// // Overview.jsx

// import React from 'react';
// import { CgProfile } from 'react-icons/cg';
// import './Overview.css';

// const Overview = () => (
//   <div className="space-y-6 animate-fadeIn">
//   <nav className="text-black py-6 px-6 flex items-center justify-end">
//     {/* Profile logo in top-right corner */}
//     <div className="relative">
//       <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
//     </div>
//   </nav>
//   <div className="space-y animate-fadeIn">
//     <h2 className="text-4xl font-bold text-center mb-9 text-gray-800">📊 Dashboard Overview</h2>
//     <div className="grid grid-cols-3 gap-4">
//       <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
//         <h3 className="text-lg font-semibold">Total Orders</h3>
//         <p className="text-4xl font-bold text-blue-600 ">150</p>
//       </div>
//       <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg">
//         <h3 className="text-lg font-semibold">Delivery Orders</h3>
//         <p className="text-4xl font-bold text-green-600">30</p>
//       </div>
//       <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg">
//         <h3 className="text-lg font-semibold">Available Tables</h3>
//         <p className="text-4xl font-bold text-red-600">15</p>
//       </div>
//     </div>
//     <div className="grid grid-cols-2 gap-6 mt-6 items-stretch h-full">
//       <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
//         <h3 className="text-lg font-semibold">Popular Menu Items</h3>
//         <ul className="space-y-2">
//           <li className="flex justify-between items-center">
//             <span>Pizza</span>
//             <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm">🔥 50 orders</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>Burger</span>
//             <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm">⭐ 40 orders</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>Pasta</span>
//             <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">👍 30 orders</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>Salad</span>
//             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">🥗 25 orders</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>Sushi</span>
//             <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">🍣 20 orders</span>
//           </li>
//         </ul>
//       </div>

//       <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
//         <h3 className="text-lg font-semibold">Monthly Sales Overview</h3>
//         <div className="space-y-2">
//           <p className="text-4xl font-bold text-blue-600 ">$25,000</p>
//           <p className="text-sm text-gray-600">Compared to last month: <span className="text-green-600">+15%</span></p>
//           <p className="text-xs text-gray-500">Peak Sales Day: Saturday</p>
//           <p className="text-xs text-gray-500">Lowest Sales Day: Monday</p>
//         </div>
//         <ul className="space-y-2">
//           <li className="flex justify-between items-center">
//             <span>January</span>
//             <span className="text-blue-600 font-bold">$20,000</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>February</span>
//             <span className="text-blue-600 font-bold">$25,000</span>
//           </li>
//           <li className="flex justify-between items-center">
//             <span>March</span>
//             <span className="text-blue-600 font-bold">$30,000</span>
//           </li>
//         </ul>
//       </div>
//     </div>



//   </div>
// </div>
// );

// export default Overview;




