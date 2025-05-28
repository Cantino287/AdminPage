import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     items: [],
//   };
  
const cartSlice = createSlice({
    name:"cart",
    initialState: [],
    
    reducers:{
        // AddItem:(state,action)=>{
        //     let existItem = state.find((item)=>item.id===action.payload.id)
        //     if(existItem){
        //         return state.map((item)=>(item.id===action.payload.id?{...item,qty:item.qty+1}:item))
        //     }else{
        //         state.push(action.payload)
        //     }
            
        // },
        AddItem: (state, action) => {
            // const token = localStorage.getItem("token"); // Check if user is logged in
            const tableNumber = localStorage.getItem("tableNumber");
            if (!tableNumber) {
              toast.error("Log in first to add dishes");
              return; // Prevent adding items to cart
            }
      
            // let existItem = state.find((item) => item.id === action.payload.id);
            // if (existItem) {
            //   existItem.qty += 1;
            // } else {
            //   state.items.push({ ...action.payload, qty: 1 });
            // }
            let existItem = state.find((item)=>item.id===action.payload.id)
            if(existItem){
                return state.map((item)=>(item.id===action.payload.id?{...item,qty:item.qty+1}:item))
            }else{
                state.push(action.payload)
            }
          },
        
        RemoveItem:(state,action)=>{
            return state.filter((item)=>item.id!==action.payload)
        },
        IncrementQty:(state,action)=>{
            return state.map((item)=>(item.id===action.payload?{...item,qty:item.qty+1}:item))
        },
        DecrementQty:(state,action)=>{
            return state.map((item)=>(item.id===action.payload?{...item,qty:item.qty-1}:item))
        },
        // clearCart: (state) => {
        //     state.items = []; // This will clear the cart
        //   },
          clearCart: (state) => {
            if (state.items) {
              state.items = [];  // Clear the cart if items exists
            }
          },
    },
    
})

export const { AddItem, RemoveItem, IncrementQty, DecrementQty,clearCart } = cartSlice.actions
export default cartSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: [],
  
//   reducers: {
//     AddItem: (state, action) => {
//       const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
//       if (itemIndex >= 0) {
//         state.items[itemIndex].qty += 1;
//       } else {
//         state.items.push({ ...action.payload, qty: 1 });
//       }
//     },
//     RemoveItem: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//     },
//     IncrementQty: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item) item.qty += 1;
//     },
//     DecrementQty: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item && item.qty > 1) {
//         item.qty -= 1;
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { AddItem, RemoveItem, IncrementQty, DecrementQty, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;
