// import React, { useEffect, useState, useRef } from 'react';
// import { CgProfile } from 'react-icons/cg';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import './Overview.css';

// const AdminOverview = () => {
//   const [totalOrders, setTotalOrders] = useState(0);
// const [shopId, setShopId] = useState(null);
// const [role, setRole] = useState(null);


// useEffect(() => {
//   const storedUser = JSON.parse(localStorage.getItem('user'));
//   if (storedUser) {
//     setRole(storedUser.role);
//     if (storedUser.shopId) {
//       setShopId(storedUser.shopId);
//     }
//   }
// }, []);

// useEffect(() => {
//   if (role === 'admin') {
//     // Admin fetches all orders
//     axios.get('http://localhost:8082/orders/get')
//       .then(res => {
//         const orders = res.data || [];
//         console.log('Fetched orders:', orders);
//         setTotalOrders(orders.length);
//       })
//       .catch(err => {
//         console.error('Failed to fetch all orders for admin:', err);
//         setTotalOrders(0);
//       });
//   } else if (shopId) {
//     // Employee fetches orders by shopId
//     axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`)
//       .then(res => {
//         const orders = res.data || [];
//         console.log('Fetched orders:', orders);
//         setTotalOrders(orders.length);
//       })
//       .catch(err => {
//         console.error('Failed to fetch shop orders:', err);
//         setTotalOrders(0);
//       });
//   }
// }, [role, shopId]);


//   const [deliveryOrders, setDeliveryOrders] = useState(0);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser && storedUser.shopId) {
//       setShopId(storedUser.shopId);
//     }
//   }, []);

//   useEffect(() => {
//     if (!shopId) return;

//     const fetchDeliveryOrders = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`);
//         const deliveries = response.data.deliveries || [];
//         setDeliveryOrders(deliveries.length); // ✅ Set total count
//       } catch (error) {
//         console.error('Failed to fetch delivery orders:', error);
//         setDeliveryOrders(0);
//       }
//     };

//     fetchDeliveryOrders();
//   }, [shopId]);
  

//   const [availableTables, setAvailableTables] = useState(0);
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setRole(storedUser.role);
//       if (storedUser.shopId) {
//         setShopId(storedUser.shopId);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchTables = async () => {
//       try {
//         let response;
//         let tables = [];

//         if (role === 'admin') {
//           // Admin: fetch all tables
//           response = await axios.get(`http://localhost:8082/table-login/all`);
//           tables = response.data || [];
//         } else if (shopId) {
//           // Employee: fetch tables by shop
//           response = await axios.get(`http://localhost:8082/table-login/shop/${shopId}`);
//           tables = response.data.tables || [];
//         }

//         if (Array.isArray(tables)) {
//           const available = tables.filter(
//             table => table.status?.toLowerCase() === 'available'
//           ).length;
//           setAvailableTables(available);
//         } else {
//           setAvailableTables(0);
//         }

//       } catch (error) {
//         console.error('❌ Error fetching tables:', error);
//         setAvailableTables(0);
//       }
//     };

//     fetchTables();
//   }, [shopId, role]);
  

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setRole(storedUser.role);
//       if (storedUser.shopId) {
//         setShopId(storedUser.shopId);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchDeliveryOrders = async () => {
//       try {
//         let response;

//         if (role === 'admin') {
//           // Admin gets all delivery orders
//           response = await axios.get(`http://localhost:8082/delivery/all`);
//           const deliveries = response.data.deliveries || response.data || [];
//           setDeliveryOrders(deliveries.length);
//         } else if (shopId) {
//           // Employee gets delivery orders by shop
//           response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`);
//           const deliveries = response.data.deliveries || [];
//           setDeliveryOrders(deliveries.length);
//         } else {
//           console.warn('No shopId and not an admin');
//           setDeliveryOrders(0);
//         }
//       } catch (error) {
//         console.error('❌ Failed to fetch delivery orders:', error);
//         setDeliveryOrders(0);
//       }
//     };

//     fetchDeliveryOrders();
//   }, [role, shopId]);

  

//   const [popularItems, setPopularItems] = useState([]);
//   const prevOrderIds = useRef(new Set());

