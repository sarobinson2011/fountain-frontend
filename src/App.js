import React from 'react';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import './App.css';
import DepositComponent from './DepositComponent.js';
import WithdrawComponent from './WithdrawComponent';
import { checkEventsReward } from './RewardEventListener.js';
import { checkCurrentReward } from './CurrentRewardListener.js';
import lockdropABI from './contracts/LockDrop.json';


function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [blockReward, setBlockReward] = useState(null);

  const checkWalletIsConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed");
      return;
    } else {
      console.log("Wallet exists... ready to go!");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    console.log('Contract address:', process.env.REACT_APP_LOCKDROP_ADDRESS);

    if (!ethereum) {
      alert("Please install Metamask");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Success, account found! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  // Render the connected wallet address in the top right corner
  const renderConnectedAddress = () => {
    return (
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        padding: '8px',
        backgroundColor: '#d3d3d3',
        color: '#0d141c',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        {currentAccount ? `Connected wallet : ${currentAccount}` : 'Not connected'}
      </div>
    );
  };



  useEffect(() => {
    checkWalletIsConnected();
    if (currentAccount) {
      checkEventsReward();
      checkCurrentReward();
    }
  }, [currentAccount]);        // contract.on both functions, when a wallet is connected



  const handleRewardClick = async () => {                                           // this needs fixing <-- ToDo
    try {
      const contractAddress = process.env.REACT_APP_LOCKDROP_ADDRESS;
      if (!contractAddress) {
        console.log("Contract address is not defined in environment variables.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      let contractInstance = new ethers.Contract(contractAddress, lockdropABI, provider);
      const reward = await contractInstance.returnBlockReward();
      setBlockReward(reward.toString());

    } catch (error) {
      console.error('Error fetching block reward:', error);
    }
  };



  return (
    <div className='main-app'>
      <h1 className='top-left-heading'>Fountain.xyz</h1>
      <div className='main-app-content'>
        {renderConnectedAddress()}
        <div style={{ marginBottom: '10px' }}>
          {connectWalletButton()}
        </div>
        <div style={{ flexGrow: 1 }}> {/* Main content area */}
          <DepositComponent />
          <WithdrawComponent />
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <button onClick={handleRewardClick} className='cta-button'>
            Current reward
          </button>
          <div style={{ marginLeft: 10 }}>
            Block Reward: {blockReward}
          </div>
        </div>
      </div>
    </div>
  );

}

export default App; 