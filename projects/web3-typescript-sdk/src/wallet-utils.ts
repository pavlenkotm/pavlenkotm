/**
 * Web3 Wallet Utilities for Solana
 * TypeScript SDK for common wallet operations
 * Author: PavlenkoTM
 */

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import bs58 from 'bs58';

export class SolanaWalletSDK {
  private connection: Connection;
  private commitment: 'processed' | 'confirmed' | 'finalized';

  constructor(rpcUrl: string, commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed') {
    this.connection = new Connection(rpcUrl, commitment);
    this.commitment = commitment;
  }

  /**
   * Generate a new Solana keypair
   */
  generateWallet(): { publicKey: string; secretKey: string } {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: bs58.encode(keypair.secretKey),
    };
  }

  /**
   * Import wallet from private key
   */
  importWallet(secretKey: string): Keypair {
    const decoded = bs58.decode(secretKey);
    return Keypair.fromSecretKey(decoded);
  }

  /**
   * Get SOL balance for an address
   */
  async getBalance(address: string): Promise<number> {
    const publicKey = new PublicKey(address);
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  /**
   * Get all token accounts for a wallet
   */
  async getTokenAccounts(address: string) {
    const publicKey = new PublicKey(address);
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    return tokenAccounts.value.map(account => ({
      address: account.pubkey.toBase58(),
      mint: account.account.data.parsed.info.mint,
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
    }));
  }

  /**
   * Transfer SOL from one wallet to another
   */
  async transferSol(
    from: Keypair,
    to: string,
    amount: number
  ): Promise<string> {
    const toPublicKey = new PublicKey(to);
    const lamports = amount * LAMPORTS_PER_SOL;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [from],
      { commitment: this.commitment }
    );

    console.log(`✅ Transferred ${amount} SOL to ${to}`);
    console.log(`   Signature: ${signature}`);

    return signature;
  }

  /**
   * Transfer SPL tokens
   */
  async transferToken(
    from: Keypair,
    to: string,
    mintAddress: string,
    amount: number
  ): Promise<string> {
    const toPublicKey = new PublicKey(to);
    const mintPublicKey = new PublicKey(mintAddress);

    // Get or create associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      from.publicKey
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );

    const transaction = new Transaction();

    // Check if destination token account exists
    const toAccountInfo = await this.connection.getAccountInfo(toTokenAccount);
    if (!toAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          from.publicKey,
          toTokenAccount,
          toPublicKey,
          mintPublicKey
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        from.publicKey,
        amount
      )
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [from],
      { commitment: this.commitment }
    );

    console.log(`✅ Transferred ${amount} tokens to ${to}`);
    console.log(`   Signature: ${signature}`);

    return signature;
  }

  /**
   * Batch transfer SOL to multiple recipients
   */
  async batchTransferSol(
    from: Keypair,
    recipients: Array<{ address: string; amount: number }>
  ): Promise<string[]> {
    console.log(`📦 Batch transferring to ${recipients.length} recipients`);

    const signatures: string[] = [];

    // Process in chunks of 10 to avoid transaction size limits
    const chunkSize = 10;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      const transaction = new Transaction();

      for (const recipient of chunk) {
        const toPublicKey = new PublicKey(recipient.address);
        const lamports = recipient.amount * LAMPORTS_PER_SOL;

        transaction.add(
          SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: toPublicKey,
            lamports,
          })
        );
      }

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [from],
        { commitment: this.commitment }
      );

      signatures.push(signature);
      console.log(`   ✓ Chunk ${Math.floor(i / chunkSize) + 1} complete`);
    }

    console.log(`✅ Batch transfer complete!`);
    return signatures;
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(address: string, limit: number = 10) {
    const publicKey = new PublicKey(address);
    const signatures = await this.connection.getSignaturesForAddress(
      publicKey,
      { limit }
    );

    const transactions = [];

    for (const sig of signatures) {
      const tx = await this.connection.getParsedTransaction(sig.signature);
      if (tx) {
        transactions.push({
          signature: sig.signature,
          slot: tx.slot,
          timestamp: tx.blockTime,
          fee: tx.meta?.fee,
          status: tx.meta?.err ? 'failed' : 'success',
        });
      }
    }

    return transactions;
  }

  /**
   * Monitor address for new transactions
   */
  onTransaction(
    address: string,
    callback: (signature: string) => void
  ): number {
    const publicKey = new PublicKey(address);

    return this.connection.onLogs(
      publicKey,
      (logs) => {
        callback(logs.signature);
      },
      this.commitment
    );
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(signature: string): Promise<void> {
    console.log(`⏳ Waiting for confirmation: ${signature}`);

    const result = await this.connection.confirmTransaction(signature, this.commitment);

    if (result.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(result.value.err)}`);
    }

    console.log(`✅ Transaction confirmed!`);
  }
}

// Example usage
export async function exampleUsage() {
  const sdk = new SolanaWalletSDK('https://api.mainnet-beta.solana.com');

  // Generate new wallet
  const wallet = sdk.generateWallet();
  console.log('Generated wallet:', wallet.publicKey);

  // Check balance
  const balance = await sdk.getBalance(wallet.publicKey);
  console.log('Balance:', balance, 'SOL');

  // Get token accounts
  const tokens = await sdk.getTokenAccounts(wallet.publicKey);
  console.log('Token accounts:', tokens);
}