// useEffect(() => {
//   const fetchPopularItems = async () => {
//     try {
//       const today = new Date().toISOString().split("T")[0];

//       const [dineRes, deliveryRes] = await Promise.all([
//         axios.get(`http://localhost:8082/orders/get`),       // All dine-in
//         axios.get(`http://localhost:8082/delivery/all`)   // All delivery
//       ]);

//       const dineOrders = dineRes.data || [];

//       // If deliveryRes.data is an array
//       const deliveryOrders = Array.isArray(deliveryRes.data)
//         ? deliveryRes.data
//         : (deliveryRes.data.deliveries || []); // fallback in case it's an object

//       const itemCount = {};

//       // Dine-in orders
//       dineOrders.forEach(order => {
//         const dateOnly = (order.orderDate || "").split("T")[0];
//         if (dateOnly !== today) return;

//         const names = order.orderedProductNames || [];
//         const quantities = order.quantity || [];

//         names.forEach((name, i) => {
//           const qty = quantities[i] || 1;
//           itemCount[name] = (itemCount[name] || 0) + qty;
//         });
//       });

//       // Delivery orders
//       deliveryOrders.forEach(delivery => {
//         const dateOnly = (delivery.orderDate || "").split("T")[0];
//         if (dateOnly !== today) return;

//         const products = delivery.orderedProducts || [];

//         products.forEach(product => {
//           const name = product.productName;
//           const qty = product.quantity || 1;
//           itemCount[name] = (itemCount[name] || 0) + qty;
//         });
//       });

//       const sortedItems = Object.entries(itemCount)
//         .map(([name, orders]) => ({ name, orders }))
//         .sort((a, b) => b.orders - a.orders)
//         .slice(0, 5);

//       setPopularItems(sortedItems);
//     } catch (err) {
//       console.error("❌ Failed to fetch and process popular items:", err);
//     }
//   };

//   fetchPopularItems();
// }, []);


// const [monthlySales, setMonthlySales] = useState({
//   today: 0,
//   total: 0,
//   compare: 0,
//   peakDay: '',
//   lowDay: '',
//   months: [], // [{name: 'Jan', sales: 0}, ...]
// });

// useEffect(() => {
//   const fetchMonthlySales = async () => {
//     try {
//       // Admin: fetch all orders from all shops
//       const [dineRes, deliveryRes] = await Promise.all([
//         axios.get(`http://localhost:8082/orders/get`),         // All dine-in
//         axios.get(`http://localhost:8082/delivery/all`)     // All delivery
//       ]);

//       const dineOrders = dineRes.data || [];

//       // If deliveryRes.data is an array
//       const deliveryOrders = Array.isArray(deliveryRes.data)
//         ? deliveryRes.data
//         : (deliveryRes.data.deliveries || []);

//       // Merge and normalize all orders
//       const allOrders = [
//         ...dineOrders.map(o => ({
//           date: o.orderDate,
//           totalAmount: parseFloat(o.total) || 0,
//         })),
//         ...deliveryOrders.map(d => ({
//           date: d.orderDate,
//           totalAmount: parseFloat(d.totalAmount) || 0,
//         }))
//       ];

//       const now = new Date();
//       const currentYear = now.getFullYear();
//       const currentMonth = now.getMonth() + 1;
//       const todayDate = now.toISOString().split('T')[0];

//       const getPreviousMonth = (month, offset) => {
//         let m = month - offset;
//         return m <= 0 ? 12 + m : m;
//       };

//       const monthsToShow = [
//         getPreviousMonth(currentMonth, 2),
//         getPreviousMonth(currentMonth, 1),
//         currentMonth
//       ];

//       // Monthly sales
//       const salesByMonth = {};
//       allOrders.forEach(order => {
//         if (!order.date) return;
//         const [year, month] = order.date.split('-').map(Number);
//         if (year === currentYear && monthsToShow.includes(month)) {
//           salesByMonth[month] = (salesByMonth[month] || 0) + order.totalAmount;
//         }
//       });

//       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const monthsArray = monthsToShow.map(m => ({
//         name: monthNames[m - 1],
//         sales: salesByMonth[m] || 0,
//       }));

