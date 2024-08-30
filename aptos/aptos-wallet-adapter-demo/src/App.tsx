import React, { useEffect, useState } from 'react';
import './App.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from 'aptos';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

function App() {
  const { connected, account, network } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const resources: any[] = await client.getAccountResources(account.address);
          const accountResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
          
          if (accountResource) {
            const balanceValue = (accountResource.data as any).coin.value;
            setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0);
          } else {
            setBalance(0);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [account, connected]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aptos Wallet Adapter Demo</h1>
        <WalletSelector />
        {connected && account ? (
          <div>
            <p>Account Address: {account.address}</p>
            <p>Network: {network ? network.name : 'Unknown'}</p>
            <p>Balance: {balance !== null ? `${balance} APT` : 'Loading...'}</p>
          </div>
        ) : (
          <p>No wallet connected</p>
        )}
      </header>
    </div>
  );
}

export default App;