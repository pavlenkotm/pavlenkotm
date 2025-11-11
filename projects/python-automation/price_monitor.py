#!/usr/bin/env python3
"""
Crypto Price Monitor with Alerts
Monitors token prices and sends alerts on significant changes
Author: Andrei Pavlenko
"""

import asyncio
import aiohttp
from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
import json


@dataclass
class PriceAlert:
    """Price alert configuration"""
    symbol: str
    threshold_percent: float
    alert_type: str  # 'above' or 'below'
    target_price: Optional[float] = None


class CryptoPriceMonitor:
    """
    Real-time cryptocurrency price monitoring with alerts

    Features:
    - Multi-token monitoring
    - Price change alerts
    - Historical tracking
    - Telegram notifications (with bot token)
    - Webhook support
    """

    def __init__(self, update_interval: int = 30):
        self.update_interval = update_interval
        self.price_history: Dict[str, List[float]] = {}
        self.alerts: List[PriceAlert] = []
        self.last_prices: Dict[str, float] = {}

    async def fetch_price(self, session: aiohttp.ClientSession, symbol: str) -> Optional[float]:
        """
        Fetch current price for a token

        Args:
            session: aiohttp session
            symbol: Token symbol (e.g., 'SOL', 'BTC')

        Returns:
            Current price in USD
        """
        try:
            # Using CoinGecko API as example
            url = f"https://api.coingecko.com/api/v3/simple/price"
            params = {
                'ids': symbol.lower(),
                'vs_currencies': 'usd'
            }

            async with session.get(url, params=params) as response:
                data = await response.json()
                price = data.get(symbol.lower(), {}).get('usd')
                return price
        except Exception as e:
            print(f"❌ Error fetching price for {symbol}: {e}")
            return None

    async def fetch_jupiter_price(self, session: aiohttp.ClientSession, mint_address: str) -> Optional[float]:
        """
        Fetch token price from Jupiter on Solana

        Args:
            session: aiohttp session
            mint_address: Token mint address

        Returns:
            Price in USDC
        """
        try:
            url = f"https://price.jup.ag/v4/price"
            params = {'ids': mint_address}

            async with session.get(url, params=params) as response:
                data = await response.json()
                price_data = data.get('data', {}).get(mint_address, {})
                price = price_data.get('price')
                return price
        except Exception as e:
            print(f"❌ Error fetching Jupiter price: {e}")
            return None

    def add_alert(self, symbol: str, threshold_percent: float,
                  alert_type: str = 'above', target_price: Optional[float] = None):
        """
        Add a price alert

        Args:
            symbol: Token symbol
            threshold_percent: Alert on % change
            alert_type: 'above' or 'below'
            target_price: Optional specific price target
        """
        alert = PriceAlert(
            symbol=symbol,
            threshold_percent=threshold_percent,
            alert_type=alert_type,
            target_price=target_price
        )
        self.alerts.append(alert)
        print(f"🔔 Alert added: {symbol} {alert_type} {threshold_percent}%")

    def check_alerts(self, symbol: str, current_price: float) -> List[str]:
        """
        Check if any alerts should trigger

        Args:
            symbol: Token symbol
            current_price: Current token price

        Returns:
            List of alert messages
        """
        triggered_alerts = []

        if symbol not in self.last_prices:
            return triggered_alerts

        last_price = self.last_prices[symbol]
        price_change_percent = ((current_price - last_price) / last_price) * 100

        for alert in self.alerts:
            if alert.symbol != symbol:
                continue

            # Check threshold alerts
            if abs(price_change_percent) >= alert.threshold_percent:
                direction = "📈 UP" if price_change_percent > 0 else "📉 DOWN"
                msg = (f"🚨 ALERT: {symbol} {direction} {abs(price_change_percent):.2f}%\n"
                      f"   Price: ${current_price:.4f} (was ${last_price:.4f})")
                triggered_alerts.append(msg)

            # Check target price alerts
            if alert.target_price:
                if alert.alert_type == 'above' and current_price >= alert.target_price:
                    msg = (f"🎯 TARGET HIT: {symbol} reached ${alert.target_price}\n"
                          f"   Current: ${current_price:.4f}")
                    triggered_alerts.append(msg)
                elif alert.alert_type == 'below' and current_price <= alert.target_price:
                    msg = (f"🎯 TARGET HIT: {symbol} dropped to ${alert.target_price}\n"
                          f"   Current: ${current_price:.4f}")
                    triggered_alerts.append(msg)

        return triggered_alerts

    async def monitor_tokens(self, tokens: Dict[str, str]):
        """
        Monitor multiple tokens continuously

        Args:
            tokens: Dict of {symbol: coingecko_id}
        """
        print("=" * 60)
        print("   🎯 CRYPTO PRICE MONITOR STARTED")
        print(f"   Monitoring: {', '.join(tokens.keys())}")
        print(f"   Update interval: {self.update_interval}s")
        print("=" * 60)

        async with aiohttp.ClientSession() as session:
            iteration = 0

            while True:
                iteration += 1
                timestamp = datetime.now().strftime("%H:%M:%S")
                print(f"\n⏰ Update #{iteration} at {timestamp}")
                print("-" * 60)

                for symbol, coingecko_id in tokens.items():
                    price = await self.fetch_price(session, coingecko_id)

                    if price:
                        # Store in history
                        if symbol not in self.price_history:
                            self.price_history[symbol] = []
                        self.price_history[symbol].append(price)

                        # Calculate change
                        if symbol in self.last_prices:
                            last = self.last_prices[symbol]
                            change = ((price - last) / last) * 100
                            change_symbol = "📈" if change > 0 else "📉"
                            print(f"   {symbol:8} ${price:>10.4f}  {change_symbol} {change:>+6.2f}%")

                            # Check alerts
                            alerts = self.check_alerts(symbol, price)
                            for alert_msg in alerts:
                                print(f"\n{alert_msg}")
                        else:
                            print(f"   {symbol:8} ${price:>10.4f}  (baseline)")

                        self.last_prices[symbol] = price
                    else:
                        print(f"   {symbol:8} ❌ Failed to fetch")

                await asyncio.sleep(self.update_interval)

    def get_statistics(self, symbol: str) -> Dict:
        """
        Get price statistics for a token

        Args:
            symbol: Token symbol

        Returns:
            Dict with min, max, avg, volatility
        """
        if symbol not in self.price_history or not self.price_history[symbol]:
            return {}

        prices = self.price_history[symbol]

        stats = {
            'min': min(prices),
            'max': max(prices),
            'avg': sum(prices) / len(prices),
            'current': prices[-1],
            'samples': len(prices)
        }

        # Calculate volatility (simplified)
        if len(prices) > 1:
            changes = [(prices[i] - prices[i-1]) / prices[i-1] * 100
                      for i in range(1, len(prices))]
            stats['volatility'] = sum(abs(c) for c in changes) / len(changes)
        else:
            stats['volatility'] = 0

        return stats

    def export_data(self, filename: str = "price_history.json"):
        """Export price history to JSON"""
        data = {
            'timestamp': datetime.now().isoformat(),
            'history': self.price_history,
            'last_prices': self.last_prices
        }

        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

        print(f"📁 Price history exported to: {filename}")


