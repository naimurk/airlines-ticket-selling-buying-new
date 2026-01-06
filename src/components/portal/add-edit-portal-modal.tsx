/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { TPortal } from "@/types/portal.types";
import {
  useCreatePortalMutation,
  useUpdatePortalMutation,
} from "@/redux/features/portal/portal.api";

interface AddEditPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  portalData?: TPortal; // Optional, only for edit mode
}

export default function AddEditPortalModal({
  isOpen,
  onClose,
  mode,
  portalData,
}: AddEditPortalModalProps) {
  const [portalName, setPortalName] = useState(portalData?.name || "");

  const [createPortal, { isLoading: isCreating }] = useCreatePortalMutation();
  const [updatePortal, { isLoading: isUpdating }] = useUpdatePortalMutation();

  useEffect(() => {
    if (mode === "edit" && portalData) {
      setPortalName(portalData.name);
    } else {
      setPortalName(""); // Clear for create mode
    }
  }, [isOpen, mode, portalData]);

  const handleSubmit = async () => {
    if (!portalName.trim()) {
      toast.error("Portal name cannot be empty.");
      return;
    }

    try {
      if (mode === "create") {
        await createPortal({ name: portalName }).unwrap();
        toast.success("Portal created successfully!");
      } else if (mode === "edit" && portalData?._id) {
        await updatePortal({
          id: portalData._id,
          data: { name: portalName },
        }).unwrap();
        toast.success("Portal updated successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(
        `Failed to ${mode} portal: ${
          error?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Portal" : "Edit Portal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter the name for your new portal."
              : "Edit the name of the portal."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portalName" className="text-right">
              Name
            </Label>
            <Input
              id="portalName"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isLoading
              ? mode === "create"
                ? "Adding..."
                : "Updating..."
              : mode === "create"
              ? "Add Portal"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
