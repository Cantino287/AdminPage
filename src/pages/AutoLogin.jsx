// import { useEffect } from 'react';

// import {
//   useLocation,
//   useNavigate,
// } from 'react-router-dom';

// const AutoLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const tableNumber = queryParams.get('tableNumber');
//     const seat = queryParams.get('seat');
//     const password = queryParams.get('password');
   
// if (tableNumber && seat && password) {
//     fetch(`http://localhost:8082/table-login/auto-login?tableNumber=${tableNumber}&seat=${seat}&password=${password}`, {
//       method: 'GET', // 🔹 Use GET instead of POST
//       headers: {
//         'Content-Type': 'application/json',
//         // 'Authorization': `Bearer ${jwtToken}`,  // 🔹 Not needed since this API does not require authentication
//       },
//     })
//       .then(response => {
//         if (response.ok) return response.json();
//         throw new Error('Login failed');
//       })
//       .then(data => {
//         // ✅ Save login data
//         localStorage.setItem('tableLogin', JSON.stringify(data));
//         localStorage.setItem('tableNumber', tableNumber);
  
//         console.log("Auto-login successful for table:", tableNumber);
  
//         // ✅ Redirect to home page after successful login
//         navigate('/');
//       })
//       .catch(() => {
//         console.error("Auto-login failed, redirecting to home...");
//         // ✅ Redirect to home even if login fails
//         navigate('/');
//       });
//   } else {
//     console.warn("Invalid QR code parameters, redirecting to home...");
//     // ✅ Redirect if no valid parameters are found
//     navigate('/');
//   }
  
//   }, [location, navigate]);

//   return <p>Logging in...</p>; // Show a brief message before redirecting
// };

// export default AutoLogin;

import { useEffect } from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

const AutoLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tableNumber = params.get("tableNumber");
        const seat = params.get("seat");
        const password = params.get("password");
        const shopId = params.get("shopId");

        if (tableNumber && seat && password && shopId) {
            fetch(`http://localhost:8082/table-login/auto-login?tableNumber=${tableNumber}&seat=${seat}&password=${password}&shopId=${shopId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Login failed");
                    }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem("tableLogin", JSON.stringify(data));
                    localStorage.setItem("tableNumber", tableNumber);
                    localStorage.setItem("shopId", shopId); // ✅ Save shopId

                    // Redirect to home page after successful login
                    navigate("/");
                })
                .catch(error => {
                    console.error("Login error:", error);
                    alert("Login failed");
                    navigate("/"); // Redirect to home even on failure
                });
        } else {
            navigate("/"); // Redirect if missing parameters
        }
    }, [location, navigate]);

    return <h2>Logging in...</h2>;
};

export default AutoLogin;
