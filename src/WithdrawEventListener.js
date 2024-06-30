// WithdrawEventListener.js

import { ethers } from "ethers";
import lockdropABI from './contracts/LockDrop.json';
import Swal from 'sweetalert2';

let withdrawListenerAttached = false; // Flag to track listener state

export const checkEventsWithdraw = async () => {

    const { ethereum } = window;
    if (!ethereum) {
        console.log("Metamask not connected. Please install or connect your wallet.");
        return;
    }

    return new Promise((resolve, reject) => {

        const contractAddress = process.env.REACT_APP_LOCKDROP_ADDRESS;
        const provider = new ethers.BrowserProvider(window.ethereum);
        let contract = new ethers.Contract(contractAddress, lockdropABI, provider);

        const handleNewWithdraw = (user, amount, timestamp) => {

            console.log("New withdraw event was emitted!");

            // ===== <stylised event message> =====
            const message = `New withdraw event was emitted! User: ${user}, Amount: ${amount}, Timestamp: ${timestamp}`;
            Swal.fire({
                title: 'Event Detected!',
                text: message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // ===== </stylised event message> =====


            // contract.off("NewWithdraw", handleNewWithdraw);   // Remove the event listener
            resolve();
        };

        // Attach listener only if not already attached
        if (!withdrawListenerAttached) {
            contract.on("NewWithdraw", handleNewWithdraw);
            withdrawListenerAttached = true;
        }

    }).catch((error) => {
        console.error("Error during promise execution:", error);
        return Promise.reject(error);
    });
};