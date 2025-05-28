import 'react-toastify/dist/ReactToastify.css';

import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Categories from '../Category';  // Import Categories component
import Card from '../components/Card';
import Card2 from '../components/Card2';
import Nav from '../components/Nav';
import { dataContext } from '../context/UserContext';
// import { clearCart } from '../redux/actions/cartActions';
import { clearCart } from '../redux/cartSlice';

// import { clearCart } from '../redux/cart/cartActions';

const Home = () => {
    // const navigate = useNavigate();
  let { Cate, setCate, input, showCart, setShowCart } = useContext(dataContext);
  const [categories, setCategories] = useState({});
  const [category, setCategory] = useState("All");
  const [foodList, setFoodList] = useState([]);
  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [shopName, setShopName] = useState("");



  // const [foodList, setFoodList] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [filteredFoodList, setFilteredFoodList] = useState([]);
  // const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("All");

  const cart = useSelector((state) => state.cart);
  const [orderType, setOrderType] = useState("EatInShop");
  const [email, setEmail] = useState('');






const dispatch = useDispatch();    
const token = localStorage.getItem("token");
  const shopId = localStorage.getItem("shopId");
  let tableNumber = localStorage.getItem("tableNumber");


// useEffect(() => {
//     const token = localStorage.getItem("token"); // Retrieve JWT token
//     // Fetching categories
//     fetch("http://localhost:8082/category/get", { 
//       // Categories API
//       method: "GET", 
//       headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": token ? `Bearer ${token}` : "", // Pass JWT token for authentication
//               },
//     })
//       .then(response => response.json())
//       .then(data => {
//         setCategories(data); // Update categories list
//         console.log("Fetched Categories:", data);
//       })
//       .catch(error => console.error("Error fetching categories:", error));
  
//     // Fetching food items (with categoryId)
//     fetch("http://localhost:8082/product/get", { 
//       method: "GET", 
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`, // Pass JWT token for authentication
//       } 
//     })
//       .then(response => response.json())
//       .then(data => {
//         setFoodList(data); // Set fetched food items
//         setFilteredFoodList(data); // Initially show all items
//         console.log("Fetched Food List:", data);
//       })
//       .catch(error => console.error("Error fetching food items:", error));
//   }, []);
useEffect(() => {
  const fetchCat = () => {
    fetch("http://localhost:8082/category/get", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const categoryMap = {};
        data.forEach((cat) => {
          categoryMap[cat.name] = cat.id;
        });
        setCategories(categoryMap);
      })
      .catch((error) => console.error("❌ Error fetching categories:", error));
  };

  fetchCat();
  const intervalId = setInterval(fetchCat, 10000); // every 10 seconds

  return () => clearInterval(intervalId);
}, []);

// Fetch Products
useEffect(() => {
  const fetchMenu = () => {
    fetch(`http://localhost:8082/product/shop/${shopId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const products = Array.isArray(data.products) ? data.products : data;
        setFoodList(products);
      })
      .catch((error) => console.error("❌ Error fetching food:", error));
  };

  fetchMenu();
  const intervalId = setInterval(fetchMenu, 5000); // every 5 seconds

  return () => clearInterval(intervalId);
}, []);

// Filter food list based on selected category
useEffect(() => {
  if (!Array.isArray(foodList)) {
    console.warn("⚠️ foodList is not an array:", foodList);
    setFilteredFoodList([]);
    return;
  }

  if (!category || category === "All") {
    setFilteredFoodList(foodList);
    return;
  }

  const categoryId = categories[category];
  if (!categoryId) {
    setFilteredFoodList([]);
    return;
  }

  const filtered = foodList.filter((item) => item.categoryId === categoryId);
  setFilteredFoodList(filtered);
}, [category, foodList, categories]);

const handleTabClick = (tab) => {
  setCategory(tab);
};

useEffect(() => {
  const shopId = localStorage.getItem("shopId");

  if (shopId) {
    axios
      .get(`http://localhost:8082/shop/shop-name/${shopId}`)
      .then((res) => setShopName(res.data))
      .catch((err) => console.error("Error fetching shop name:", err));
  }
}, []);

// useEffect(() => {
//   if (!foodList || !Array.isArray(foodList)) return;

//   if (currentCategory === "All") {
//     setFilteredFoodList(foodList);
//   } else {
//     const categoryId = categories[currentCategory];
//     const filtered = foodList.filter((item) => item.categoryId === categoryId);
//     setFilteredFoodList(filtered);
//   }
// }, [currentCategory, categories, foodList]);

// const handleCategorySelect = (categoryName) => {
//   setCurrentCategory(categoryName);
// };
// useEffect(() => {
//   if (currentCategory === "All") {
//     setFilteredFoodList(foodList);
//   } else {
//     const categoryId = categories[currentCategory];
//     const filtered = foodList.filter((item) => item.food_category_id === categoryId);
//     setFilteredFoodList(filtered);
//   }
// }, [currentCategory, categories, foodList]);

