"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchMarketplaceItems } from "../api"; // ✅ Import API call

// ✅ Define the TypeScript interface for an item
interface Item {
  id: number;
  name: string;
  brand: string;
  seller: string;
  cost: number;
  image: string;
}

export default function Marketplace() {
  const [items, setItems] = useState<Item[]>([]); // ✅ Set correct type
  const [searchQuery, setSearchQuery] = useState<string>(""); // ✅ Define type for search query
  const [currentPage, setCurrentPage] = useState<number>(1); // ✅ Define type for pagination
  const [totalPages, setTotalPages] = useState<number>(1);

  // ✅ Fake Data (For Testing)
  const fakeItems: Item[] = [
    { id: 1, name: "GoPro Hero 10", brand: "GoPro", seller: "ActionCam", cost: 499, image: "/gopro.jpg" },
    { id: 2, name: "NVIDIA RTX 3080", brand: "NVIDIA", seller: "PCMaster", cost: 699, image: "/rtx3080.jpg" }
  ];

  useEffect(() => {
    const getItems = async () => {
      // ✅ Uncomment this when the backend is ready
      // const data = await fetchMarketplaceItems(searchQuery, currentPage);
      // setItems(data.items);
      // setTotalPages(data.totalPages);

      // ✅ For now, using Fake Data
      setItems(fakeItems);
      setTotalPages(1);
    };

    getItems();
  }, [searchQuery, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // ✅ Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between py-4 px-1">
          <h1 className="text-xl font-semibold text-gray-800">MarketPlace</h1>
          <div className="space-x-6 text-gray-600">
            <Link href="/marketplace/sell-item" className="hover:text-blue-600 transition">Sell Item</Link>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Home</Link>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto py-4">
        <div className="max-w-md mx-1 py-4 flex justify-start">
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
      </div>


      {/* Items List */}
      <div className="max-w-5xl mx-auto py-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/${item.seller}-${item.name.replace(/\s+/g, "-")}`}>
                <div className="bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition cursor-pointer">
                  <img src={item.image || "/default-item.png"} alt={item.name} className="w-full h-40 object-cover rounded" />
                  <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                  <p className="text-gray-500">{item.brand}</p>
                  <p className="text-blue-600 font-bold">${item.cost}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-6 ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Previous
          </button>

          <p className="text-gray-700">Page {currentPage} of {totalPages}</p>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
