import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Drone UTM</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
          Register
        </Link>
      </div>
    </nav>
  );
}
