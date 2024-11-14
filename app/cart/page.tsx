// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ShoppingCart, TrashIcon, Plus, Minus } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface CartItem {
//   _id: string;
//   productId: string;
//   name: string;
//   price: number;
//   image: string;
//   quantity: number;
// }

// const Page = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const fetchCartItems = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/api/cart");
//       if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//       }
//       const data = await response.json();
//       setCartItems(data);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
//     if (newQuantity < 1) return;
//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `http://localhost:3001/api/cart/${item.productId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ quantity: newQuantity }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update quantity");
//       }

//       // Update local state immediately for better UX
//       setCartItems((prevItems) =>
//         prevItems.map((cartItem) =>
//           cartItem.productId === item.productId
//             ? { ...cartItem, quantity: newQuantity }
//             : cartItem
//         )
//       );

//       // Fetch updated cart items
//       fetchCartItems();
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRemoveFromCart = async (itemId: string) => {
//     try {
//       const response = await fetch(`http://localhost:3001/api/cart/${itemId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to remove item");
//       }

//       setCartItems((prevItems) =>
//         prevItems.filter((item) => item._id !== itemId)
//       );
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//     }
//   };

//   const calculateItemTotal = (price: number, quantity: number) => {
//     return price * quantity;
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return (
//         total + calculateItemTotal(Number(item.price), Number(item.quantity))
//       );
//     }, 0);
//   };

//   return (
//     <div className="container mx-auto py-8 bg-slate-300">
//       <h1 className="text-3xl font-bold mb-6 text-primary">
//         <ShoppingCart className="inline-block mr-2" /> Shopping Cart
//       </h1>

//       {cartItems.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500 text-lg">Your cart is empty.</p>
//           <Button
//             onClick={() => router.push("/home")}
//             className="mt-4 bg-fuchsia-600 text-white"
//           >
//             Continue Shopping
//           </Button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
//             >
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div>
//                   <h3 className="text-lg font-medium text-primary">
//                     {item.name}
//                   </h3>
//                   <p className="text-gray-500">
//                     ${Number(item.price).toFixed(2)} each
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex flex-col items-end mx-10">
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       onClick={() =>
//                         handleUpdateQuantity(item, Number(item.quantity) - 1)
//                       }
//                       className="p-1 px-5"
//                       disabled={item.quantity <= 1 || isLoading}
//                     >
//                       <Minus className="w-4 h-4" />
//                     </Button>

//                     <span className="w-8 text-center text-primary">
//                       {item.quantity}
//                     </span>
//                     {/* <span className="w-8 text-center text-primary">|</span> */}

//                     <Button
//                       onClick={() =>
//                         handleUpdateQuantity(item, Number(item.quantity) + 1)
//                       }
//                       className="p-1 px-5"
//                       disabled={isLoading}
//                     >
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Total: $
//                     {calculateItemTotal(
//                       Number(item.price),
//                       Number(item.quantity)
//                     ).toFixed(2)}
//                   </p>
//                 </div>

//                 <Button
//                   onClick={() => handleRemoveFromCart(item._id)}
//                   className="bg-red-600 hover:bg-red-900 mb-5"
//                   disabled={isLoading}
//                 >
//                   <TrashIcon className="w-5 h-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}

//           <div className="mt-6 bg-white rounded-lg shadow-md p-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-medium">Cart Total:</span>
//               <span className="text-xl font-bold">
//                 ${calculateTotal().toFixed(2)}
//               </span>
//             </div>

//             <div className="mt-4 flex justify-end space-x-4">
//               <Button
//                 onClick={() => router.push("/home")}
//                 variant="outline"
//                 className="bg-gray-50 text-gray-800"
//               >
//                 Continue Shopping
//               </Button>
//               <Button
//                 onClick={() => router.push("/checkout")}
//                 className="bg-fuchsia-600 text-white"
//               >
//                 Proceed to Checkout
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, TrashIcon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Page = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/cart/${item.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );

      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateItemTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return (
        total + calculateItemTotal(Number(item.price), Number(item.quantity))
      );
    }, 0);
  };

  return (
    <div className="container mx-auto py-8 bg-slate-300">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        <ShoppingCart className="inline-block mr-2" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <Button
            onClick={() => router.push("/home")}
            className="mt-4 bg-fuchsia-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-medium text-primary">
                    {item.name}
                  </h3>
                  <p className="text-gray-500">
                    ${Number(item.price).toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mx-10">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() =>
                        handleUpdateQuantity(item, Number(item.quantity) - 1)
                      }
                      className="p-1 px-5"
                      disabled={item.quantity <= 1 || isLoading}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="w-8 text-center text-primary">
                      {item.quantity}
                    </span>

                    <Button
                      onClick={() =>
                        handleUpdateQuantity(item, Number(item.quantity) + 1)
                      }
                      className="p-1 px-5"
                      disabled={isLoading}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: $
                    {calculateItemTotal(
                      Number(item.price),
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>

                <Button
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="bg-red-600 hover:bg-red-900 mb-5"
                  disabled={isLoading}
                >
                  <TrashIcon className="w-5 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Cart Total:</span>
              <span className="text-xl font-bold">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex flex-col space-y-3">
              <div className="text-center text-2xl font-semibold text-fuchsia-600">
                Total amount: ${calculateTotal().toFixed(2)}
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => router.push("/home")}
                  variant="outline"
                  className="bg-gray-50 text-gray-800"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => router.push("/checkout")}
                  className="bg-fuchsia-600 text-white"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;