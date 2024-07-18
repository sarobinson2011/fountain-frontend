/* RewardEventListener.js */

import { ethers } from "ethers";
import tokenmanagerABI from './contracts/TokenManager.json';

let rewardListenerAttached = false;                     // Flag to track listener state

export const checkEventsReward = async () => {

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
        let contract = new ethers.Contract(contractAddress, tokenmanagerABI, provider);

        const handleRewardBalanceZero = () => {
            console.log("Zero reward tokens left for transfer");
        };

        // Attach listener only if not already attached
        if (!rewardListenerAttached) {
            contract.on("RewardBalanceZero", handleRewardBalanceZero);
            rewardListenerAttached = true;
        } else {
            console.log("Listener already attached");
        }
    } catch (error) {
        console.error("Error during promise execution:", error);
    }
};


