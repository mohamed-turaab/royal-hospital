import React, { useState, useEffect } from "react";
import { getRooms } from "../services/roomService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { DoorOpen, User, CreditCard, Activity, Plus } from "lucide-react";

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const canManageRooms = user?.role === "Admin";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-emerald-50/70 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30";
      case "Occupied": return "bg-rose-50/70 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30";
      case "Maintenance": return "bg-amber-50/70 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30";
      default: return "bg-navyBlue-50/70 text-navyBlue-600 border-navyBlue-200 dark:bg-navyBlue-500/10 dark:text-navyBlue-400 dark:border-navyBlue-500/30";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "VIP": return <CreditCard className="w-5 h-5 text-purple-500" />;
      case "ICU": return <Activity className="w-5 h-5 text-red-500" />;
      default: return <DoorOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navyBlue-900 dark:text-white">
            Hospital Room Management
          </h1>
          <p className="text-navyBlue-500 dark:text-royalBlue-300 mt-1 font-medium">Monitor and manage hospital room allocations</p>
        </div>
        {canManageRooms && (
          <button className="flex items-center gap-2 bg-royalBlue hover:bg-royalBlue-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-royalBlue/20 font-bold">
            <Plus className="w-5 h-5" />
            <span>Add New Room</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white dark:bg-navyBlue-900/50 border border-navyBlue-100 dark:border-navyBlue-800 rounded-[28px] p-6 hover:border-royalBlue/50 transition-all duration-500 hover:shadow-2xl hover:shadow-royalBlue/10 backdrop-blur-xl shadow-md"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-navyBlue-50 dark:bg-navyBlue-800 rounded-xl group-hover:bg-royalBlue/10 transition-colors">
                {getTypeIcon(room.type)}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-black text-navyBlue-900 dark:text-white">Room {room.roomNumber}</h3>
                <p className="text-navyBlue-500 dark:text-royalBlue-300 text-sm font-bold mt-1">{room.type} Room</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-navyBlue-50 dark:border-navyBlue-800">
                <div className="flex items-center gap-2 text-navyBlue-700 dark:text-navyBlue-300 font-bold">
                  <User className="w-4 h-4 text-royalBlue" />
                  <span className="text-sm">
                    {room.currentPatient ? room.currentPatient.name : "Unoccupied"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-royalBlue dark:text-royalBlue-400 font-black text-lg">${room.pricePerDay}</span>
                  <span className="text-navyBlue-400 dark:text-navyBlue-500 text-[9px] block uppercase font-black tracking-widest">Per Day</span>
                </div>
              </div>
            </div>

            {/* Hover Effect Glow */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-royalBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
