import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { CgProfile } from 'react-icons/cg';

const Admin = () => {
  const roles = ["Employee", "Admin"];
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [shops, setShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({email: "", password: "", role: roles[0], shopId: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  useEffect(() => {
    fetchEmployees();
    fetchShops();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8082/account/all");
      // Filter employees only
      if (Array.isArray(res.data)) {
        const employeeList = res.data.filter(user => user.role?.toLowerCase() === "employee");
        setEmployees(employeeList);
      } else {
        console.error("API returned unexpected data:", res.data);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await axios.get("http://localhost:8082/shop/get");
      setShops(res.data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  // Search filter, ignoring case, on name, email, or role
  const filteredEmployees = employees.filter((employee) =>
    (employee.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.role ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  // Prepare employee object for backend with nested shop object on add
  const addEmployee = async () => {
    try {
      // Prepare payload with nested shop object
      const shopObj = shops.find(shop => shop.id === Number(newEmployee.shopId)) || null;

      const payload = {
        
        email: newEmployee.email,
        password: newEmployee.password,
        role: newEmployee.role,
        shop: shopObj,
      };

      await axios.post("http://localhost:8082/account/create", payload);
      fetchEmployees();
      setShowForm(false);
      setNewEmployee({email: "", password: "", role: roles[0], shopId: "" });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Prepare employee object for backend with nested shop object on update
  const updateEmployee = async () => {
    try {
      const shopObj = shops.find(shop => shop.id === Number(editingEmployee.shopId)) || null;

      const payload = {
        ...editingEmployee,
        shop: shopObj,
      };
      // Remove shopId property from payload if exists (not needed by backend)
      delete payload.shopId;

      await axios.put(`http://localhost:8082/account/update/${editingEmployee.id}`, payload);
      fetchEmployees();
      setEditingEmployee(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const deleteEmployee = async () => {
    try {
      await axios.delete(`http://localhost:8082/account/delete/${employeeToDelete}`);
      fetchEmployees();
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const confirmDelete = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const openEditForm = (employee) => {
    // Set shopId from nested shop object for controlled select input
    setEditingEmployee({
      ...employee,
      shopId: employee.shop?.id ? employee.shop.id.toString() : "",
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y animate-fadeIn">
      <nav className="text-black py-6 px-6 flex items-center justify-end">
        <div className="relative">
          <CgProfile className="w-12 h-12 rounded-full border border-gray-300 shadow-lg" />
        </div>
      </nav>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">👥 Employee Management</h2>
      <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">Add New Employee</button>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-[50%] border ml-[200px] pl-6 rounded-md p-2 mb-8"
      />
      <table className="w-full border-collapse border border-gray-300 mb-7">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            {/* <th className="border border-gray-300 px-4 py-2 text-left">Name</th> */}
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Shop</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Password</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((user, index) => (
            <tr key={user.id} className="border border-gray-300 hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
              {/* <td className="border border-gray-300 px-4 py-2">{user.name}</td> */}
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">{user.shop?.name || ""}</td>
              <td className="border border-gray-300 px-4 py-2">{user.password}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button onClick={() => openEditForm(user)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Edit</button>
                <button onClick={() => confirmDelete(user.id)} className="px-3 ml-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Delete</button>
              </td>
            </tr>
          ))}
          {paginatedEmployees.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl font-bold mb-4">{editingEmployee ? "Edit Employee" : "Add New Employee"}</h3>
            {/* <input
              type="text"
              name="name"
              value={editingEmployee ? editingEmployee.name : newEmployee.name}
              onChange={editingEmployee ? handleInputChange : (e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              placeholder="Name"
              className="border rounded-md p-2 w-full mb-2"
            /> */}
            <input
              type="email"
              name="email"
              value={editingEmployee ? editingEmployee.email : newEmployee.email}
              onChange={editingEmployee ? handleInputChange : (e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              placeholder="Email"
              className="border rounded-md p-2 w-full mb-2"
            />
            <input
              type="password"
              name="password"
              value={editingEmployee ? editingEmployee.password : newEmployee.password}
              onChange={editingEmployee ? handleInputChange : (e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              placeholder="Password"
              className="border rounded-md p-2 w-full mb-2"
            />
            <select
              name="role"
              value={editingEmployee ? editingEmployee.role : newEmployee.role}
              onChange={editingEmployee ? handleInputChange : (e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="border rounded-md p-2 w-full mb-2"
            >
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select
              name="shopId"
              value={editingEmployee ? editingEmployee.shopId : newEmployee.shopId}
              onChange={editingEmployee ? handleInputChange : (e) => setNewEmployee({ ...newEmployee, shopId: e.target.value })}
              className="border rounded-md p-2 w-full mb-2"
            >
              <option value="">Select Shop</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={editingEmployee ? updateEmployee : addEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {editingEmployee ? "Save Changes" : "Add Employee"}
              </button>
              <button onClick={cancelEdit} className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={deleteEmployee} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-400"}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-400"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Admin;

