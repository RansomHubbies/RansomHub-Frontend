"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// TypeScript interface for an item (similar to the one in Marketplace)
interface Item {
  id: string;
  title: string;
  price: string;
  description?: string;
  category?: number;
  category_name?: string;
  seller: {
    id: number;
    username: string;
    email: string;
    profile_picture?: string;
  };
  primary_image?: string | null;
  images?: string[];
  status?: string;
}

// API function to fetch item details (you'll need to implement this in your API file)
const fetchItemDetails = async (id: string): Promise<Item> => {
  const response = await fetch(`/api/marketplace/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item details');
  }
  return response.json();
};

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItemDetails = async () => {
      try {
        setIsLoading(true);
        const itemDetails = await fetchItemDetails(itemId);
        setItem(itemDetails);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      loadItemDetails();
    }
  }, [itemId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!item) {
    return <div className="text-center mt-10">Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Image Section */}
        <div className="w-1/2 p-6">
          <Image 
            src={item.primary_image || "/default-item.png"} 
            alt={item.title}
            width={500}
            height={500}
            className="w-full h-96 object-cover rounded-lg"
          />
          {/* Optional: Additional image gallery can be added here */}
        </div>

        {/* Item Details Section */}
        <div className="w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.title}</h1>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-bold text-blue-600">${item.price}</p>
            {item.status && (
              <span 
                className={`px-3 py-1 rounded text-sm ${
                  item.status === 'sold' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {item.status}
              </span>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Category: {item.category_name || 'Uncategorized'}</p>
          </div>

          {item.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Seller Information</h2>
            <div className="flex items-center">
              {item.seller.profile_picture && (
                <Image 
                  src={item.seller.profile_picture} 
                  alt={item.seller.username}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
              )}
              <div>
                <p className="font-medium">{item.seller.username}</p>
                <p className="text-gray-500">{item.seller.email}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              // Add purchase/contact logic here
            >
              Contact Seller
            </button>
            <button 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              // Add purchase/cart logic here
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}