import React, { useEffect, useState, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Overview.css';

const Overview = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.shopId) {
      setShopId(storedUser.shopId);
    }
  }, []);

  useEffect(() => {
    if (!shopId) return;

    axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`)
      .then(res => {
        const orders = res.data || [];
        setTotalOrders(orders.length); // ✅ Count total orders
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setTotalOrders(0);
      });
  }, [shopId]);

  const [deliveryOrders, setDeliveryOrders] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.shopId) {
      setShopId(storedUser.shopId);
    }
  }, []);

  useEffect(() => {
    if (!shopId) return;

    const fetchDeliveryOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`);
        const deliveries = response.data.deliveries || [];
        setDeliveryOrders(deliveries.length); // ✅ Set total count
      } catch (error) {
        console.error('Failed to fetch delivery orders:', error);
        setDeliveryOrders(0);
      }
    };

    fetchDeliveryOrders();
  }, [shopId]);


  const [availableTables, setAvailableTables] = useState(0);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.shopId) {
      setShopId(storedUser.shopId);
    }
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        if (shopId) {
          const response = await axios.get(`http://localhost:8082/table-login/shop/${shopId}`);
          const { tables } = response.data;

          if (Array.isArray(tables)) {
            const available = tables.filter(table => table.status?.toLowerCase() === 'available').length;
            setAvailableTables(available);
          } else {
            setAvailableTables(0);
          }
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        setAvailableTables(0);
      }
    };

    fetchTables();
  }, [shopId]);

  const [popularItems, setPopularItems] = useState([]);
  const prevOrderIds = useRef(new Set());
  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const shopId = localStorage.getItem('shopId');
        if (!shopId) return;
  
        const today = new Date().toISOString().split("T")[0];
  
        const [dineRes, deliveryRes] = await Promise.all([
          axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`),
          axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`)
        ]);
  
        const dineOrders = dineRes.data || [];
        const deliveryOrders = deliveryRes.data.deliveries || [];
  
        const itemCount = {};
  
        // Process dine-in orders
        dineOrders.forEach(order => {
          if (order.orderDate !== today) return;
  
          const names = order.orderedProductNames || [];
          const quantities = order.quantity || [];
  
          names.forEach((name, i) => {
            const qty = quantities[i] || 1;
            itemCount[name] = (itemCount[name] || 0) + qty;
          });
        });
  
        // Process delivery orders
        deliveryOrders.forEach(delivery => {
          if (delivery.orderDate !== today) return;
  
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
      }
    };
  
    fetchPopularItems();
  }, []);


  const [monthlySales, setMonthlySales] = useState({
    total: 0,
    compare: 0,
    peakDay: '',
    lowDay: '',
    months: [], // [{name: 'Jan', sales: 0}, ...]
  });

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const shopId = localStorage.getItem('shopId');
        if (!shopId) return;
  
        const [dineRes, deliveryRes] = await Promise.all([
          axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`),
          axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`)
        ]);
  
        const dineOrders = dineRes.data || [];
        const deliveryOrders = deliveryRes.data.deliveries || [];
  
        const allOrders = [
          ...dineOrders.map(o => ({
            date: o.orderDate,
            totalAmount: parseFloat(o.total) || 0,
          })),
          ...deliveryOrders.map(d => ({
            date: d.orderDate,
            totalAmount: parseFloat(d.totalAmount) || 0,
          }))
        ];
  
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
        const getPreviousMonth = (month, offset) => {
          let m = month - offset;
          if (m <= 0) return 12 + m;
          return m;
        };
  
        const monthsToShow = [
          getPreviousMonth(currentMonth, 2),
          getPreviousMonth(currentMonth, 1),
          currentMonth
        ];
  
        // Monthly sales for previous 2 + current month
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
          sales: salesByMonth[m] ? salesByMonth[m] : '0',
        }));
  
        // Daily sales current month
        const salesByDay = {};
        allOrders.forEach(order => {
          if (!order.date) return;
          const [year, month, day] = order.date.split('-').map(Number);
          if (year === currentYear && month === currentMonth) {
            salesByDay[day] = (salesByDay[day] || 0) + order.totalAmount;
          }
        });
  
        const days = Object.keys(salesByDay);
        let peakDay = '';
        let lowDay = '';
        let peakSales = -Infinity;
        let lowSales = Infinity;
  
        days.forEach(day => {
          const val = salesByDay[day];
          if (val > peakSales) {
            peakSales = val;
            peakDay = day;
          }
          if (val < lowSales) {
            lowSales = val;
            lowDay = day;
          }
        });
  
        const totalSalesThisMonth = Object.values(salesByDay).reduce((sum, val) => sum + val, 0);
  
        // Calculate today sales
        const todaySalesAmount = allOrders
          .filter(order => order.date === todayDate)
          .reduce((sum, order) => sum + order.totalAmount, 0);
  
        const lastMonth = getPreviousMonth(currentMonth, 1);
        const lastMonthSales = salesByMonth[lastMonth] || 0;
        const comparePercent = lastMonthSales === 0 ? 100 : (((totalSalesThisMonth - lastMonthSales) / lastMonthSales) * 100).toFixed(2);
  
        setMonthlySales({
          today: todaySalesAmount,
          total: totalSalesThisMonth,
          compare: comparePercent,
          peakDay: peakDay ? `${peakDay}/${currentMonth}` : 'N/A',
          lowDay: lowDay ? `${lowDay}/${currentMonth}` : 'N/A',
          months: monthsArray,
        });
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
      }
    };
  
    fetchMonthlySales();
  }, []);
  

  
  return (
    <div className="space-y-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>

      <div className="space-y animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-9 text-gray-800">📊 Dashboard Overview</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Total Orders</h3>
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

          {/* <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
            <h3 className="text-lg font-semibold">Monthly Sales Overview</h3>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-600">${monthlySales.total}</p>
              <p className="text-sm text-gray-600">Compared to last month: <span className="text-green-600">+{monthlySales.compare}%</span></p>
              <p className="text-xs text-gray-500">Peak Sales Day: {monthlySales.peakDay}</p>
              <p className="text-xs text-gray-500">Lowest Sales Day: {monthlySales.lowDay}</p>
            </div>
            <ul className="space-y-2">
              {monthlySales.months.map((month, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{month.name}</span>
                  <span className="text-blue-600 font-bold">${month.sales}</span>
                </li>
              ))}
            </ul>
          </div> */}

<div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col justify-between">
  {/* <h3 className="text-lg font-semibold">Today's Sales</h3>
  <p className="text-4xl font-bold text-green-600">${monthlySales.today || '0.00'}</p>

  <h3 className="text-lg font-semibold mt-6">Monthly Sales Overview</h3> */}
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
    {/* <p className="text-4xl font-bold text-blue-600">${monthlySales.total}</p> */}
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

export default Overview;
