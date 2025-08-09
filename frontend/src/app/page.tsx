"use client";
import { useState } from "react";

import { useAccount } from "wagmi";
import PleaseConnectWallet from "../components/PleaseConnectWallet";
import BatchSenderTabs from "../components/BatchSenderTabs";
import BatchSendERC20 from "../components/BatchSendERC20";
import BatchSendERC721 from "../components/BatchSendERC721";

export default function Home() {
  const [tab, setTab] = useState<"erc20" | "erc721">("erc20");
  const { isConnected } = useAccount();
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <PleaseConnectWallet />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mt-8 w-full max-w-2xl">
        <BatchSenderTabs onTabChange={setTab} />
        {tab === "erc20" ? <BatchSendERC20 /> : <BatchSendERC721 />}
      </div>
    </div>
  );
}
