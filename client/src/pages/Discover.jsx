import React, { useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { MapPin, Search, UserPlus } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";

export default function Discover() {
  const [input, setInpute] = useState("");
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (e) => {
    if (e.key === "enter") {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* titile  */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            Discover people
          </h1>
          <p className="text-slate-600">
            Connect with amazing people and grow your network{" "}
          </p>
        </div>

        {/* search  */}
        <div className=" mb-8 shadow-md rounded-md border  border-slate-200/60 bg-white/80">
          <div className="p-6">
            <div className="relative">
              <Search className=" absolute left-3 top-1/2  transform -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search the people across the world"
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
                onChange={(e) => setInpute(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {users.map((user) => (
            <UserCard user={user} key={user._id} />
          ))}
        </div>
        {loading && <Loading height="60vh" />}
      </div>
     
    </div>
  );
}
