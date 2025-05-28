import React from 'react';

import { RiDeleteBin6Line } from 'react-icons/ri';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { toast } from 'react-toastify';

import {
  DecrementQty,
  IncrementQty,
  RemoveItem,
} from '../redux/cartSlice';

function Card2({ name, id, price, image, qty }) {
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart.items); 
    const shopId = localStorage.getItem("shopId");
    // Get the cart items from Redux store
    
    // Handle placing the order
    // const placeOrder = async () => {
    //     const tableNumber = localStorage.getItem("tableNumber");
    //     const token = localStorage.getItem("token"); // Retrieve JWT token
      
    //     if (!token) {
    //       toast.error("You are not logged in! Please log in first.");
    //       return;
    //     }
      
    //     if (!tableNumber) {
    //       toast.error("Table number is missing!");
    //       return;
    //     }
      
    //     // Ensure that 'items' is an array, and check if it is not empty
    //     if (!items || items.length === 0) {
    //       toast.error("Cart is empty! Please add items to the cart.");
    //       return;
    //     }
      
    //     // Ensure orderedProductNames is a string and quantity is a number
    //     const orderDetails = {
    //         tableNumber: parseInt(tableNumber),  // Convert to integer
    //         orderedProductNames: items.map(item => item.name).join(', '),
    //         quantity: items.reduce((total, item) => total + item.qty, 0),
    //         totalPrice: parseFloat(items.reduce((total, item) => total + (item.price * item.qty), 0)).toFixed(2), // Convert to float
    //       };
          
      
    //     try {
    //       const response = await fetch("http://localhost:8082/orders/placeorder", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Authorization": `Bearer ${token}` // Ensure token is included
    //         },
    //         body: JSON.stringify(orderDetails),
    //       });console.log("Order Details:", orderDetails);
    
      
    //       if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //       }
      
    //       const data = await response.json();
    //       toast.success("Order placed successfully!");
    //       dispatch(clearCart()); // Clear cart after order placement
    //       setShowCart(false);
    //     } catch (error) {
    //       console.error("Error placing order:", error);
    //       toast.error("Failed to place order.");
    //     }
    //   };
      

    return (
        <div className='w-full h-[120px] p-2 shadow-lg flex justify-between '>
            <div className='w-[60%] h-full  flex gap-5'>
                <div className='w-[50%] h-full overflow-hidden rounded-lg'>
                    <img src={image} alt="" className='object-cover' />
                </div>
                <div className='w-[40%] h-full flex flex-col gap-3' >
                    <div className='text-md w-[120px] text-gray-600  font-semibold'>{name}</div>
                    <div className='w-[110px] md:h-[50px] bg-slate-400 flex rounded-lg overflow-hidden shadow-lg font-semibold border-2 border-green-400  text-xl'>
                        <button className='w-[30%] h-full bg-white flex justify-center items-center text-green-400 hover:bg-gray-400' onClick={() => {
                            qty > 1 ? dispatch(DecrementQty(id)) : 1;
                        }}>-</button>
                        <span className='w-[40%] h-full bg-slate-200 flex justify-center items-center text-green-400'>{qty}</span>
                        <button className='w-[30%] h-full bg-white flex justify-center items-center text-green-400 hover:bg-gray-400' onClick={() => {
                            dispatch(IncrementQty(id));
                        }}>+</button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-start items-end gap-6'>
                <span className='text-xl text-green-400 font-semibold'>{price} Ks</span>
                <RiDeleteBin6Line className='w-[30px] h-[30px] text-red-400 cursor-pointer' onClick={() => {
                    dispatch(RemoveItem(id));
                    toast.error("Item Removed");
                }} />
            </div>
        </div>
    );
}
export default Card2