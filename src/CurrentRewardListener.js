/* CurrentRewardListener.js */

import { ethers } from "ethers";
import lockdropABI from './contracts/LockDrop.json';

let currentRewardListenerAttached = false;   // Flag to track listener state

export const checkCurrentReward = async () => {

    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected. Please install or connect your wallet.");
        return;
    }

    try {
        const contractAddress = process.env.REACT_APP_TOKENMANAGER_ADDRESS;
        if (!contractAddress) {
            console.log("Contract address is not defined in environment variables.");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, lockdropABI, provider);

        const handleRewardReturned = (user, reward) => {
            console.log("Reward returned = ", reward.toString());
            console.log("User wallet address: ", user);
        };

        // Attach listener only if not already attached
        if (!currentRewardListenerAttached) {
            contract.on("RewardReturned", handleRewardReturned);
            currentRewardListenerAttached = true;
        } else {
            console.log("Listener already attached");
        }
    } catch (error) {
        console.error("Error during promise execution:", error);
    }
};
