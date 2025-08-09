"use client";

import { useState } from "react";

import RecipientsInput from "./RecipientsInput";
import TransactionDetails from "./TransactionDetails";
import TokenAddressInput from "./TokenAddressInput";

export default function BatchSendERC20() {
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
  } | null>(null);

  const [recipients, setRecipients] = useState([{ address: "", amount: "" }]);

  // Calculate total token amount
  const totalTokens = recipients.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0
  );

  // Validation
  const hasRecipientError = recipients.some(
    (r) =>
      !r.address ||
      r.address.length !== 42 ||
      !r.amount ||
      isNaN(Number(r.amount))
  );
  const isFormValid = tokenInfo && !hasRecipientError;

  function handleSendTokens() {
    // Replace with your on-chain logic later!
    console.log({ tokenInfo, recipients });
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-lg px-4 sm:px-8 py-5 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center sm:text-left tracking-tight select-none">
        Batch Send ERC-20 Tokens
      </h2>
      <TokenAddressInput onTokenInfo={setTokenInfo} />
      <RecipientsInput value={recipients} onChange={setRecipients} />
      <TransactionDetails
        tokenName={tokenInfo?.name || "-"}
        amountTokens={totalTokens.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}
      />
      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold text-base sm:text-lg shadow-lg hover:from-blue-600 hover:to-blue-500 transition mt-3 mb-1 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
        onClick={handleSendTokens}
        disabled={!isFormValid}
      >
        Send Tokens
      </button>
    </div>
  );
}
