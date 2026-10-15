"use client";

import { useMemo, useState } from "react";
import {
  X,
  Calendar,
  Download,
  Video,
  ArrowUpRight,
  Radio,
  Vote,
  FileText,
  Info,
  Landmark,
  ArrowLeftRight,
  BadgeCheck,
  TrendingUp,
  ShieldCheck,
  ScrollText,
} from "lucide-react";

type Transaction = {
  type: "repost" | "video" | "withdrawal" | "live" | "poll";
  title: string;
  subtitle: string;
  date: string;
  referenceId: string;
  amount: string;
  status: "Completed" | "Settled" | "In Escrow";
  positive: boolean;
};

const transactions: Transaction[] = [
  {
    type: "repost",
    title: "Repost Bounty Payout",
    subtitle: "Channel: Syndication Pool",
    date: "Today, 02:15 PM",
    referenceId: "#REP-88219",
    amount: "+₹250.00",
    status: "Completed",
    positive: true,
  },
  {
    type: "video",
    title: "Sponsored Video Revenue",
    subtitle: "Partner: Tamil Nadu Tourism",
    date: "Yesterday, 06:30 PM",
    referenceId: "#SPON-44182",
    amount: "+₹1,200.00",
    status: "Completed",
    positive: true,
  },
  {
    type: "withdrawal",
    title: "Bank Withdrawal to HDFC",
    subtitle: "Direct Deposit •••• 1267",
    date: "May 12, 2025",
    referenceId: "#HDFC-99124481",
    amount: "-₹10,000.00",
    status: "Settled",
    positive: false,
  },
  {
    type: "live",
    title: "Live Townhall Speaker Fee",
    subtitle: "Tamil News Desk Live",
    date: "May 10, 2025",
    referenceId: "#TOWN-11029",
    amount: "+₹3,500.00",
    status: "In Escrow",
    positive: true,
  },
  {
    type: "poll",
    title: "Poll Sponsorship Dividend",
    subtitle: "Chennai Metro Analysis",
    date: "May 08, 2025",
    referenceId: "#POLL-89281",
    amount: "+₹450.00",
    status: "Completed",
    positive: true,
  },
];

const tabs = ["All Transactions", "Bounties", "Sponsorships", "Bank Payout"];

function TransactionIcon({ type }: { type: Transaction["type"] }) {
  const className = "h-3.5 w-3.5";
  switch (type) {
    case "repost":
      return <ArrowLeftRight className={`${className} text-[#E05319]`} />;
    case "video":
      return <Video className={`${className} text-[#E05319]`} />;
    case "withdrawal":
      return <ArrowUpRight className={`${className} text-[#6E6E6A]`} />;
    case "live":
      return <Radio className={`${className} text-[#E05319]`} />;
    case "poll":
      return <Vote className={`${className} text-[#E05319]`} />;
    default:
      return <FileText className={className} />;
  }
}

