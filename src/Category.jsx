
// import {
//   useEffect,
//   useState,
// } from 'react';

// import { CiBowlNoodles } from 'react-icons/ci';
// import {
//   GiFullPizza,
//   GiHamburger,
// } from 'react-icons/gi';
// import {
//   MdOutlineFoodBank,
//   MdOutlineFreeBreakfast,
// } from 'react-icons/md';
// import { TbSoup } from 'react-icons/tb';
// import { TiThSmallOutline } from 'react-icons/ti';

// const iconMap = {
//   all: <TiThSmallOutline className="w-[60px] h-[60px] text-green-600" />,
//   breakfast: <MdOutlineFreeBreakfast className="w-[60px] h-[60px] text-green-600" />,
//   soups: <TbSoup className="w-[60px] h-[60px] text-green-600" />,
//   pasta: <CiBowlNoodles className="w-[60px] h-[60px] text-green-600" />,
//   main_course: <MdOutlineFoodBank className="w-[60px] h-[60px] text-green-600" />,
//   pizza: <GiFullPizza className="w-[60px] h-[60px] text-green-600" />,
//   burger: <GiHamburger className="w-[60px] h-[60px] text-green-600" />,
// };

// const Categories = () => {
//   const [categories, setCategories] = useState([]);



// useEffect(() => {
//     const token = localStorage.getItem("token"); // ✅ Retrieve stored JWT token
//     console.log("JWT Token:", token); // ✅ Debugging output

//     fetch("http://localhost:8082/category/get", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": token ? `Bearer ${token}` : "", // ✅ Ensure JWT is sent
//         },
//     })
//     .then((response) => {
//         console.log("Response Status:", response.status); // ✅ Debug HTTP status
//         return response.json();
//     })
//     .then((data) => {
//         console.log("Categories Data:", data); // ✅ Debug API response
//         setCategories(data);
//     })
//     .catch((error) => {
//         console.error("Error fetching categories:", error);
//     });
// }, []);
//   return (
//     <div className="flex gap-4">
//       {categories.map((category) => (
//         <div key={category.id} className="flex flex-col items-center">
//           {iconMap[category.name.toLowerCase()] || iconMap["all"]}
//           <p className="text-green-600 text-lg">{category.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Categories;

// import {
//   useEffect,
//   useState,
// } from 'react';

// const Categories = ({ setCategory }) => {
//   const [categories, setCategories] = useState([]);
//   const [category, setCategoryState] = useState("All");

//   useEffect(() => {
//     const token = localStorage.getItem("token"); // ✅ Retrieve stored JWT token
//     console.log("JWT Token:", token); // ✅ Debugging output

//     fetch("http://localhost:8082/category/get", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": token ? `Bearer ${token}` : "", // ✅ Ensure JWT is sent
//         },
//     })
//     .then((response) => {
//         console.log("Response Status:", response.status); // ✅ Debug HTTP status
//         return response.json();
//     })
//     .then((data) => {
//         console.log("Categories Data:", data); // ✅ Debug API response
//         setCategories(data);
//     })
//     .catch((error) => {
//         console.error("Error fetching categories:", error);
//     });
// }, []);

//   return (
//     <div className="explore-menu-list flex gap-4">
//       {categories.map((item, index) => (
//         <div
//           key={index}
//           onClick={() => {
//             setCategory((prev) => (prev === item.name ? "All" : item.name));
//             setCategoryState(item.name); // Update category filter state
//           }}
//           className="explore-menu-list-item flex flex-col items-center cursor-pointer"
//         >
//           <img
//             className={category === item.name ? "active" : ""}
//             src={`http://localhost:8082/images/${item.image}`} // Correct URL format for images
//             onError={(e) => { e.target.src = "/fallback-image.jpg"; }} // Handles broken images
//             alt={item.name}
//           />
//           <p className="text-green-600 text-lg">{item.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Categories;

import './category.css';

// Categories.jsx
// Categories.jsx
import React from 'react';

const Categories = ({ categories, selectedCategory, onTabClick }) => {
  return (
    <div className="explore-menu-list flex gap-4">
      <ul
        className="nav nav-tabs justify-content-center gap-4"
        data-aos="fade-up"
        data-aos-delay="200"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {["All", ...Object.keys(categories)].map((cat) => (
          <li className="nav-item" key={cat}>
            <button
              className={`nav-link ${selectedCategory === cat ? "active show" : ""}`}
              onClick={() => onTabClick(cat)}
            >
              <h4 className="mb-0">{cat}</h4>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;




// import './category.css';

// import {
//   useEffect,
//   useState,
// } from 'react';

// const Categories = ({ setCategory }) => {
//   const [categories, setCategories] = useState([]);
//   const [categoryId, setCategoryId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token"); // Retrieve stored JWT token

//     fetch("http://localhost:8082/category/get", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": token ? `Bearer ${token}` : "",
//         },
//     })
//     .then((response) => response.json())
//     .then((data) => setCategories(data))
//     .catch((error) => console.error("Error fetching categories:", error));
//   }, []);

//   const handleCategoryClick = (item) => {
//     setCategoryId((prev) => (prev === item.id ? null : item.id)); 
//     setCategory(item.id ? item.id : null); 
//   };

//   return (
//     <div className="explore-menu-list flex gap-4">
//       {categories.map((item) => (
//         <div
//           key={item.id} 
//           onClick={() => handleCategoryClick(item)}
//           className="explore-menu-list-item flex flex-col items-center cursor-pointer"
//         >
//           {/* <img
//             className={`category-image ${categoryId === item.id ? "active" : ""}`}
//             src={`http://localhost:8082/images/shop-images/${item.image}`}
//             onError={(e) => { e.target.src = "/fallback-image.jpg"; }} 
//             alt={item.name}
//           /> */}
//           <p className="text-green-600 text-lg">{item.name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Categories;
