"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Button } from "../ui/button";

import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CalendarIcon,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { useGetSellStatisticsQuery } from "@/redux/features/ticket/sell-statistic.api";

export default function StatisticsCards() {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSellStatisticsQuery({
    fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,

    toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
  });

  const statisticsData = apiResponse?.data;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load statistics");
    }
  }, [isError]);

  const stats = [
    {
      title: "Total Profit",
      value: statisticsData
        ? `${statisticsData.totalProfitAED.toLocaleString()} AED`
        : "0 AED",

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
        : "0",

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
        : "0 AED",

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
        : "0 AED",

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
      {/* Date Filter */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Filter Statistics
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* From Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[220px] justify-start text-left font-normal bg-white",
                      !fromDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {fromDate ? (
                      format(fromDate, "PPP")
                    ) : (
                      <span>From Date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                  />
                </PopoverContent>
              </Popover>

              {/* To Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[220px] justify-start text-left font-normal bg-white",
                      !toDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {toDate ? format(toDate, "PPP") : <span>To Date</span>}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="destructive"
                onClick={() => {
                  setFromDate(undefined);
                  setToDate(undefined);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.title}
              </CardTitle>

              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.iconBg} shadow-lg`}
              >
                <stat.icon className="h-5 w-5 text-white" />
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
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
