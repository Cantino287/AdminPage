import 'react-toastify/dist/ReactToastify.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import { CgProfile } from 'react-icons/cg';
import {
  toast,
  ToastContainer,
} from 'react-toastify';

const EmpOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const prevOrderIds = useRef(new Set());
  const [shopId, setShopId] = useState(null);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  // page - switching ----------------------



  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;  // You can change this number
  const filteredOrders =
    filterStatus === "All"
      ? [...orders].reverse()
      : orders.filter((order) => order.status === filterStatus);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  ///------------------------------------------


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setShopId(storedUser.shopId);
    }
  }, []);

  useEffect(() => {
    const audio = new Audio('/notification.mp3');
    const shopId = localStorage.getItem("shopId"); // ✅ Get shopId from storage

    const fetchOrders = () => {
      if (!shopId) {
        console.error("shopId is missing in localStorage.");
        return;
      }

      axios.get(`http://localhost:8082/orders/getByShopId/${shopId}`) // ✅ Filtered by shop
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
              time: (() => {
                const [hour, minute] = order.orderTime.split(':').map(Number);
                const date = new Date();
                date.setHours(hour);
                date.setMinutes(minute);
                return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
              })(),
              orderDate: order.orderDate
                ? new Date(order.orderDate).toLocaleDateString("en-GB")
                : "Unknown Date",
              items,
              taxes: `${taxAmount}`,
              total: `${Math.round(total)}`
            };
          });

          const newOrders = transformedOrders.filter(
            order =>
              !prevOrderIds.current.has(order.id) &&
              order.status === "Confirming"
          );

          if (newOrders.length > 0) {
            newOrders.forEach(order => {
              toast.success(`🛎️ New Order at Table ${order.table_number}`);
            });
            audio.play();
          }

          setOrders(transformedOrders);
          prevOrderIds.current = new Set(transformedOrders.map(order => order.id));
        })
        .catch(error => {
          console.error("Failed to fetch orders:", error);
        });
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);
    return () => clearInterval(intervalId);
  }, []);


  const updateOrderStatus = (id, newStatus) => {
    axios.put(`http://localhost:8082/orders/status/${id}`, null, {
      params: { status: newStatus }
    })
      .then(() => {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status: newStatus } : order)
        );
      })
      .catch(err => {
        console.error("Failed to update order status", err);
      });
  };
  //new functions added area----

  const calculateTotal = (items, taxes) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // const subtotal = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price.replace('$', '')), 0);
    const total = subtotal + parseFloat(taxes.replace('$', ''));
    return `${Math.round(total)} Kyats`;
  };





  const showOrderDetails = (order) => {
    const updatedOrder = { ...order, total: calculateTotal(order.items, order.taxes) };
    console.log("Selected Order:", updatedOrder);  // 🔍 Check what's inside
    setSelectedOrder(updatedOrder);
  };



  const closePopup = () => {
    setSelectedOrder(null);
  };






  //area ended--------
  const totalOrders = orders.length;

  const confirmingOrders = orders.filter(
    (order) => order.status === "Confirming"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;
  const canceledOrders = orders.filter(
    (order) => order.status === "Canceled"
  ).length;







  return (
    <div className="space-y mb-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        {/* Profile logo in top-right corner */}
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>
      <h2 className="text-3xl mb-9 font-bold text-center text-gray-800">📦 Order Management</h2>
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
          <div className={`p-4 bg-yellow-100 rounded-lg shadow text-centercursor-pointer ${filterStatus === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-100"
            }`}
            onClick={() => setFilterStatus("Pending")}
          >
            <h4 className="text-lg font-semibold text-yellow-800">
              Pending Orders
            </h4>
            <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
          </div>
          <div className={`p-4 bg-green-100 rounded-lg shadow text-centercursor-pointer ${filterStatus === "Completed" ? "ring-2 ring-green-500" : "bg-green-100"
            }`}
            onClick={() => setFilterStatus("Completed")}
          >
            <h4 className="text-lg font-semibold text-green-800">
              Completed Orders
            </h4>
            <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
          </div>
          <div className={`p-4 bg-red-100 rounded-lg shadow text-centercursor-pointer ${filterStatus === "Canceled" ? "ring-2 ring-red-500" : "bg-red-100"
            }`}
            onClick={() => setFilterStatus("Canceled")}
          >
            <h4 className="text-lg font-semibold text-red-800">
              Canceled Orders
            </h4>
            <p className="text-2xl font-bold text-red-900">{canceledOrders}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Order List</h2>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-3 items-center p-4 border-b cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  if (!e.target.closest('button')) {
                    showOrderDetails(order);
                  }
                }}
              >
                <span className="w-full text-left">
                  Table Number: <span className="bg-blue-500 text-white px-4 py-1 rounded-lg">{order.table_number}</span> - {order.time}
                </span>

                <span
                  className={`px-0 py-1 rounded-full text-white w-24 text-center mx-auto my-auto ${order.status === "Confirming"
                    ? "bg-orange-500"
                    : order.status === "Completed"
                      ? "bg-green-500"
                      : order.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                >
                  {order.status}
                </span>

                <div className="w-full flex justify-end space-x-2">
                  {order.status === "Confirming" && (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      onClick={() => updateOrderStatus(order.id, "Pending")}
                    >
                      Pending
                    </button>
                  )}
                  {order.status === "Pending" && (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      onClick={() => updateOrderStatus(order.id, "Completed")}
                    >
                      Complete
                    </button>
                  )}
                  {(order.status === "Pending" || order.status === "Confirming") && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      onClick={() => updateOrderStatus(order.id, "Canceled")}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8 text-lg">No New Orders.</div>
          )}

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



        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div
              className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] text-center overflow-y-auto scrollbar-hide"
            >
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-6">Order Details</h3>
                <div className="text-lg font-medium mb-4">
                  Table Number: <span className="bg-blue-500 text-white px-4 py-1 rounded-lg">{selectedOrder.table_number}</span>
                </div>
                <div className="grid grid-cols-1 text-sm font-semibold text-left mb-4">
                  <span>Date: {selectedOrder.orderDate}</span>
                  <span>Time: {selectedOrder.time}</span>
                </div>

                <div className="border-t border-gray-300 my-4"></div>
                <div className="grid grid-cols-3 text-lg font-semibold">
                  <span className="text-left">Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>

                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 text-lg py-2">
                    <span className="text-left">{item.name}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-right">{Math.round(item.price)}</span>
                  </div>
                ))}

                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between text-lg font-medium">
                  <span>Taxes:</span>
                  <span>{selectedOrder.taxes}</span>
                </div>

                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{selectedOrder.total}</span>
                </div>

                <button
                  className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 text-lg font-semibold"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmpOrder;
