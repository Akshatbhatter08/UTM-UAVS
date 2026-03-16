import { useState } from "react";

export default function Dashboard() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/flightplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ source, destination }),
    });

    if (res.ok) alert("Flight plan submitted successfully!");
    else alert("Error submitting flight plan!");
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Submit Flight Plan</h2>
        <input
          type="text"
          placeholder="Source Address"
          className="border w-full p-2 mb-4"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination Address"
          className="border w-full p-2 mb-4"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700">
          Submit
        </button>
      </form>
    </div>
  );
}
