import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { CgProfile } from 'react-icons/cg';

const EmpTable = () => {
    const [shopId, setShopId] = useState(null);
    const [shopName, setShopName] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [newTable, setNewTable] = useState({ tableNumber: '', seats: '', password: '' });
    const [editTable, setEditTable] = useState(null);
    const [editTableId, setEditTableId] = useState(""); // Initialize with empty string or null
    const [shopList, setShopList] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState(null);


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
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setShopId(storedUser.shopId);
        
        // If admin, load all shops and all tables
        if (storedUser.role === "admin") {
          axios.get("http://localhost:8082/shop/all").then(res => {
            setShopList(res.data);
          });
    
          axios
            .get("http://localhost:8082/table-login/all", {
              headers: { role: "admin" },
            })
            .then((res) => {
              setTables(res.data);
            });
        }
      }
    }, []);

    useEffect(() => {
      if (user?.role === "admin" && selectedShopId) {
        const filteredTables = tables.filter((t) => t.shop?.id === Number(selectedShopId));
        setTables(filteredTables);
      }
    }, [selectedShopId]);
    
    
  
    // Fetch shop name
    useEffect(() => {
      if (shopId) {
        axios
          .get(`http://localhost:8082/shop/shop-name/${shopId}`)
          .then((res) => setShopName(res.data))
          .catch((err) => console.error('Error fetching shop name:', err));
      }
    }, [shopId]);
  
    // Fetch tables
    const fetchTables = async () => {
      try {
        if (shopId) {
          const response = await axios.get(`http://localhost:8082/table-login/shop/${shopId}`);
          const { tables } = response.data;
          setTables(Array.isArray(tables) ? tables : []);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
  
    useEffect(() => {
      fetchTables();
    }, [shopId]);
  
    // Create new table
    const handleCreateTable = async (e) => {
      e.preventDefault();
      const { tableNumber, seats, password } = newTable;
  
      if (!tableNumber || seats <= 0 || !password) {
        alert('Please fill all fields correctly.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:8082/table-login/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            shopId: shopId.toString(),
          },
          body: JSON.stringify({
            tableNumber: tableNumber.toString(),
            seat: seats.toString(),
            password: password,
          }),
        });
  
        if (response.ok) {
          const newTableData = await response.json();
          setTables((prev) => [...prev, newTableData]);
          setShowCreateForm(false);
          setNewTable({ tableNumber: '', seats: '', password: '' });
          alert('Table created successfully!');
        } else {
          alert('Failed to create table.');
        }
      } catch (error) {
        console.error('Error creating table:', error);
        alert('An error occurred.');
      }
    };
  
    // Edit existing table
    const handleEditTable = async () => {
      if (!editTable) return;
  
      try {
        const payload = {
          tableNumber: editTable.tableNumber.toString(),
          seat: editTable.seat.toString(),
          password: editTable.password,
          status: editTable.status || 'Available',
          shopId: shopId,
        };
  
        await axios.put(`http://localhost:8082/table-login/edit/${editTable.id}`, payload);
        await fetchTables();
        alert('Table updated successfully!');
        setShowEditForm(false);
        setEditTable(null);
      } catch (error) {
        console.error('Error editing table:', error);
      }
    };
  
    
          
    const totalTables = Array.isArray(tables) ? tables.length : 0;
    const occupiedTables = Array.isArray(tables)
      ? tables.filter((table) => table.status === 'Occupied').length
      : 0;
    const availableTables = totalTables - occupiedTables;
    const handleStatusChange = async () => {
        if (!selectedTable) return;
    
        // Determine new status
        const newStatus = selectedTable.status === "Available" ? "Occupied" : "Available";
    
        try {
            // Send update request to backend
            await axios.put(
                `http://localhost:8082/table-login/update-status/${selectedTable.id}`,
                { status: newStatus }
            );
    
            // Update UI immediately
            setTables(
                tables.map((table) =>
                    table.id === selectedTable.id ? { ...table, status: newStatus } : table
                )
            );
    
            setSelectedTable(null); // Close the modal after update
        } catch (error) {
            console.error("Error updating table status:", error);
        }
    };
    
    
    
        

  return (
    <div className="space-y mb-9 animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>

      <div>
     
        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center">
          🍽️ {shopName} Table Management 
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold text-blue-800">Total Tables</h4>
            <p className="text-2xl font-bold text-blue-900">{totalTables}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold text-red-800">Occupied Tables</h4>
            <p className="text-2xl font-bold text-red-900">{occupiedTables}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold text-green-800">Available Tables</h4>
            <p className="text-2xl font-bold text-green-900">{availableTables}</p>
          </div>
        </div>
        <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        onClick={(e) => {
          e.stopPropagation();
          setShowCreateForm(true);
        }}
      >
        Create Table
      </button>
      <button
        className="mt-4 ml-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
        onClick={(e) => {
          e.stopPropagation();
          setShowEditForm(true);
        }}
      >
        Edit Table
      </button>

      
{showCreateForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-2xl font-bold mb-4">Create Table</h3>

      <input
        type="number"
        value={newTable.tableNumber}
        onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
        className="border p-2 w-full mb-2"
        placeholder="Table Number"
        min="1"
      />

      <input
        type="number"
        value={newTable.seats}
        onChange={(e) => setNewTable({ ...newTable, seats: e.target.value })}
        className="border p-2 w-full mb-2"
        placeholder="Seats"
      />

      <input
        type="text"
        value={newTable.password}
        onChange={(e) => setNewTable({ ...newTable, password: e.target.value })}
        className="border p-2 w-full mb-2"
        placeholder="Password"
      />

      {/* Shop dropdown for admin only */}
      {user?.role === 'admin' && (
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Shop</option>
          {shopList.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      )}
      


      <button
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        onClick={handleCreateTable}
      >
        Create
      </button>

            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition ml-2"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

        <div className="grid grid-cols-3 gap-4 mt-4">
            {Array.isArray(tables) && tables.length > 0 ? (
             tables.map((table) => (
            <div
            key={table.id}
         className="p-6 bg-white rounded-lg shadow-md text-center border border-gray-300 hover:shadow-lg transition duration-300 cursor-pointer"
         onClick={(e) => {
            e.stopPropagation();
            setSelectedTable(table);
          }}
          > 
         <h3 className="text-lg mb-2 font-semibold">Table {table.tableNumber}</h3>
         <p
          className={`text-sm font-medium p-1 rounded-md ${
            table.status === 'Available'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}
            >
          {table.status}
            </p>
            </div>
    ))
  ) : (
    <p className="text-gray-600 col-span-3 text-center">No tables found.</p>
  )}
  {showEditForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h3 className="text-2xl font-bold mb-4">Edit Table</h3>
     

      {/* Table selector */}
      <select
        value={editTableId}
        onChange={(e) => {
          const selected = tables.find((table) => table.id === Number(e.target.value));
          setEditTableId(e.target.value);
          setEditTable(selected || null);
          setOriginalTableId(selected ? selected.id : null);
        }}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>
            Table {table.tableNumber}
          </option>
        ))}
      </select>

      {editTable && (
        <>
          

          {/* Seat count */}
          <input
            type="number"
            value={editTable.seat}
            onChange={(e) =>
              setEditTable({ ...editTable, seat: e.target.value })
            }
            className="border p-2 w-full mb-2"
            placeholder="Seats"
          />

          {/* Password */}
          <input
            type="text"
            value={editTable.password}
            onChange={(e) =>
              setEditTable({ ...editTable, password: e.target.value })
            }
            className="border p-2 w-full mb-2"
            placeholder="Password"
          />

          

          {/* Optional: ShopId field for Admin only */}
          {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
            <input
              type="number"
              value={editTable.shopId || ""}
              onChange={(e) =>
                setEditTable({ ...editTable, shopId: Number(e.target.value) })
              }
              className="border p-2 w-full mb-2"
              placeholder="Shop ID"
            />
          )}

          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={handleEditTable}
          >
            Save Changes
          </button>
          <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition ml-2"
              onClick={() => setShowEditForm(false)}
            >
              Cancel
            </button>
        </>
      )}
    </div>
  </div>
)}

        
        

{selectedTable && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h3 className="text-2xl font-bold mb-4">
        Table {selectedTable.id} Details
      </h3>
      <p className="mb-[5px]">Seats: {selectedTable.seat}</p>
      <p className="mb-[5px]">Password: {selectedTable.password}</p>
      <p className="mb-[5px]">Status: {selectedTable.status}</p>
      <div className="space-x-4 mt-4">
        {selectedTable.status === "Available" ? (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => handleStatusChange(selectedTable.id, "Occupied")}
          >
            Set as Occupied
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => handleStatusChange(selectedTable.id, "Available")}
          >
            Set as Available
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          onClick={() => setSelectedTable(null)} // This closes the modal
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </div>

      </div>
    </div>
  );
};

export default EmpTable;

