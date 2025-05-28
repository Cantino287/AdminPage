
import { CgProfile } from 'react-icons/cg';
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const EmpTable = () => {
  const [shopId, setShopId] = useState(null);
  const [shopName, setShopName] = useState('');
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [shopList, setShopList] = useState([]);
  const [user, setUser] = useState(null);

  // Load user and fetch shops/tables
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setShopId(storedUser.shopId);

      if (storedUser.role === 'admin') {
        axios.get('http://localhost:8082/shop/get')
        .then((res) => {
          console.log('Loaded shop list:', res.data); // ✅ Add this
          setShopList(res.data);
        })
        .catch((err) => {
          console.error('Error loading shop list:', err); // ✅ Handle errors too
        });

        axios
          .get('http://localhost:8082/table-login/all', {
            headers: { role: 'admin' },
          })
          .then((res) => {
            setTables(res.data);
            setFilteredTables(res.data);
          });
      } else {
        axios
          .get(`http://localhost:8082/table-login/shop/${storedUser.shopId}`)
          .then((res) => {
            const shopTables = Array.isArray(res.data.tables) ? res.data.tables : [];
            setTables(shopTables);
            setFilteredTables(shopTables);
          });

        axios
          .get(`http://localhost:8082/shop/shop-name/${storedUser.shopId}`)
          .then((res) => setShopName(res.data))
          .catch((err) => console.error('Error fetching shop name:', err));
      }
    }
  }, []);

  // Handle dropdown filtering for admin
  useEffect(() => {
    if (user?.role === 'admin') {
      if (!selectedShopId || selectedShopId === 'all') {
        setFilteredTables(tables);
      } else {
        setFilteredTables(tables.filter((t) => t.shop?.id === Number(selectedShopId)));
      }
    }
  }, [selectedShopId, tables, user]);

  
  return (
      <div className="space-y mb-9 animate-fadeIn">
        <nav className="text-black py-6 px-6 flex items-center justify-end">
          <div className="relative">
         <CgProfile className="w-10 h-10 text-gray-700" />
          </div>
        </nav>
        
      
  
        <div>
       
          <h1 className="text-3xl font-bold mb-8 flex items-center justify-center">
            🍽️ {shopName} Table Management 
          </h1>

          {user?.role === 'admin' && (
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
      )}

  
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-blue-800">Total Tables</h4>
              <p className="text-2xl font-bold text-blue-900">{filteredTables.length}</p>
            </div>
            <div className="p-4 bg-red-100 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-red-800">Occupied Tables</h4>
              <p className="text-2xl font-bold text-red-900">
              {filteredTables.filter((t) => t.status === 'Occupied').length}
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-green-800">Available Tables</h4>
              <p className="text-2xl font-bold text-green-900">{filteredTables.filter((t) => t.status === 'Available').length}</p>
            </div>
          </div>

   
  
          <div className="grid grid-cols-3 gap-4 mt-4">
          {filteredTables.length > 0 ? (
          filteredTables.map((table) => (
              <div
              key={table.id}
           className="p-6 bg-white rounded-lg shadow-md text-center border border-gray-300 hover:shadow-lg transition duration-300 cursor-pointer"
       
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
   
  
          
          
  
  {/* {selectedTable && (
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
  )} */}
  
          </div>
  
        </div>
      </div>
    );
};

export default EmpTable;
