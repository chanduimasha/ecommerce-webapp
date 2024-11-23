"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import CategoryModel from "@/components/CategoryModel";

interface Category {
  id: string;
  category: string;
  image: string;
}

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:3001/api/categories");
    if (!response.ok) {
      console.error("Failed to fetch categories. Status:", response.status);
      return;
    }
    const data = await response.json();
    setCategories(data);
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, image }),
    });

    if (response.ok) {
      // Optionally clear the input fields or fetch the updated categories
      fetchCategories();
      setImage("");
      setCategory("");
    } else {
      console.error("Failed to create category. Status:", response.status);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Categories - TechShop</title>
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
                Create Categories
              </button>
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

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Categories
        </h1>

        {/* Input Form to create category */}
        {/* <div className="container mx-auto xl:mx-[320px]">
          <div className="xl:w-[50%]">
            <form onSubmit={handleCreateCategory} className="mb-8">
              <div className="flex flex-col gap-2 font-primary">
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
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <Button
                  type="submit"
                  className="bg-fuchsia-600 text-primary p-2 rounded-full"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter((category) =>
                category.category
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.category}
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <CategoryModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={fetchCategories}
      />
    </div>
  );
};

export default Page;
