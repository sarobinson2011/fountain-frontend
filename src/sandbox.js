/* CurrentRewardListener.js */

import { ethers } from "ethers";
import lockdropABI from './contracts/LockDrop.json';
// swal

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

            console.log("RewardReturned event emitted - yay!");

            // ===== <stylised event message> =====
            //
            //
            //
            //
            //
            //
            //
            // ===== </stylised event message> =====

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

// event RewardReturned(address indexed _user, uint256 _amount);







// /* CurrentRewardListener.js */
//
// import { ethers } from 'ethers';
// import lockdropABI from './contracts/LockDrop.json';

// let currentRewardListenerAttached = false;   // Flag to track listener state

// const contractAddress = process.env.REACT_APP_TOKENMANAGER_ADDRESS;

// export const checkCurrentReward = async () => {

//     try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const contract = new ethers.Contract(contractAddress, lockdropABI, provider);

//         // Attach listener only if not already attached
//         if (!currentRewardListenerAttached) {
//             contract.on("RewardReturned", (user, amount) => {
//                 console.log('RewardReturned event:', { user, amount });
//                 currentRewardListenerAttached = true;
//                 // console.log("Reward returned = ", reward.toString());
//                 // console.log("User wallet address: ", user);
//             });
//         } else {
//             console.log("Listener already attached");
//         }
//     } catch (error) {
//         console.error("Error during promise execution:", error);
//     }
// };

