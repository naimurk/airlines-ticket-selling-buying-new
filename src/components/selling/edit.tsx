import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Edit, X } from "lucide-react";
import type { TSTicket } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  pnr: z.string().min(1, "PNR is required"),
  AirlinesName: z.string().min(1, "Airlines name is required"),
  trip: z.enum(["single", "round"], {
    required_error: "Trip type is required",
  }),
  departure: z.string().min(1, "Departure is required"),
  arrival: z.string().min(1, "Arrival is required"),
  passengerName: z.string().min(1, "Passenger name is required"),
  phoneNumber: z.number().min(1, "Phone number is required"),
  buyingPriceAED: z.number().min(0, "Buying price must be positive"),
  sellingPriceAED: z.number().min(0, "Selling price must be positive"),
  buyingPriceBDT: z.number().min(0, "Buying price must be positive"),
  sellingPriceBDT: z.number().min(0, "Selling price must be positive"),
  duePriceAED: z.number().min(0, "Due price must be positive"),
  duePriceBDT: z.number().min(0, "Due price must be positive"),
  paymentMethod: z.enum(["cash", "deposit"], {
    required_error: "Payment method is required",
  }),
  bankName: z.string().optional(),
  bankReference: z.string().optional(),
  remarks: z.string().optional(),
});

interface EditModalProps {
  item: TSTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TSTicket) => void;
}

export default function EditModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const watchPaymentMethod = form.watch("paymentMethod");
  const watchBuyingPriceAED = form.watch("buyingPriceAED");
  const watchSellingPriceAED = form.watch("sellingPriceAED");
  const watchBuyingPriceBDT = form.watch("buyingPriceBDT");
  const watchSellingPriceBDT = form.watch("sellingPriceBDT");

  const profitAED = watchSellingPriceAED - watchBuyingPriceAED;
  const profitBDT = watchSellingPriceBDT - watchBuyingPriceBDT;

  useEffect(() => {
    if (item && isOpen) {
      form.reset({
        date: item.date,
        pnr: item.pnr,
        AirlinesName: item.AirlinesName,
        trip: item.trip,
        departure: item.departure,
        arrival: item.arrival,
        passengerName: item.passengerName,
        phoneNumber: item.phoneNumber,
        buyingPriceAED: item.buyingPriceAED,
        sellingPriceAED: item.sellingPriceAED,
        buyingPriceBDT: item.buyingPriceBDT,
        sellingPriceBDT: item.sellingPriceBDT,
        duePriceAED: item.duePriceAED,
        duePriceBDT: item.duePriceBDT,
        paymentMethod: item.paymentMethod,
        bankName: item.bankName,
        bankReference: item.bankReference,
        remarks: item.remarks,
      });
    }
  }, [item, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!item) return;

    const updatedData = {
      ...values,
      profitPriceAED: profitAED,
      profitPriceBDT: profitBDT,
      dueStatus: values.duePriceAED > 0 || values.duePriceBDT > 0,
      bankName: watchPaymentMethod === "deposit" ? values.bankName || "" : "",
      bankReference:
        watchPaymentMethod === "deposit" ? values.bankReference || "" : "",
    };

    onSave(updatedData as TSTicket);
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Edit className="h-6 w-6 text-green-600" />
              Edit Selling Record
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pnr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PNR</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter PNR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="AirlinesName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airlines Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter airlines name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="round">Round</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure</FormLabel>
                    <FormControl>
                      <Input placeholder="Departure city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival</FormLabel>
                    <FormControl>
                      <Input placeholder="Arrival city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passenger Information */}
              <FormField
                control={form.control}
                name="passengerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passenger name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter phone number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pricing Information - AED */}
              <div className="col-span-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing Information (AED)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="buyingPriceAED"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buying Price (AED)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellingPriceAED"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (AED)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Profit (AED)</Label>
                    <Input
                      value={profitAED.toLocaleString()}
                      disabled
                      className="bg-green-50 text-green-700 font-semibold"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="duePriceAED"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Price (AED)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing Information - BDT */}
              <div className="col-span-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing Information (BDT)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="buyingPriceBDT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buying Price (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellingPriceBDT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Profit (BDT)</Label>
                    <Input
                      value={profitBDT.toLocaleString()}
                      disabled
                      className="bg-green-50 text-green-700 font-semibold"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="duePriceBDT"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Price (BDT)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="col-span-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="deposit">Deposit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPaymentMethod === "deposit" && (
                    <>
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Reference</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter bank reference"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional remarks..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Update Record
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
