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

const API_BASE_URL = "https://cantino.onrender.com";

// Retrieve JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token"); // Ensure token is stored in localStorage after login
};

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShops, setEditingShops] = useState(null);
  const [shopName, setShopName] = useState(editingShops?.name || "");
  const [shopPhone, setShopPhone] = useState(editingShops?.phone || "");
  const [selectedImage, setSelectedImage] = useState(editingShops?.image || null);
  const [showPopup, setShowPopup] = useState(false); // Added based on your usage
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shopToDelte, setShopToDelete] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    fetchShops();
  }, []);


  const fetchShops = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/shop/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching Shops:", error);
    }
  };

  // Handle file input
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopName || !selectedImage) {
      alert("Please provide all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", shopName);
    formData.append("phone", shopPhone);
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${API_BASE_URL}/shop/add`, formData, {
        headers: {
          // Authorization: `Bearer ${token}`, // Add if needed
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Shop added successfully!");
        setShowForm(false);           // ✅ Corrected this line
        setEditingShops(null);     // Optional cleanup
        setShopName("");          // Clear input
        setShopPhone("");          // Clear input
        setSelectedImage(null);       // Clear image
        fetchShops();            // Refresh the category list
      }
    } catch (error) {
      toast.error("Error saving shop:", error);
      // alert("❌ Failed to add category.");
    }
  };

  //Update

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingShops || !shopName) {
      alert("Please provide all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id", editingShops.id); // required by requestMap
    formData.append("name", shopName);     // required by requestMap
    formData.append("phone", shopPhone);     // required by requestMap

    // Send image only if selected
    if (selectedImage) {
      formData.append("image", selectedImage); // optional MultipartFile
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/shop/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token}`, // include if your backend requires JWT
        },
      });

      if (response.status === 200) {
        toast.success("Shop updated successfully!");
        setShowForm(false);
        setEditingShops(null);
        setShopName("");
        setShopPhone("");
        setSelectedImage(null);
        fetchShops(); // reload the list
      }
    } catch (error) {
      toast.error("Error updating shop:", error);
      // alert("❌ Failed to update category.");
    }
  };



  // Delete category
  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this category?")) {
  //     try {
  //       const response = await axios.delete(`${API_BASE_URL}/category/delete/${id}`);

  //       if (response.status === 200) {
  //         toast.success("Category deleted successfully!");
  //         fetchCategories();  // Re-fetch categories to update the list
  //       }
  //     } catch (error) {
  //       toast.error("❌ Error deleting category:", error);
  //       // alert("❌ Failed to delete category.");
  //     }
  //   }
  // };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/shop/delete/${shopToDelte}`);
      toast.success("Shop deleted successfully!");
      setShowDeleteConfirm(false);
      fetchShops(); // reload the menu
    } catch (err) {
      console.error("Error deleting Shop:", err);
      toast.error("Failed to delete Shop.");
    }
  };

  const deleteShop = (id) => {
    setShopToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };


  return (
    <div className="space-y animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
      </nav>

      <h2 className="text-3xl font-bold text-center mb-9 text-gray-800">
        🏪 Shop Management
      </h2>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add New Shop
      </button>

      <input
        type="text"
        placeholder="Search Shop..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[50%] border items-center ml-[190px] rounded-md pl-6 p-2 mb-8"
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="p-6 bg-white rounded-lg w-96">
            <h3 className="text-2xl font-bold mb-4">
              {editingShops ? "Edit Shop" : "Add New Shop"}
            </h3>


            <form onSubmit={editingShops ? handleUpdate : handleSubmit}>
              <input
                type="text"
                placeholder="Enter shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="w-full border rounded-md p-2 mb-2"
              />

              <input
                type="text"
                placeholder="Enter shop phone"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                required
                className="w-full border rounded-md p-2 mb-2"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md p-2 mb-2"
                required={!editingShops}
              />

              {selectedImage && (
                <img
                  src={
                    selectedImage instanceof File
                      ? URL.createObjectURL(selectedImage) // New uploaded image
                      : `https://cantino.onrender.com/images/shop-images/${selectedImage}` // Existing image from backend
                  }
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}


              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingShops ? "Save Changes" : "Add Shop"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedImage(null);
                    setShopName("");
                    setShopPhone("");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Categories */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Shop Name</th>
            <th className="border border-gray-300 px-4 py-2">Shop Phone</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops
            .filter((shop) =>
              shop.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((shop, index) => (
              <tr key={shop.id} className="border border-gray-300 hover:bg-gray-100">
                <td className="border text-center border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={`${API_BASE_URL}/images/shop-images/${shop.image}`}
                    alt={shop.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{shop.name}</td>
                <td className="border border-gray-300 px-4 py-2">{shop.phone}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">

                  <button
                    onClick={() => {
                      setEditingShops({
                        id: shop.id,
                        name: shop.name,
                        phone: shop.phone,
                        image: shop.image || null,
                      });
                      setShopName(shop.name);         // pre-fill the name field
                      setShopPhone(shop.phone);         // pre-fill the name field
                      setSelectedImage(shop.image || null); // set existing image filename
                      setShowForm(true);                      // open the form modal
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => deleteShop(shop.id)}
                    className="px-3 ml-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
            <p>Are you sure you want to delete this Shop?</p>
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

    </div>
  );
};

export default ShopList;
