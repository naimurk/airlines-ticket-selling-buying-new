"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import type { TSTicket } from "@/types";

interface DeleteModalProps {
  item: TSTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Delete Record
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this selling record?
          </p>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">PNR:</span>
              <span className="font-medium">{item.pnr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Passenger:</span>
              <span className="font-medium">{item.passengerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Airlines:</span>
              <span className="font-medium">{item.AirlinesName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">
                {item.departure} → {item.arrival}
              </span>
            </div>
          </div>

          <p className="text-red-600 text-sm mt-4 font-medium">
            ⚠️ This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
