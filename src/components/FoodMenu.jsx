import 'react-toastify/dist/ReactToastify.css';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { motion } from 'framer-motion';
import { CgProfile } from 'react-icons/cg';
import {
  toast,
  ToastContainer,
} from 'react-toastify';

const FoodMenu = () => {
  const [shops, setShops] = useState([]);
const [selectedShopId, setSelectedShopId] = useState('all');
const [menu, setMenu] = useState([]);
const [loading, setLoading] = useState(false);      // New: shops list
  // const [selectedShop, setSelectedShop] = useState("all"); // New: selected shop
// const [selectedShopId, setSelectedShopId] = useState('all'); // default 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(menu.length / itemsPerPage);

  
   
  
  useEffect(() => {
    // Fetch shops list once
    axios.get("http://localhost:8082/shop/get")
      .then(res => setShops(res.data))
      .catch(err => console.error("Failed to fetch shops:", err));
    
    // Initial fetch of all menu items
    fetchMenu('all');
  }, []);
  
  const fetchMenu = async (shopId) => {
    setLoading(true);
    try {
      let url = "http://localhost:8082/product/get"; // all shops
      if (shopId && shopId !== "all") {
        url = `http://localhost:8082/product/shop/${shopId}`;
      }
      const res = await axios.get(url);
      console.log("Fetched menu data:", res.data);
  
      if (Array.isArray(res.data)) {
        // response is an array (all shops)
        setMenu(res.data);
      } else if (res.data.products && Array.isArray(res.data.products)) {
        // response is an object with products property
        setMenu(res.data.products);
      } else {
        setMenu([]);
      }
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      setMenu([]);
    }
    setLoading(false);
  };
  
  
  const handleShopChange = (e) => {
    const shopId = e.target.value;
    setSelectedShopId(shopId);
    setCurrentPage(1);
    fetchMenu(shopId);
  };
  
  // Filter menu by shop and search term
  const filteredByShop = selectedShopId === 'all'
  ? menu
  : menu.filter(item => item.shopId === Number(selectedShopId));

// Apply search filtering on filteredByShop
const filteredMenu = Array.isArray(menu) ? menu.filter(item =>
  item.name?.toLowerCase().includes(searchTerm.toLowerCase())
) : [];

// Use filteredMenu in pagination and display below instead of `menu`
const paginatedMenu = filteredMenu.slice(startIndex, startIndex + itemsPerPage);


  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // const filteredMenu = menu.filter(item =>
  //   item.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // const filteredMenu = menu.filter(item =>
  //   item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  

  // const paginatedMenu = filteredMenu.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setLoading(true);

    setTimeout(() => {
      const results = menu.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setLoading(false);
      setNoResults(results.length === 0);
    }, 1000);
  };
  
    
  const [categories, setCategories] = useState([]);
const [showForm, setShowForm] = useState(false);
// const [menu, setMenu] = useState([]);
const [newItem, setNewItem] = useState({
  name: "",
  categoryId: "", // category ID from the backend
  price: "",
  desc: "",
  image: null,
});
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);



const [editingItem, setEditingItem] = useState(null);

// Fetch categories from backend
useEffect(() => {
  axios.get("http://localhost:8082/category/get")
    .then((res) => setCategories(res.data))
    .catch((err) => console.error("Failed to fetch categories:", err));
}, []); // ← Add this


const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : "No Category";
};





const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [name]: value  // This will update the correct field (e.g. 'desc', 'name', etc.)
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: value  // Update for new item case
      });
    }
  };



// Handle image file selection
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (editingItem) {
      setEditingItem({ ...editingItem, image: file });
    } else {
      setNewItem({ ...newItem, image: file });
    }
  }
};

// Add new menu item