//       // Daily sales for current month
//       const salesByDay = {};
//       allOrders.forEach(order => {
//         if (!order.date) return;
//         const [year, month, day] = order.date.split('-').map(Number);
//         if (year === currentYear && month === currentMonth) {
//           salesByDay[day] = (salesByDay[day] || 0) + order.totalAmount;
//         }
//       });

//       const days = Object.keys(salesByDay);
//       let peakDay = '';
//       let lowDay = '';
//       let peakSales = -Infinity;
//       let lowSales = Infinity;

//       days.forEach(day => {
//         const val = salesByDay[day];
//         if (val > peakSales) {
//           peakSales = val;
//           peakDay = day;
//         }
//         if (val < lowSales) {
//           lowSales = val;
//           lowDay = day;
//         }
//       });

//       const totalSalesThisMonth = Object.values(salesByDay).reduce((sum, val) => sum + val, 0);

//       const todaySalesAmount = allOrders
//         .filter(order => order.date === todayDate)
//         .reduce((sum, order) => sum + order.totalAmount, 0);

//       const lastMonth = getPreviousMonth(currentMonth, 1);
//       const lastMonthSales = salesByMonth[lastMonth] || 0;
//       const comparePercent = lastMonthSales === 0
//         ? 100
//         : (((totalSalesThisMonth - lastMonthSales) / lastMonthSales) * 100).toFixed(2);

//       setMonthlySales({
//         today: todaySalesAmount,
//         total: totalSalesThisMonth,
//         compare: comparePercent,
//         peakDay: peakDay ? `${peakDay}/${currentMonth}` : 'N/A',
//         lowDay: lowDay ? `${lowDay}/${currentMonth}` : 'N/A',
//         months: monthsArray,
//       });
//     } catch (error) {
//       console.error("❌ Error fetching monthly sales:", error);
//     }
//   };

//   fetchMonthlySales();
// }, []);


  

  
//   return (
//     <div className="space-y-6 animate-fadeIn">
//       <nav className="text-black py-6 px-6 flex items-center justify-end">
//         <div className="relative">
//           <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
//         </div>
//       </nav>

//       <div className="space-y animate-fadeIn">
//         <h2 className="text-4xl font-bold text-center mb-9 text-gray-800">📊 Aashboard Overview</h2>

//         <div className="grid grid-cols-3 gap-4">
//           <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold"> Orders</h3>
//             <p className="text-4xl font-bold text-blue-600">{totalOrders}</p>
//           </div>
//           <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold">Delivery Orders</h3>
//             <p className="text-4xl font-bold text-green-600">{deliveryOrders}</p>
//           </div>
//           <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold">Available Tables</h3>
//             <p className="text-4xl font-bold text-red-600">{availableTables}</p>
//           </div>
//         </div>

//          <div className="grid grid-cols-2 gap-6 mt-6 items-stretch h-full">
//           <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
//             <h3 className="text-lg font-semibold">Popular Menu Items</h3>
//             <ul className="space-y-2">
//               {popularItems.map((item, idx) => (
//                 <li key={idx} className="flex justify-between items-center">
//                   <span>{item.name}</span>
//                   <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm">🔥 {item.orders} orders</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
//   {/* <h3 className="text-lg font-semibold">Today's Sales</h3>
//   <p className="text-4xl font-bold text-green-600">${monthlySales.today || '0.00'}</p>

//   <h3 className="text-lg font-semibold mt-6">Monthly Sales Overview</h3> */}
//   <div className="flex items-center justify-between space-x-8">
//   <div>
//     <h3 className="text-lg font-semibold">Today's Sales</h3>
//     <p className="text-4xl font-bold text-green-600">{monthlySales.today || '0'} Ks</p>
//   </div>

//   <div>
//     <h3 className="text-lg font-semibold">Monthly Sales Overview</h3>
//     <p className="text-4xl font-bold text-blue-600">{monthlySales.total} Ks</p>
//   </div>
// </div>
//   <div className="space-y-2">
//     {/* <p className="text-4xl font-bold text-blue-600">${monthlySales.total}</p> */}
//     <p className="text-sm text-gray-600">
//       Compared to last month: <span className="text-green-600">+{monthlySales.compare}%</span>
//     </p>
//     <p className="text-xs text-gray-500">Peak Sales Day: {monthlySales.peakDay}</p>
//     <p className="text-xs text-gray-500">Lowest Sales Day: {monthlySales.lowDay}</p>
//   </div>
//   <ul className="space-y-2">
//     {monthlySales.months.map((month, idx) => (
//       <li key={idx} className="flex justify-between items-center">
//         <span>{month.name}</span>
//         <span className="text-blue-600 font-bold">{month.sales} Ks</span>
//       </li>
//     ))}
//   </ul>
// </div>



