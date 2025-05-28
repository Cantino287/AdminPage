// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import axios from 'axios';
// import { CgProfile } from 'react-icons/cg';
// import { toast, ToastContainer } from 'react-toastify';

// const OrderManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [shopList, setShopList] = useState([]);
//   const [selectedShopId, setSelectedShopId] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const prevOrderIds = useRef(new Set());


//   //  page switching ----------------------


//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 10;  // You can change this number
//   const filteredOrders =
//     filterStatus === "All"
//       ? [...orders].reverse()
//       : orders.filter((order) => order.status === filterStatus);

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


//   //---------------------------------------

//   // Audio notification ref
//   const audio = useRef(null);

//   // Fetch Shops once on mount
//   useEffect(() => {
//     axios.get("http://localhost:8082/shop/get")
//       .then(res => setShopList(res.data))
//       .catch(err => console.error("Failed to fetch shops:", err));
//   }, []);

//   // Fetch Orders based on selectedShopId
//   const fetchOrders = useCallback(() => {
//     let url = '';
//     if (selectedShopId === "all") {
//       url = 'http://localhost:8082/orders/get';
//     } else {
//       url = `http://localhost:8082/orders/getByShop/${selectedShopId}`;
//     }

//     axios.get(url)
//       .then(res => {
//         const transformedOrders = res.data.map(order => {
//           const names = order.orderedProductNames || [];
//           const quantities = order.quantity || [];
//           const prices = order.price || [];

//           const items = names.map((name, index) => ({
//             name,
//             quantity: quantities[index] || 0,
//             price: prices[index] || 0,
//           }));

//           const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
//           const taxAmount = Math.round(subtotal * 0.05);
//           const total = subtotal + taxAmount;

//           return {
//             id: order.id,
//             table_number: order.tableNumber,
//             status: order.status,
//             time: new Date(`1970-01-01T${order.orderTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
//             orderDate: order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-GB") : "Unknown Date",
//             items,
//             taxes: `${taxAmount}`,
//             total: `${Math.round(total)}`,
//             shopId: order.shopId || null,
//             shopName: order.shopName || "Unknown Shop"  // <-- use this instead of order.shop?.name
//           };
//         });

//         const newOrders = transformedOrders.filter(
//           order => !prevOrderIds.current.has(order.id) && order.status === "Confirming"
//         );

//         if (newOrders.length > 0) {
//           newOrders.forEach(order => toast.success(`🛎️ New Order at Table ${order.table_number}`));
//           if (audio.current) audio.current.play();
//         }

//         setOrders(transformedOrders);
//         prevOrderIds.current = new Set(transformedOrders.map(order => order.id));
//       })
//       .catch(error => console.error("Failed to fetch orders:", error));
//   }, [selectedShopId]);

//   // Setup audio and periodic fetching
//   useEffect(() => {
//     audio.current = new Audio('/notification.mp3');
//   }, []);

//   // Fetch orders initially and on shop change every 5 seconds
//   useEffect(() => {
//     fetchOrders();
//     const intervalId = setInterval(fetchOrders, 5000);
//     return () => clearInterval(intervalId);
//   }, [fetchOrders]);

//   // Update order status API call
//   const updateOrderStatus = (id, newStatus) => {
//     axios.put(`http://localhost:8082/orders/status/${id}`, null, {
//       params: { status: newStatus }
//     })
//       .then(() => {
//         setOrders(prev =>
//           prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
//         );
//       })
//       .catch(err => console.error("Failed to update order status", err));
//   };

//   // Calculate total price for display in popup
//   const calculateTotal = (items, taxes) => {
//     const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
//     return `${Math.round(subtotal + parseFloat(taxes))} Kyats`;
//   };

//   // Show order details popup
//   const showOrderDetails = (order) => {
//     const updatedOrder = { ...order, total: calculateTotal(order.items, order.taxes) };
//     setSelectedOrder(updatedOrder);
//   };

//   // Close popup
//   const closePopup = () => setSelectedOrder(null);

//   // Status counts and filter orders
//   const totalOrders = orders.length;
//   const confirmingOrders = orders.filter(o => o.status === "Confirming").length;
//   const pendingOrders = orders.filter(o => o.status === "Pending").length;
//   const completedOrders = orders.filter(o => o.status === "Completed").length;
//   const canceledOrders = orders.filter(o => o.status === "Canceled").length;


