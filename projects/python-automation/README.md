# Python Automation Toolkit for Web3

![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![Solana](https://img.shields.io/badge/solana-compatible-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

A comprehensive collection of Python automation tools for Web3 development, DeFi operations, and blockchain workflows. Save hours of manual work with these battle-tested scripts.

## Features

### 🔑 Wallet Management (`wallet_manager.py`)
- Bulk wallet generation
- Balance monitoring across multiple wallets
- Automated SOL transfers
- Token account management
- Empty account cleanup (rent reclamation)
- CSV export for analysis

### 📊 Price Monitoring (`price_monitor.py`)
- Real-time price tracking for multiple tokens
- Customizable price alerts
- Historical data collection
- Volatility analysis
- Integration with CoinGecko and Jupiter APIs
- Export data for further analysis

### 🤖 Smart Contract Interaction
- Automated transaction signing
- Batch operations
- Error handling and retries
- Gas optimization

## Installation

```bash
# Clone the repository
git clone https://github.com/pavlenkotm/python-automation.git
cd python-automation

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Requirements

```txt
solana-py>=0.30.0
solders>=0.18.0
aiohttp>=3.9.0
base58>=2.1.0
```

## Usage Examples

### Wallet Management

```python
from wallet_manager import SolanaWalletManager

# Initialize manager
manager = SolanaWalletManager()

# Generate single wallet
wallet = manager.generate_wallet()

# Generate 100 wallets at once
wallets = manager.generate_bulk_wallets(count=100, output_file="wallets.json")

# Check balances
balance = await manager.check_balance("YourWalletAddressHere")

# Monitor wallets for changes
addresses = ["wallet1...", "wallet2...", "wallet3..."]
await manager.monitor_wallets(addresses, interval=60)

# Cleanup empty token accounts to reclaim rent
manager.cleanup_empty_accounts(keypair)
```

### Price Monitoring

```python
from price_monitor import CryptoPriceMonitor

# Initialize monitor
monitor = CryptoPriceMonitor(update_interval=30)

# Add alerts
monitor.add_alert('SOL', threshold_percent=5.0)  # Alert on 5% change
monitor.add_alert('BTC', target_price=50000.0, alert_type='above')

# Start monitoring
tokens = {
    'SOL': 'solana',
    'BTC': 'bitcoin',
    'ETH': 'ethereum'
}

await monitor.monitor_tokens(tokens)

# Get statistics
stats = monitor.get_statistics('SOL')
print(f"SOL Stats: {stats}")
```

### Batch Operations

```python
# Batch transfer SOL to multiple recipients
recipients = [
    {'address': 'wallet1...', 'amount': 0.1},
    {'address': 'wallet2...', 'amount': 0.2},
    {'address': 'wallet3...', 'amount': 0.15}
]

manager.batch_transfer_sol(from_keypair, recipients)
```

## Real-World Use Cases

### 1. Airdrop Distribution
```python
# Read addresses from CSV
import csv

addresses = []
with open('airdrop_list.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        addresses.append({
            'address': row['wallet'],
            'amount': float(row['tokens'])
        })

# Execute airdrop
manager.batch_transfer_sol(treasury_keypair, addresses)
```

### 2. Portfolio Monitoring
```python
# Monitor your wallet portfolio
my_wallets = [
    "MainWallet...",
    "TradingWallet...",
    "StakingWallet..."
]

# Check every 5 minutes
await manager.monitor_wallets(my_wallets, interval=300)
```

### 3. Arbitrage Alert System
```python
# Monitor price differences across DEXs
monitor = CryptoPriceMonitor(update_interval=10)
monitor.add_alert('SOL', threshold_percent=0.5)  # Alert on 0.5% moves

# When alert triggers, execute arbitrage
# (implement your arbitrage logic)
```

## Advanced Features

### Webhook Integration

```python
import aiohttp

async def send_webhook(message: str, webhook_url: str):
    """Send alert to Discord/Slack"""
    async with aiohttp.ClientSession() as session:
        await session.post(webhook_url, json={'content': message})

# Add to price monitor
monitor.webhook_url = "https://discord.com/api/webhooks/..."
```

### Telegram Bot Integration

```python
from telegram import Bot

async def send_telegram_alert(message: str, bot_token: str, chat_id: str):
    """Send alert via Telegram"""
    bot = Bot(token=bot_token)
    await bot.send_message(chat_id=chat_id, text=message)
```

## Performance Optimization

- **Async Operations**: All network calls use asyncio for maximum performance
- **Batch Processing**: Handle multiple operations in single transactions
- **Connection Pooling**: Reuse HTTP sessions for efficiency
- **Rate Limiting**: Built-in delays to respect API limits

## Security Best Practices

⚠️ **IMPORTANT SECURITY GUIDELINES**

1. **Never commit private keys** to version control
2. Use environment variables for sensitive data:
   ```python
   import os
   RPC_URL = os.getenv('SOLANA_RPC_URL')
   PRIVATE_KEY = os.getenv('WALLET_PRIVATE_KEY')
   ```
3. Encrypt wallet files at rest
4. Use hardware wallets for large amounts
5. Test on devnet first

## Error Handling

The toolkit includes comprehensive error handling:

```python
try:
    balance = await manager.check_balance(address)
except ConnectionError:
    print("RPC connection failed, retrying...")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Testing

```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=. tests/

# Test on devnet
python wallet_manager.py --network devnet
```

## Roadmap

- [x] Wallet management
- [x] Price monitoring
- [x] Batch operations
- [ ] NFT bulk operations
- [ ] Smart contract deployment automation
- [ ] Cross-chain bridge automation
- [ ] MEV bot framework
- [ ] DAO voting automation

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## License

MIT License - see LICENSE file

## Support

- **Email**: pavlenko.tm.dev@gmail.com
- **Telegram**: [@pavlenkotm](https://t.me/pavlenkotm)
- **GitHub Issues**: [Report bugs](https://github.com/pavlenkotm/python-automation/issues)

## Acknowledgments

- Solana Foundation
- Python community
- All contributors

---

**Built with ❤️ and Python**

*Automating the future, one script at a time* 🚀
