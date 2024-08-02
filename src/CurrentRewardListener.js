// CurrentRewardListener.js

import { ethers } from "ethers";
import lockdropABI from './contracts/LockDrop.json';

let currentRewardListenerAttached = false; // Flag to track listener state

export const checkCurrentReward = async () => {

    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected. Please install or connect your wallet.");
        return;
    }

    return new Promise((resolve, reject) => {

        const contractAddress = process.env.REACT_APP_LOCKDROP_ADDRESS;
        const provider = new ethers.BrowserProvider(window.ethereum);
        let contract = new ethers.Contract(contractAddress, lockdropABI, provider);

        const handleCurrentReward = (user, amount) => {

            console.log("Reward returned:", "User:", user, "Amount:", amount);

            resolve();
        };

        // Attach listener only if not already attached (toggle flag)
        if (!currentRewardListenerAttached) {
            contract.on("RewardReturned", handleCurrentReward);
            currentRewardListenerAttached = true;
        }

    }).catch((error) => {
        console.error("Error during promise execution:", error);
        return Promise.reject(error);
    });
};