//   const completionRate = totalOrders === 0 ? 0 : (completedOrders / totalOrders) * 100;

//   return (
//     <div className="space-y mb-6 animate-fadeIn">
//       <nav className="text-black py-6 px-6 flex items-center justify-end">
//         <div className="relative">
//           <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
//         </div>
//       </nav>

//       <h2 className="text-3xl mb-9 font-bold text-center text-gray-800">📦 Order Management</h2>

//       <div className="mb-4">
//         <label className="mr-2 font-medium">Filter by Shop:</label>
//         <div className="relative inline-block w-40">
//           <select
//             value={selectedShopId}
//             onChange={(e) => setSelectedShopId(e.target.value)}
//             className="appearance-none w-full border px-4 py-2 rounded pr-10 bg-white"
//           >
//             <option value="all">All Shops</option>
//             {shopList.map((shop) => (
//               <option key={shop.id} value={shop.id}>
//                 {shop.name}
//               </option>
//             ))}
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//             <svg
//               className="w-4 h-4 text-gray-700"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6 animate-fadeIn">
//         <div className="grid grid-cols-5 gap-6">
//           <div className={`p-4 bg-blue-100 rounded-lg shadow  text-center cursor-pointer ${filterStatus === "All" ? "ring-2 ring-blue-500" : "bg-blue-100"
//             }`}
//             onClick={() => setFilterStatus("All")}
//           >
//             <h4 className="text-lg font-semibold text-blue-800">Total Orders</h4>
//             <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
//           </div>
//           <div className={`p-4 bg-orange-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Confirming" ? "ring-2 ring-orange-500" : "bg-orange-100"
//             }`}
//             onClick={() => setFilterStatus("Confirming")}
//           >
//             <h4 className="text-lg font-semibold text-orange-800">
//               Wating Confirm Orders
//             </h4>
//             <p className="text-2xl font-bold text-yellow-900">{confirmingOrders}</p>
//           </div>
//           <div className={`p-4 bg-yellow-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-100"
//             }`}
//             onClick={() => setFilterStatus("Pending")}
//           >
//             <h4 className="text-lg font-semibold text-yellow-800">
//               Pending Orders
//             </h4>
//             <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
//           </div>
//           <div className={`p-4 bg-green-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Completed" ? "ring-2 ring-green-500" : "bg-green-100"
//             }`}
//             onClick={() => setFilterStatus("Completed")}
//           >
//             <h4 className="text-lg font-semibold text-green-800">Completed Orders</h4>
//             <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
//           </div>
//           <div className={`p-4 bg-red-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Canceled" ? "ring-2 ring-red-500" : "bg-red-100"
//             }`}
//             onClick={() => setFilterStatus("Canceled")}
//           >
//             <h4 className="text-lg font-semibold text-red-800">Canceled Orders</h4>
//             <p className="text-2xl font-bold text-red-900">{canceledOrders}</p>
//           </div>
//         </div>


//         {/* Order list */}
//         <div className="overflow-auto border rounded-lg">
//           <div className="grid grid-cols-4 gap-4 text-gray-600 p-4 border-b font-semibold text-center">
//             <span>Table & Time</span>
//             <span>Shop</span>
//             <span>Status</span>
//             <span className="text-right">Actions</span>
//           </div>


//        {currentOrders.length > 0 ? (
//   currentOrders.map((order) => (
//     <div
//       key={order.id}
//       className="grid grid-cols-4 items-center p-4 border-b cursor-pointer hover:bg-gray-100"
//       onClick={(e) => {
//         if (!e.target.closest('button')) {
//           showOrderDetails(order);
//         }
//       }}
//     >
//       <span>
//         Table: <span className="bg-blue-500 text-white px-4 py-1 rounded-lg">{order.table_number}</span> - {order.time}
//       </span>

//       <span className="bg-gray-100 px-2 py-1 rounded inline-block text-center w-full">
//         <span className="bg-gray-300 px-2 py-1 rounded inline-block">
//           {order.shopName}
//         </span>
//       </span>
//       <span className={`px-0 py-1 rounded-full text-white w-24 text-center mx-auto ${order.status === "Confirming" ? "bg-orange-500" :
//           order.status === "Completed" ? "bg-green-500" :
//             order.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
//         }`}>
//         {order.status}
//       </span>