export default function StatementsSettlements({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("All Transactions");
  const [period, setPeriod] = useState("Last 30 Days (May 2025)");
  const [actionMessage, setActionMessage] = useState("");

  const filteredTransactions = useMemo(() => {
    switch (activeTab) {
      case "Bounties":
        return transactions.filter((tx) => tx.type === "repost");
      case "Sponsorships":
        return transactions.filter(
          (tx) => tx.type === "video" || tx.type === "live" || tx.type === "poll"
        );
      case "Bank Payout":
        return transactions.filter((tx) => tx.type === "withdrawal");
      default:
        return transactions;
    }
  }, [activeTab]);

  const downloadCSV = () => {
    const headers = [
      "Transaction Details",
      "Subtitle",
      "Date & Time",
      "Reference ID",
      "Amount (INR)",
      "Status",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.title,
      tx.subtitle,
      tx.date,
      tx.referenceId,
      tx.amount,
      tx.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "statements-settlements.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePDF = () => {
    window.print();
  };


  return (
    <div className="min-h-screen w-full  p-3 font-sans text-gray-800 sm:p-5 lg:p-8 ">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[30px] bg-white shadow-xl">
      
        <header className="flex items-start justify-between gap-4 bg-[#FAF8F5] px-5 py-5 sm:px-7">
          <div>
            <h1 className="text-lg font-black tracking-tight text-gray-950 sm:text-xl">
              Statements & Settlements
            </h1>
            <p className="mt-1 text-[10px] font-medium text-[#82766D] sm:text-xs">
              Real-time creator payout ledger, GST invoices & export reconciliation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close statements"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F0EDE9] text-gray-700 transition hover:bg-gray-200"
          >
            <X size={15} />
          </button>
        </header>

        <main className="flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
          
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F7F4F0] px-3 py-2 text-[12px] font-bold ">
                <Calendar size={15} className="text-[#E05319]" />
                <select
                  aria-label="Statement period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="max-w-[175px] cursor-pointer bg-transparent outline-none"
                >
                  <option>Last 30 Days (May 2025)</option>
                  <option>Last 7 Days</option>
                  <option>All Time</option>
                </select>
              </label>

              <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#F7F4F0] p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[9px] font-bold transition sm:text-[10px] ${
                      activeTab === tab
                        ? "bg-[#E94E00] text-white"
                        : "text-[#786B61] hover:bg-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={downloadCSV}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F3F0EC] px-3 py-2 text-[12px] font-bold  transition hover:bg-gray-200"
              >
                <Download size={12} className="text-orange-500" />
                CSV
              </button>
              <button
                type="button"
                onClick={handlePDF}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#FFDDD1] px-3 py-2 text-[12px] font-bold text-[#E05319] transition hover:bg-[#FFD0C0]"
              >
                <FileText size={12} />
                PDF Statement
              </button>
            </div>
          </div>

   
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F5EBE1] bg-[#FAF6F2] px-4 py-3">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#84766B]">
                  Total Credits
                </p>
                <p className="mt-0.5 text-xl font-black tracking-tight text-[#E05319]">
                  +₹18,450.00
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE0D4] text-[#E05319]">
                <TrendingUp size={18} />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F5EBE1] bg-[#FAF6F2] px-4 py-3">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#84766B]">
                  Total Withdrawn
                </p>
                <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">
                  -₹10,000.00
                </p>
              </div>
              <span className="flex h-9 w-9  items-center justify-center rounded-full bg-[#EEEAE5] text-[#81766D]">
                <Landmark size={18} />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F5EBE1] bg-[#FAF0E9] px-4 py-3">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#84766B]">
                  Net Available
                </p>
                <p className="mt-0.5 text-xl font-black tracking-tight text-gray-900">
                  ₹12,450.00
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-500 shadow-3xs">
                <BadgeCheck size={18} />
              </span>
            </div>
          </section>

         
          <section className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-[#F7F4F0] text-[10px] font-bold uppercase tracking-wide text-[#786B61]">
                  <th className="px-3 py-2.5 font-bold">Transaction Details</th>
                  <th className="px-3 py-2.5 font-bold">Date &amp; Time</th>
                  <th className="px-3 py-2.5 font-bold">Reference ID</th>
                  <th className="px-3 py-2.5 text-right font-bold">Amount (INR)</th>
                  <th className="px-3 py-2.5 text-center font-bold">Status</th>
                  <th className="px-3 py-2.5 text-center font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-[10px]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.referenceId} className="transition hover:bg-[#FFFAF7]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            tx.positive ? "bg-[#FFE0D4]" : "bg-[#EAE7E2]"
                          }`}
                        >
                          <TransactionIcon type={tx.type} />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="font-bold text-gray-900 text-[13px] ">
                            {tx.title}
                          </span>
                          <span className="mt-0.5 text-[11px] font-medium text-[#897D73]">
                            {tx.subtitle}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium  text-[13px] text-[#786B61]">
                      {tx.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-[13px] text-[#786B61]">
                      {tx.referenceId}
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-3 text-right text-[13px] font-extrabold ${
                        tx.positive ? "text-[#E05319]" : "text-gray-900"
                      }`}
                    >
                      {tx.amount}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${
                          tx.status === "Completed"
                            ? "bg-[#F1EEEA] text-orange-500"
                            : tx.status === "Settled"
                              ? "bg-[#EAE7E2] text-[#5F574F]"
                              : "bg-[#F8E6D9] text-[#A9532B]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === "In Escrow"
                              ? "bg-[#E87339]"
                              : tx.status === "Settled"
                                ? "bg-[#8B8177]"
                                : "bg-[#E05319]"
                          }`}
                        />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        aria-label={`View ${tx.title}`}
                        title={`View ${tx.referenceId}`}
                        onClick={() =>
                          setActionMessage(
                            `${tx.title} — ${tx.referenceId} — ${tx.amount} — ${tx.status}`
                          )
                        }
                        className="inline-flex cursor-pointer items-center justify-center rounded p-1 text-bold transition hover:bg-[#F7F0EA] hover:text-[#E05319]"
                      >
                        {tx.status === "In Escrow" && <Info size={15} />}
                        {tx.status === "Settled" && <FileText size={15} />}
                        {tx.status === "Completed" && <ScrollText size={15} />}
                         
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                      No transactions found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {actionMessage && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#F5D5C7] bg-[#FFF5EF] px-4 py-3 text-xs text-gray-800"
            >
              <span>{actionMessage}</span>
              <button
                type="button"
                onClick={() => setActionMessage("")}
                aria-label="Dismiss transaction details"
                className="shrink-0 cursor-pointer text-gray-500 hover:text-gray-900"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </main>
        <footer className="flex flex-col justify-between gap-3 bg-[#FAF8F5] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <button
            type="button"
            onClick={() =>
              setActionMessage(
                "GST invoice download is a demo action. Connect your invoice API to download the actual invoice."
              )
            }
            className="inline-flex cursor-pointer items-center gap-1.5 text-left text-[13px] font-bold text-[#E05319] hover:underline"
          >
            <span><ShieldCheck /></span>
            Download May 2025 GST Compliant Invoice (TIN: 33AAACT9921E1Z)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="self-end rounded-full bg-[#E9E5E0] px-5 py-2 text-[12px] font-bold transition hover:bg-[#DDD7D0] sm:self-auto"
          >
            Dismiss
          </button>
        </footer>
      </div>
    </div>
  );
}