// // 🔍 Search Filtering
// useEffect(() => {
//   if (input) {
//     const filtered = foodList.filter(item =>
//       item.name.toLowerCase().includes(input.toLowerCase())
//     );
//     setFilteredFoodList(filtered);
//   } else {
//     setFilteredFoodList(foodList);
//     setCurrentCategory(null); // Reset category on empty search
//   }
// }, [input, foodList]);



// function filter(categoryId) {
//     if (categoryId === currentCategory) {
//       // If the category is already selected, reset to show all products
//       setFilteredFoodList(foodList);
//       setCurrentCategory(null); // Reset category selection
//     } else {
//       // Otherwise, filter the products based on the categoryId
//       const filtered = foodList.filter((item) => item.categoryId === categoryId);
//       setFilteredFoodList(filtered);
//       setCurrentCategory(categoryId); // Set the current selected category
//     }
//   }
  


// const getCategoryId = (categoryName) => {
//     // If categoryName is null or empty, we skip finding category by name and rely on the categoryId directly
//     if (!categoryName) {
//       return 0; // or any default ID that matches "All" categories or returns all items
//     }
  
//     // Check if categories array exists and filter by categoryName
//     const category = categories.find((cat) => cat.name.trim().toLowerCase() === categoryName.trim().toLowerCase());
    
