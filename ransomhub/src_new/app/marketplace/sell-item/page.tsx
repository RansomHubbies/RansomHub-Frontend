"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellItem() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    seller: "",
    description: "",
    cost: "",
    delivery: "Pickup",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setForm({ ...form, image: e.target.files[0] });
//     }
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, (form as any)[key]);
    });

    try {
      const response = await fetch("https://your-backend.com/api/marketplace/list-item/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to list item");

      router.push("/marketplace");
    } catch (error) {
      console.error("Error listing item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white w-full shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between py-4 px-1">
          <h1 className="text-xl font-semibold text-gray-800">MarketPlace</h1>
          <div className="space-x-6 text-gray-600">
            <Link href="/marketplace/" className="hover:text-blue-600 transition">Buy Item</Link>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Home</Link>
          </div>
        </div>
      </nav>
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Sell an Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" required onChange={handleChange} className="border w-full p-2 rounded" />
          <input type="text" name="brand" placeholder="Brand" required onChange={handleChange} className="border w-full p-2 rounded" />
          <input type="text" name="seller" placeholder="Seller Name" required onChange={handleChange} className="border w-full p-2 rounded" />
          <textarea name="description" placeholder="Description" required onChange={handleChange} className="border w-full p-2 rounded"></textarea>
          <input type="number" name="cost" placeholder="Cost ($)" required onChange={handleChange} className="border w-full p-2 rounded" />
          <select name="delivery" onChange={handleChange} className="border w-full p-2 rounded">
            <option>Pickup</option>
            <option>Shipping</option>
            <option>Both</option>
          </select>
          <input type="file" accept="image/*" required  className="border w-full p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" disabled={loading}>
            {loading ? "Listing..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
