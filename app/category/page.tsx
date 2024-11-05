"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  category: string;
  image: string;
}

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

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

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Categories
        </h1>

        {/* Input Form to create category */}
        <div className="container mx-auto xl:mx-[320px]">
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
        </div>

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
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
    </div>
  );
};

export default Page;