//     console.log("Category object found: ", category);  // Debugging line
//     return category ? category.id : 0;  // Return ID or 0 if not found
//   };
  function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    setInput(query); // Update the input value

    // Filter the food list based on the query
    if (query) {
      const filtered = foodList.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
      setFilteredFoodList(filtered);
    } else {
      setFilteredFoodList(foodList); // Reset to all products when search is cleared
    }
  }
  const placeOrder = async () => {
    const tableNumber = localStorage.getItem("tableNumber");
    const shopId = localStorage.getItem("shopId");

    // const
    // let price = useSelector((state) => state.cart);
    // const token = localStorage.getItem("token");
    // const items = useSelector((state) => state.cart.items);
  
    // if (!token) {
    //   toast.error("You are not logged in! Please log in first.");
    //   return;
    // }
  
    if (!tableNumber) {
      toast.error("Table number is missing!");
      return;
    }
  
    // Ensure the cart is not empty
    if (!items || items.length === 0) {
      toast.error("Cart is empty! Please add items to the cart.");
      return;
    }
  
    // Prepare orderedProductNames and quantities
    const orderedProductNames = items.map(item => item.name);
    const quantity = items.map(item => item.qty);
    const price = items.map(item => item.price);
  
    // Calculate total price
    const totalPrice = items.reduce((total, item) => total + (item.price * item.qty), 0);
  
    // Construct orderDetails
    const orderDetails = {
      tableNumber: parseInt(tableNumber), 
      orderedProductNames: orderedProductNames,
      quantity: quantity,
      price : price,
      totalPrice: totalPrice,
      shopId:parseInt(shopId),
      orderType: orderType, // ✅ Add this line
      email: email, // ✅ Include this line
    };
  
    try {
      const response = await fetch("http://localhost:8082/orders/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const text = await response.text(); // Get raw string
const data = JSON.parse(text); // Parse manually

toast.success(
  <div>
    <strong>{data.message || "Order placed successfully!"}</strong> <br />
    Auto log out in 3s...
  </div>,
  {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }
);

      setTimeout(() => {
        dispatch(clearCart()); // Clear cart after order placement
        setShowCart(false);
  
        // localStorage.removeItem("token");
        localStorage.removeItem("tableNumber"); 
        // localStorage.getItem("shopId");

  
        // Refresh the page
        window.location.reload();
      }, 3000); // Delay refresh by 2 seconds (2000 ms)
  
  
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order.");
    }
  };
  



  
  
// let shopId = localStorage.getItem("shopId");

// let token = localStorage.getItem("token");


  let items = useSelector((state) => state.cart);

  

  let subtotal = items.reduce((total, item) => total + item.qty * item.price, 0);
let total = Math.floor(subtotal); // Rounded subtotal

// Calculate tax (5%)
const tax = Math.round(total * 0.05);

// Net total = subtotal + tax
const netTotal = total + tax;

 
   
  

  return (
    <div className="bg-slate-200 w-full min-h-screen">
  <Nav />
  <div className="section-header text-center mb-4">
              <h2>Our Menu</h2>
              <p>
        Check <strong>{shopName || "Selected Shop"}</strong>'s <span>Menu</span>
      </p>
            </div>

  {!input && (
    <div className="flex justify-center items-center pt-6">
      <Categories
        categories={categories}
        selectedCategory={category}
        onTabClick={handleTabClick}
      />
    </div>
  )}

  <div className="w-full flex flex-wrap gap-5 px-5 justify-center items-center pt-8 pb-8">
    {filteredFoodList && filteredFoodList.length > 0 ? (
      filteredFoodList.map((item) => (
        <Card
          key={item.id}
          name={item.name}
          image={`http://localhost:8082/images/product-images/${item.image}`}
          price={item.price}
          id={item.id}
          type={item.type}
          food_category_id={item.food_category_id}
        />
      ))
    ) : (
      <div className="text-center text-2xl text-green-500 font-semibold pt-5">
        No Dish Found!!
      </div>
    )}
  </div>
{/* </div> */}


      {/* Cart Drawer */}
      <div className={`w-full md:w-[40vw] h-[100%] fixed top-0 right-0 bg-white shadow-xl p-6 transition-all duration-500 flex flex-col items-center overflow-auto ${showCart ? "translate-x-0" : "translate-x-full"}`}>
        <header className='w-[100%] flex justify-between items-center'>
          <span className='text-green-400 text-[18px] font-semibold'>Order Items</span>
          <RxCross2 className='w-[30px] h-[30px] text-green-400 text-[18px] font-semibold cursor-pointer hover:text-gray-600' onClick={() => setShowCart(false)} />
        </header>

        {items.length > 0 ? <div className='w-full mt-9 flex flex-col gap-8'>
          {items.map((item) => (
            <Card2 key={item.id} name={item.name} price={item.price} image={item.image} id={item.id} qty={item.qty} />
          ))}</div> : <div className='text-center text-2xl text-green-500 font-semibold pt-5'>Empty Cart</div>}

        <div className='w-full border-t-2 border-b-2 border-gray-400 mt-7 flex flex-col gap-4 p-8'>
          <div className='w-full flex justify-between items-center'>
            <span className='text-lg text-gray-600 font-semibold'>Table_Number {tableNumber}</span>
            <span className='text-green-400 font-semibold text-lg'></span>
          </div>
          <div className='w-full flex justify-between items-center'>
          <span className='text-lg text-gray-600 font-semibold'>
         
            {items.map((item)=>(<div>{item.name}</div>))}
            </span> 
          {/* {categories.map((item) => ( */}
            <span className='text-green-400 font-semibold text-lg'>
            
          {items.map((item)=>(<div>x {item.qty}</div>))}
            </span>
          </div>
          {/* <div className='w-full flex justify-between items-center'>
            <span className='text-lg text-gray-600 font-semibold'>Taxes</span>
            <span className='text-green-400 font-semibold text-lg'>Kyat-/{taxes}</span>
          </div> */}
        </div>

        <div className="w-full p-9 flex flex-col gap-4 border-b-2 border-gray-400">
  {/* Tax */}
  <div className="flex justify-between items-center">
    <span className="text-2xl text-gray-600 font-semibold">Tax ( 5% )</span>
    <span className="text-green-400 font-semibold text-2xl">{tax} Ks</span>
  </div>

  {/* Total */}
  <div className="flex justify-between items-center">
    <span className="text-2xl text-gray-600 font-semibold">Total</span>
    <span className="text-green-400 font-semibold text-2xl">{netTotal} Ks</span>
  </div>
</div>
{/* <div className='w-full border-t-2 border-b-2 border-gray-400 mt-7 flex flex-col gap-4 p-8'> */}



        <div className="w-full flex flex-wrap justify-between items-center gap-6 px-9 py-6">
  {/* Order Type Selection */}
  <div className="flex gap-10 items-center text-xl text-gray-700">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="orderType"
        value="EatInShop"
        className="form-radio w-5 h-5 text-green-500"
        checked={orderType === "EatInShop"}
        onChange={() => setOrderType("EatInShop")}
      />
      Eat in Shop
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="orderType"
        value="TakeAway"
        className="form-radio w-5 h-5 text-green-500"
        checked={orderType === "TakeAway"}
        onChange={() => setOrderType("TakeAway")}
      />
      Take Away
    </label>
  </div>

  {/* Email Input */}
  <div className="w-full flex justify-center items-center py-6">
  <div className="flex flex-col items-center">
    <label className="text-xl text-gray-700 mb-2 font-semibold">Enter Gmail to get the Bill (Optional)</label>
    <input
      type="email"
      placeholder="your@gmail.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="p-3 border border-gray-300 rounded-xl text-lg w-[300px]"
      required
    /> 
  </div>
</div>

</div>


        {/* <button className='w-[80%] p-3 rounded-lg bg-green-500 text-white hover:bg-green-400 transition-all' onClick={(placeOrder) => {
          toast.success("Order Placed");
        }}>Place Order</button>
         */}
         
       <button className='w-[80%] p-3 rounded-lg bg-green-500 text-white hover:bg-green-400 transition-all' onClick={placeOrder}>
         Place Order
       </button>
      </div>
    </div>
  );
}

export default Home 
