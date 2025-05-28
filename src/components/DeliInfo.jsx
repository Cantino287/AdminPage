// import 'react-toastify/dist/ReactToastify.css';

// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';

// import axios from 'axios';
// import { CgProfile } from 'react-icons/cg';
// import {
//   toast,
//   ToastContainer,
// } from 'react-toastify';

// const DeliInfo = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const previousIds = useRef(new Set());
//   const prevOrderIds = useRef(new Set());
//   const audioRef = useRef(new Audio('/notification.mp3')); // Place sound file in public folder
//   const itemsPerPage = 7;

//   const totalDeli = deliveries.length;
//   const confirmingDeli = deliveries.filter(
//     (delivery) => delivery.status === "Confirming"
//   ).length;

//   const pendingDeli = deliveries.filter(
//     (delivery) => delivery.status === "Pending"
//   ).length;
//   // const availableTables = totalTables - occupiedTables;
//   const onWayDeli = deliveries.filter(
//     (delivery) => delivery.status === "On Way"
//   ).length;  

//   const finishDeli = deliveries.filter(
//     (delivery) => delivery.status === "Delivered"
//   ).length;
//   const [filterStatus, setFilterStatus] = useState("All");

//   const filteredOrders =
// filterStatus === "All"
// ? deliveries
// : deliveries.filter((delivery) => delivery.status === filterStatus);
  
// useEffect(() => {
//   const audio = new Audio('/notification.mp3');

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('http://localhost:8082/delivery/all');
//       const newData = response.data;

      
//       const transformedOrders = newData;

     
//       const newOrders = transformedOrders.filter(
//         delivery =>
//           !prevOrderIds.current.has(delivery.id) &&
//           delivery.status === "Confirming"
//       );

     
//       if (newOrders.length > 0) {
//         newOrders.forEach(delivery => {
//           toast.success(`🛎️ New Order From ${delivery.name}`);
//         });
//         audio.play();
//       }

//       setDeliveries(transformedOrders);
//       prevOrderIds.current = new Set(transformedOrders.map(delivery => delivery.id));
//     } catch (error) {
//       console.error("❌ Failed to fetch orders:", error);
//     }
//     const timeFormatted = (() => {
//       const [hour, minute] = (deliveries.orderTime || "00:00").split(':').map(Number);
//       const date = new Date();
//       date.setHours(hour || 0);
//       date.setMinutes(minute || 0);
//       return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
//     })();

//     const dateFormatted = deliveries.orderDate
//       ? new Date(deliveries.orderDate).toLocaleDateString("en-GB")
//       : "Unknown Date";
    
//       return {
//         time: (() => {
//           const [hour, minute] = deliveries.orderTime.split(':').map(Number);
//           const date = new Date();
//           date.setHours(hour);
//           date.setMinutes(minute);
//           return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
//         })(),
//         orderDate: (() => {
//           if (deliveries.orderDate) {
//             return new Date(deliveries.orderDate).toLocaleDateString("en-GB");
//           }
//           return "Unknown Date";
//         })(),
//       }
    
//   };

//   fetchOrders();
//   // Initial fetch
//   const intervalId = setInterval(fetchOrders, 5000); // Repeat every 5s

//   return () => clearInterval(intervalId); // Cleanup
// }, []);
  

 
  
  
//   const filteredDeliveries = deliveries.filter(
//     (delivery) =>
      
//       delivery.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  
//   const updateDeliveryStatus = async (id, newStatus) => {
//     try {
//       const response = await fetch(`http://localhost:8082/delivery/status/${id}?status=${newStatus}`, {
//         method: "PUT",
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Failed to update status:", response.status, errorText); // Log more detail
//         toast.error("Failed to update status on server.");
//         return false;
//       }

//       toast.success("Status updated successfully!");
//       return true;
//     } catch (error) {
//       console.error("Network error:", error);
//       toast.error("Network error while updating status.");
//       return false;
//     }
//   };
  
  
  
  

//   // Paginate deliveries
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

//   const handleRowClick = (delivery) => {
//     setSelectedDelivery(delivery);
//   };

//   const handleDelete = (id) => {
//     setDeliveries(deliveries.filter((delivery) => delivery.id !== id));
//     setSelectedDelivery(null);
//   };

//   const handleEdit = () => {
//     setEditMode(true);
//   };

//   const handleInputChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     setDeliveries(deliveries.map((delivery) => (delivery.id === editData.id ? editData : delivery)));
//     setSelectedDelivery(editData);
//     setEditMode(false);
//   };


