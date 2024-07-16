import React, { useEffect, useState } from 'react';
import './App.css';
import DepositComponent from './DepositComponent.js';
import WithdrawComponent from './WithdrawComponent';
import { ethers } from 'ethers'; // Assuming you have ethers.js installed


function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [estimatedReward, setEstimatedReward] = useState(0); // State variable to store estimated reward

    const checkWalletIsConnected = () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have Metamask installed");
            return;
        } else {
            console.log("Wallet exists... ready to go!");
        }
    };

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
            console.log(err);
        }
    };

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        );
    };

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
        // Add a new useEffect hook to fetch and update estimated reward every few seconds
        const intervalId = setInterval(async () => {
            if (currentAccount) {
                // Call a view function in your contract to calculate estimated reward
                const reward = await calculateEstimatedReward(currentAccount); // Replace with actual function call
                setEstimatedReward(reward);
            }
        }, 5000); // Update every 5 seconds (adjust as needed)

        return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
    }, [currentAccount]); // Dependency array ensures update on account change






    const calculateEstimatedReward = async (account) => {
        // Implement logic to call a view function in your contract that calculates the estimated reward based on current block and deposit information for the user's account

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(process.env.REACT_APP_LOCKDROP_ADDRESS, LockDropABI, provider);

        try {
            const blockNumber = await provider.getBlockNumber();
            const depositInfo = await contract.balances(account); // Get user's deposit information

            // Calculate estimated reward based on block difference and reward per block
            const elapsedBlocks = blockNumber - depositInfo.blockstamp.toNumber();
            const estimatedReward = elapsedBlocks * (5 * Math.pow(10, 18)); // 0.5 reward per block with 18 decimals

            return estimatedReward;
        } catch (error) {
            console.error("Error fetching estimated reward:", error);
            return 0; // Handle errors gracefully, potentially display an error message
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
                <div style={{ marginBottom: '10px' }}>
                    <DepositComponent /> {/* Use the DepositComponent */}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <WithdrawComponent /> {/* Use the WithdrawComponent */}
                </div>
                {currentAccount && (
                    <div className="reward-box">
                        <p>Estimated Reward:</p>
                        {estimatedReward > 0 ? (
                            <p>{estimatedReward / Math.pow(10, 18)} (approx.)</p>
                        ) : (
                            <p>No deposit detected or error fetching reward.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}