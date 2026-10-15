
"use client";

import React, { useState } from "react";
import {
    X,
    User,
    Eye,
    EyeOff,
    Building2,
    CheckCircle2,
    ShieldCheck,
    Trash2,
    QrCode,
    LockKeyhole,
    Smartphone,
    CreditCard,
    Plus,
    AlertCircle,
    Landmark,
    Verified,
    Sparkles,
    UserLock,
} from "lucide-react";

interface ChangePayoutRailProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: PayoutData) => void;
}

interface PayoutData {
    payoutType: "bank" | "upi";
    accountHolder: string;
    accountNumber?: string;
    ifscCode?: string;
    accountType?: "savings" | "current";
    upiId?: string;
    bankName?: string;
    selectedRail: string;
}

interface ExistingRail {
    id: string;
    name: string;
    details: string;
    type: "bank" | "upi";
    primary: boolean | string;
    verified: boolean;
}

const initialRails: ExistingRail[] = [
    {
        id: "hdfc",
        name: "HDFC Bank Limited",
        details: "A/C: •••••••• 4092 • IFSC: HDFC0001824 • Branch: T. Nagar, Chennai",
        type: "bank",
        primary: true,
        verified: true,
    },
    {
        id: "sbi",
        name: "State Bank of India",
        details: "A/C: •••••••• 7183 • IFSC: SBIN0000842 • Branch: Anna Nagar, Chennai",
        type: "bank",
        primary: "Verified",
        verified: true,
    },
    {
        id: "upi",
        name: "Instant UPI VPA ",
        details: "karthik@okhdfcbank",
        type: "upi",
        primary: "Instant Payout Active",
        verified: true,
    },
];

