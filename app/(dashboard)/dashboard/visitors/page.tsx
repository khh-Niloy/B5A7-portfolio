"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Users,
  Clock,
  Globe,
  Search,
  Trash2,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  UserCheck,
  Compass,
  ShieldAlert,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
  Cpu,
  HardDrive,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { getVisitorStats } from "@/actions/visitor/getVisitorStats";
import { getVisitorLogs } from "@/actions/visitor/getVisitorLogs";
import { deleteVisitorLog } from "@/actions/visitor/deleteVisitorLog";
import { clearVisitorLogs } from "@/actions/visitor/clearVisitorLogs";
import type {
  VisitorStatsResponse,
  VisitorLogItem,
} from "@/interfaces/interface";

// Format duration helper
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "< 1s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (mins < 60) {
    return `${mins}m ${remainingSecs > 0 ? `${remainingSecs}s` : ""}`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

// Relative time helper
function formatTimeAgo(dateString: string): string {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VisitorsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  // Stats state
  const [stats, setStats] = useState<VisitorStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Logs state
  const [logs, setLogs] = useState<VisitorLogItem[]>([]);
  const [logsMeta, setLogsMeta] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [botFilter, setBotFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inspect Modal
  const [selectedLog, setSelectedLog] = useState<VisitorLogItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState<boolean>(false);

  // Load stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await getVisitorStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load visitor stats:", err);
      toast.error("Failed to load visitor analytics");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load logs
  const fetchLogs = useCallback(
    async (pageToLoad = currentPage) => {
      setLoadingLogs(true);
      try {
        const res = await getVisitorLogs({
          page: pageToLoad,
          limit: 20,
          searchTerm: activeSearch || undefined,
          deviceType: deviceFilter !== "all" ? deviceFilter : undefined,
          isBot: botFilter !== "all" ? botFilter : undefined,
          country: countryFilter !== "all" ? countryFilter : undefined,
        });

        if (res) {
          setLogs(res.data);
          setLogsMeta(res.meta);
        }
      } catch (err) {
        console.error("Failed to load visitor logs:", err);
        toast.error("Failed to load visitor logs");
      } finally {
        setLoadingLogs(false);
      }
    },
    [currentPage, activeSearch, deviceFilter, botFilter, countryFilter]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [fetchLogs, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery.trim());
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveSearch("");
    setDeviceFilter("all");
    setBotFilter("all");
    setCountryFilter("all");
    setCurrentPage(1);
  };

  // Delete single log
  const handleDeleteLog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    setDeletingId(id);
    try {
      const res = await deleteVisitorLog(id);
      if (res?.success) {
        toast.success("Visitor log deleted");
        setLogs((prev) => prev.filter((item) => item._id !== id));
        setLogsMeta((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
        if (selectedLog?._id === id) {
          setSelectedLog(null);
        }
      } else {
        toast.error(res?.message || "Failed to delete log");
      }
    } catch {
      toast.error("Error deleting log");
    } finally {
      setDeletingId(null);
    }
  };

  // Clear bot logs
  const handleClearBots = async () => {
    if (
      !confirm(
        "Clear all detected bot and automated web scraper logs from the database?"
      )
    )
      return;
    setClearing(true);
    try {
      const res = await clearVisitorLogs("bots");
      if (res?.success) {
        toast.success(res.message || "Bot logs cleared");
        fetchStats();
        fetchLogs(1);
      } else {
        toast.error(res?.message || "Failed to clear logs");
      }
    } catch {
      toast.error("Error clearing bot logs");
    } finally {
      setClearing(false);
    }
  };

  // Render SVG Daily Bar Chart
  const renderDailyChart = () => {
    if (!stats?.daily || stats.daily.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
          No historical visitor records yet.
        </div>
      );
    }

    const data = stats.daily;
    const maxVal = Math.max(...data.map((d) => d.count), 1);
    const chartHeight = 160;
    const barWidth = 24;
    const gap = 16;
    const totalSvgWidth = data.length * (barWidth + gap);

    return (
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        <svg
          viewBox={`0 0 ${Math.max(totalSvgWidth, 600)} ${chartHeight + 40}`}
          className="w-full h-48 min-w-[550px]"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {data.map((item, index) => {
            const h = Math.max(Math.round((item.count / maxVal) * chartHeight), 6);
            const x = index * (barWidth + gap) + 12;
            const y = chartHeight - h + 10;
            const isHighest = item.count === maxVal && maxVal > 0;
            const displayDate = item.date.split("-").slice(1).join("/");

            return (
              <g key={item.date || index} className="group cursor-pointer">
                <title>{`${item.date}: ${item.count} visitors`}</title>
                {/* Background column highlight */}
                <rect
                  x={x - 4}
                  y={10}
                  width={barWidth + 8}
                  height={chartHeight}
                  fill="transparent"
                  className="group-hover:fill-white/5 transition-colors"
                  rx={4}
                />
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={4}
                  fill={isHighest ? "url(#peakGradient)" : "url(#barGradient)"}
                  className="transition-all duration-300 group-hover:opacity-90"
                />
                {/* Count badge on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={Math.max(y - 6, 12)}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="600"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {item.count}
                </text>
                {/* Date label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11"
                  className="group-hover:fill-white transition-colors"
                >
                  {displayDate}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                Visitors & Audit Logs
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Audited traffic metrics, geographic footprints, user environments, and interaction logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Monitoring
          </div>

          <Button
            onClick={() => {
              fetchStats();
              fetchLogs();
              toast.success("Analytics refreshed");
            }}
            disabled={loadingStats || loadingLogs}
            variant="outline"
            className="border-white/10 bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/10 text-xs gap-2"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loadingStats || loadingLogs ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleClearBots}
            disabled={clearing}
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 text-xs gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            Clean Bots
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Visits */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Total Portfolio Visits
            </p>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">
            {stats ? stats.summary.totalVisits.toLocaleString() : "..."}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Aggregate count across all sessions</span>
          </div>
        </div>

        {/* Card 2: Today's Visits */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Today&apos;s Visitors
            </p>
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">
            {stats ? stats.summary.todayVisits.toLocaleString() : "..."}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-400 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Tracked for {new Date().toISOString().split("T")[0]}</span>
          </div>
        </div>

        {/* Card 3: Unique Visitors */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Unique Visitors
            </p>
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">
            {stats ? stats.summary.uniqueVisitors.toLocaleString() : "..."}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-violet-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Distinct client fingerprints</span>
          </div>
        </div>

        {/* Card 4: Average Duration */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
              Avg. Time on Page
            </p>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">
            {stats ? formatDuration(stats.summary.avgDuration) : "..."}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5" />
            <span>High engagement indicator</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-emerald-500 text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Analytics & Visual Trends
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 px-4 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "logs"
              ? "border-emerald-500 text-white"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          Activity Log Stream ({logsMeta.total})
        </button>
      </div>

      {/* TAB 1: Visual Analytics Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Daily Traffic Chart */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Daily Visitor Volume (Past 30 Days)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Chronological record of aggregate daily traffic
                </p>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  Standard Daily Traffic
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />
                  Peak Volume Day
                </span>
              </div>
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : (
              renderDailyChart()
            )}
          </div>

          {/* Grid: Breakdown panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Devices Panel */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Monitor className="w-4 h-4 text-emerald-400" />
                Device Breakdown
              </h4>
              <div className="space-y-3">
                {stats?.deviceBreakdown?.length ? (
                  stats.deviceBreakdown.map((item) => {
                    const totalDev =
                      stats.deviceBreakdown.reduce((sum, d) => sum + d.count, 0) || 1;
                    const percent = Math.round((item.count / totalDev) * 100);
                    const isMobile = item.name.toLowerCase() === "mobile";
                    const isTablet = item.name.toLowerCase() === "tablet";

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 capitalize flex items-center gap-1.5">
                            {isMobile ? (
                              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                            ) : isTablet ? (
                              <Tablet className="w-3.5 h-3.5 text-purple-400" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            {item.name}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {item.count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No device data available</p>
                )}
              </div>
            </div>

            {/* Top Countries Panel */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Globe className="w-4 h-4 text-sky-400" />
                Top Geographies
              </h4>
              <div className="space-y-3">
                {stats?.countryBreakdown?.length ? (
                  stats.countryBreakdown.slice(0, 5).map((item) => {
                    const totalCountry =
                      stats.countryBreakdown.reduce((s, c) => s + c.count, 0) || 1;
                    const percent = Math.round((item.count / totalCountry) * 100);

                    return (
                      <div key={item.country} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 truncate max-w-[150px] flex items-center gap-1.5">
                            <span>{item.countryFlag || "🌐"}</span>
                            <span>{item.country}</span>
                          </span>
                          <span className="text-gray-400 font-mono">
                            {item.count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No geolocation records yet</p>
                )}
              </div>
            </div>

            {/* Browsers Panel */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Compass className="w-4 h-4 text-violet-400" />
                Top Browsers
              </h4>
              <div className="space-y-3">
                {stats?.browserBreakdown?.length ? (
                  stats.browserBreakdown.slice(0, 5).map((item) => {
                    const totalBrowsers =
                      stats.browserBreakdown.reduce((s, b) => s + b.count, 0) || 1;
                    const percent = Math.round((item.count / totalBrowsers) * 100);

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 truncate max-w-[150px]">
                            {item.name}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {item.count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-violet-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No browser data available</p>
                )}
              </div>
            </div>

            {/* Top Pages Panel */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Layers className="w-4 h-4 text-amber-400" />
                Most Visited Pages
              </h4>
              <div className="space-y-3">
                {stats?.topPages?.length ? (
                  stats.topPages.slice(0, 5).map((item) => {
                    const totalPages =
                      stats.topPages.reduce((s, p) => s + p.count, 0) || 1;
                    const percent = Math.round((item.count / totalPages) * 100);

                    return (
                      <div key={item.pathname} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                            {item.pathname}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {item.count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No page metrics recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Detailed Activity Logs Stream */}
      {(activeTab === "logs" || activeTab === "overview") && (
        <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                Raw Activity Log Records ({logsMeta.total})
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Detailed audit trail with IP address, device fingerprints, visited routes, and engagement.
              </p>
            </div>

            {/* Filter controls */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 flex-wrap"
            >
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search IP, city, path..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder-gray-500 text-xs h-9 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Device Selector */}
              <select
                value={deviceFilter}
                onChange={(e) => {
                  setDeviceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#000319] border border-white/10 text-gray-300 text-xs rounded-lg px-2.5 h-9 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>

              {/* Bot Selector */}
              <select
                value={botFilter}
                onChange={(e) => {
                  setBotFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#000319] border border-white/10 text-gray-300 text-xs rounded-lg px-2.5 h-9 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Traffic</option>
                <option value="false">Humans Only</option>
                <option value="true">Bots Only</option>
              </select>

              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-9 px-3"
              >
                Filter
              </Button>

              {(activeSearch ||
                deviceFilter !== "all" ||
                botFilter !== "all" ||
                countryFilter !== "all") && (
                <Button
                  type="button"
                  onClick={handleResetFilters}
                  variant="ghost"
                  className="text-gray-400 hover:text-white text-xs h-9 px-2"
                >
                  Reset
                </Button>
              )}
            </form>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-gray-400 uppercase font-medium border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Origin & Location</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Route & Referrer</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Visited At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingLogs ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mx-auto" />
                      <p className="mt-3 text-xs">Loading activity logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-300">
                        No visitor logs match your filters.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try adjusting your search criteria or resetting filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isBot = log.isBot;
                    const isLocal = log.isLocalIp;

                    return (
                      <tr
                        key={log._id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Visitor Info */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {isBot ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                Bot
                              </span>
                            ) : log.isNewVisitor ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                New
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Return #{log.visitCount || 1}
                              </span>
                            )}
                            <span
                              className="font-mono text-gray-400 text-[11px] truncate max-w-[90px]"
                              title={log.visitorId}
                            >
                              {log.visitorId.slice(0, 8)}...
                            </span>
                          </div>
                        </td>

                        {/* Origin & IP */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-white font-medium flex items-center gap-1.5">
                              <span>{log.countryFlag || "🌐"}</span>
                              <span>
                                {isLocal
                                  ? "Local Network"
                                  : log.city && log.city !== "Unknown"
                                  ? `${log.city}, ${log.country}`
                                  : log.country || "Unknown"}
                              </span>
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              {log.ip} {log.isp ? `• ${log.isp}` : ""}
                            </span>
                          </div>
                        </td>

                        {/* Environment */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {log.deviceType === "mobile" ? (
                              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span className="text-gray-300">
                              {log.browserName || "Unknown"}
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              / {log.osName || "Unknown"}
                            </span>
                          </div>
                          {log.screenResolution && (
                            <span className="text-[10px] text-gray-500 block font-mono">
                              {log.screenResolution}
                            </span>
                          )}
                        </td>

                        {/* Route & Referrer */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col max-w-[180px]">
                            <span className="text-emerald-400 font-mono truncate">
                              {log.pathname || "/"}
                            </span>
                            <span
                              className="text-[10px] text-gray-500 truncate"
                              title={log.referrer}
                            >
                              Ref: {log.referrerDomain || log.referrer || "Direct"}
                            </span>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`font-mono ${
                              log.durationSeconds > 60
                                ? "text-emerald-400 font-semibold"
                                : log.durationSeconds > 0
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDuration(log.durationSeconds)}
                          </span>
                        </td>

                        {/* Visited At */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className="text-gray-400"
                            title={new Date(log.visitedAt).toLocaleString()}
                          >
                            {formatTimeAgo(log.visitedAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => setSelectedLog(log)}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10 text-xs"
                              title="Inspect full details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteLog(log._id)}
                              disabled={deletingId === log._id}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                              title="Delete log entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-400">
              Showing page{" "}
              <span className="text-white font-medium">{logsMeta.page}</span> of{" "}
              <span className="text-white font-medium">
                {logsMeta.totalPages}
              </span>{" "}
              ({logsMeta.total} total visitor logs)
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loadingLogs}
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-gray-300 hover:text-white text-xs h-8 px-2.5"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(logsMeta.totalPages, p + 1))
                }
                disabled={currentPage >= logsMeta.totalPages || loadingLogs}
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-gray-300 hover:text-white text-xs h-8 px-2.5"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT LOG DETAILS MODAL */}
      <Dialog
        open={Boolean(selectedLog)}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="max-w-2xl bg-[#000319] border-white/10 text-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Visitor Forensic Footprint
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Recorded at{" "}
              {selectedLog
                ? new Date(selectedLog.visitedAt).toLocaleString()
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-5 text-xs">
              {/* Basic Identity & Session */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-emerald-400">
                  <Users className="w-3.5 h-3.5" />
                  Visitor Identity & Session
                </h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div>
                    <span className="text-gray-500">Visitor ID:</span>
                    <p className="text-gray-300 select-all">{selectedLog.visitorId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Session ID:</span>
                    <p className="text-gray-300 select-all">{selectedLog.sessionId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Is New Visitor:</span>
                    <p className="text-gray-300">
                      {selectedLog.isNewVisitor ? "Yes (First visit)" : "Returning"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Visit Count:</span>
                    <p className="text-gray-300">#{selectedLog.visitCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="text-emerald-400 font-bold">
                      {formatDuration(selectedLog.durationSeconds)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Is Bot:</span>
                    <p
                      className={
                        selectedLog.isBot ? "text-amber-400" : "text-emerald-400"
                      }
                    >
                      {selectedLog.isBot
                        ? `Yes (${selectedLog.botName || "Automated"})`
                        : "No (Real human visitor)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Geolocation & Network */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-sky-400">
                  <Globe className="w-3.5 h-3.5" />
                  Network & Geolocation
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">IP Address:</span>
                    <p className="font-mono text-white select-all">
                      {selectedLog.ip} ({selectedLog.ipType || "IPv4"})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Country / Flag:</span>
                    <p className="text-gray-200">
                      {selectedLog.countryFlag} {selectedLog.country} (
                      {selectedLog.countryCode})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">City / Region:</span>
                    <p className="text-gray-200">
                      {selectedLog.city}, {selectedLog.region || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Timezone / Coordinates:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.timezone || "N/A"}
                      {selectedLog.latitude && selectedLog.longitude
                        ? ` (${selectedLog.latitude.toFixed(2)}, ${selectedLog.longitude.toFixed(2)})`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">ISP / Organization:</span>
                    <p className="text-gray-200">{selectedLog.isp || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Local Time (Client):</span>
                    <p className="text-gray-200">
                      {selectedLog.clientLocalTime || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hardware & Display */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-violet-400">
                  <Monitor className="w-3.5 h-3.5" />
                  Device & Client Hardware
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">Device Type:</span>
                    <p className="capitalize text-white">
                      {selectedLog.deviceType}
                      {selectedLog.deviceModel
                        ? ` (${selectedLog.deviceModel})`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Browser:</span>
                    <p className="text-white">
                      {selectedLog.browserName} {selectedLog.browserVersion}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Operating System:</span>
                    <p className="text-white">
                      {selectedLog.osName} {selectedLog.osVersion}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Screen Resolution:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.screenResolution || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Viewport:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.viewportSize || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Device Pixel Ratio:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.devicePixelRatio || 1}x
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Touch Support:</span>
                    <p className="text-gray-300">
                      {selectedLog.touchSupport
                        ? `Yes (${selectedLog.maxTouchPoints || 1} points)`
                        : "No"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">CPU Concurrency:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.hardwareConcurrency
                        ? `${selectedLog.hardwareConcurrency} cores`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Device Memory:</span>
                    <p className="font-mono text-gray-300">
                      {selectedLog.deviceMemory
                        ? `~${selectedLog.deviceMemory} GB`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation & Referrer */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Page Navigation & Referrer
                </h4>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-gray-500">Visited Pathname:</span>
                    <p className="font-mono text-emerald-400 select-all">
                      {selectedLog.pathname}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Full URL:</span>
                    <p className="font-mono text-gray-300 text-[10px] break-all select-all">
                      {selectedLog.url}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Referrer:</span>
                    <p className="text-gray-300">{selectedLog.referrer}</p>
                  </div>
                  {selectedLog.utmSource && (
                    <div>
                      <span className="text-gray-500">Campaign UTMs:</span>
                      <p className="font-mono text-sky-400">
                        source={selectedLog.utmSource} medium=
                        {selectedLog.utmMedium} campaign=
                        {selectedLog.utmCampaign}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw User Agent & Headers */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-gray-400">
                  <Cpu className="w-3.5 h-3.5" />
                  Raw User-Agent String
                </h4>
                <p className="font-mono text-[10px] text-gray-400 bg-black/40 p-2.5 rounded border border-white/5 break-all select-all">
                  {selectedLog.userAgent}
                </p>
              </div>

              {/* Raw HTTP Headers */}
              {selectedLog.rawHeaders &&
                Object.keys(selectedLog.rawHeaders).length > 0 && (
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2">
                    <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-gray-400">
                      <HardDrive className="w-3.5 h-3.5" />
                      Captured HTTP Request Headers
                    </h4>
                    <div className="space-y-1 font-mono text-[10px] bg-black/40 p-2.5 rounded border border-white/5 overflow-x-auto max-h-36">
                      {Object.entries(selectedLog.rawHeaders).map(
                        ([key, val]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-emerald-400 shrink-0">
                              {key}:
                            </span>
                            <span className="text-gray-300 break-all">{val}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