async def main():
    """Main execution example"""
    monitor = CryptoPriceMonitor(update_interval=30)

    # Add price alerts
    monitor.add_alert('SOL', threshold_percent=5.0)
    monitor.add_alert('BTC', threshold_percent=3.0)
    monitor.add_alert('ETH', target_price=3000.0, alert_type='above')

    # Tokens to monitor (symbol: coingecko_id)
    tokens = {
        'SOL': 'solana',
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'USDC': 'usd-coin',
        'BONK': 'bonk'
    }

    try:
        await monitor.monitor_tokens(tokens)
    except KeyboardInterrupt:
        print("\n\n⏹️  Monitor stopped by user")

        # Print statistics
        print("\n" + "=" * 60)
        print("   📊 SESSION STATISTICS")
        print("=" * 60)

        for symbol in tokens.keys():
            stats = monitor.get_statistics(symbol)
            if stats:
                print(f"\n{symbol}:")
                print(f"   Min:        ${stats['min']:.4f}")
                print(f"   Max:        ${stats['max']:.4f}")
                print(f"   Avg:        ${stats['avg']:.4f}")
                print(f"   Current:    ${stats['current']:.4f}")
                print(f"   Volatility: {stats['volatility']:.2f}%")
                print(f"   Samples:    {stats['samples']}")

        monitor.export_data()


if __name__ == "__main__":
    asyncio.run(main())
