// DepositComponent.js

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './DepositComponent.css';
import lockdropABI from './contracts/LockDrop.json';            // <-- update LockDrop.json ??
import { checkEventsDeposit } from './DepositEventListener';


const DepositComponent = () => {
    const [depositAmount, setDepositAmount] = useState("");
    const contractAddress = process.env.REACT_APP_LOCKDROP_ADDRESS;

    const depositHandler = async () => {
        try {
            if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
                console.error("Invalid deposit amount. Please enter a valid positive number.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, lockdropABI, signer);
            const amountToDeposit = ethers.parseEther(depositAmount);

            console.log('Deposit pending...');

            const transaction = await contractInstance.deposit({ value: amountToDeposit });
            await transaction.wait();

            console.log("Deposit successful!");
            // console.log("Transaction Receipt:", await transaction.wait());

        } catch (error) {
            console.error("Deposit failed:", error);
        }
    };

    useEffect(() => {
        checkEventsDeposit();
    }, []);

    return (
        <div className="deposit-component">
            <div className="deposit-form">
                <label htmlFor="depositAmount">Enter Deposit Amount: </label>
                <input
                    type="text"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="custom-input deposit-amount-input"
                />
                <button onClick={depositHandler} className="cta-button deposit-button">
                    Deposit
                </button>
            </div>
        </div>
    );
};

export default DepositComponent;