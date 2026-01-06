"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Calendar,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { useGetSellStatisticsQuery } from "@/redux/features/ticket/sell-statistic.api";

interface StatisticsCardsProps {
  onTimeFilterChange: (timeFilter: string) => void;
}

export default function StatisticsCards({
  onTimeFilterChange,
}: StatisticsCardsProps) {
  const [currentTimeFilter, setCurrentTimeFilter] = useState("all");

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSellStatisticsQuery(currentTimeFilter);

  const statisticsData = apiResponse?.data;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load statistics.");
    }
  }, [isError]);

  const handleSelectChange = (value: string) => {
    setCurrentTimeFilter(value);
    onTimeFilterChange(value); // Propagate the change to parent if needed
  };

  const stats = [
    {
      title: "Total Profit",
      value: statisticsData
        ? `${statisticsData.totalProfitAED.toLocaleString()} AED`
        : "...",
      icon: TrendingUp,
      gradient: "from-emerald-400 via-green-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-green-100",
      iconBg: "from-emerald-500 to-green-600",
      textColor: "text-emerald-700",
      valueColor: "text-emerald-800",
    },
    {
      title: "Total Sales",
      value: statisticsData
        ? statisticsData.totalSelling.toLocaleString()
        : "...",
      icon: ShoppingCart,
      gradient: "from-blue-400 via-indigo-500 to-blue-600",
      bgGradient: "from-blue-50 to-indigo-100",
      iconBg: "from-blue-500 to-indigo-600",
      textColor: "text-blue-700",
      valueColor: "text-blue-800",
    },
    {
      title: "Total Revenue",
      value: statisticsData
        ? `${statisticsData.totalRevenue.toLocaleString()} AED`
        : "...",
      icon: DollarSign,
      gradient: "from-purple-400 via-violet-500 to-purple-600",
      bgGradient: "from-purple-50 to-violet-100",
      iconBg: "from-purple-500 to-violet-600",
      textColor: "text-purple-700",
      valueColor: "text-purple-800",
    },
    {
      title: "Total Due",
      value: statisticsData
        ? `${statisticsData.totalDue.toLocaleString()} AED`
        : "...",
      icon: AlertCircle,
      gradient: "from-red-400 via-rose-500 to-red-600",
      bgGradient: "from-red-50 to-rose-100",
      iconBg: "from-red-500 to-rose-600",
      textColor: "text-red-700",
      valueColor: "text-red-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Statistics Period
              </h3>
            </div>
            <div className="w-64">
              <Select onValueChange={handleSelectChange} defaultValue="all">
                <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-500 bg-white shadow-md hover:shadow-lg transition-all duration-200">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌐 All Time</SelectItem>
                  <SelectItem value="last-7-days">📅 Last 7 Days</SelectItem>
                  <SelectItem value="this-week">📆 This Week</SelectItem>
                  <SelectItem value="last-month">🗓️ Last Month</SelectItem>
                  <SelectItem value="last-6-months">
                    📊 Last 6 Months
                  </SelectItem>
                  <SelectItem value="last-year">🎯 Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.iconBg} shadow-lg`}
              >
                <stat.icon className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-3xl font-bold ${stat.valueColor} mb-2`}>
                {isLoading || isFetching ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  stat.value
                )}
              </div>
              <div
                className={`h-1 w-full bg-gradient-to-r ${stat.gradient} rounded-full opacity-60`}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