const addMenuItem = async () => {
  const formData = new FormData();
  formData.append("name", newItem.name);
  formData.append("description", newItem.desc);
  formData.append("price", newItem.price);
  formData.append("categoryId", newItem.categoryId); // pass category ID
  formData.append("image", newItem.image);

  try {
    const res = await axios.post("http://localhost:8082/product/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // setMenu([...menu, res.data]); // assuming backend returns the created item
    await fetchMenu(); // re-fetch full updated product list
    setShowForm(false);
    setNewItem({ name: "", categoryId: "", price: "", desc: "", image: null });
    toast.success("Menu added successfully!");
  } catch (err) {
    toast.error("Error adding menu :", err);
  }
};
const updateMenuItem = async () => {
  const formData = new FormData();

  formData.append("id", editingItem.id); // Important: send ID for update
  formData.append("name", editingItem.name);
  formData.append("description", editingItem.desc);
  formData.append("price", editingItem.price);
  formData.append("categoryId", editingItem.categoryId);

  // Only append image if a new file is selected
  if (editingItem.image && typeof editingItem.image !== "string") {
    formData.append("image", editingItem.image);
  }

  try {
    await axios.post("http://localhost:8082/product/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Optionally refresh or update the menu
    fetchMenu(); // or manually update the local state
    setEditingItem(null);
    toast.success("Menu updated successfully!");
  } catch (err) {
    toast.error("Error updating menu :", err);
  }
};




// Cancel editing
const cancelEdit = () => {
  setEditingItem(null);
};

// Confirm delete


// Delete menu item
const confirmDelete = async () => {
  try {
    await axios.post(`http://localhost:8082/product/delete/${productToDelete}`);
    toast.success("Product deleted successfully!");
    setShowDeleteConfirm(false);
    fetchMenu(); // reload the menu
  } catch (err) {
    console.error("Error deleting product:", err);
    toast.error("Failed to delete product.");
  }
};

const deleteProduct = (id) => {
  setProductToDelete(id);
  setShowDeleteConfirm(true);
};

const cancelDelete = () => {
  setShowDeleteConfirm(false);
};


// Cancel deletion


  
    return (
      
      <div className="space-y animate-fadeIn">
        <nav className="text-black py-6 px-6 flex items-center mb-5 justify-end">
          {/* Profile logo in top-right corner */}
          <div className="relative">
            <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
          </div>
        </nav>
        <h2 className="text-3xl font-bold  text-center mb-9 text-gray-800">🍴 Food Menu</h2>
        <div className="mb-4 flex justify-left gap-4">
        <div className="relative inline-block w-40 mb-6">
  <select
    value={selectedShopId}
    onChange={handleShopChange}
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
        {/* <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add Menu
        </button> */}
        <motion.input
          type="text"
          placeholder="Search food menu...                                                                                                                 🔍"
          value={searchTerm}
          onChange={handleSearch}
          className="w-[50%] border items-center ml-[200px]  pl-6 rounded-md p-2 "
        />
        {(showForm || editingItem) && (
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="p-6 bg-white rounded-lg w-96">
              <h3 className="text-2xl font-bold mb-4">{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
              <div className="space-y-4">
                <input type="text" name="name" placeholder="Food Name" value={editingItem ? editingItem.name || "" : newItem.name} onChange={handleInputChange} className="w-full border rounded-md p-2" />
               
                <select
  name="categoryId"
  value={editingItem ? editingItem.categoryId || "" : newItem.categoryId}
  onChange={handleInputChange}
  className="w-full border rounded-md p-2"
>
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

                <input type="text" name="desc" placeholder="Description" value={editingItem ? editingItem.desc || "" : newItem.desc} onChange={handleInputChange} className="w-full border rounded-md p-2" />
                <input type="text" name="price" placeholder="Price" value={editingItem ? editingItem.price || "" : newItem.price} onChange={handleInputChange} className="w-full border rounded-md p-2" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border rounded-md p-2" />
                {(editingItem ? editingItem.image : newItem.image) && (
  <img
    src={
      typeof (editingItem ? editingItem.image : newItem.image) === "string"
        ? `http://localhost:8082/images/food-images/${editingItem ? editingItem.image : newItem.image}` // for already uploaded
        : URL.createObjectURL(editingItem ? editingItem.image : newItem.image) // for new file
    }
    alt="Preview"
    className="w-full h-32 object-cover rounded-md"
  />
)}

                <div className="flex justify-end gap-2">
                  {editingItem ? (
                    <>
                      <button onClick={updateMenuItem} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
                      <button onClick={cancelEdit} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={addMenuItem} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Item</button>
                      <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && <p className="text-center text-blue-500 text-lg animate-pulse">Searching...</p>}
        {noResults && !loading && <h2 className="text-center text-red-500 text-lg">Item not found</h2>}
  
        {!noResults && !loading && filteredMenu.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Id</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Food Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                {/* <th className="border border-gray-300 px-4 py-2 text-center">Actions</th> */}
              </tr>
            </thead>
           
            <tbody>
  {paginatedMenu.map((item, index) => (
    <tr key={item.id} className="border border-gray-300 hover:bg-gray-100"><td className="border border-gray-300 px-4 py-2">{index + 1}</td>
    <td className="border border-gray-300 px-4 py-2">
      {/* <img
        src={`http://localhost:8082/images/food-images/${item.image}`}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-full"
      /> */}
      <img
        src={`http://localhost:8082/images/product-images/${item.image}`}
        alt={item.name}
        className="w-16 h-16 object-cover"
      />
    </td>
    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
    
    <td className="border border-gray-300 px-4 py-2">
  {getCategoryName(item.categoryId)}
</td>



    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
    <td className="border border-gray-300 px-4 py-2">{item.price}</td>
    {/* <td className="border border-gray-300 px-4 py-2 text-center">
    <button onClick={() =>
    setEditingItem({
      id: item.id,
      name: item.name,
      desc: item.description || "",
      price: item.price,
      categoryId: item.category?.id || item.categoryId || "",
      image: item.image || null,
    })
  }
  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
>
  Edit
</button>

<button
  onClick={() => deleteProduct(item.id)}
  className="px-3 ml-[10px] py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
>
  Delete
</button>
    </td> */}
  </tr>
  ))}
</tbody>
          </table>
        ): (
          <div className="text-center text-gray-500 text-lg mt-8">
            No menu available.
          </div>
        )}
{showDeleteConfirm && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        initial={{ opacity: 0.5, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <h3 className="text-2xl font-bold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this Menu?</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={confirmDelete}  
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          >
            Previous
          </button>
  
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-4 py-2 rounded-md ${currentPage === num ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {num}
            </button>
          ))}
  
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
  
    );
  };

export default FoodMenu;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// function FoodMenu() {
//   const [shops, setShops] = useState([]);
//   const [selectedShopId, setSelectedShopId] = useState('all');
//   const [menuItems, setMenuItems] = useState([]);
//   const [shopName, setShopName] = useState('');

//   // Fetch shops list once
//   useEffect(() => {
//     axios.get('http://localhost:8082/shop/get') // adjust if your shops API path differs
//       .then(response => {
//         setShops(response.data || []);
//       })
//       .catch(err => console.error('Error fetching shops:', err));
//   }, []);

//   const fetchMenuItems = useCallback(() => {
//     let url = '';
//     if (selectedShopId === 'all') {
//       url = 'http://localhost:8082/product/get';
//     } else {
//       url = `http://localhost:8082/product/shop/${selectedShopId}`;
//     }

//     console.log("Fetching menu from:", url);

//     axios.get(url)
//   .then(response => {
//     console.log('API response data:', response.data);

//     let items = [];

//     if (selectedShopId === 'all') {
//       // Assuming all products come as an array directly
//       items = Array.isArray(response.data) ? response.data : [];
//       setShopName('');
//     } else {
//       // If your shop products API returns an object with products array
//       if (response.data && Array.isArray(response.data.products)) {
//         items = response.data.products;
//       } else if (Array.isArray(response.data)) {
//         items = response.data;
//       } else {
//         items = [];
//       }

//       // Get shop name from shops list
//       const shop = shops.find(s => String(s.id) === String(selectedShopId));
//       setShopName(shop ? shop.name : '');
//     }

//     setMenuItems(items);
//   })
//   .catch(error => {
//     console.error('Error fetching menu items:', error);
//     setMenuItems([]);
//     setShopName('');
//   });

//   }, [selectedShopId, shops]);

//   useEffect(() => {
//     fetchMenuItems();
//   }, [fetchMenuItems]);

//   const handleShopChange = (e) => {
//     setSelectedShopId(e.target.value);
//   };

//   return (
//     <div>
//       <h1>Food Menu {shopName ? `- ${shopName}` : ''}</h1>

//       <label htmlFor="shop-select">Select Shop:</label>
//       <select id="shop-select" value={selectedShopId} onChange={handleShopChange}>
//         <option value="all">All Shops</option>
//         {shops.map(shop => (
//           <option key={shop.id} value={shop.id}>
//             {shop.name}
//           </option>
//         ))}
//       </select>

//       <div>
//         {menuItems.length === 0 ? (
//           <p>No menu items available.</p>
//         ) : (
//           <ul>
//             {menuItems.map(item => (
//               <li key={item.id}>
//                 {item.name} - ${item.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FoodMenu;
