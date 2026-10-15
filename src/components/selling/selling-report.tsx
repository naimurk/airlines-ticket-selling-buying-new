import { forwardRef } from "react";
import type { TSTicket } from "@/types";

interface SellingReportProps {
  data: TSTicket[];
  fromDate?: string;
  toDate?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const money = (value: number) =>
  (value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const SellingReport = forwardRef<HTMLDivElement, SellingReportProps>(
  ({ data, fromDate, toDate }, ref) => {
    const totals = data.reduce(
      (acc, item) => {
        acc.buying += item.buyingPriceAED || 0;
        acc.selling += item.sellingPriceAED || 0;
        acc.profit += item.profitPriceAED || 0;
        acc.due += item.duePriceAED || 0;
        return acc;
      },
      { buying: 0, selling: 0, profit: 0, due: 0 },
    );

    const periodText =
      fromDate && toDate
        ? `From: ${formatDate(fromDate)}   To: ${formatDate(toDate)}`
        : fromDate
          ? `From: ${formatDate(fromDate)}`
          : toDate
            ? `Up to: ${formatDate(toDate)}`
            : "All Records";

    const thClass =
      "border border-black px-1.5 py-1 text-[10px] font-bold uppercase text-black";
    const tdClass = "border border-black px-1.5 py-0.5 text-[10px] text-black";
    const tdNumClass = `${tdClass} text-right tabular-nums`;

    return (
      <div ref={ref} className="bg-white p-4 slip-content text-black">
        {/* Report Header */}
        <div className="mb-3 border-b-2 border-black pb-2 text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide">
            Ticket Selling Report
          </h1>
          <p className="mt-1 text-xs font-semibold">{periodText}</p>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span>Total Records: {data.length}</span>
            <span>Printed on: {formatDate(new Date().toISOString())}</span>
          </div>
        </div>

        {/* Report Table */}
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${thClass} text-center`}>SL</th>
              <th className={`${thClass} text-left`}>Date</th>
              <th className={`${thClass} text-left`}>PNR</th>
              <th className={`${thClass} text-left`}>Airline</th>
              <th className={`${thClass} text-left`}>Route</th>
              <th className={`${thClass} text-left`}>Passenger</th>
              <th className={`${thClass} text-right`}>Buying (AED)</th>
              <th className={`${thClass} text-right`}>Selling (AED)</th>
              <th className={`${thClass} text-right`}>Profit (AED)</th>
              <th className={`${thClass} text-right`}>Due (AED)</th>
              <th className={`${thClass} text-left`}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id ?? index} className="break-inside-avoid">
                <td className={`${tdClass} text-center`}>{index + 1}</td>
                <td className={`${tdClass} whitespace-nowrap`}>
                  {formatDate(item.date)}
                </td>
                <td className={`${tdClass} font-mono`}>{item.pnr}</td>
                <td className={tdClass}>{item.AirlinesName}</td>
                <td className={`${tdClass} whitespace-nowrap`}>
                  {item.departure} - {item.arrival}
                  <span className="ml-1 capitalize">({item.trip})</span>
                </td>
                <td className={tdClass}>{item.passengerName}</td>
                <td className={tdNumClass}>{money(item.buyingPriceAED)}</td>
                <td className={tdNumClass}>{money(item.sellingPriceAED)}</td>
                <td className={tdNumClass}>{money(item.profitPriceAED)}</td>
                <td className={tdNumClass}>
                  {item.dueStatus ? money(item.duePriceAED) : "-"}
                </td>
                <td className={`${tdClass} capitalize`}>
                  {item.paymentMethod}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={11} className={`${tdClass} py-4 text-center`}>
                  No records found
                </td>
              </tr>
            )}

            {/* Totals row (tbody te rakhsi jate prottek page e repeat na hoy) */}
            <tr className="break-inside-avoid bg-gray-100 font-bold">
              <td
                colSpan={6}
                className={`${tdClass} text-right font-bold uppercase`}
              >
                Total ({data.length} Sells)
              </td>
              <td className={`${tdNumClass} font-bold`}>
                {money(totals.buying)}
              </td>
              <td className={`${tdNumClass} font-bold`}>
                {money(totals.selling)}
              </td>
              <td className={`${tdNumClass} font-bold`}>
                {money(totals.profit)}
              </td>
              <td className={`${tdNumClass} font-bold`}>{money(totals.due)}</td>
              <td className={tdClass}></td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-4 flex justify-end">
          <table className="w-64 border-collapse border border-black">
            <tbody>
              <tr>
                <td className={tdClass}>Total Sell</td>
                <td className={tdNumClass}>{data.length}</td>
              </tr>
              <tr>
                <td className={tdClass}>Total Buying</td>
                <td className={tdNumClass}>{money(totals.buying)} AED</td>
              </tr>
              <tr>
                <td className={tdClass}>Total Revenue</td>
                <td className={tdNumClass}>{money(totals.selling)} AED</td>
              </tr>
              <tr>
                <td className={tdClass}>Total Profit</td>
                <td className={tdNumClass}>{money(totals.profit)} AED</td>
              </tr>
              <tr>
                <td className={`${tdClass} font-bold`}>Total Due</td>
                <td className={`${tdNumClass} font-bold`}>
                  {money(totals.due)} AED
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="mt-10 flex items-center justify-between text-[10px]">
          <span className="border-t border-black px-6 pt-1">Prepared By</span>
          <span className="border-t border-black px-6 pt-1">
            Authorized Signature
          </span>
        </div>
      </div>
    );
  },
);

SellingReport.displayName = "SellingReport";

export default SellingReport;
