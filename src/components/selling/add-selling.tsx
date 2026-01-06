/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CommandGroup } from "@/components/ui/command";

import { CommandEmpty } from "@/components/ui/command";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { TSTicket } from "@/types";
import { Edit, Plus, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateSellingTicketMutation,
  useUpdateSellingTicketMutation,
} from "@/redux/features/ticket/ticketp.api";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "@/components/ui/command"; // Import CommandList
import { useGetAllPortalsQuery } from "@/redux/features/portal/portal.api";

// Mock portal data - replace with actual API call

const formSchema = z
  .object({
    date: z.string().min(1, "Date is required"),
    pnr: z.string().min(1, "PNR is required"),
    AirlinesName: z.string().min(1, "Airlines name is required"),
    trip: z.enum(["single", "round"], {
      required_error: "Trip type is required",
    }),
    departure: z.string().min(1, "Departure is required"),
    arrival: z.string().min(1, "Arrival is required"),
    passengerName: z.string().min(1, "Passenger name is required"),
    portal: z.string().min(1, "Portal is required"),
    phoneNumber: z.number().min(1, "Phone number is required"),
    buyingPriceAED: z.number().optional().default(0),
    sellingPriceAED: z.number().optional().default(0),
    buyingPriceBDT: z.number().optional().default(0),
    sellingPriceBDT: z.number().optional().default(0),
    duePriceAED: z.number().optional().default(0),
    duePriceBDT: z.number().optional().default(0),
    paymentMethod: z.enum(["cash", "deposit"], {
      required_error: "Payment method is required",
    }),
    bankName: z.string().optional(),
    bankReference: z.string().optional(),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "deposit") {
        return data.bankName && data.bankReference;
      }
      return true;
    },
    {
      message: "Bank name and reference are required for deposit payments",
      path: ["bankName"],
    }
  );

interface AddSellingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: TSTicket | null;
  mode?: "create" | "edit";
}

