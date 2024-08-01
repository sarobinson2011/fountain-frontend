/* CurrentRewardListener.js - draft version*/

import { ethers } from 'ethers';
import lockdropABI from './contracts/LockDrop.json';

const contractAddress = process.env.REACT_APP_TOKENMANAGER_ADDRESS;

export const checkCurrentReward = async () => {

    try {
        const contractAddress = process.env.REACT_APP_TOKENMANAGER_ADDRESS;
        if (!contractAddress) {
            console.log("Contract address is not defined in environment variables.");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, lockdropABI, provider);

        contract.on("RewardReturned", (user, amount) => {
            console.log('RewardReturned event:', { user, amount });
        });
    } catch (error) {
        console.error("Error during promise execution:", error);
    }
};


// event RewardReturned(address indexed _user, uint256 _amount);
