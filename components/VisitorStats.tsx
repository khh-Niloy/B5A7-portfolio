"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconChartBar, IconUsers } from "@tabler/icons-react";
import getVisitorStats from "@/helper/getVisitorStats";
import getMe from "@/helper/getMe";

interface IVisitorStat {
  _id: string;
  date: string;
  count: number;
}

export default function VisitorStats() {
  const [stats, setStats] = useState<IVisitorStat[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getMe();
        if (me) {
          setIsLoggedIn(true);
          const data = await getVisitorStats();
          setStats(data || []);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (!isLoggedIn || loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group">
            <IconChartBar className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium">
              Visitor Stats
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-[#0a0f1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <IconUsers className="text-blue-500" />
              Visitor Statistics
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {stats.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No visitor data available yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div
                    key={stat._id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <span className="text-gray-300 font-medium">{stat.date}</span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                      {stat.count} visits
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