//       <div className="flex justify-end space-x-2">
//         {order.status === "Confirming" && (
//           <button className="px-3 py-1 bg-yellow-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Pending")}>Pending</button>
//         )}
//         {order.status === "Pending" && (
//           <button className="px-3 py-1 bg-green-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Completed")}>Complete</button>
//         )}
//         {(order.status === "Pending" || order.status === "Confirming") && (
//           <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Canceled")}>Cancel</button>
//         )}
//       </div>
//     </div>
//   ))
// ) : filteredOrders.length > 0 ? (
//   (filterStatus === "All" ? [...filteredOrders].reverse() : filteredOrders).map(order => (
//     <div
//       key={order.id}
//       className="grid grid-cols-4 items-center p-4 border-b cursor-pointer hover:bg-gray-100"
//       onClick={(e) => {
//         if (!e.target.closest('button')) {
//           showOrderDetails(order);
//         }
//       }}
//     >
//       <span>
//         Table: <span className="bg-blue-500 text-white px-4 py-1 rounded-lg">{order.table_number}</span> - {order.time}
//       </span>

//       <span className="bg-gray-100 px-2 py-1 rounded inline-block text-center w-full">
//         <span className="bg-gray-300 px-2 py-1 rounded inline-block">
//           {order.shopName}
//         </span>
//       </span>
//       <span className={`px-0 py-1 rounded-full text-white w-24 text-center mx-auto ${order.status === "Confirming" ? "bg-orange-500" :
//           order.status === "Completed" ? "bg-green-500" :
//             order.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
//         }`}>
//         {order.status}
//       </span>

//       <div className="flex justify-end space-x-2">
//         {order.status === "Confirming" && (
//           <button className="px-3 py-1 bg-yellow-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Pending")}>Pending</button>
//         )}
//         {order.status === "Pending" && (
//           <button className="px-3 py-1 bg-green-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Completed")}>Complete</button>
//         )}
//         {(order.status === "Pending" || order.status === "Confirming") && (
//           <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Canceled")}>Cancel</button>
//         )}
//       </div>
//     </div>
//   ))
// ) : (
//   <div className="text-center text-gray-500 py-8 text-lg">No orders found.</div>
// )}



//         </div>
//              <div className="flex justify-center mt-4 space-x-2">
//             <button
//               className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>

//             {[...Array(totalPages)].map((_, idx) => (
//               <button
//                 key={idx}
//                 className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
//                   }`}
//                 onClick={() => setCurrentPage(idx + 1)}
//               >
//                 {idx + 1}
//               </button>
//             ))}

//             <button
//               className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//       </div>

//       {/* Order details popup */}
//       {selectedOrder && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
//             <button
//               onClick={closePopup}
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
//             >
//               ×
//             </button>
//             <h2 className="text-xl font-bold mb-4">
//               Order Details for Table {selectedOrder.table_number}
//             </h2>
//             <p>Date: {selectedOrder.orderDate}</p>
//             <p>Time: {selectedOrder.time}</p>
//             <p>Shop: {selectedOrder.shopName}</p>

//             <table className="w-full mt-4 border-collapse border border-gray-300">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 p-2">Menu Item</th>
//                   <th className="border border-gray-300 p-2">Quantity</th>
//                   <th className="border border-gray-300 p-2">Price</th>
//                   <th className="border border-gray-300 p-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedOrder.items.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="text-center border border-gray-300 p-2">{item.name}</td>
//                     <td className="text-right border border-gray-300 p-2">{item.quantity}</td>
//                     <td className="text-right border border-gray-300 p-2">{item.price}</td>
//                     <td className="text-right border border-gray-300 p-2">{item.quantity * item.price}</td>
//                   </tr>
//                 ))}
//                 <tr>
//                   <td colSpan="3" className="text-right font-semibold p-2 border border-gray-300">Taxes (5%)</td>
//                   <td className="text-right border border-gray-300 p-2">{selectedOrder.taxes}</td>
//                 </tr>
//                 <tr>
//                   <td colSpan="3" className="text-right font-bold p-2 border border-gray-300">Total</td>
//                   <td className="text-right font-bold border border-gray-300 p-2">{selectedOrder.total}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default OrderManagement;



