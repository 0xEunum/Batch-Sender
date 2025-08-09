import React from "react";

export default function TransactionDetails({
  tokenName,
  amountTokens,
}: {
  tokenName: string;
  amountTokens: string | number;
}) {
  return (
    <div className="w-full bg-white/95 dark:bg-gray-900/95 rounded-lg border border-gray-200 dark:border-gray-800 shadow p-3 mb-4">
      <div className="font-bold text-base text-blue-700 dark:text-blue-400 mb-2 text-center">
        Transaction Details
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-xs">
            Token Name:
          </span>
          <span className="font-semibold text-right text-xs break-all">
            {tokenName || "-"}
          </span>
        </div>
        <div className="flex flex-row justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-xs">
            Total Amount (tokens):
          </span>
          <span className="font-semibold text-right text-xs break-all">
            {amountTokens || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
