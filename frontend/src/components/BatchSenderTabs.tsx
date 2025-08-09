"use client";
import React, { useState } from "react";

export default function BatchSenderTabs({
  onTabChange,
}: {
  onTabChange: (tab: "erc20" | "erc721") => void;
}) {
  const [activeTab, setActiveTab] = useState<"erc20" | "erc721">("erc20");

  const handleTabClick = (tab: "erc20" | "erc721") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        className={`px-6 py-2 rounded-t-lg font-semibold transition-colors border-b-2 cursor-pointer ${
          activeTab === "erc20"
            ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950"
            : "border-transparent text-gray-500 dark:text-gray-400"
        }`}
        onClick={() => handleTabClick("erc20")}
      >
        ERC-20 Batch Send
      </button>
      <button
        className={`px-6 py-2 rounded-t-lg font-semibold transition-colors border-b-2 cursor-pointer ${
          activeTab === "erc721"
            ? "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950"
            : "border-transparent text-gray-500 dark:text-gray-400"
        }`}
        onClick={() => handleTabClick("erc721")}
      >
        ERC-721 Batch Send
      </button>
    </div>
  );
}
