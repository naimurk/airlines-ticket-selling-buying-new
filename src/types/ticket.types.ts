import type { TPortal } from "./portal.types";

export type TSTicket = {
  _id: string;
  date: string;
  pnr: string;
  AirlinesName: string;
  trip: "single" | "round";
  departure: string;
  arrival: string;
  passengerName: string;
  phoneNumber: number;
  buyingPriceAED: number;
  sellingPriceAED: number;
  profitPriceAED: number;
  buyingPriceBDT: number;
  sellingPriceBDT: number;
  profitPriceBDT: number;
  duePriceAED: number;
  duePriceBDT: number;
  dueStatus: boolean;
  paymentMethod: "cash" | "deposit";
  bankName: string;
  bankReference: string;
  remarks: string;
  portal: TPortal;
};
