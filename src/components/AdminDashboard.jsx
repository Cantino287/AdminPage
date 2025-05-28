import './AdminDashboard.css';

import React, {
  useEffect,
  useState,
} from 'react';

import CategoryCreate from './Category_Create';
import DeliInfo from './DeliInfo';
import EmpDeli from './EmpDeli';
import Employee from './Employee';
import EmpOrder from './EmpOrder';
import EmpTable from './EmpTable';
import FoodMenu from './FoodMenu';
import OrderManagement from './OrderManagement';
import Overview from './Overview';
import ShopList from './shop';
import ShopMenu from './ShopMenu';
import TableDashboard from './TableDashboard';
import UserList from './UserList';
import axios from 'axios';
import AdminOverview from './AdminOverview';


const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("AdminOverview" || "overview");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [shopId, setShopId] = useState(null);
const [shopName, setShopName] = useState("");

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser && storedUser.shopId) {
    setShopId(storedUser.shopId);
  }
}, []);

// Fetch shop name based on shopId
useEffect(() => {
  if (shopId) {
    axios
      .get(`http://localhost:8082/shop/shop-name/${shopId}`)
      .then((res) => {
        const data = res.data;
        // Adjust depending on your backend response format:
        setShopName(data.name || data); // works for either { name: "Shop A" } or plain "Shop A"
      })
      .catch((err) => console.error('Error fetching shop name:', err));
  }
}, [shopId]);
  


  useEffect(() => {
    // Example: Fetch from localStorage where login info is saved
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole('guest'); // fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderMenu = () => {
    if (role === 'admin') {
      return (
        <>
          <MenuButton label="AdminOverview" section="AdminOverview" />
          {/* <MenuButton label="emptable" section="emptable" /> */}
          <MenuButton label="Table Management" section="tables" />
          <MenuButton label="Order Management" section="orders" />
          <MenuButton label="Shop" section="shops" />
          <MenuButton label="Food Menu" section="menu" />
          <MenuButton label="Add New Category" section="category" />
          <MenuButton label="Deliveries Information" section="deliveries" />
          <MenuButton label="Lists of Users" section="users" />
          <MenuButton label="Employee" section="employee" />
        </>
      );
    } else if (role === 'employee'||'mm') {
      return (
        <>
          <MenuButton label="Overview" section="overview" />
          {/* <MenuButton label="Table Management" section="tables" /> */}
          {/* <MenuButton label="Food Menu" section="menu" /> */}
          {/* <MenuButton label="Order Management" section="orders" /> */}
          {/* <MenuButton label="Deliveries Information" section="deliveries" /> */}
          <MenuButton label="EmpTable" section="emptable" />
          <MenuButton label="ShopMenu" section="shopMenu" />
          <MenuButton label="Deli" section="empDeli" />
          <MenuButton label="Order" section="empOrder"/>


        </>
      );
    } else {
      return <p>Unauthorized. Please login.</p>;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "AdminOverview":
        return <AdminOverview />;
      case "overview":
        return <Overview />;
      case "tables":
        return <TableDashboard />;
      case "orders":
        return <OrderManagement />;
      case "shops":
        return <ShopList />;
      case "menu":
        return <FoodMenu />;
      case "category":
        return <CategoryCreate />;
      case "deliveries":
        return <DeliInfo />;
      case "users":
        return <UserList />;
      case "emptable":
          return <EmpTable />;
      case "shopMenu":
        return <ShopMenu />;
      case "empDeli":
        return<EmpDeli />;
      case "empOrder":
        return<EmpOrder/>;
      case "employee":
        return <Employee />;
      default:
        return <Overview />;
    }
  };

  const MenuButton = ({ label, section }) => (
    <button
      className={`w-full p-3 rounded-lg hover:bg-gray-700 transition duration-300 ${
        activeSection === section ? "bg-gray-700" : ""
      }`}
      onClick={() => setActiveSection(section)}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
      <div className="flex flex-col items-center my-4">
      <h1 className="text-2xl font-bold">{shopName ? shopName : "Admin's"}</h1>

  <h1 className="text-2xl font-bold">Dashboard</h1>
</div>
        <nav className="space-y-4">{renderMenu()}</nav>
        <div className="fixed w-[10%] bottom-12 left-10">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg bg-red-500 hover:bg-red-600 transition duration-300 text-center"
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