//   return (
//     <div className="space-y mb-6 animate-fadeIn">
//       <nav className="text-black py-6 px-6 flex items-center justify-end">
//         {/* Profile logo in top-right corner */}
//         <div className="relative">
//           <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
//         </div>
//       </nav>
//       <div className="p-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-9 text-center">🚚 Deliveries Information</h2>
       
//       <div className="grid grid-cols-5 gap-6">
//             <div className={`p-4 bg-blue-100 rounded-lg shadow  text-center cursor-pointer ${
//             filterStatus === "All" ? "ring-2 ring-blue-500" : "bg-blue-100"
//               }`}
//               onClick={() => setFilterStatus("All")}
//             >
//               <h4 className="text-lg font-semibold text-blue-800">Total Orders</h4>
//               <p className="text-2xl font-bold text-blue-900">{totalDeli}</p>
//             </div>
//             <div className={`p-4 bg-orange-100 rounded-lg shadow text-center cursor-pointer ${
//             filterStatus === "Confirming" ? "ring-2 ring-orange-500" : "bg-orange-100"
//           }`}
//           onClick={() => setFilterStatus("Confirming")}
//         >
//               <h4 className="text-lg font-semibold text-orange-800">
//                 Wating Confirm Orders
//               </h4>
//               <p className="text-2xl font-bold text-yellow-900">{confirmingDeli}</p>
//             </div>
//             <div className={`p-4 bg-yellow-100 rounded-lg shadow text-center cursor-pointer ${
//             filterStatus === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-100"
//           }`}
//           onClick={() => setFilterStatus("Pending")}
//         >
//               <h4 className="text-lg font-semibold text-yellow-800">
//                 Pending Orders
//               </h4>
//               <p className="text-2xl font-bold text-yellow-900">{pendingDeli}</p>
//             </div>
//             <div className={`p-4 bg-green-100 rounded-lg shadow text-center cursor-pointer ${
//             filterStatus === "On Way" ? "ring-2 ring-green-500" : "bg-green-100"
//           }`}
//           onClick={() => setFilterStatus("On Way")}
//         >
//               <h4 className="text-lg font-semibold text-green-800">
//                 On Way Orders
//               </h4>
//               <p className="text-2xl font-bold text-green-900">{onWayDeli}</p>
//             </div>
//             <div className={`p-4 bg-red-100 rounded-lg shadow text-center cursor-pointer ${
//             filterStatus === "Delivered" ? "ring-2 ring-red-500" : "bg-red-100"
//           }`}
//           onClick={() => setFilterStatus("Delivered")}
//         >
//               <h4 className="text-lg font-semibold text-red-800">
//                 Delivered Orders
//               </h4>
//               <p className="text-2xl font-bold text-red-900">{finishDeli}</p>
//             </div>
//           </div>
  
// <br></br>
//         <input
//           type="text"
//           placeholder="Search by ID or Name...                                                                                                     🔍"
//           className="w-[50%] border items-center ml-[340px] pl-6 rounded-md p-2 mb-9"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value.toLowerCase());
//             setCurrentPage(1);
//           }}
//         />
       
//         {filteredOrders.length > 0 ? (
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//               <thead>
//                 <tr  className="bg-gray-800 text-white">
//                   <th className="py-2 px-4">ID</th>
//                   <th className="py-2 px-4">Name</th>
//                   <th className="py-2 px-4">Date</th>
//                   <th className="py-2 px-4">Time</th>
//                   <th className="py-2 px-4">Total Amount</th>
//                   <th className="py-2 px-4">Status</th>
//                   <th className="py-2 px-4">Action</th>
//                   <th className="py-2 px-4">Payment Method</th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {filteredOrders.map((delivery) => (
//                   <tr
//                     key={delivery.id}
//                     className="border-t cursor-pointer hover:bg-gray-100"
//                     onClick={(e) => 
//                       {
//                         if (!e.target.closest('button')){
//                           handleRowClick(delivery);
//                         }
//                       }}
                   
//                   >
//                     <td className="py-2 px-4 text-center">{delivery.id}</td>
//                     <td className="py-2 px-4 text-center">{delivery.name}</td>
//                     <td className="py-2 px-4 text-center">{delivery.orderDate}</td>
//                     <td className="py-2 px-4 text-center">{delivery.time}</td>
//                     <td className="py-2 px-4 text-center">{delivery.totalAmount}</td>
//                     <td className="py-2 px-4 text-center">
                
