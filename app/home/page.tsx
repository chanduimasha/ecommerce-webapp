"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductModal from "@/components/ProductModal";
import ProductModel from "@/server/model/Products";

interface Product {
  _id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

const Page = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3001/api/products");
    if (!response.ok) {
      console.error("Failed to fetch products. Status:", response.status);
      return;
    }
    const data = await response.json();
    setFeaturedProducts(data);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch("http://localhost:3001/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
      console.log("Item added to cart successfully");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/products/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      setFeaturedProducts((prevItems) =>
        prevItems.filter((product) => product._id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleViewCart = () => {
    router.push("/cart");
  };

  const handleProductClick = (productId: number) => {
    router.push(`/home/${productId}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>TechShop - Your Electronics Store</title>
        <meta name="description" content="Find the best electronics products" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-fuchsia-600">
                TechShop
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 text-primary">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-gray-600 hover:text-fuchsia-600"
              >
                Create Products
              </button>
              <Link
                href="/category"
                className="text-gray-600 hover:text-fuchsia-600"
              >
                Categories
              </Link>
              {/* <Link
                href="/deals"
                className="text-gray-600 hover:text-fuchsia-600"
              >
                Deals
              </Link> */}
              <Link
                href="/cart"
                className="relative text-gray-600 hover:text-fuchsia-600"
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-fuchsia-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="bg-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to TechShop</h1>
            <p className="text-xl mb-8">
              Discover the latest in technology and electronics
            </p>
            <Link
              href="/category"
              className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts
            .filter((product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
              >
                <div onClick={() => handleProductClick(product._id)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-fuchsia-600">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">{product.category}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-fuchsia-600">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-[70%] bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition-colors"
                  >
                    <ShoppingCart className="mx-2" size={20} />
                    Add to Cart
                  </Button>
                  <span className="px-3"></span>
                  <Button
                    onClick={() => handleRemove(product._id)}
                    className="w-[20%] bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-900 transition-colors"
                  >
                    <TrashIcon className="w-5 h-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Cart Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={handleViewCart}
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-fuchsia-700 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={fetchProducts}
      />
    </div>
  );
};

export default Page;
