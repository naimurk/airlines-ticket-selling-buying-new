/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from "react"; // Import useRef and useEffect
import { useReactToPrint } from "react-to-print"; // Import useReactToPrint
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Plane,
  Printer,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { TSTicket } from "@/types";
import AddSellingModal from "./add-selling";
import { toast } from "sonner";
import { useSellingTicketDeleteMutation } from "@/redux/features/ticket/ticketp.api";
import DeleteModal from "./deleteSelling";
import ViewModal from "./viewModal";
import type { TMeta } from "@/types/global-types";
// sdfs
interface DataTableProps {
  data: TSTicket[];
  isLoading?: boolean;
  meta?: TMeta;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

export default function DataTable({
  data,
  isLoading,
  meta,
  onPageChange,
  onRefresh,
}: DataTableProps) {
  const [viewItem, setViewItem] = useState<TSTicket | null>(null);
  const [editItem, setEditItem] = useState<TSTicket | null>(null);
  const [deleteItem, setDeleteItem] = useState<TSTicket | null>(null);
  const [itemToPrint, setItemToPrint] = useState<TSTicket | null>(null); // State to hold the item to be printed

  const [deleteSellingTicket, { isLoading: isDeleting }] =
    useSellingTicketDeleteMutation();

  const contentRef = useRef<HTMLDivElement>(null); // Ref for the component to be printed

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: itemToPrint
      ? `Ticket_Slip_${itemToPrint.pnr}`
      : "Ticket_Slip",
    onAfterPrint: () => setItemToPrint(null),
  });

  //   const contentRef = useRef<HTMLDivElement>(null);
  //  const reactToPrintFn = useReactToPrint({
  //   contentRef,
  //   documentTitle: "Subscription Slip",
  // });
  // Effect to trigger print when itemToPrint is set
  // useEffect(() => {
  //   if (itemToPrint) {
  //     handlePrint();
  //   }
  // }, [itemToPrint, handlePrint]);

  const handleEdit = (item: TSTicket) => {
    setEditItem(item);
  };
  const handleDelete = (item: TSTicket) => {
    setDeleteItem(item);
  };
  const handleView = (item: TSTicket) => {
    setViewItem(item);
  };
  const confirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteSellingTicket(deleteItem._id).unwrap();
        toast.success("Selling record deleted successfully!");
        setDeleteItem(null);
        onRefresh?.();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete record");
      }
    }
  };

  // This function will set the item to print, which then triggers the useEffect
  const triggerPrint = (item: TSTicket) => {
    setItemToPrint(item);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading records...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl text-gray-900">
              Selling Records
            </CardTitle>
            {meta && (
              <Badge variant="secondary" className="ml-2">
                {meta.total} total records
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  PNR
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Airline
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Route
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Passenger
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Buying Price
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Selling Price
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Profit
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Due
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Payment
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.pnr}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {item.AirlinesName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>{item.departure}</span>
                      <span className="text-gray-400">→</span>
                      <span>{item.arrival}</span>
                    </div>
                    <Badge
                      variant={item.trip === "single" ? "secondary" : "default"}
                      className="text-xs mt-1"
                    >
                      {item.trip}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {item.passengerName}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-green-600">
                    {item.buyingPriceAED.toLocaleString()} AED
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-green-600">
                    {item.sellingPriceAED.toLocaleString()} AED
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-blue-600">
                    {item.profitPriceAED.toLocaleString()} AED
                  </td>
                  <td className="py-4 px-4">
                    {item.dueStatus ? (
                      <Badge variant="destructive" className="text-xs">
                        {item.duePriceAED.toLocaleString()} AED
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        No Due
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        item.paymentMethod === "cash" ? "default" : "outline"
                      }
                      className="text-xs"
                    >
                      {item.paymentMethod}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(item)}
                        className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0 border-green-200 hover:bg-green-50"
                        title="Edit Record"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerPrint(item)} // Call triggerPrint here
                        className="h-8 w-8 p-0 border-purple-200 hover:bg-purple-50"
                        title="Print Receipt"
                      >
                        <Printer className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item)}
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50"
                        title="Delete Record"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-12">
              <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No records found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or add new selling records
              </p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(meta.page - 1)}
                disabled={meta.page <= 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, meta.totalPage) }, (_, i) => {
                const pageNum = Math.max(1, meta.page - 2) + i;
                if (pageNum > meta.totalPage) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === meta.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(meta.page + 1)}
                disabled={meta.page >= meta.totalPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {/* Modals */}
      <ViewModal
        item={viewItem}
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
      />
      <AddSellingModal
        isOpen={!!editItem}
        onClose={() => {
          setEditItem(null);
          onRefresh?.();
        }}
        mode="edit"
        editData={editItem}
      />
      <DeleteModal
        item={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      {/* Print component - conditionally rendered and hidden */}
      {itemToPrint && (
        <div style={{ display: "none" }}>
          {/* <PrintSlip ref={contentRef} item={itemToPrint} /> */}
          <div ref={contentRef} className="slip-content">
            <h1>hello world</h1>
          </div>
        </div>
      )}
    </Card>
  );
}
