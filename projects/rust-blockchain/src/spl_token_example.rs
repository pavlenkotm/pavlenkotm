/// SPL Token Operations in Rust
/// Demonstrates token creation, minting, and transfers on Solana
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};
use spl_token::{instruction as token_instruction, state::Mint};

/// Create a new SPL token
pub fn create_token(
    accounts: &[AccountInfo],
    decimals: u8,
) -> ProgramResult {
    msg!("Creating SPL Token with {} decimals", decimals);

    let account_info_iter = &mut accounts.iter();
    let mint_account = next_account_info(account_info_iter)?;
    let mint_authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let rent_sysvar = next_account_info(account_info_iter)?;

    // Initialize mint
    let init_mint_ix = token_instruction::initialize_mint(
        token_program.key,
        mint_account.key,
        mint_authority.key,
        Some(mint_authority.key), // freeze authority
        decimals,
    )?;

    msg!("Token mint initialized: {}", mint_account.key);
    Ok(())
}

/// Mint tokens to an account
pub fn mint_tokens(
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    msg!("Minting {} tokens", amount);

    let account_info_iter = &mut accounts.iter();
    let mint_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let mint_authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;

    let mint_ix = token_instruction::mint_to(
        token_program.key,
        mint_account.key,
        destination_account.key,
        mint_authority.key,
        &[],
        amount,
    )?;

    msg!("Minted {} tokens to {}", amount, destination_account.key);
    Ok(())
}

/// Transfer tokens between accounts
pub fn transfer_tokens(
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    msg!("Transferring {} tokens", amount);

    let account_info_iter = &mut accounts.iter();
    let source_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;

    let transfer_ix = token_instruction::transfer(
        token_program.key,
        source_account.key,
        destination_account.key,
        authority.key,
        &[],
        amount,
    )?;

    msg!("Transferred {} tokens from {} to {}",
         amount, source_account.key, destination_account.key);
    Ok(())
}

/// Burn tokens (reduce supply)
pub fn burn_tokens(
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    msg!("Burning {} tokens", amount);

    let account_info_iter = &mut accounts.iter();
    let token_account = next_account_info(account_info_iter)?;
    let mint_account = next_account_info(account_info_iter)?;
    let authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;

    let burn_ix = token_instruction::burn(
        token_program.key,
        token_account.key,
        mint_account.key,
        authority.key,
        &[],
        amount,
    )?;

    msg!("Burned {} tokens", amount);
    Ok(())
}
