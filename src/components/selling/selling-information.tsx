/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import AddSellingModal from "./add-selling";
import StatisticsCards from "./statiscard";
import FilterBar from "./filterbar";
import DataTable from "./data-table";
import { useGetAllSellingTicketsQuery } from "@/redux/features/ticket/ticketp.api";
import type { TMeta } from "@/types/global-types";

export default function SellingInformation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setTimeFilter] = useState("all");
  const [filters, setFilters] = useState<
    Array<{ name: string; value: string }>
  >([
    { name: "page", value: "1" },
    { name: "limit", value: "10" },
  ]);

  // Fetch data using the API
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllSellingTicketsQuery(filters);

  const data = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  const handleAddSelling = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch(); // Refresh data after modal closes
  };

  const handleFilter = (newFilters: any) => {
    const queryParams = [];
    // Add pagination
    queryParams.push({ name: "page", value: "1" });
    queryParams.push({ name: "limit", value: "10" });

    // Add filters
    if (newFilters.dateFrom) {
      queryParams.push({ name: "startDate", value: newFilters.dateFrom });
    }
    if (newFilters.dateTo) {
      queryParams.push({ name: "endDate", value: newFilters.dateTo });
    }
    if (newFilters.pnr) {
      queryParams.push({ name: "pnr", value: newFilters.pnr });
    }
    if (newFilters.airline) {
      queryParams.push({ name: "AirlinesName", value: newFilters.airline });
    }
    if (newFilters.trip && newFilters.trip !== "all") {
      queryParams.push({ name: "trip", value: newFilters.trip });
    }
    if (newFilters.departure) {
      queryParams.push({ name: "departure", value: newFilters.departure });
    }
    if (newFilters.arrival) {
      queryParams.push({ name: "arrival", value: newFilters.arrival });
    }
    if (newFilters.priceSort && newFilters.priceSort !== "none") {
      queryParams.push({
        name: "sort",
        value:
          newFilters.priceSort === "low-to-high"
            ? "sellingPriceAED"
            : "-sellingPriceAED",
      });
    }
    if (newFilters.dueFilter && newFilters.dueFilter !== "all") {
      queryParams.push({
        name: "dueStatus",
        value: newFilters.dueFilter === "due-only" ? "true" : "false",
      });
    }
    if (newFilters.paymentMethod && newFilters.paymentMethod !== "all") {
      queryParams.push({
        name: "paymentMethod",
        value: newFilters.paymentMethod,
      });
    }
    if (newFilters.bankName) {
      queryParams.push({ name: "bankName", value: newFilters.bankName });
    }
    if (newFilters.bankReference) {
      queryParams.push({
        name: "bankReference",
        value: newFilters.bankReference,
      });
    }
    if (newFilters.searchTerm) {
      queryParams.push({ name: "searchTerm", value: newFilters.searchTerm });
    }
    if (newFilters.portalName) {
      queryParams.push({ name: "portalName", value: newFilters.portalName });
    }
    // Add new passenger filters
    if (newFilters.passengerName) {
      queryParams.push({
        name: "passengerName",
        value: newFilters.passengerName,
      });
    }
    if (newFilters.phoneNumber) {
      queryParams.push({ name: "phoneNumber", value: newFilters.phoneNumber });
    }

    setFilters(queryParams);
  };

  const handlePageChange = (page: number) => {
    const newFilters = filters.map((filter) =>
      filter.name === "page" ? { ...filter, value: page.toString() } : filter
    );
    setFilters(newFilters);
  };

  const handleTimeFilter = (filter: string) => {
    setTimeFilter(filter);
  };

  if (isError) {
    toast.error("Failed to load selling records");
  }

  return (
    <div className="space-y-8 relative">
      {/* Add Selling Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleAddSelling}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Selling
        </Button>
      </div>

      {/* Statistics */}
      <StatisticsCards onTimeFilterChange={handleTimeFilter} />

      {/* Filter Bar */}
      <FilterBar onFilter={handleFilter} />

      {/* Data Table */}
      <DataTable
        data={data}
        isLoading={isLoading || isFetching}
        meta={meta as TMeta}
        onPageChange={handlePageChange}
        onRefresh={refetch}
      />

      {/* Add Selling Modal */}
      <AddSellingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode="create"
      />
    </div>
  );
}
