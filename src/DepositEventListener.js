// DepositEventListener.js

import { ethers } from "ethers";
import lockdropABI from './contracts/LockDrop.json';            // <-- HERE !!
import Swal from 'sweetalert2';

export const checkEventsDeposit = async () => {

    return new Promise((resolve, reject) => {

        const contractAddress = process.env.REACT_APP_LOCKDROP_ADDRESS;
        const provider = new ethers.BrowserProvider(window.ethereum);
        let contract = new ethers.Contract(contractAddress, lockdropABI, provider);

        const handleNewDeposit = (user, amount, timestamp) => {

            console.log("New deposit event was emitted!");

            // ===== <stylised event message> =====
            const message = `New deposit event was emitted! User: ${user}, Amount: ${amount}, Timestamp: ${timestamp}`;
            Swal.fire({
                title: 'Event Detected!',
                text: message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // ===== </stylised event message> =====

            contract.off("NewDeposit", handleNewDeposit);   // Remove the event listener
            resolve();
        };

        contract.on("NewDeposit", handleNewDeposit);

    }).catch((error) => {
        console.error("Error during promise execution:", error);
        return Promise.reject(error);
    });
};