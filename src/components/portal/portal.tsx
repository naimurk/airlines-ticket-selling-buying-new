/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, Globe, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { TPortal } from "@/types/portal.types";

import {
  useDeletePortalMutation,
  useGetAllPortalsQuery,
} from "@/redux/features/portal/portal.api";
import AddEditPortalModal from "./add-edit-portal-modal";

export default function PortalManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPortal, setSelectedPortal] = useState<TPortal | undefined>(
    undefined
  );

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllPortalsQuery([]);
  const portals = apiResponse?.data || [];

  const [deletePortal, { isLoading: isDeleting }] = useDeletePortalMutation();

  const handleAddPortal = () => {
    setModalMode("create");
    setSelectedPortal(undefined);
    setIsModalOpen(true);
  };

  const handleEditPortal = (portal: TPortal) => {
    setModalMode("edit");
    setSelectedPortal(portal);
    setIsModalOpen(true);
  };

  const handleDeletePortal = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this portal? This action cannot be undone."
      )
    ) {
      try {
        await deletePortal(id).unwrap();
        toast.success("Portal deleted successfully!");
      } catch (error: any) {
        toast.error(
          `Failed to delete portal: ${
            error?.data?.message || error.message || "Unknown error"
          }`
        );
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPortal(undefined); // Clear selected portal on close
    refetch(); // Refresh data after any CUD operation
  };

  if (isError) {
    toast.error("Failed to load portals.");
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading portals. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Portal Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Portal Management
            </h2>
            <p className="text-gray-600">
              Manage your airline portals and connections
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddPortal}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Portal
        </Button>
      </div>

      {/* Portal Table */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-xl text-gray-900">Portal List</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Portal Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                      <p className="text-gray-500 mt-2">Loading portals...</p>
                    </td>
                  </tr>
                ) : portals.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No portals found</p>
                      <p className="text-gray-400 text-sm">
                        Add your first portal to get started
                      </p>
                    </td>
                  </tr>
                ) : (
                  portals.map((portal) => (
                    <tr
                      key={portal._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-lg font-medium text-gray-900">
                            {portal.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Active
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-blue-200 hover:bg-blue-50 bg-transparent"
                            title="Edit Portal"
                            onClick={() => handleEditPortal(portal)}
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-9 p-0 border-red-200 hover:bg-red-50 bg-transparent"
                            title="Delete Portal"
                            onClick={() => handleDeletePortal(portal._id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Portal Modal */}
      <AddEditPortalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        portalData={selectedPortal}
      />
    </div>
  );
}
