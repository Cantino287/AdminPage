// import React from 'react';

// import QRScanner from './QRScanner';

// const QRLogin = () => {
    
//     const handleScan = (qrData) => {
//         const params = new URLSearchParams(qrData);
//         const tableNumber = params.get("tableNumber");
//         const seat = params.get("seat");
//         const password = params.get("password");

//         if (tableNumber && seat && password) {
//             fetch(`/table-login/auto-login/${tableNumber}?seat=${seat}&password=${password}`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (data.success) {
//                         window.location.href = "/"; // Navigate after login
//                     } else {
//                         alert("Login failed!");
//                     }
//                 })
//                 .catch((err) => console.error("Login error:", err));
//         }
//     };
    

//     return (
//         <div>
//             <h2>Scan QR Code to Auto-Login</h2>
//             <QRScanner onScan={handleScan} />
//         </div>
//     );
// };

// export default QRLogin;

import { useNavigate } from 'react-router-dom';

import QRScanner from './QRScanner';

const QRLogin = () => {
    const navigate = useNavigate();

    const handleScan = (qrData) => {
        try {
            const url = new URL(qrData);
            const params = new URLSearchParams(url.search);
            const tableNumber = params.get("tableNumber");
            const seat = params.get("seat");
            const password = params.get("password");
            const shopId = params.get("shopId");

            if (tableNumber && seat && password && shopId) {
                // Redirect to auto-login page with parameters
                navigate(`/auto-login?tableNumber=${tableNumber}&seat=${seat}&password=${password}&shopId=${shopId}`);
            } else {
                alert("Invalid QR Code format");
            }
        } catch (error) {
            console.error("Error processing QR code:", error);
            alert("Invalid QR Code");
        }
    };

    return (
        <div>
            <h2>Scan QR Code to Auto-Login</h2>
            <QRScanner onScan={handleScan} />
        </div>
    );
};

export default QRLogin;