//                 <span>
//                   {delivery.status}
//                 </span>
//                 </td>
//                 <td className="py-2 px-4 text-center">
//                 <div className="w-full flex justify-center space-x-2">
//                   {delivery.status === "Confirming" && (
//                     <button
//                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
//                       onClick={() => updateDeliveryStatus(delivery.id, "Pending")}
//                     >
//                       Pending
//                     </button>
//                   )}
//                   {delivery.status === "Pending" && (
//                     <button
//                       className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
//                       onClick={() => updateDeliveryStatus(delivery.id, "On Way")}
//                     >
//                       On Way
//                     </button>
//                   )}
//                   {delivery.status === "On Way" && (
//                     <button
//                       className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
//                       onClick={() => updateDeliveryStatus(delivery.id, "Delivered")}
//                     >
//                       Delivered
//                     </button>
//                   )}
               
//                 </div></td>
//                     <td className="py-2 px-4 text-center">{delivery.paymentMethod}</td>
//                  </tr>
                 
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center text-red-500 font-bold text-lg mt-1 mb-3 pb-5">No Orders</p>
//         )}

//         <div className="flex justify-center mt-4 space-x-2">
//           <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled={currentPage === 1}>
//             Previous
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-4 py-2 rounded-md border ${currentPage === page ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
//             >
//               {page}
//             </button>
//           ))}
//           <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-4 py-2 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled={currentPage === totalPages}>
//             Next
//           </button>
//         </div>

        
//         {selectedDelivery && (
//   <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
//       <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
//       <div className="mb-4">
//         <p><strong>Name :</strong> {selectedDelivery.name}</p>
//         <p><strong>Email :</strong> {selectedDelivery.email}</p>
//         <p><strong>Address :</strong> {selectedDelivery.street}</p>
//         <p><strong>Phone :</strong> {selectedDelivery.phone}</p>
//         <p><strong>Total Amount :</strong> {selectedDelivery.totalAmount} - Kyats</p>
//         <p><strong>Payment Method :</strong> {selectedDelivery.paymentMethod}</p>
//         <p><strong>Date :</strong> {selectedDelivery.orderDate}</p>
//         <p><strong>Time :</strong> {selectedDelivery.time}</p>

//         <h4 className="mt-4 font-semibold">Ordered Products :</h4>
//         <ul className="list-disc list-inside">
//           {selectedDelivery.orderedProducts && selectedDelivery.orderedProducts.map((product, index) => (
//             <li key={index}>
//               {product.productName} (Qty: {product.quantity})
//             </li>
//           ))}
//         </ul>
//         <br></br>
//         <label className="block font-semibold mb-1">Status : {selectedDelivery.status}</label>
    
   
//       </div>
//       <div className="flex justify-end mt-4">
//         <button onClick={() => setSelectedDelivery(null)} className="bg-gray-500 text-white px-3 py-1 rounded-md">Close</button>
//       </div>
//     </div>
//   </div>
// )}

//       </div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//     </div>
//   );
// };

// export default DeliInfo;



// import 'react-toastify/dist/ReactToastify.css';
// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { CgProfile } from 'react-icons/cg';
// import { toast, ToastContainer } from 'react-toastify';

// const DeliInfo = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [shops, setShops] = useState([]);
//   const [selectedShop, setSelectedShop] = useState("");
//   const itemsPerPage = 7;
//   const prevOrderIds = useRef(new Set());
//   const audioRef = useRef(new Audio('/notification.mp3'));

//   // Delivery status counts
//   const confirmingDeli = deliveries.filter(d => d.status === "Confirming").length;
//   const pendingDeli = deliveries.filter(d => d.status === "Pending").length;
//   const onWayDeli = deliveries.filter(d => d.status === "On Way").length;
//   const finishDeli = deliveries.filter(d => d.status === "Delivered").length;

//   useEffect(() => {
//     axios.get('http://localhost:8082/shop/get')
//       .then(res => {
//         setShops(res.data);
//         if (res.data.length > 0) {
//           setSelectedShop(res.data[0].id);
//         }
//       })
//       .catch(err => console.error("Error fetching shops:", err));
//   }, []);

//   useEffect(() => {
//     if (!selectedShop) return;

//     const fetchDeliveries = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${selectedShop}`);
//         const newData = response.data.deliveries || []; // Make sure it's an array
    
//         // Filtering logic
//         const filteredData = newData.filter((delivery) =>
//           delivery.name && delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
    
//         setDeliveries(filteredData);
//         prevOrderIds.current = new Set(filteredData.map((d) => d.id));
    
//         const newOrders = filteredData.filter(
//           (delivery) =>
//             !prevOrderIds.current.has(delivery.id) &&
//             delivery.status === "Confirming"
//         );
    
//         if (newOrders.length > 0) {
//           newOrders.forEach((delivery) => {
//             toast.success(`🛎️ New Order From ${delivery.name}`);
//           });
//           audioRef.current.play();
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch deliveries:", error);
//       }
//     };
    
    

//     fetchDeliveries();
//     const interval = setInterval(fetchDeliveries, 5000);
//     return () => clearInterval(interval);
//   }, [selectedShop]);

//   const filteredDeliveries = deliveries.filter(
//     d => d.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredOrders = filterStatus === "All"
//     ? filteredDeliveries
//     : filteredDeliveries.filter(d => d.status === filterStatus);

//   const updateDeliveryStatus = async (id, newStatus) => {
//     try {
//       const res = await fetch(`http://localhost:8082/delivery/status/${id}?status=${newStatus}`, {
//         method: "PUT",
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("Failed to update:", res.status, errorText);
//         toast.error("Failed to update status.");
//         return;
//       }

//       toast.success("Status updated!");
//     } catch (err) {
//       console.error("Network error:", err);
//       toast.error("Network error while updating.");
//     }
//   };
  
  
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentItems = filteredOrders.slice(indexOfFirst, indexOfLast);

//   return (
//     <div className="space-y mb-6 animate-fadeIn">
//       <nav className="text-black py-6 px-6 flex items-center justify-end">
//         <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
//       </nav>

//       <div className="p-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-9 text-center">🚚 Deliveries Information</h2>

//         {/* Shop Dropdown */}
//         <div className="flex justify-center mb-6">
//           <select
//             value={selectedShop}
//             onChange={e => setSelectedShop(e.target.value)}
//             className="border px-4 py-2 rounded-md"
//           >
//             {shops.map(shop => (
//               <option key={shop.id} value={shop.id}>{shop.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Delivery Status Overview */}
//         <div className="grid grid-cols-5 gap-6 mb-6">
//           {[
//             ["All", deliveries.length, "blue"],
//             ["Confirming", confirmingDeli, "orange"],
//             ["Pending", pendingDeli, "yellow"],
//             ["On Way", onWayDeli, "green"],
//             ["Delivered", finishDeli, "red"]
//           ].map(([label, count, color]) => (
//             <div
//               key={label}
//               onClick={() => setFilterStatus(label)}
//               className={`p-4 bg-${color}-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === label ? `ring-2 ring-${color}-500` : ""}`}
//             >
//               <h4 className={`text-lg font-semibold text-${color}-800`}>{label} Orders</h4>
//               <p className={`text-2xl font-bold text-${color}-900`}>{count}</p>
//             </div>
//           ))}
//         </div>

//         <input
//           type="text"
//           placeholder="Search by Email..."
//           className="w-1/2 border rounded-md p-2 mb-6 block mx-auto"
//           value={searchTerm}
//           onChange={e => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//         />

//         {filteredOrders.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//               <thead>
//                 <tr className="bg-gray-800 text-white">
//                   <th className="py-2 px-4">ID</th>
//                   <th className="py-2 px-4">Name</th>
//                   <th className="py-2 px-4">Date</th>
//                   <th className="py-2 px-4">Time</th>
//                   <th className="py-2 px-4">Total</th>
//                   <th className="py-2 px-4">Status</th>
//                   <th className="py-2 px-4">Action</th>
//                   <th className="py-2 px-4">Payment</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map(d => (
//                   <tr
//                     key={d.id}
//                     className="border-t hover:bg-gray-100 cursor-pointer"
//                     onClick={(e) => {
//                       if (!e.target.closest('button')) {
//                         setSelectedDelivery(d);
//                       }
//                     }}
//                   >
//                     <td className="py-2 px-4 text-center">{d.id}</td>
//                     <td className="py-2 px-4 text-center">{d.name}</td>
//                     <td className="py-2 px-4 text-center">{d.orderDate}</td>
//                     <td className="py-2 px-4 text-center">{d.time}</td>
//                     <td className="py-2 px-4 text-center">{d.totalAmount}</td>
//                     <td className="py-2 px-4 text-center">{d.status}</td>
//                     <td className="py-2 px-4 text-center">
//                       {d.status === "Confirming" && (
//                         <button onClick={() => updateDeliveryStatus(d.id, "Pending")} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Pending</button>
//                       )}
//                       {d.status === "Pending" && (
//                         <button onClick={() => updateDeliveryStatus(d.id, "On Way")} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">On Way</button>
//                       )}
//                       {d.status === "On Way" && (
//                         <button onClick={() => updateDeliveryStatus(d.id, "Delivered")} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Delivered</button>
//                       )}
//                     </td>
//                     <td className="py-2 px-4 text-center">{d.paymentMethod}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center text-red-500 font-bold text-lg mt-2">No Orders</p>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center mt-4 space-x-2">
//           <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Prev</button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//             <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{page}</button>
//           ))}
//           <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Next</button>
//         </div>

//         {/* Detail Modal */}
//         {selectedDelivery && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
//               <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
//               <p><strong>Name:</strong> {selectedDelivery.name}</p>
//               <p><strong>Email:</strong> {selectedDelivery.email}</p>
//               <p><strong>Address:</strong> {selectedDelivery.street}</p>
//               <p><strong>Phone:</strong> {selectedDelivery.phone}</p>
//               <p><strong>Total Amount:</strong> {selectedDelivery.totalAmount}</p>
//               <p><strong>Payment Method:</strong> {selectedDelivery.paymentMethod}</p>
//               <p><strong>Date:</strong> {selectedDelivery.orderDate}</p>
//               <p><strong>Time:</strong> {selectedDelivery.time}</p>
//               <p><strong>Status:</strong> {selectedDelivery.status}</p>
//               <h4 className="mt-3 font-semibold">Ordered Products:</h4>
//               <ul className="list-disc list-inside">
//                 {selectedDelivery.orderedProducts?.map((p, i) => (
//                   <li key={i}>{p.productName} (Qty: {p.quantity})</li>
//                 ))}
//               </ul>
//               <button onClick={() => setSelectedDelivery(null)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">Close</button>
//             </div>
//           </div>
//         )}

//         <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       </div>
//     </div>
//   );
// };

// export default DeliInfo;



import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import { toast, ToastContainer } from 'react-toastify';

const DeliInfo = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const itemsPerPage = 10;
  const prevOrderIds = useRef(new Set());
  const audioRef = useRef(new Audio('/notification.mp3'));
  const [selectedShopId, setSelectedShopId] = useState("all");
  const [shopName, setShopName] = useState("");


  const confirmingDeli = deliveries.filter(d => d.status === "Confirming").length;
  const pendingDeli = deliveries.filter(d => d.status === "Pending").length;
  const onWayDeli = deliveries.filter(d => d.status === "On Way").length;
  const finishDeli = deliveries.filter(d => d.status === "Delivered").length;

  useEffect(() => {
    axios.get('http://localhost:8082/shop/get')
      .then(res => {
        setShops(res.data);
        if (res.data.length > 0) {
          setSelectedShop(res.data[0].id);
        }
      })
      .catch(err => console.error("Error fetching shops:", err));
  }, []);

  // useEffect(() => {
  //   // const fetchDeliveries = async () => {
  //   //   try {
  //   //     let allDeliveries = [];

  //   //     if (!selectedShop || selectedShop === '') {
  //   //       const response = await axios.get("http://localhost:8082/delivery/all");
  //   //       allDeliveries = response.data.flatMap(shop => shop.deliveries || []);
  //   //     } else {
  //   //       const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${selectedShop}`);
  //   //       allDeliveries = response.data.deliveries || [];
  //   //     }

  //   //     const filteredData = allDeliveries.filter((delivery) =>
  //   //       delivery.name && delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   //     );

  //   //     const newOrders = filteredData.filter(
  //   //       (delivery) =>
  //   //         !prevOrderIds.current.has(delivery.id) &&
  //   //         delivery.status === "Confirming"
  //   //     );

  //   //     if (newOrders.length > 0) {
  //   //       newOrders.forEach((delivery) => {
  //   //         toast.success(`🛎️ New Order From ${delivery.name}`);
  //   //       });
  //   //       audioRef.current.play();
  //   //     }

  //   //     setDeliveries(filteredData);
  //   //     prevOrderIds.current = new Set(filteredData.map((d) => d.id));
  //   //   } catch (error) {
  //   //     console.error("❌ Failed to fetch deliveries:", error);
  //   //   }
  //   // };


  //   const fetchDeliveries = useCallback(() => {
  //     let url = '';
  //     if (selectedShopId === "all") {
  //       url = 'http://localhost:8082/delivery/all';
  //     } else {
  //       url = `http://localhost:8082/delivery/getOrderByShop/${selectedShopId}`;
  //     }
    
  //     axios.get(url)
  //       .then(response => {
  //         if (selectedShopId === "all") {
  //           // Response is an array directly
  //           setDeliveries(response.data || []);
  //           setShopName(""); // no specific shop name in this case
  //         } else {
  //           // Response is an object { deliveries: [...], shopName: '...' }
  //           setDeliveries(response.data.deliveries || []);
  //           setShopName(response.data.shopName || "");
  //         }
  //       })
  //       .catch(error => {
  //         console.error('❌ Failed to fetch deliveries:', error);
  //       });
  //   }, [selectedShopId]);
    
    
    
  //   fetchDeliveries();
  //   const interval = setInterval(fetchDeliveries, 5000);
  //   return () => clearInterval(interval);
  // }, [selectedShop, searchTerm]);


  const fetchDeliveries = useCallback(() => {
    let url = '';
    if (selectedShopId === "all") {
      url = 'http://localhost:8082/delivery/all';
    } else {
      url = `http://localhost:8082/delivery/getOrderByShop/${selectedShopId}`;
    }

    axios.get(url)
      .then(response => {
        if (selectedShopId === "all") {
          setDeliveries(response.data || []);
          setShopName(""); // reset shop name when all shops selected
        } else {
          setDeliveries(response.data.deliveries || []);
          setShopName(response.data.shopName || "");
        }
      })

      // axios.get(url)
      //       .then(response => {
      //         if (selectedShopId === "all") {
      //           // Response is an array directly
      //           setDeliveries(response.data || []);
      //           setShopName(""); // no specific shop name in this case
      //         } else {
      //           // Response is an object { deliveries: [...], shopName: '...' }
      //           setDeliveries(response.data.deliveries || []);
      //           setShopName(response.data.shopName || "");
      //         }
      //       })
      .catch(error => {
        console.error('❌ Failed to fetch deliveries:', error);
      });
  }, [selectedShopId]);

  useEffect(() => {
  const fetchDeliveries = async () => {
    try {
      let allDeliveries = [];

      if (!selectedShop || selectedShop === '') {
        const response = await axios.get("http://localhost:8082/delivery/all");
        allDeliveries = response.data.flatMap(shop => shop.deliveries || []);
      } else {
        const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${selectedShop}`);
        allDeliveries = response.data.deliveries || [];
      }

      const filteredData = allDeliveries.filter((delivery) =>
        delivery.name && delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const newOrders = filteredData.filter(
        (delivery) =>
          !prevOrderIds.current.has(delivery.id) &&
          delivery.status === "Confirming"
      );

      if (newOrders.length > 0) {
        newOrders.forEach((delivery) => {
          toast.success(`🚚 New Order From ${delivery.name}`);
        });
        audioRef.current.play();
      }

      // Merge new IDs into existing Set
      filteredData.forEach(delivery => prevOrderIds.current.add(delivery.id));

      // Transform deliveries: format time + date safely
      const transformedDeliveries = filteredData.map(order => {
        let formattedTime = "Unknown time";
        if (order.orderTime) {
          const [hour, minute] = order.orderTime.split(":").map(Number);
          const date = new Date();
          date.setHours(hour);
          date.setMinutes(minute);
          formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        }

        const formattedDate = order.orderDate
          ? new Date(order.orderDate).toLocaleDateString("en-GB")
          : "Unknown Date";

        return {
          ...order,
          time: formattedTime,
          orderDate: formattedDate,
        };
      });

      setDeliveries(transformedDeliveries);
    } catch (error) {
      console.error("❌ Failed to fetch deliveries:", error);
    }
  };

  fetchDeliveries();
}, [selectedShop, searchTerm]);

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);
  const filteredDeliveries = deliveries.filter(
    d => d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = filterStatus === "All"
    ? filteredDeliveries
    : filteredDeliveries.filter(d => d.status === filterStatus);

  const updateDeliveryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8082/delivery/status/${id}?status=${newStatus}`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update:", res.status, errorText);
        toast.error("Failed to update status.");
        return;
      }

      toast.success("Status updated!");
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error while updating.");
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirst, indexOfLast);

  return (
    <div className="space-y mb-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
      </nav>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-9 text-center">🚚 Deliveries Information</h2>

        {/* <div className="flex justify-center mb-6">
        <select
  value={selectedShopId}
  onChange={e => setSelectedShopId(e.target.value)}
  className="border px-4 py-2 rounded-md"
>
  <option value="all">All Shops</option>
  {shops.map(shop => (
    <option key={shop.id} value={shop.id}>{shop.name}</option>
  ))}
</select>
        </div> */}
        <div className="relative inline-block w-40 mb-6">
  <select
    value={selectedShopId}
    onChange={(e) => setSelectedShopId(e.target.value)}
    className="appearance-none w-full border px-4 py-2 rounded pr-10 bg-white"
  >
    <option value="all">All Shops</option>
    {shops.map((shop) => (
      <option key={shop.id} value={shop.id}>
        {shop.name}
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    <svg
      className="w-4 h-4 text-gray-700"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

        <div className="grid grid-cols-5 gap-6 mb-6">
          {[
            ["All", deliveries.length, "blue"],
            ["Confirming", confirmingDeli, "orange"],
            ["Pending", pendingDeli, "yellow"],
            ["On Way", onWayDeli, "green"],
            ["Delivered", finishDeli, "red"]
          ].map(([label, count, color]) => (
            <div
              key={label}
              onClick={() => setFilterStatus(label)}
              className={`p-4 bg-${color}-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === label ? `ring-2 ring-${color}-500` : ""}`}
            >
              <h4 className={`text-lg font-semibold text-${color}-800`}>{label} Orders</h4>
              <p className={`text-2xl font-bold text-${color}-900`}>{count}</p>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by Email..."
          className="w-1/2 border rounded-md p-2 mb-6 block mx-auto"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Time</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                  <th className="py-2 px-4">Payment</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(d => (
                  <tr
                    key={d.id}
                    className="border-t hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest('button')) {
                        setSelectedDelivery(d);
                      }
                    }}
                  >
                    <td className="py-2 px-4 text-center">{d.id}</td>
                    <td className="py-2 px-4 text-center">{d.name}</td>
                    <td className="py-2 px-4 text-center">{d.orderDate}</td>
                    <td className="py-2 px-4 text-center">{d.time}</td>
                    <td className="py-2 px-4 text-center">{d.totalAmount}</td>
                    <td className="py-2 px-4 text-center">{d.status}</td>
                    <td className="py-2 px-4 text-center">
                      {d.status === "Confirming" && (
                        <button onClick={() => updateDeliveryStatus(d.id, "Pending")} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Pending</button>
                      )}
                      {d.status === "Pending" && (
                        <button onClick={() => updateDeliveryStatus(d.id, "On Way")} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">On Way</button>
                      )}
                      {d.status === "On Way" && (
                        <button onClick={() => updateDeliveryStatus(d.id, "Delivered")} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Delivered</button>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">{d.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-red-500 font-bold text-lg mt-2">No Orders</p>
        )}

        <div className="flex justify-center mt-4 space-x-2">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Next</button>
        </div>

        {selectedDelivery && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
              <p><strong>Name:</strong> {selectedDelivery.name}</p>
              <p><strong>Email:</strong> {selectedDelivery.email}</p>
              <p><strong>Address:</strong> {selectedDelivery.street}</p>
              <p><strong>Phone:</strong> {selectedDelivery.phone}</p>
              <p><strong>Total Amount:</strong> {selectedDelivery.totalAmount}</p>
              <p><strong>Payment Method:</strong> {selectedDelivery.paymentMethod}</p>
              <p><strong>Date:</strong> {selectedDelivery.orderDate}</p>
              <p><strong>Time:</strong> {selectedDelivery.time}</p>
              <p><strong>Status:</strong> {selectedDelivery.status}</p>
              <h4 className="mt-3 font-semibold">Ordered Products:</h4>
              <ul className="list-disc list-inside">
                {selectedDelivery.orderedProducts?.map((p, i) => (
                  <li key={i}>{p.productName} (Qty: {p.quantity})</li>
                ))}
              </ul>
              <button onClick={() => setSelectedDelivery(null)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">Close</button>
            </div>
          </div>
        )}

      </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default DeliInfo;







