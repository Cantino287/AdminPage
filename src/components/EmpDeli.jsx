
import 'react-toastify/dist/ReactToastify.css';

import React, {
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

const EmpDeli = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const previousIds = useRef(new Set());
  const prevOrderIds = useRef(new Set());
  const audioRef = useRef(new Audio('/notification.mp3')); // Place sound file in public folder
  const [filterStatus, setFilterStatus] = useState("All");


  const totalDeli = deliveries.length;
  const confirmingDeli = deliveries.filter(
    (delivery) => delivery.status === "Confirming"
  ).length;

  const pendingDeli = deliveries.filter(
    (delivery) => delivery.status === "Pending"
  ).length;
  // const availableTables = totalTables - occupiedTables;
  const onWayDeli = deliveries.filter(
    (delivery) => delivery.status === "On Way"
  ).length;

  const finishDeli = deliveries.filter(
    (delivery) => delivery.status === "Delivered"
  ).length;

  const filteredOrders = (filterStatus === "All"
    ? deliveries
    : deliveries.filter((delivery) => delivery.status === filterStatus)
  ).filter((delivery) => {
    const term = searchTerm.toLowerCase();

    // If the search term is numeric, do an exact ID match
    if (!isNaN(term) && term.trim() !== "") {
      return delivery.id.toString() === term;
    }

    // Otherwise, match by name or email
    return (
      delivery.name.toLowerCase().includes(term) ||
      delivery.email.toLowerCase().includes(term)
    );
  });

  //  page switching -----------------

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);


  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  