export default function Changeaccount({
    isOpen,
    onClose,
    onSave,
}: ChangePayoutRailProps) {
    const [payoutType, setPayoutType] = useState<"bank" | "upi">("bank");

    const [accountHolder] = useState("Karthik Raja");
    const [accountNumber, setAccountNumber] = useState("");
    const [reAccountNumber, setReAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [accountType, setAccountType] = useState<
        "savings" | "current"
    >("savings");
    const [upiId, setUpiId] = useState("");

    const [selectedExistingRail, setSelectedExistingRail] =
        useState("hdfc");
    const [rails, setRails] = useState<ExistingRail[]>(initialRails);

    const [showAccountNumber, setShowAccountNumber] = useState(false);
    const [ifscVerified, setIfscVerified] = useState(false);
    const [upiVerified, setUpiVerified] = useState(false);
    const [verificationRequested, setVerificationRequested] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!isOpen) return null;

    const resetMessages = () => {
        setError("");
        setSuccess("");
    };

    const handleIfscChange = (value: string) => {
        setIfscCode(value.toUpperCase().replace(/\s/g, ""));
        setIfscVerified(false);
        resetMessages();
    };

    const verifyIfsc = () => {
        const normalizedIfsc = ifscCode.trim().toUpperCase();

        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(normalizedIfsc)) {
            setError("Enter a valid 11-character IFSC code.");
            setIfscVerified(false);
            return;
        }


        setIfscVerified(true);
        setError("");
        setSuccess(
            "IFSC format verified. Bank details still require server-side verification."
        );
    };

    const verifyUpi = () => {
        const normalizedUpi = upiId.trim();

        if (!/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9.-]{2,64}$/.test(normalizedUpi)) {
            setError("Enter a valid UPI ID, for example name@bank.");
            setUpiVerified(false);
            return;
        }


        setUpiVerified(true);
        setError("");
        setSuccess(
            "UPI format verified. Ownership must be confirmed by a payment provider."
        );
    };

    const handleDeleteRail = (railId: string) => {
        const rail = rails.find((item) => item.id === railId);

        if (!rail) return;

        if (rail.primary) {
            setError("Change your primary payout account before removing it.");
            return;
        }

        setRails((previous) =>
            previous.filter((item) => item.id !== railId)
        );

        if (selectedExistingRail === railId) {
            setSelectedExistingRail("");
        }

        resetMessages();
    };

    const handleSubmit = async () => {
        resetMessages();

        if (selectedExistingRail) {
            const existingRail = rails.find(
                (rail) => rail.id === selectedExistingRail
            );

            if (existingRail) {
                setError(
                    "You selected an existing account. Select Add New Payout Rail to enter new details."
                );
                return;
            }
        }

        if (payoutType === "bank") {
            const account = accountNumber.trim();
            const confirmation = reAccountNumber.trim();

            if (!/^\d{9,18}$/.test(account)) {
                setError("Enter a valid bank account number.");
                return;
            }

            if (account !== confirmation) {
                setError("Bank account numbers do not match.");
                return;
            }

            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim())) {
                setError("Enter a valid IFSC code.");
                return;
            }

            if (!ifscVerified) {
                setError("Please verify the IFSC code format first.");
                return;
            }
        }

        if (payoutType === "upi") {
            if (
                !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9.-]{2,64}$/.test(
                    upiId.trim()
                )
            ) {
                setError("Enter a valid UPI ID.");
                return;
            }

            if (!upiVerified) {
                setError("Please verify the UPI ID format first.");
                return;
            }
        }

        const payoutData: PayoutData = {
            payoutType,
            accountHolder,
            selectedRail: selectedExistingRail,
            ...(payoutType === "bank"
                ? {
                    accountNumber: accountNumber.trim(),
                    ifscCode: ifscCode.trim().toUpperCase(),
                    accountType,
                }
                : {
                    upiId: upiId.trim(),
                }),
        };

        try {
            setLoading(true);

            onSave?.(payoutData);

            setVerificationRequested(true);
            setSuccess(
                "Details validated. Connect your backend to complete secure verification."
            );
        } catch {
            setError("Unable to submit payout details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetMessages();
        setVerificationRequested(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 font-sans text-[#2B211B] sm:p-5">
            <button
                type="button"
                aria-label="Close payout modal"
                onClick={handleClose}
                className="absolute inset-0 cursor-default"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="payout-title"
                className="relative z-10 flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#EFE6DC] bg-white shadow-2xl"
            >

                <header className="flex items-start justify-between gap-4 border-b border-[#F7F3EE] px-5 pb-4 pt-5 sm:px-6">
                    <div>
                        <h2
                            id="payout-title"
                            className="text-lg font-extrabold tracking-tight"
                        >
                            Change Payout Bank Account
                        </h2>

                        <p className="mt-1 text-xs font-medium leading-relaxed text-[#766960]">
                            Update your verified direct deposit account or UPI ID for instant Talk Tamila creator bounty payouts.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EFE6DC] bg-[#FAF6F0] text-[#766960] transition hover:bg-[#FFF0E8] hover:text-[#FF5E13]"
                    >
                        <X size={15} />
                    </button>
                </header>


                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 sm:px-6">
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
                        >
                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium leading-relaxed text-emerald-700"
                        >
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {verificationRequested && (
                        <div className="rounded-xl border border-[#FFD2BE] bg-[#FFF4EC] p-3 text-xs leading-relaxed text-[#8D411F]">
                            <strong>Next step:</strong> Complete account ownership
                            verification through your payment provider before making this
                            account active.
                        </div>
                    )}


                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F7F3EE] pb-3">
                        <span className="text-xs font-bold text-[#766960]">
                            Add New Payout Rail
                        </span>

                        <div className="flex items-center gap-1 rounded-full border border-[#EFE6DC] bg-[#FAF6F0] p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutType("bank");
                                    resetMessages();
                                }}
                                className={`rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${payoutType === "bank"
                                        ? "bg-white text-[#FF5E13] shadow-sm"
                                        : "text-[#766960] hover:text-[#2B211B]"
                                    }`}
                            >
                                <Landmark size={13} className="mr-1 inline" />
                                Bank Account (NEFT/IMPS)
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPayoutType("upi");
                                    resetMessages();
                                }}
                                className={`rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${payoutType === "upi"
                                        ? "bg-white text-[#FF5E13] shadow-sm"
                                        : "text-[#766960] hover:text-[#2B211B]"
                                    }`}
                            >
                                <QrCode size={13} className="mr-1 inline" />
                                UPI ID (Instant)
                            </button>
                        </div>
                    </div>


                    <div className="space-y-1.5">
                        <label
                            htmlFor="accountHolder"
                            className="block text-xs font-bold uppercase tracking-wider text-[#766960]"
                        >
                            ACCOUNT HOLDER NAME (PAN KYC MATCH)
                        </label>

                        <div className="relative flex items-center">
                            <User
                                size={14}
                                className="absolute left-3.5 text-[#A59990]"
                            />

                            <input
                                id="accountHolder"
                                type="text"
                                disabled
                                value={accountHolder}
                                className="w-full select-none rounded-xl border border-[#EFE6DC] bg-[#FAF6F0]/70 py-3 pl-10 pr-24 text-xs font-bold text-[#2B211B]/80 outline-none"
                            />

                            <span className="absolute right-3 rounded-md border border-[#EFE6DC] bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#766960]">
                                Locked to PAN
                            </span>
                        </div>
                    </div>

                    {payoutType === "bank" && (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="accountNumber"
                                        className="block text-xs font-bold uppercase tracking-wider text-[#766960]"
                                    >
                                        Bank Account Number
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="accountNumber"
                                            type={showAccountNumber ? "text" : "password"}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            value={accountNumber}
                                            onChange={(event) => {
                                                setAccountNumber(
                                                    event.target.value.replace(/\D/g, "").slice(0, 18)
                                                );
                                                resetMessages();
                                            }}
                                            placeholder="Enter account number"
                                            maxLength={18}
                                            className="w-full rounded-xl border border-[#EFE6DC] bg-white px-3.5 py-3 pr-10 text-xs font-bold tracking-widest outline-none focus:border-[#FF5E13]"
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showAccountNumber
                                                    ? "Hide account number"
                                                    : "Show account number"
                                            }
                                            onClick={() =>
                                                setShowAccountNumber((previous) => !previous)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A59990] hover:text-[#FF5E13]"
                                        >
                                            {showAccountNumber ? (
                                                <EyeOff size={14} />
                                            ) : (
                                                <Eye size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="reAccountNumber"
                                        className="block text-xs font-bold uppercase tracking-wider text-[#766960]"
                                    >
                                        Re-enter Account Number
                                    </label>

                                    <input
                                        id="reAccountNumber"
                                        type="password"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        value={reAccountNumber}
                                        onChange={(event) => {
                                            setReAccountNumber(
                                                event.target.value.replace(/\D/g, "").slice(0, 18)
                                            );
                                            resetMessages();
                                        }}
                                        placeholder="Confirm account number"
                                        maxLength={18}
                                        className="w-full rounded-xl border border-[#EFE6DC] bg-white px-3.5 py-3 text-xs font-bold tracking-widest outline-none focus:border-[#FF5E13]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="ifscCode"
                                    className="block text-xs font-bold uppercase tracking-wider text-[#766960]"
                                >
                                  IFSC Code
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        id="ifscCode"
                                        type="text"
                                        autoComplete="off"
                                        value={ifscCode}
                                        onChange={(event) => handleIfscChange(event.target.value)}
                                        placeholder="e.g. ICIC0000001"
                                        maxLength={11}
                                        className="min-w-0 flex-1 rounded-xl border border-[#EFE6DC] bg-white px-3.5 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#FF5E13]"
                                    />

                                    <button
                                        type="button"
                                        onClick={verifyIfsc}
                                        className="shrink-0 rounded-xl border border-[#FFD2BE] bg-[#FFF0E8] px-3 py-2 text-xs font-bold text-[#FF5E13] transition hover:bg-[#FFE1D1] sm:px-4"
                                    >
                                        {ifscVerified ? (
                                            <Verified size={13} className="mr-1 inline" />
                                        ) : <CheckCircle2 size={13} className="mr-1 inline" /> }
                                        {ifscVerified ? "Checked" : "Verify IFSC"}
                                    </button>
                                </div>

                                {ifscVerified && (
                                    <p className="flex items-center gap-1 pt-1 text-[11px] font-semibold text-emerald-700">
                                        <Verified size={12} />
                                        IFSC format is valid. Bank identity is not yet confirmed.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#766960]">
                                    Account Type
                                </label>

                                <div className="flex flex-wrap gap-3">
                                    {(["savings", "current"] as const).map((type) => (
                                        <label
                                            key={type}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition ${accountType === type
                                                    ? "border-[#AD3303] border-2 bg-[#FFF0E8]/50 "
                                                    : " bg-[#FFDBD033] text-[#766960] hover:bg-[#FAF6F0]"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="accountType"
                                                value={type}
                                                checked={accountType === type}
                                                onChange={() => setAccountType(type)}
                                                className="h-3.5 w-3.5 accent-[#AD3303]"
                                            />

                                            {type === "savings"
                                                ? "Savings Account"
                                                : "Current / Business Account"}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}


                    {payoutType === "upi" && (
                        <div className="space-y-3 rounded-2xl border border-[#EFE6DC] bg-[#FAF6F0]/60 p-4">
                            <div>
                                <label
                                    htmlFor="upiId"
                                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#766960]"
                                >
                                    UPI ID / VPA
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        id="upiId"
                                        type="text"
                                        autoComplete="off"
                                        value={upiId}
                                        onChange={(event) => {
                                            setUpiId(event.target.value.trim());
                                            setUpiVerified(false);
                                            resetMessages();
                                        }}
                                        placeholder="yourname@bank"
                                        className="min-w-0 flex-1 rounded-xl border border-[#EFE6DC] bg-white px-3.5 py-3 text-xs font-semibold outline-none focus:border-[#FF5E13]"
                                    />

                                    <button
                                        type="button"
                                        onClick={verifyUpi}
                                        className="shrink-0 rounded-xl bg-[#FFF0E8] px-3 py-2 text-xs font-bold text-[#FF5E13] hover:bg-[#FFE1D1]"
                                    >
                                        Verify UPI
                                    </button>
                                </div>
                            </div>

                            {upiVerified && (
                                <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                    <CheckCircle2 size={12} />
                                    UPI format is valid. Ownership verification is still required.
                                </p>
                            )}

                            <p className="text-[11px] leading-relaxed text-[#766960]">
                                Use a valid UPI ID linked to an account you own. Actual
                                ownership verification requires a supported payment provider.
                            </p>
                        </div>
                    )}


                    <div className="flex items-start gap-2.5 rounded-xl border border-[#EFE6DC] bg-[#FAF6F0] p-3.5 text-[12px] leading-relaxed text-[#766960]">
                        <ShieldCheck
                            size={17}
                            className="mt-0.5 shrink-0 text-[#FF5E13]"
                        />

                        <div>
                            <p className="font-bold text-[#2B211B]">
                                TDS & Regulatory Compliance:
                            </p>

                            <p className="mt-1">
                               Payouts are automatically mapped to verified PAN: <span className="font-bold">ABCPK****F</span> for Section 194J compliance. A ₹1.00 penny-drop credit will verify ownership instantly.
                            </p>
                        </div>
                    </div>


                    <div className="space-y-3 border-t border-[#F7F3EE] pt-5">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-bold text-[#766960]">
                                Existing Linked Accounts
                            </h3>

                            <span className="text-[10px] font-semibold text-emerald-700">
                                {rails.filter((rail) => rail.verified).length} Account Verified
                            </span>
                        </div>


                        {rails.map((rail) => (
                            <div
                                key={rail.id}
                                className={`flex items-center gap-3 rounded-xl border p-3 transition ${selectedExistingRail === rail.id
                                        ? "border-[#FF5E13] bg-[#FFF4EC]"
                                        : "border-[#EFE6DC] "
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedExistingRail(rail.id);
                                        resetMessages();
                                    }}
                                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#FF5E13]">
                                        {rail.type === "bank" ? (
                                            <Landmark size={18} />
                                        ) : (
                                            <QrCode size={18} />
                                        )}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#2B211B]">
                                            {rail.name}

                                            {rail.primary && (
                                                <span
                                                    className={`flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold gap-1 ${
                                                    rail.primary === true
                                                        ? "bg-[#FF5000] text-white" 
                                                        : rail.id === "upi"
                                                        ? "bg-[#F2DFD1] text-[#231A11]" 
                                                        : "bg-[#F1EDE8] text-[#695C51]" 
                                                    }`}
                                                >
                                                    
                                                    {rail.primary === true ? (
                                                    <CheckCircle2 size={13} className="shrink-0" />
                                                    ) : rail.id === "upi" ? (
                                                    <Sparkles size={12} className="shrink-0 fill-current" /> 
                                                    ) : (
                                                    <Verified size={13} className="shrink-0" />
                                                    )}
                                                    
                                                    <span>
                                                    {rail.primary === true ? "Primary" : rail.primary}
                                                    </span>
                                                </span>
                                                )}
                                        </span>

                                        <span className="mt-1 block break-words text-[10px] text-[#766960]">
                                            {rail.details}
                                        </span>

                                       
                                    </span>

                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selectedExistingRail === rail.id
                                                ? "border-[#FF5E13] bg-[#FF5E13]"
                                                : "border-[#DCCABD] bg-white"
                                            }`}
                                    >
                                        {selectedExistingRail === rail.id && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                        )}
                                    </span>
                                </button>

                                {!rail.primary && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRail(rail.id)}
                                        aria-label={`Remove ${rail.name}`}
                                        className="shrink-0 rounded-lg p-2 text-[#A59990] transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedExistingRail("");
                                setPayoutType("bank");
                                setAccountNumber("");
                                setReAccountNumber("");
                                setIfscCode("");
                                setIfscVerified(false);
                                setUpiId("");
                                setUpiVerified(false);
                                setVerificationRequested(false);
                                resetMessages();
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl border  border-[#DCCABD] py-3 text-xs font-bold text-[#766960] transition hover:border-[#FF5E13] hover:bg-[#FFF4EC] hover:text-[#FF5E13]"
                        >
                            <Plus size={14} />
                            Add New Payout Account
                        </button>
                    </div>

                </div>


                <footer className="flex flex-col gap-3 border-t border-[#EFE6DC] bg-[#FAF6F0] px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-2 text-[13px] leading-relaxed text-[#766960]">
                        <UserLock size={14} className="shrink-0" />
                        2FA confirmation sent to registered mobile •••• 8912
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-full border border-[#E5D9CD] bg-white px-5 py-2.5 text-xs font-bold text-[#766960] transition hover:bg-[#F3EBE3]"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={loading || verificationRequested}
                            onClick={handleSubmit}
                            className="flex items-center justify-center gap-2 rounded-full bg-[#FF5E13] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#E04D08] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {verificationRequested ? (
                                <Verified size={14} />
                            ) : (
                                <CheckCircle2 size={14} />
                            )}

                            {loading
                                ? "Processing..."
                                : verificationRequested
                                    ? "Request Submitted"
                                    : "Verify & Set as Primary"}
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
}


