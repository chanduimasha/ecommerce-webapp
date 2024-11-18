"use client";

import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, ReactNode } from "react";

// Export CartItem so it can be used in other files
export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  seller: string;
  quantity: number;
}

interface CartContextType {
  cart: { cartItems: CartItem[] };
  addItemToCart: (item: CartItem) => Promise<void>;
  deleteItemFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<{ cartItems: CartItem[] }>({ cartItems: [] });

  const router = useRouter();

  useEffect(() => {
    setCartToState();
  }, []);

  const setCartToState = () => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : { cartItems: [] });
  };

  const addItemToCart = async (item: CartItem) => {
    const isItemExist = cart?.cartItems?.find((i) => i.product === item.product);

    let newCartItems;

    if (isItemExist) {
      newCartItems = cart?.cartItems?.map((i) =>
        i.product === isItemExist.product ? item : i
      );
    } else {
      newCartItems = [...(cart?.cartItems || []), item];
    }

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  const deleteItemFromCart = (id: string) => {
    const newCartItems = cart?.cartItems?.filter((i) => i.product !== id);

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;