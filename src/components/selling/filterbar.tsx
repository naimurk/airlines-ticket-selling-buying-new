/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  Plane,
  MapPin,
  DollarSign,
  CreditCard,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface FilterBarProps {
  onFilter: (filters: any) => void;
}

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    pnr: "",
    airline: "",
    trip: "all",
    departure: "",
    arrival: "",
    priceSort: "none",
    dueFilter: "all",
    paymentMethod: "all",
    bankName: "",
    passengerName: "",
    phoneNumber: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateFrom: "",
      dateTo: "",
      pnr: "",
      airline: "",
      trip: "all",
      departure: "",
      arrival: "",
      priceSort: "none",
      dueFilter: "all",
      paymentMethod: "all",
      bankName: "",
      passengerName: "",
      phoneNumber: "",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const clearIndividualFilter = (key: string) => {
    const clearedFilters = {
      ...filters,
      [key]:
        key === "trip" ||
        key === "priceSort" ||
        key === "dueFilter" ||
        key === "paymentMethod"
          ? key === "priceSort"
            ? "none"
            : "all"
          : "",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "trip" || key === "dueFilter" || key === "paymentMethod")
      return value !== "all";
    if (key === "priceSort") return value !== "none";
    return value !== "";
  }).length;

  return (
    <Card className="shadow-lg border-0 bg-white mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">
                Search & Filter Records
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Use filters to find specific records quickly and efficiently
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200"
              >
                {activeFiltersCount} Active
              </Badge>
            )}
            <Button
              onClick={handleApplyFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 hover:bg-gray-50 shadow-sm bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Filters Row - Always Visible */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Quick Search (PNR)
                {filters.pnr && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => clearIndividualFilter("pnr")}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter PNR number..."
                  value={filters.pnr}
                  onChange={(e) => handleFilterChange("pnr", e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                From Date
                {filters.dateFrom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => clearIndividualFilter("dateFrom")}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                To Date
                {filters.dateTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-100"
                    onClick={() => clearIndividualFilter("dateTo")}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-200"
              />
            </div>
            {/* Due Status Quick Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-red-600" />
                Due Status
              </Label>
              <Select
                value={filters.dueFilter}
                onValueChange={(value) =>
                  handleFilterChange("dueFilter", value)
                }
              >
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Filter by due" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="due-only">⚠️ Has Due</SelectItem>
                  <SelectItem value="no-due">✅ No Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-dashed border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                Advanced Filters & Options
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4">
            {/* Passenger Information Row */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">
                  Passenger Information
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="h-4 w-4 text-purple-600" />
                    Passenger Name
                    {filters.passengerName && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("passengerName")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    placeholder="e.g., John Doe, Ahmed Ali"
                    value={filters.passengerName}
                    onChange={(e) =>
                      handleFilterChange("passengerName", e.target.value)
                    }
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="h-4 w-4 text-purple-600" />
                    Phone Number
                    {filters.phoneNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("phoneNumber")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    type="tel"
                    placeholder="e.g., +971501234567, 0501234567"
                    value={filters.phoneNumber}
                    onChange={(e) =>
                      handleFilterChange("phoneNumber", e.target.value)
                    }
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Flight Information Row */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">
                  Flight Information
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Airlines Name
                    {filters.airline && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("airline")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    placeholder="e.g., Emirates, Qatar Airways"
                    value={filters.airline}
                    onChange={(e) =>
                      handleFilterChange("airline", e.target.value)
                    }
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Trip Type
                  </Label>
                  <Select
                    value={filters.trip}
                    onValueChange={(value) => handleFilterChange("trip", value)}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="single">✈️ Single Trip</SelectItem>
                      <SelectItem value="round">🔄 Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Price Sorting
                  </Label>
                  <Select
                    value={filters.priceSort}
                    onValueChange={(value) =>
                      handleFilterChange("priceSort", value)
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Sorting</SelectItem>
                      <SelectItem value="low-to-high">
                        📈 Low to High
                      </SelectItem>
                      <SelectItem value="high-to-low">
                        📉 High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Route Information Row */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">
                  Route Information
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    From (Departure)
                    {filters.departure && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("departure")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    placeholder="e.g., Dubai, New York, London"
                    value={filters.departure}
                    onChange={(e) =>
                      handleFilterChange("departure", e.target.value)
                    }
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    To (Arrival)
                    {filters.arrival && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("arrival")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    placeholder="e.g., Paris, Tokyo, Sydney"
                    value={filters.arrival}
                    onChange={(e) =>
                      handleFilterChange("arrival", e.target.value)
                    }
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information Row */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-800">
                  Payment Information
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Payment Method
                  </Label>
                  <Select
                    value={filters.paymentMethod}
                    onValueChange={(value) =>
                      handleFilterChange("paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">💵 Cash</SelectItem>
                      <SelectItem value="deposit">🏦 Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Bank Name
                    {filters.bankName && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100"
                        onClick={() => clearIndividualFilter("bankName")}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    )}
                  </Label>
                  <Input
                    placeholder="e.g., ADCB, Emirates NBD"
                    value={filters.bankName}
                    onChange={(e) =>
                      handleFilterChange("bankName", e.target.value)
                    }
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">Quick Actions</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 hover:bg-red-50 bg-transparent"
                  onClick={() => {
                    const dueFilters = { ...filters, dueFilter: "due-only" };
                    setFilters(dueFilters);
                    onFilter(dueFilters);
                  }}
                >
                  ⚠️ Show Due Records
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 hover:bg-green-50 bg-transparent"
                  onClick={() => {
                    const cashFilters = { ...filters, paymentMethod: "cash" };
                    setFilters(cashFilters);
                    onFilter(cashFilters);
                  }}
                >
                  💵 Cash Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 hover:bg-blue-50 bg-transparent"
                  onClick={() => {
                    const recentFilters = {
                      ...filters,
                      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    };
                    setFilters(recentFilters);
                    onFilter(recentFilters);
                  }}
                >
                  📅 Last 7 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50 bg-transparent"
                  onClick={() => {
                    const sortedFilters = {
                      ...filters,
                      priceSort: "high-to-low",
                    };
                    setFilters(sortedFilters);
                    onFilter(sortedFilters);
                  }}
                >
                  💰 High Value First
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
