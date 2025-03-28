// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function ProductDetails({ params }) {
//   const { seller, item } = params;
//   const [product, setProduct] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`https://your-backend.com/api/marketplace/item/${seller}/${item}`);
//         const data = await response.json();
//         setProduct(data);
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       }
//     };

//     fetchProduct();
//   }, [seller, item]);

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="bg-white shadow-lg p-6 rounded-lg max-w-3xl mx-auto">
//         <img src={product.image || "/default-item.png"} alt={product.name} className="w-full h-60 object-cover rounded" />
//         <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
//         <p className="text-gray-500">{product.brand}</p>
//         <p className="mt-2">{product.description}</p>
//         <p className="text-blue-600 font-bold text-xl">${product.cost}</p>
//         <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => router.push(`/checkout/${product.id}`)}>
//           Buy Now
//         </button>
//       </div>
//     </div>
//   );
// }
