"use client";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  return res.json();
};

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {}
          </p>
          <p className="text-lg">
            <span className="font-semibold">User ID:</span> {}
          </p>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
