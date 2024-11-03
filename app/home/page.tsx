"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Page = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3001/api/products");
    if (!response.ok) {
      console.error("Failed to fetch products. Status:", response.status);
      return;
    }
    const data = await response.json();
    setFeaturedProducts(data);
  };

  const handleCreateProducts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, image, category }),
    });

    if (response.ok) {
      // Optionally clear the input fields or fetch the updated categories
      fetchProducts();
      setName("");
      setPrice("");
      setImage("");
      setCategory("");
    } else {
      console.error("Failed to create products. Status:", response.status);
    }
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
            <div className="flex-1 max-w-lg mx-8">
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
              <Link
                href="/category"
                className="text-gray-600 hover:text-fuchsia-600"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-gray-600 hover:text-fuchsia-600"
              >
                Deals
              </Link>
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

      {/* Hero Section */}
      <div className="bg-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to TechShop</h1>
            <p className="text-xl mb-8">
              Discover the latest in technology and electronics
            </p>
            <button className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Input Form to create category */}
      <div className="container mx-auto">
        <div className="xl:w-[100%]">
          <form onSubmit={handleCreateProducts} className="mb-8 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 font-primary">
              <Input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <Input
                type="text"
                placeholder="Category Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded"
              />
              <Input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <Input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="bg-fuchsia-600 text-primary p-2 rounded-full w-[300px]"
              >
                Create Products
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id || index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.category}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-fuchsia-600">
                    ${product.price}
                  </span>
                  <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
