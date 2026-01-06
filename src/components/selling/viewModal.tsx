"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plane, User, CreditCard, DollarSign } from "lucide-react";
import type { TSTicket } from "@/types";

interface ViewModalProps {
  item: TSTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewModal({ item, isOpen, onClose }: ViewModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="h-6 w-6 text-blue-600" />
              Ticket Details - {item.pnr}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Flight Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plane className="h-5 w-5 text-blue-600" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PNR:</span>
                <Badge variant="outline" className="font-mono">
                  {item.pnr}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Airlines:</span>
                <span className="font-medium">{item.AirlinesName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Type:</span>
                <Badge
                  variant={item.trip === "single" ? "secondary" : "default"}
                >
                  {item.trip}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">
                  {item.departure} → {item.arrival}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-green-600" />
                Passenger Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{item.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">+{item.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Portal:</span>
                <span className="font-medium">
                  {item.portal?.name || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information - AED */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Pricing (AED)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Buying Price:</span>
                <span className="font-medium">
                  {item.buyingPriceAED.toLocaleString()} AED
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-medium text-green-600">
                  {item.sellingPriceAED.toLocaleString()} AED
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium text-blue-600">
                  {item.profitPriceAED.toLocaleString()} AED
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Amount:</span>
                <span
                  className={`font-medium ${
                    item.duePriceAED > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.duePriceAED.toLocaleString()} AED
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information - BDT */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
                Pricing (BDT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Buying Price:</span>
                <span className="font-medium">
                  {item.buyingPriceBDT.toLocaleString()} BDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-medium text-green-600">
                  {item.sellingPriceBDT.toLocaleString()} BDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium text-blue-600">
                  {item.profitPriceBDT.toLocaleString()} BDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Amount:</span>
                <span
                  className={`font-medium ${
                    item.duePriceBDT > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.duePriceBDT.toLocaleString()} BDT
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <Badge
                    variant={
                      item.paymentMethod === "cash" ? "default" : "outline"
                    }
                  >
                    {item.paymentMethod}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Status:</span>
                  <Badge variant={item.dueStatus ? "destructive" : "secondary"}>
                    {item.dueStatus ? "Has Due" : "No Due"}
                  </Badge>
                </div>
                {item.paymentMethod === "deposit" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">
                        {item.bankName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                      <span className="text-gray-600">Bank Reference:</span>
                      <span className="font-medium">
                        {item.bankReference || "N/A"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          {item.remarks && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{item.remarks}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
