import {
  useEffect,
  useState,
} from 'react';

import Card from './Card'; // Import your Card component

const Menu = ({ category }) => {
  const [foodList, setFoodList] = useState([]);
  const [filteredFoodList, setFilteredFoodList] = useState([]);

  // Fetch the food menu based on the category when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    fetch("http://localhost:8082/food/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "", // Ensure JWT token is passed
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFoodList(data); // Set the fetched food list
      })
      .catch((error) => console.error("Error fetching food items:", error));
  }, []);

  // Filter food list based on the selected category
  useEffect(() => {
    const categoryId = getCategoryId(category); // Convert category name to ID
    console.log(`🔎 Filtering: category=${category} (ID=${categoryId})`);

    if (category === "All" || categoryId === 0) {
      setFilteredFoodList(foodList); // Show all food items if "All" or no category
    } else {
      const filtered = foodList.filter(item => {
        console.log(`Checking item: item.categoryId=${item.categoryId}, expected=${categoryId}`);
        return parseInt(item.categoryId) === categoryId; // Filter by categoryId
      });
      setFilteredFoodList(filtered);
    }
  }, [category, foodList]); // Re-run this effect when category or foodList changes

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes Near You</h2>
      <div className="food-display-list">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              name={item.name}
              image={`http://localhost:8082/images/${item.image}`}
              price={item.price}
              type={item.type}
              categoryId={item.categoryId} // Pass categoryId to Card
            />
          ))
        ) : (
          <p>No food items available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