//----------------------------------------

  const [shopId, setShopId] = useState(null);
  const [user, setUser] = useState(null);

  // Get user and shopId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setShopId(storedUser.shopId);
    }
  }, []);
  useEffect(() => {
    if (!shopId) return; // Don't fetch if shopId isn't loaded yet

    const audio = new Audio('/notification.mp3');

    const fetchOrders = async () => {
      try {
        if (!shopId) return;

        const response = await axios.get(`http://localhost:8082/delivery/getOrderByShop/${shopId}`);
        const newData = response.data.deliveries;

        // Filter orders that are "Confirming" and not already seen
        const newConfirmingOrders = newData.filter(
          delivery => delivery.status === "Confirming" && !prevOrderIds.current.has(delivery.id)
        );

        // Notify about new orders
        if (newConfirmingOrders.length > 0) {
          newConfirmingOrders.forEach(delivery => {
            toast.success(`🚚 New Order From ${delivery.name}`);
          });
          audio.play();
        }

        // Merge new IDs into existing Set
        newData.forEach(delivery => prevOrderIds.current.add(delivery.id));

        // Transform deliveries: format time + date safely
        const transformedDeliveries = newData.map(order => {
          let formattedTime = "Unknown time";
          if (order.orderTime) {
            const [hour, minute] = order.orderTime.split(':').map(Number);
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

        // Update state with transformed data
        setDeliveries(transformedDeliveries);

      } catch (error) {
        console.error("❌ Failed to fetch orders:", error);
      }
    };



    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [shopId]);







  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      // delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateDeliveryStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8082/delivery/status/${id}?status=${newStatus}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update status:", response.status, errorText); // Log more detail
        toast.error("Failed to update status on server.");
        return false;
      }

      toast.success("Status updated successfully!");
      return true;
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error while updating status.");
      return false;
    }
  };


  const handleRowClick = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleDelete = (id) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id));
    setSelectedDelivery(null);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setDeliveries(deliveries.map((delivery) => (delivery.id === editData.id ? editData : delivery)));
    setSelectedDelivery(editData);
    setEditMode(false);
  };


  return (
    <div className="space-y mb-6 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        {/* Profile logo in top-right corner */}
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-9 text-center">🚚 Deliveries Information</h2>
        <div className="grid grid-cols-5 gap-6">
          <div className={`p-4 bg-blue-100 rounded-lg shadow  text-center cursor-pointer ${filterStatus === "All" ? "ring-2 ring-blue-500" : "bg-blue-100"
            }`}
            onClick={() => setFilterStatus("All")}
          >
            <h4 className="text-lg font-semibold text-blue-800">Total Orders</h4>
            <p className="text-2xl font-bold text-blue-900">{totalDeli}</p>
          </div>
          <div className={`p-4 bg-orange-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Confirming" ? "ring-2 ring-orange-500" : "bg-orange-100"
            }`}
            onClick={() => setFilterStatus("Confirming")}
          >
            <h4 className="text-lg font-semibold text-orange-800">
              Wating Confirm Orders
            </h4>
            <p className="text-2xl font-bold text-yellow-900">{confirmingDeli}</p>
          </div>
          <div className={`p-4 bg-yellow-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-100"
            }`}
            onClick={() => setFilterStatus("Pending")}
          >
            <h4 className="text-lg font-semibold text-yellow-800">
              Pending Orders
            </h4>
            <p className="text-2xl font-bold text-yellow-900">{pendingDeli}</p>
          </div>
          <div className={`p-4 bg-green-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "On Way" ? "ring-2 ring-green-500" : "bg-green-100"
            }`}
            onClick={() => setFilterStatus("On Way")}
          >
            <h4 className="text-lg font-semibold text-green-800">
              On Way Orders
            </h4>
            <p className="text-2xl font-bold text-green-900">{onWayDeli}</p>
          </div>
          <div className={`p-4 bg-red-100 rounded-lg shadow text-center cursor-pointer ${filterStatus === "Delivered" ? "ring-2 ring-red-500" : "bg-red-100"
            }`}
            onClick={() => setFilterStatus("Delivered")}
          >
            <h4 className="text-lg font-semibold text-red-800">
              Delivered Orders
            </h4>
            <p className="text-2xl font-bold text-red-900">{finishDeli}</p>
          </div>
        </div>

        <br></br>
        <input
          type="text"
          placeholder="Search by ID or Name...                                                                                                     🔍"
          className="w-[50%] border items-center ml-[340px] pl-6 rounded-md p-2 mb-9"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {/* {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => ( */}

        {filteredOrders.length > 0 ? (

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Time</th>
                  <th className="py-2 px-4">Total Amount</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                  <th className="py-2 px-4">Payment Method</th>
                </tr>
              </thead>

              <tbody>
              {currentItems.map((delivery) => (
            <tr
              key={delivery.id}
              className="border-t cursor-pointer hover:bg-gray-100"
              onClick={(e) => {
                if (!e.target.closest('button')) {
                  handleRowClick(delivery);
                }
              }}
            >
              <td className="py-2 px-4 text-center">{delivery.id}</td>
              <td className="py-2 px-4 text-center">{delivery.name}</td>
              <td className="py-2 px-4 text-center">{delivery.orderDate}</td>
              <td className="py-2 px-4 text-center">{delivery.time}</td>
              <td className="py-2 px-4 text-center">{delivery.totalAmount}</td>
              <td className="py-2 px-4 text-center">{delivery.status}</td>
              <td className="py-2 px-4 text-center">
                <div className="w-full flex justify-center space-x-2">
                  {delivery.status === 'Confirming' && (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      onClick={() => updateDeliveryStatus(delivery.id, 'Pending')}
                    >
                      Pending
                    </button>
                  )}
                  {delivery.status === 'Pending' && (
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      onClick={() => updateDeliveryStatus(delivery.id, 'On Way')}
                    >
                      On Way
                    </button>
                  )}
                  {delivery.status === 'On Way' && (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      onClick={() => updateDeliveryStatus(delivery.id, 'Delivered')}
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 text-center">{delivery.paymentMethod}</td>
            </tr>
          ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-red-500 font-bold text-lg mt-1 mb-3 pb-5">No Orders</p>
        )}

        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded ${currentPage === idx + 1 ? 'bg-gray-800 text-white' : 'bg-gray-300'}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>


        {selectedDelivery && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
              <div className="mb-4">
                <p><strong>Name :</strong> {selectedDelivery.name}</p>
                <p><strong>Email :</strong> {selectedDelivery.email}</p>
                <p><strong>Address :</strong> {selectedDelivery.street}</p>
                <p><strong>Phone :</strong> {selectedDelivery.phone}</p>
                <p><strong>Total Amount :</strong> {selectedDelivery.totalAmount} - Kyats</p>
                <p><strong>Payment Method :</strong> {selectedDelivery.paymentMethod}</p>
                <p><strong>Date :</strong> {selectedDelivery.orderDate}</p>
                <p><strong>Time :</strong> {selectedDelivery.time}</p>

                <h4 className="mt-4 font-semibold">Ordered Products :</h4>
                <ul className="list-disc list-inside">
                  {selectedDelivery.orderedProducts && selectedDelivery.orderedProducts.map((product, index) => (
                    <li key={index}>
                      {product.productName} (Qty: {product.quantity})
                    </li>
                  ))}
                </ul>
                <br></br>
                <label className="block font-semibold mb-1">Status : {selectedDelivery.status}</label>
                {/* <select
      value={selectedDelivery.status}
      
      onChange={async (e) => {
        const newStatus = e.target.value;
      
        // Update UI first
        setSelectedDelivery((prev) => ({
          ...prev,
          status: newStatus,
        }));
      
        // Then attempt backend update (optional but recommended)
        const success = await updateDeliveryStatus(selectedDelivery.id, newStatus);
      
        if (!success) {
          alert("Failed to update status on server.");
          // Optionally revert the change
        }
      }}
      
      className="border rounded-md px-2 py-1"
    >
      <option value="Pending">Pending</option>
      <option value="On Way">On Way</option>
      <option value="Delivered">Delivered</option>
    </select> */}

                {/* ..................................Change.................... */}
                {/* <select
  value={selectedDelivery.status}
  onChange={async (e) => {
    const newStatus = e.target.value;

    // ✅ 1. Update selectedDelivery state
    setSelectedDelivery((prev) => ({
      ...prev,
      status: newStatus,
    }));

    // ✅ 2. Update the main deliveries list to reflect the status change in the table
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === selectedDelivery.id
          ? { ...delivery, status: newStatus }
          : delivery
      )
    );

    // ✅ 3. Update backend
    const success = await updateDeliveryStatus(selectedDelivery.id, newStatus);
    if (!success) {
      alert("Failed to update status on server.");
      // Optionally revert the change in both selectedDelivery and deliveries
    }
  }}
  className="border rounded-md px-2 py-1"
>
<option value="Comfirming">Comfirming</option>
  <option value="Pending">Pending</option>
  <option value="On Way">On Way</option>
  <option value="Delivered">Delivered</option>
</select> */}
                {/* ............................................................. */}

              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setSelectedDelivery(null)} className="bg-gray-500 text-white px-3 py-1 rounded-md">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

    </div>
  );
};

export default EmpDeli;