import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import { toast, ToastContainer } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shopList, setShopList] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("All");
  const prevOrderIds = useRef(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  //   //  page switching ----------------------


  //   const [currentPage, setCurrentPage] = useState(1);
  //   const ordersPerPage = 10;  // You can change this number
  //   const filteredOrders =
  //     filterStatus === "All"
  //       ? [...orders].reverse()
  //       : orders.filter((order) => order.status === filterStatus);

  //   const indexOfLastOrder = currentPage * ordersPerPage;
  //   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  //   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  //   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  //   //---------------------------------------
  // Audio notification ref
  const audio = useRef(null);


  //========================

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
  }
  // Fetch Shops once on mount
  useEffect(() => {
    axios.get("http://localhost:8082/shop/get")
      .then(res => setShopList(res.data))
      .catch(err => console.error("Failed to fetch shops:", err));
  }, []);

  // Fetch Orders based on selectedShopId
  const fetchOrders = useCallback(() => {
    let url = '';
    if (selectedShopId === "all") {
      url = 'http://localhost:8082/orders/get';
    } else {
      url = `http://localhost:8082/orders/getByShop/${selectedShopId}`;
    }

    axios.get(url)
      .then(res => {
        const transformedOrders = res.data.map(order => {
          const names = order.orderedProductNames || [];
          const quantities = order.quantity || [];
          const prices = order.price || [];

          const items = names.map((name, index) => ({
            name,
            quantity: quantities[index] || 0,
            price: prices[index] || 0,
          }));

          const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
          const taxAmount = Math.round(subtotal * 0.05);
          const total = subtotal + taxAmount;

          return {
            id: order.id,
            table_number: order.tableNumber,
            status: order.status,
            time: new Date(`1970-01-01T${order.orderTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
            orderDate: order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-GB") : "Unknown Date",
            items,
            taxes: `${taxAmount}`,
            total: `${Math.round(total)}`,
            shopId: order.shopId || null,
            shopName: order.shopName || "Unknown Shop"  // <-- use this instead of order.shop?.name
          };
        });

        const newOrders = transformedOrders.filter(
          order => !prevOrderIds.current.has(order.id) && order.status === "Confirming"
        );

        if (newOrders.length > 0) {
          newOrders.forEach(order => toast.success(`🛎️ New Order at Table ${order.table_number}`));
          if (audio.current) audio.current.play();
        }

        setOrders(transformedOrders);
        prevOrderIds.current = new Set(transformedOrders.map(order => order.id));
      })
      .catch(error => console.error("Failed to fetch orders:", error));
  }, [selectedShopId]);

  // Setup audio and periodic fetching
  useEffect(() => {
    audio.current = new Audio('/notification.mp3');
  }, []);

  // Fetch orders initially and on shop change every 5 seconds
  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  // Update order status API call
  const updateOrderStatus = (id, newStatus) => {
    axios.put(`http://localhost:8082/orders/status/${id}`, null, {
      params: { status: newStatus }
    })
      .then(() => {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
        );
      })
      .catch(err => console.error("Failed to update order status", err));
  };

  // Calculate total price for display in popup
  const calculateTotal = (items, taxes) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return `${Math.round(subtotal + parseFloat(taxes))} Kyats`;
  };

  // Show order details popup
  const showOrderDetails = (order) => {
    const updatedOrder = { ...order, total: calculateTotal(order.items, order.taxes) };
    setSelectedOrder(updatedOrder);
  };

  // Close popup
  const closePopup = () => setSelectedOrder(null);

  // Status counts and filter orders
  const totalOrders = orders.length;
  const confirmingOrders = orders.filter(o => o.status === "Confirming").length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const canceledOrders = orders.filter(o => o.status === "Canceled").length;


  const filteredOrders = orders
    .filter(order => filterStatus === "All" || order.status === filterStatus)
    .filter(order => selectedShopId === "all" || order.shopId?.toString() === selectedShopId)
    .reverse();

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


  const completionRate = totalOrders === 0 ? 0 : (completedOrders / totalOrders) * 100;

  return (
    <div className="space-y mb-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>

      <h2 className="text-3xl mb-9 font-bold text-center text-gray-800">📦 Order Management</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Shop:</label>
        <div className="relative inline-block w-40">
          <select
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            className="appearance-none w-full border px-4 py-2 rounded pr-10 bg-white"
          >
            <option value="all">All Shops</option>
            {shopList.map((shop) => (
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
      </div>

      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-5 gap-6">
          <div className={`p-4 bg-blue-100 rounded-lg shadow  text-center cursor-pointer ${filterStatus === "All" ? "ring-2 ring-blue-500" : "bg-blue-100"
            }`}
            onClick={() => setFilterStatus("All")}
          >
            <h4 className="text-lg font-semibold text-blue-800">Total Orders</h4>
            <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
          </div>
          <div className={`p-4 bg-orange-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Confirming" ? "ring-2 ring-orange-500" : "bg-orange-100"
            }`}
            onClick={() => setFilterStatus("Confirming")}
          >
            <h4 className="text-lg font-semibold text-orange-800">
              Wating Confirm Orders
            </h4>
            <p className="text-2xl font-bold text-yellow-900">{confirmingOrders}</p>
          </div>
          <div className={`p-4 bg-yellow-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-100"
            }`}
            onClick={() => setFilterStatus("Pending")}
          >
            <h4 className="text-lg font-semibold text-yellow-800">
              Pending Orders
            </h4>
            <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
          </div>
          <div className={`p-4 bg-green-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Completed" ? "ring-2 ring-green-500" : "bg-green-100"
            }`}
            onClick={() => setFilterStatus("Completed")}
          >
            <h4 className="text-lg font-semibold text-green-800">Completed Orders</h4>
            <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
          </div>
          <div className={`p-4 bg-red-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Canceled" ? "ring-2 ring-red-500" : "bg-red-100"
            }`}
            onClick={() => setFilterStatus("Canceled")}
          >
            <h4 className="text-lg font-semibold text-red-800">Canceled Orders</h4>
            <p className="text-2xl font-bold text-red-900">{canceledOrders}</p>
          </div>
        </div>


        {/* Order list */}
        <div className="overflow-auto border rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-gray-600 p-4 border-b font-semibold text-center">
            <span>Table & Time</span>
            <span>Shop</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {currentOrders.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No orders found.</p>
          ) : (
            currentOrders.map(order => (
              <div
                key={order.id}
                className="grid grid-cols-4 items-center p-4 border-b cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  if (!e.target.closest('button')) {
                    showOrderDetails(order);
                  }
                }}
              >
                <span>Table: <span className="bg-blue-500 text-white px-4 py-1 rounded-lg">{order.table_number}</span> - {order.time}</span>
                <span className="bg-gray-100 px-2 py-1 rounded inline-block text-center w-full">
                  <span className="bg-gray-300 px-2 py-1 rounded inline-block">
                    {order.shopName}
                  </span>
                </span>              <span className={`px-0 py-1 rounded-full text-white w-24 text-center mx-auto ${order.status === "Confirming" ? "bg-orange-500" :
                    order.status === "Completed" ? "bg-green-500" :
                      order.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                  }`}>
                  {order.status}
                </span>
                <div className="flex justify-end space-x-2">
                  {order.status === "Confirming" && (
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Pending")}>Pending</button>
                  )}
                  {order.status === "Pending" && (
                    <button className="px-3 py-1 bg-green-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Completed")}>Complete</button>
                  )}
                  {(order.status === "Pending" || order.status === "Confirming") && (
                    <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => updateOrderStatus(order.id, "Canceled")}>Cancel</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>

      {/* Order details popup */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              Order Details for Table {selectedOrder.table_number}
            </h2>
            <p>Date: {selectedOrder.orderDate}</p>
            <p>Time: {selectedOrder.time}</p>
            <p>Shop: {selectedOrder.shopName}</p>

            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Menu Item</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Price</th>
                  <th className="border border-gray-300 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center border border-gray-300 p-2">{item.name}</td>
                    <td className="text-right border border-gray-300 p-2">{item.quantity}</td>
                    <td className="text-right border border-gray-300 p-2">{item.price}</td>
                    <td className="text-right border border-gray-300 p-2">{item.quantity * item.price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-right font-semibold p-2 border border-gray-300">Taxes (5%)</td>
                  <td className="text-right border border-gray-300 p-2">{selectedOrder.taxes}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right font-bold p-2 border border-gray-300">Total</td>
                  <td className="text-right font-bold border border-gray-300 p-2">{selectedOrder.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderManagement;