export default function AddSellingModal({
  isOpen,
  onClose,
  editData,
  mode = "create",
}: AddSellingModalProps) {
  const { data: apiResponse, isLoading: isPLoading } = useGetAllPortalsQuery(
    []
  );

  const portalOptions = apiResponse?.data?.map((item) => ({
    name: item.name,
    value: item._id,
  }));

  const [createSellingTicket, { isLoading: isCreating }] =
    useCreateSellingTicketMutation();
  const [updateSellingTicket, { isLoading: isUpdating }] =
    useUpdateSellingTicketMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   date: "",
    //   pnr: "",
    //   AirlinesName: "",
    //   trip: "single",
    //   departure: "",
    //   arrival: "",
    //   passengerName: "",
    //   portal: "",
    //   phoneNumber: 0,
    //   buyingPriceAED: 0,
    //   sellingPriceAED: 0,
    //   buyingPriceBDT: 0,
    //   sellingPriceBDT: 0,
    //   duePriceAED: 0,
    //   duePriceBDT: 0,
    //   paymentMethod: "cash",
    //   bankName: "",
    //   bankReference: "",
    //   remarks: "",
    // },
  });

  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && editData) {
      form.reset({
        date: editData.date || "",
        pnr: editData.pnr || "",
        AirlinesName: editData.AirlinesName || "",
        trip: editData.trip || "single",
        departure: editData.departure || "",
        arrival: editData.arrival || "",
        passengerName: editData.passengerName || "",
        portal: editData.portal?._id || "",
        phoneNumber: editData.phoneNumber || 0,
        buyingPriceAED: editData.buyingPriceAED || 0,
        sellingPriceAED: editData.sellingPriceAED || 0,
        buyingPriceBDT: editData.buyingPriceBDT || 0,
        sellingPriceBDT: editData.sellingPriceBDT || 0,
        duePriceAED: editData.duePriceAED || 0,
        duePriceBDT: editData.duePriceBDT || 0,
        paymentMethod: editData.paymentMethod || "cash",
        bankName: editData.bankName || "",
        bankReference: editData.bankReference || "",
        remarks: editData.remarks || "",
      });
    } else if (mode === "create") {
      // form.reset({
      //   date: "",
      //   pnr: "",
      //   AirlinesName: "",
      //   trip: "single",
      //   departure: "",
      //   arrival: "",
      //   passengerName: "",
      //   portal: "",
      //   phoneNumber: 0,
      //   buyingPriceAED: 0,
      //   sellingPriceAED: 0,
      //   buyingPriceBDT: 0,
      //   sellingPriceBDT: 0,
      //   duePriceAED: 0,
      //   duePriceBDT: 0,
      //   paymentMethod: "cash",
      //   bankName: "",
      //   bankReference: "",
      //   remarks: "",
      // });

      form.reset();
    }
  }, [mode, editData, form]);

  const watchPaymentMethod = form.watch("paymentMethod");
  const watchBuyingPriceAED = form.watch("buyingPriceAED");
  const watchSellingPriceAED = form.watch("sellingPriceAED");
  const watchBuyingPriceBDT = form.watch("buyingPriceBDT") || 0;
  const watchSellingPriceBDT = form.watch("sellingPriceBDT") || 0;
  const watchDuePriceAED = form.watch("duePriceAED");
  const watchDuePriceBDT = form.watch("duePriceBDT") || 0;

  // Calculate profit automatically
  const profitAED = (watchSellingPriceAED || 0) - (watchBuyingPriceAED || 0);
  const profitBDT = watchSellingPriceBDT - watchBuyingPriceBDT;

  // Calculate due status automatically
  const dueStatus = (watchDuePriceAED || 0) > 0 || watchDuePriceBDT > 0;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = {
        ...values,
        // profitPriceAED: profitAED,
        // profitPriceBDT: profitBDT,
        phoneNumber: Number(values.phoneNumber),
        dueStatus: dueStatus,
        bankName: watchPaymentMethod === "deposit" ? values.bankName || "" : "",
        bankReference:
          watchPaymentMethod === "deposit" ? values.bankReference || "" : "",
      };

      if (mode === "edit" && editData) {
        await updateSellingTicket({
          id: editData._id,
          data: formData,
        }).unwrap();
        toast.success("Selling record updated successfully!");
      } else {
        await createSellingTicket(formData).unwrap();
        toast.success("Selling record created successfully!");
      }

      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = isCreating || isUpdating || isPLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {mode === "edit" ? (
                <>
                  <Edit className="h-6 w-6 text-blue-600" />
                  Edit Selling Record
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-blue-600" />
                  Add New Selling Record
                </>
              )}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Information */}
              <FormField
                control={form.control as any}
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
                name="portal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portal</FormLabel>
                    <Popover open={portalOpen} onOpenChange={setPortalOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={portalOpen}
                            className="w-full justify-between bg-transparent"
                          >
                            {field?.value
                              ? portalOptions?.find(
                                  (portal) => portal?.value === field?.value
                                )?.name
                              : "Select portal..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search portal..." />
                          <CommandList>
                            {" "}
                            {/* Wrap CommandGroup and CommandEmpty in CommandList */}
                            <CommandEmpty>No portal found.</CommandEmpty>
                            <CommandGroup>
                              {portalOptions?.map((portal) => (
                                <CommandItem
                                  key={portal?.value}
                                  value={portal?.name}
                                  onSelect={() => {
                                    field.onChange(portal?.value);
                                    setPortalOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field?.value === portal?.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {portal.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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

              {/* Due Status Display */}
              <div className="col-span-full">
                <div className="flex items-center gap-2">
                  <Label>Due Status:</Label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dueStatus
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {dueStatus ? "Has Due" : "No Due"}
                  </span>
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mode === "edit"
                  ? "Update Selling Record"
                  : "Add Selling Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