//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOverview;


import React, { useEffect, useState, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Overview.css';

const AdminOverview = () => {
  const [shops, setShops] = useState([]);
const [selectedShopId, setSelectedShopId] = useState('all');
  const [totalOrders, setTotalOrders] = useState(0);
  const [shopId, setShopId] = useState(null);
  const [role, setRole] = useState(null);
  const [deliveryOrders, setDeliveryOrders] = useState(0);
  const [availableTables, setAvailableTables] = useState(0);
  const [popularItems, setPopularItems] = useState([]);
  const [monthlySales, setMonthlySales] = useState({
    today: 0,
    total: 0,
    compare: 0,
    peakDay: '',
    lowDay: '',
    months: [],
  });

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser?.role === 'admin') {
    axios.get('http://localhost:8082/shop/get')
      .then(res => {
        setShops(res.data || []);
      })
      .catch(err => {
        console.error('Failed to fetch shops:', err);
        toast.error("Failed to load shop list");
      });
  }
}, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setRole(storedUser.role);
      if (storedUser.shopId) {
        setShopId(storedUser.shopId);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (!role) return;

  //   const fetchOrders = async () => {
  //     try {
  //       const url = role === 'admin'
  //         ? 'http://localhost:8082/orders/get'
  //         : `http://localhost:8082/orders/getByShopId/${shopId}`;
  //       const res = await axios.get(url);
  //       const orders = res.data || [];
  //       setTotalOrders(orders.length);
  //     } catch (err) {
  //       console.error('Failed to fetch orders:', err);
  //       setTotalOrders(0);
  //     }
  //   };

  //   fetchOrders();
  // }, [role, shopId]);
  useEffect(() => {
  if (role === 'admin') {
    if (selectedShopId === 'all') {
      axios.get('http://localhost:8082/orders/get')
        .then(res => setTotalOrders(res.data.length))
        .catch(err => {
          console.error('Failed to fetch all orders:', err);
          setTotalOrders(0);
        });
    } else {
      axios.get(`http://localhost:8082/orders/getByShopId/${selectedShopId}`)
        .then(res => setTotalOrders(res.data.length))
        .catch(err => {
          console.error('Failed to fetch shop orders:', err);
          setTotalOrders(0);
        });
    }
  } else if (shopId) {
    axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`)
      .then(res => setTotalOrders(res.data.length))
      .catch(err => {
        console.error('Failed to fetch employee orders:', err);
        setTotalOrders(0);
      });
  }
}, [role, selectedShopId, shopId]);


  // useEffect(() => {
  //   if (!role) return;

  //   const fetchDeliveryOrders = async () => {
  //     try {
  //       const url = role === 'admin'
  //         ? 'http://localhost:8082/delivery/all'
  //         : `http://localhost:8082/delivery/getOrderByShop/${shopId}`;
  //       const response = await axios.get(url);
  //       const deliveries = Array.isArray(response.data)
  //         ? response.data
  //         : (response.data.deliveries || []);
  //       setDeliveryOrders(deliveries.length);
  //     } catch (error) {
  //       console.error('❌ Failed to fetch delivery orders:', error);
  //       setDeliveryOrders(0);
  //     }
  //   };

  //   fetchDeliveryOrders();
  // }, [role, shopId]);

  useEffect(() => {
  if (!role) return;

  const fetchDeliveryOrders = async () => {
    try {
      let url;

      if (role === 'admin') {
        url = selectedShopId === 'all'
          ? 'http://localhost:8082/delivery/all'
          : `http://localhost:8082/delivery/getOrderByShop/${selectedShopId}`;
      } else {
        url = `http://localhost:8082/delivery/getOrderByShop/${shopId}`;
      }

      const response = await axios.get(url);
      const deliveries = Array.isArray(response.data)
        ? response.data
        : (response.data.deliveries || []);

      setDeliveryOrders(deliveries.length);
    } catch (error) {
      console.error('❌ Failed to fetch delivery orders:', error);
      setDeliveryOrders(0);
    }
  };

  fetchDeliveryOrders();
}, [role, shopId, selectedShopId]);


  // useEffect(() => {
  //   if (!role) return;

  //   const fetchTables = async () => {
  //     try {
  //       let url = role === 'admin'
  //         ? 'http://localhost:8082/table-login/all'
  //         : `http://localhost:8082/table-login/shop/${shopId}`;
  //       const response = await axios.get(url);
  //       const tables = role === 'admin' ? response.data : response.data.tables || [];

  //       if (Array.isArray(tables)) {
  //         const available = tables.filter(
  //           table => table.status?.toLowerCase() === 'available'
  //         ).length;
  //         setAvailableTables(available);
  //       } else {
  //         setAvailableTables(0);
  //       }
  //     } catch (error) {
  //       console.error('❌ Error fetching tables:', error);
  //       setAvailableTables(0);
  //     }
  //   };

  //   fetchTables();
  // }, [role, shopId]);
  useEffect(() => {
  if (!role) return;

  const fetchTables = async () => {
    try {
      let url;

      if (role === 'admin') {
        url = selectedShopId === 'all'
          ? 'http://localhost:8082/table-login/all'
          : `http://localhost:8082/table-login/shop/${selectedShopId}`;
      } else {
        url = `http://localhost:8082/table-login/shop/${shopId}`;
      }

      const response = await axios.get(url);
      const tables = Array.isArray(response.data)
        ? response.data
        : response.data.tables || [];

      const available = tables.filter(
        table => table.status?.toLowerCase() === 'available'
      ).length;

      setAvailableTables(available);
    } catch (error) {
      console.error('❌ Error fetching tables:', error);
      setAvailableTables(0);
    }
  };

  fetchTables();
}, [role, shopId, selectedShopId]);


  // useEffect(() => {
  //   const fetchPopularItems = async () => {
  //     try {
  //       const today = new Date().toISOString().split("T")[0];

  //       const [dineRes, deliveryRes] = await Promise.all([
  //         axios.get(`http://localhost:8082/orders/get`),
  //         axios.get(`http://localhost:8082/delivery/all`)
  //       ]);

  //       const dineOrders = dineRes.data || [];
  //       const deliveryOrders = Array.isArray(deliveryRes.data)
  //         ? deliveryRes.data
  //         : (deliveryRes.data.deliveries || []);

  //       const itemCount = {};

  //       dineOrders.forEach(order => {
  //         const dateOnly = (order.orderDate || "").split("T")[0];
  //         if (dateOnly !== today) return;

  //         const names = order.orderedProductNames || [];
  //         const quantities = order.quantity || [];

  //         names.forEach((name, i) => {
  //           const qty = quantities[i] || 1;
  //           itemCount[name] = (itemCount[name] || 0) + qty;
  //         });
  //       });

  //       deliveryOrders.forEach(delivery => {
  //         const dateOnly = (delivery.orderDate || "").split("T")[0];
  //         if (dateOnly !== today) return;

  //         const products = delivery.orderedProducts || [];

  //         products.forEach(product => {
  //           const name = product.productName;
  //           const qty = product.quantity || 1;
  //           itemCount[name] = (itemCount[name] || 0) + qty;
  //         });
  //       });

  //       const sortedItems = Object.entries(itemCount)
  //         .map(([name, orders]) => ({ name, orders }))
  //         .sort((a, b) => b.orders - a.orders)
  //         .slice(0, 5);

  //       setPopularItems(sortedItems);
  //     } catch (err) {
  //       console.error("❌ Failed to fetch and process popular items:", err);
  //     }
  //   };

  //   fetchPopularItems();
  // }, []);

  useEffect(() => {
  if (!role) return;

  const fetchPopularItems = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Ensure shop IDs are valid strings
      const safeSelectedShopId = selectedShopId || 'all';
      const safeShopId = shopId || '';

      // Compose dine orders URL
      let dineUrl;
      if (role === 'admin') {
        dineUrl = safeSelectedShopId === 'all'
          ? 'http://localhost:8082/orders/get'
          : `http://localhost:8082/orders/getByShopId/${safeSelectedShopId}`;
      } else {
        if (!safeShopId) {
          console.error('❌ shopId is not set for employee role');
          return setPopularItems([]);
        }
        dineUrl = `http://localhost:8082/orders/getByShopId/${safeShopId}`;
      }

      // Compose delivery orders URL
      let deliveryUrl;
      if (role === 'admin') {
        deliveryUrl = safeSelectedShopId === 'all'
          ? 'http://localhost:8082/delivery/all'
          : `http://localhost:8082/delivery/getOrderByShop/${safeSelectedShopId}`;
      } else {
        if (!safeShopId) {
          console.error('❌ shopId is not set for employee role');
          return setPopularItems([]);
        }
        deliveryUrl = `http://localhost:8082/delivery/getOrderByShop/${safeShopId}`;
      }

      console.log('Fetching dine orders from:', dineUrl);
      console.log('Fetching delivery orders from:', deliveryUrl);

      const [dineRes, deliveryRes] = await Promise.all([
        axios.get(dineUrl),
        axios.get(deliveryUrl)
      ]);

      // Rest of your processing remains unchanged
      const dineOrders = Array.isArray(dineRes.data)
        ? dineRes.data
        : (dineRes.data.orders || []);

      const deliveryOrders = Array.isArray(deliveryRes.data)
        ? deliveryRes.data
        : (deliveryRes.data.deliveries || []);

      const itemCount = {};

      dineOrders.forEach(order => {
        const dateOnly = (order.orderDate || "").split("T")[0];
        if (dateOnly !== today) return;

        const names = order.orderedProductNames || [];
        const quantities = order.quantity || [];

        names.forEach((name, i) => {
          const qty = quantities[i] || 1;
          itemCount[name] = (itemCount[name] || 0) + qty;
        });
      });

      deliveryOrders.forEach(delivery => {
        const dateOnly = (delivery.orderDate || "").split("T")[0];
        if (dateOnly !== today) return;

        const products = delivery.orderedProducts || [];

        products.forEach(product => {
          const name = product.productName;
          const qty = product.quantity || 1;
          itemCount[name] = (itemCount[name] || 0) + qty;
        });
      });

      const sortedItems = Object.entries(itemCount)
        .map(([name, orders]) => ({ name, orders }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      setPopularItems(sortedItems);
    } catch (err) {
      console.error("❌ Failed to fetch and process popular items:", err);
      setPopularItems([]);
    }
  };

  fetchPopularItems();
}, [role, shopId, selectedShopId]);



  // useEffect(() => {
  //   const fetchMonthlySales = async () => {
  //     try {
  //       const [dineRes, deliveryRes] = await Promise.all([
  //         axios.get(`http://localhost:8082/orders/get`),
  //         axios.get(`http://localhost:8082/delivery/all`)
  //       ]);

  //       const dineOrders = dineRes.data || [];
  //       const deliveryOrders = Array.isArray(deliveryRes.data)
  //         ? deliveryRes.data
  //         : (deliveryRes.data.deliveries || []);

  //       const allOrders = [
  //         ...dineOrders.map(o => ({ date: o.orderDate, totalAmount: parseFloat(o.total) || 0 })),
  //         ...deliveryOrders.map(d => ({ date: d.orderDate, totalAmount: parseFloat(d.totalAmount) || 0 }))
  //       ];

  //       const now = new Date();
  //       const currentYear = now.getFullYear();
  //       const currentMonth = now.getMonth() + 1;
  //       const todayDate = now.toISOString().split('T')[0];

  //       const getPreviousMonth = (month, offset) => {
  //         let m = month - offset;
  //         return m <= 0 ? 12 + m : m;
  //       };

  //       const monthsToShow = [
  //         getPreviousMonth(currentMonth, 2),
  //         getPreviousMonth(currentMonth, 1),
  //         currentMonth
  //       ];

  //       const salesByMonth = {};
  //       allOrders.forEach(order => {
  //         if (!order.date) return;
  //         const [year, month] = order.date.split('-').map(Number);
  //         if (year === currentYear && monthsToShow.includes(month)) {
  //           salesByMonth[month] = (salesByMonth[month] || 0) + order.totalAmount;
  //         }
  //       });

  //       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //       const monthsArray = monthsToShow.map(m => ({
  //         name: monthNames[m - 1],
  //         sales: salesByMonth[m] || 0,
  //       }));

  //       const salesByDay = {};
  //       allOrders.forEach(order => {
  //         if (!order.date) return;
  //         const [year, month, day] = order.date.split('-').map(Number);
  //         if (year === currentYear && month === currentMonth) {
  //           salesByDay[day] = (salesByDay[day] || 0) + order.totalAmount;
  //         }
  //       });

  //       let peakDay = '', lowDay = '', peakSales = -Infinity, lowSales = Infinity;
  //       for (const [day, val] of Object.entries(salesByDay)) {
  //         if (val > peakSales) {
  //           peakSales = val;
  //           peakDay = day;
  //         }
  //         if (val < lowSales) {
  //           lowSales = val;
  //           lowDay = day;
  //         }
  //       }

  //       const totalSalesThisMonth = Object.values(salesByDay).reduce((sum, val) => sum + val, 0);
  //       const todaySalesAmount = allOrders
  //         .filter(order => order.date === todayDate)
  //         .reduce((sum, order) => sum + order.totalAmount, 0);

  //       const lastMonth = getPreviousMonth(currentMonth, 1);
  //       const lastMonthSales = salesByMonth[lastMonth] || 0;
  //       const comparePercent = lastMonthSales === 0
  //         ? 100
  //         : (((totalSalesThisMonth - lastMonthSales) / lastMonthSales) * 100).toFixed(2);

  //       setMonthlySales({
  //         today: todaySalesAmount,
  //         total: totalSalesThisMonth,
  //         compare: comparePercent,
  //         peakDay: peakDay ? `${peakDay}/${currentMonth}` : 'N/A',
  //         lowDay: lowDay ? `${lowDay}/${currentMonth}` : 'N/A',
  //         months: monthsArray,
  //       });
  //     } catch (error) {
  //       console.error("❌ Error fetching monthly sales:", error);
  //     }
  //   };

  //   fetchMonthlySales();
  // }, []);

  useEffect(() => {
  if (!role) return;

  const fetchMonthlySales = async () => {
    try {
      let dineUrl = '';
      let deliveryUrl = '';

      if (role === 'admin') {
        if (selectedShopId === 'all') {
          dineUrl = 'http://localhost:8082/orders/get';
          deliveryUrl = 'http://localhost:8082/delivery/all';
        } else {
          dineUrl = `http://localhost:8082/orders/getByShopId/${selectedShopId}`;
          deliveryUrl = `http://localhost:8082/delivery/getOrderByShop/${selectedShopId}`;
        }
      } else {
        if (!shopId) {
          console.error('❌ Missing shopId for employee');
          setMonthlySales({});
          return;
        }
        dineUrl = `http://localhost:8082/orders/getByShopId/${shopId}`;
        deliveryUrl = `http://localhost:8082/delivery/getOrderByShop/${shopId}`;
      }

      const [dineRes, deliveryRes] = await Promise.all([
        axios.get(dineUrl),
        axios.get(deliveryUrl),
      ]);

      const dineOrders = Array.isArray(dineRes.data)
        ? dineRes.data
        : dineRes.data.orders || [];

      const deliveryOrders = Array.isArray(deliveryRes.data)
        ? deliveryRes.data
        : deliveryRes.data.deliveries || [];

      const allOrders = [
        ...dineOrders.map(o => ({
          date: o.orderDate,
          totalAmount: parseFloat(o.total) || 0
        })),
        ...deliveryOrders.map(d => ({
          date: d.orderDate,
          totalAmount: parseFloat(d.totalAmount) || 0
        })),
      ];

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const todayDate = now.toISOString().split('T')[0];

      const getPreviousMonth = (month, offset) => {
        let m = month - offset;
        return m <= 0 ? 12 + m : m;
      };

      const monthsToShow = [
        getPreviousMonth(currentMonth, 2),
        getPreviousMonth(currentMonth, 1),
        currentMonth
      ];

      const salesByMonth = {};
      allOrders.forEach(order => {
        if (!order.date) return;
        const [year, month] = order.date.split('-').map(Number);
        if (year === currentYear && monthsToShow.includes(month)) {
          salesByMonth[month] = (salesByMonth[month] || 0) + order.totalAmount;
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthsArray = monthsToShow.map(m => ({
        name: monthNames[m - 1],
        sales: salesByMonth[m] || 0,
      }));

      const salesByDay = {};
      allOrders.forEach(order => {
        if (!order.date) return;
        const [year, month, day] = order.date.split('-').map(Number);
        if (year === currentYear && month === currentMonth) {
          salesByDay[day] = (salesByDay[day] || 0) + order.totalAmount;
        }
      });

      let peakDay = '', lowDay = '', peakSales = -Infinity, lowSales = Infinity;
      for (const [day, val] of Object.entries(salesByDay)) {
        if (val > peakSales) {
          peakSales = val;
          peakDay = day;
        }
        if (val < lowSales) {
          lowSales = val;
          lowDay = day;
        }
      }

      const totalSalesThisMonth = Object.values(salesByDay).reduce((sum, val) => sum + val, 0);
      const todaySalesAmount = allOrders
        .filter(order => order.date === todayDate)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const lastMonth = getPreviousMonth(currentMonth, 1);
      const lastMonthSales = salesByMonth[lastMonth] || 0;
      const comparePercent = lastMonthSales === 0
        ? 100
        : (((totalSalesThisMonth - lastMonthSales) / lastMonthSales) * 100).toFixed(2);

      setMonthlySales({
        today: todaySalesAmount,
        total: totalSalesThisMonth,
        compare: comparePercent,
        peakDay: peakDay ? `${peakDay}/${currentMonth}` : 'N/A',
        lowDay: lowDay ? `${lowDay}/${currentMonth}` : 'N/A',
        months: monthsArray,
      });
    } catch (error) {
      console.error('❌ Error fetching monthly sales:', error);
      setMonthlySales({});
    }
  };

  fetchMonthlySales();
}, [role, shopId, selectedShopId]);


  return (
    <div className="space-y-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>

      <div className="space-y animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-9 text-gray-800">📊 Dashboard Overview</h2>
        {role === 'admin' && (
  <div className="px-6">
    <label className="block text-sm font-medium mb-1">Select Shop:</label>
    {/* <select
      value={selectedShopId}
      onChange={(e) => setSelectedShopId(e.target.value)}
      className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
    >
      <option value="all">All Shops</option>
      {shops.map(shop => (
        <option key={shop.id} value={shop.id}>
          {shop.name || `Shop ${shop.id}`}
        </option>
      ))}
    </select> */}
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
  </div>
)}

        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold"> Orders</h3>
            <p className="text-4xl font-bold text-blue-600">{totalOrders}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Delivery Orders</h3>
            <p className="text-4xl font-bold text-green-600">{deliveryOrders}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Available Tables</h3>
            <p className="text-4xl font-bold text-red-600">{availableTables}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6 items-stretch h-full">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
            <h3 className="text-lg font-semibold">Popular Menu Items</h3>
            <ul className="space-y-2">
              {popularItems.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm">🔥 {item.orders} orders</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
            <div className="flex items-center justify-between space-x-8">
              <div>
                <h3 className="text-lg font-semibold">Today's Sales</h3>
                <p className="text-4xl font-bold text-green-600">{monthlySales.today || '0'} Ks</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly Sales Overview</h3>
                <p className="text-4xl font-bold text-blue-600">{monthlySales.total} Ks</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Compared to last month: <span className="text-green-600">+{monthlySales.compare}%</span>
              </p>
              <p className="text-xs text-gray-500">Peak Sales Day: {monthlySales.peakDay}</p>
              <p className="text-xs text-gray-500">Lowest Sales Day: {monthlySales.lowDay}</p>
            </div>
            <ul className="space-y-2">
              {monthlySales.months.map((month, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{month.name}</span>
                  <span className="text-blue-600 font-bold">{month.sales} Ks</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;