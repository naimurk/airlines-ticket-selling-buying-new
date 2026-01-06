import React from "react";
import type { TSTicket } from "@/types";
import printLogo from "../../assets/printLogo.jpg"; // Using placeholder for printLogo

interface PrintSlipProps {
  item: TSTicket;
}

const PrintSlip = React.forwardRef<HTMLDivElement, PrintSlipProps>(
  ({ item }, ref) => {
    const companyInfo = {
      name: "MD ALA UDDIN",
      freelancer: "Md Ala Uddin freelancer",
      phone1: "+971564247576",
      phone2: "+97502424399",
      location: "UAE, Dubai",
      email: "alauddinsohel84@gmail.com",
    };
    return (
      <div ref={ref} className="slip-content absolute h-full w-full min-h-full">
        <div className="bg-white absolute h-full w-full min-h-full shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h1 className="text-xl font-extrabold">INVOICE</h1>
                <p className="text-xs opacity-80">{companyInfo.freelancer}</p>
              </div>
              <div className="text-right">
                <img
                  //   width={60}
                  //   height={60}
                  src={printLogo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="mx-auto mb-1 size-[100px] "
                />
                <p className="text-xs mt-1">
                  INVOICE ID: {item._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            {/* Company Info in Header */}
            <div className="border-t border-blue-500 pt-2 text-xs">
              <p className="font-semibold text-sm">{companyInfo.name}</p>
              <p className="mt-1">
                Phone: {companyInfo.phone1}{" "}
                {companyInfo.phone2 && `| ${companyInfo.phone2}`}
              </p>
              <p>Location: {companyInfo.location}</p>
              <p>Email: {companyInfo.email}</p>
            </div>
          </div>
          {/* Main Content */}
          <div className="p-4 space-y-4">
            {/* Customer Details */}
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-sm font-semibold text-blue-700 mb-2">
                Customer Details:
              </h2>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {item.passengerName}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {item.phoneNumber}
                </div>
              </div>
            </div>
            {/* Ticket Information */}
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-sm font-semibold text-blue-700 mb-2">
                Ticket Information:
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-600 border-b border-gray-200">
                    <th className="pb-1">Description</th>
                    <th className="pb-1 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">
                      <p className="font-medium text-gray-800">Date</p>
                    </td>
                    <td className="py-1 text-right">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <p className="font-medium text-gray-800">PNR</p>
                    </td>
                    <td className="py-1 text-right font-mono text-blue-700">
                      {item.pnr}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <p className="font-medium text-gray-800">Airline</p>
                    </td>
                    <td className="py-1 text-right">{item.AirlinesName}</td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <p className="font-medium text-gray-800">Route</p>
                    </td>
                    <td className="py-1 text-right">
                      {item.departure} → {item.arrival} ({item.trip})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      <p className="font-medium text-gray-800">
                        Payment Method
                      </p>
                    </td>
                    <td className="py-1 text-right capitalize">
                      {item.paymentMethod}
                    </td>
                  </tr>
                  {item.paymentMethod === "deposit" && (
                    <>
                      <tr>
                        <td className="py-1">
                          <p className="font-medium text-gray-800">Bank Name</p>
                        </td>
                        <td className="py-1 text-right">{item.bankName}</td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <p className="font-medium text-gray-800">
                            Bank Reference
                          </p>
                        </td>
                        <td className="py-1 text-right">
                          {item.bankReference}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            {/* Total Amount */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-semibold text-gray-800">
                Total Selling Price:
              </span>
              <span className="text-lg font-bold text-green-700">
                {item.sellingPriceAED.toLocaleString()} AED
              </span>
            </div>
            {item.dueStatus && (
              <div className="flex justify-between items-center pt-1 border-t border-red-200">
                <span className="text-sm font-semibold text-red-600">
                  Due Amount:
                </span>
                <span className="text-lg font-bold text-red-700">
                  {item.duePriceAED.toLocaleString()} AED
                </span>
              </div>
            )}
            {item.remarks && (
              <div className="border-t border-gray-200 pt-3">
                <h2 className="text-sm font-semibold text-blue-700 mb-1">
                  Remarks:
                </h2>
                <p className="text-xs text-gray-700">{item.remarks}</p>
              </div>
            )}
          </div>
          {/* Footer Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 absolute bottom-0 w-full text-center text-white">
            <p className="text-xs">Thank you for your business!</p>
            <p className="text-xs mt-1">
              Contact: {companyInfo.phone1} | Email: {companyInfo.email}
            </p>
            <p className="text-xs mt-1">
              © {new Date().getFullYear()} {companyInfo.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }
);
PrintSlip.displayName = "PrintSlip";
export default PrintSlip;
