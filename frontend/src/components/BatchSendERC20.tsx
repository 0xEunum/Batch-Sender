"use client";

import { useMemo, useState, useEffect } from "react";
import React from "react";
import Loader from "./ui/Loader";

import RecipientsInput from "./RecipientsInput";
import TransactionDetails from "./TransactionDetails";
import TokenAddressInput from "./TokenAddressInput";
import { readContract, writeContract } from "wagmi/actions";
import { useConfig, useAccount, useChainId } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { getContractConfig } from "@/utils/constants";

export default function BatchSendERC20() {
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
  } | null>(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAddressError, setTokenAddressError] = useState("");
  const [approveNeeded, setApproveNeeded] = useState(false);
  const [checkingApprove, setCheckingApprove] = useState(false);
  const [recipients, setRecipients] = useState([{ address: "", amount: "" }]);
  const [txLoading, setTxLoading] = useState(false);
  const [txSuccess, setTxSuccess] = useState<{ hash: string } | null>(null);

  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { ERC20BatchSender, ERC20BatchSenderAbi } = getContractConfig(chainId);

  // Calculate total token amount (for display and logic, as plain number)
  const totalTokens = recipients.reduce(
    (sum, r) => sum + (parseFloat(r.amount) || 0),
    0
  );
  // Use totalAmount as a float/number, not wei
  const totalAmount = useMemo(() => {
    return recipients.reduce((sum, r) => {
      const val = parseFloat(r.amount || "0");
      return sum + val;
    }, 0);
  }, [recipients]);

  // Validation
  const hasRecipientError = recipients.some(
    (r) =>
      !r.address ||
      r.address.length !== 42 ||
      !r.amount ||
      isNaN(Number(r.amount))
  );
  const isFormValid =
    tokenInfo && !hasRecipientError && tokenAddress && !tokenAddressError;

  // Returns allowance as a BigInt (raw units)
  const fetchAllowanceAmount = async (): Promise<bigint> => {
    const allowanceAmount = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address!, ERC20BatchSender as `0x${string}`],
    });
    return BigInt(allowanceAmount as any);
  };

  // Approve tokens, then call airdropERC20Tokens
  const approveAndERC20BatchSend = async () => {
    if (!tokenInfo) return;
    setTxLoading(true);
    try {
      // Convert all amounts to BigInt with correct decimals
      const decimals = tokenInfo.decimals;
      const recipientsArr = recipients.map((r) => r.address);
      const amountsArr = recipients.map((r) =>
        parseUnits(r.amount || "0", decimals)
      );
      const totalAmountWithDecimals = parseUnits(
        totalAmount.toString(),
        decimals
      );
      console.log(totalAmount);
      console.log(decimals);
      console.log(totalAmountWithDecimals);
      // 1. Approve the BatchSender contract to spend totalAmount tokens (with decimals)
      await writeContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [ERC20BatchSender as `0x${string}`, totalAmountWithDecimals],
      });
      // 2. Call airdropERC20Tokens on the batch sender contract
      const airdropTx = await writeContract(config, {
        abi: ERC20BatchSenderAbi,
        address: ERC20BatchSender as `0x${string}`,
        functionName: "airdropERC20Tokens",
        args: [
          tokenAddress,
          recipientsArr,
          amountsArr,
          totalAmountWithDecimals,
        ],
      });
      setTxSuccess({ hash: airdropTx });
    } catch (err) {
      console.error("Error in approveAndERC20BatchSend:", err);
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTxLoading(false);
    }
  };

  // Direct batch send (no approve)
  const ERC20BatchSend = async () => {
    if (!tokenInfo) return;
    setTxLoading(true);
    try {
      const decimals = tokenInfo.decimals;
      const recipientsArr = recipients.map((r) => r.address);
      const amountsArr = recipients.map((r) =>
        parseUnits(r.amount || "0", decimals)
      );
      const totalAmountWithDecimals = parseUnits(
        totalAmount.toString(),
        decimals
      );
      const airdropTx = await writeContract(config, {
        abi: ERC20BatchSenderAbi,
        address: ERC20BatchSender as `0x${string}`,
        functionName: "airdropERC20Tokens",
        args: [
          tokenAddress,
          recipientsArr,
          amountsArr,
          totalAmountWithDecimals,
        ],
      });
      setTxSuccess({ hash: airdropTx });
    } catch (err) {
      console.error("Error in ERC20BatchSend:", err);
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTxLoading(false);
    }
  };

  async function handleSendTokens() {
    if (!tokenAddress || tokenAddressError) return;
    if (approveNeeded) {
      await approveAndERC20BatchSend();
    } else {
      await ERC20BatchSend();
    }
  }

  // Update approveNeeded in real time as recipients/tokenAddress/totalAmount change
  useEffect(() => {
    async function checkAllowance() {
      setCheckingApprove(true);
      if (
        !tokenAddress ||
        tokenAddressError ||
        hasRecipientError ||
        !tokenInfo
      ) {
        setApproveNeeded(false);
        setCheckingApprove(false);
        return;
      }
      try {
        const decimals = tokenInfo.decimals;
        const allowance = await fetchAllowanceAmount();
        const totalAmountWithDecimals = parseUnits(
          totalAmount.toString(),
          decimals
        );
        setApproveNeeded(allowance < totalAmountWithDecimals);
      } catch {
        setApproveNeeded(false);
      } finally {
        setCheckingApprove(false);
      }
    }
    checkAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipients, tokenAddress, tokenAddressError, totalAmount, tokenInfo]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-lg px-4 sm:px-8 py-5 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center sm:text-left tracking-tight select-none">
        Batch Send ERC-20 Tokens
      </h2>
      <TokenAddressInput
        value={tokenAddress}
        onChange={setTokenAddress}
        onError={setTokenAddressError}
        onTokenInfo={(info) => setTokenInfo(info && tokenAddress ? info : null)}
      />
      <RecipientsInput value={recipients} onChange={setRecipients} />
      <TransactionDetails
        tokenName={tokenInfo?.name || "-"}
        amountTokens={totalTokens.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}
        amountWei={
          tokenInfo
            ? String(
                recipients
                  .map((r) => parseUnits(r.amount || "0", tokenInfo.decimals))
                  .reduce((a, b) => a + b, BigInt(0))
              )
            : "-"
        }
        decimals={tokenInfo?.decimals || 0}
      />
      {checkingApprove || txLoading ? (
        <div className="flex justify-center my-2">
          <Loader />
          <span className="ml-2 text-blue-500 font-medium">
            {txLoading ? "Mining transaction..." : "Checking allowance..."}
          </span>
        </div>
      ) : (
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold text-base sm:text-lg shadow-lg hover:from-blue-600 hover:to-blue-500 transition mt-3 mb-1 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide cursor-pointer"
          onClick={handleSendTokens}
          disabled={!isFormValid || checkingApprove || txLoading}
        >
          {approveNeeded ? "Approve & Send Tokens" : "Send Tokens"}
        </button>
      )}

      {/* Success Dialog */}
      {txSuccess && <DialogTxSuccess hash={txSuccess.hash} chainId={chainId} />}
    </div>
  );
}

// DialogTxSuccess helper should be outside the main component
function DialogTxSuccess({ hash, chainId }: { hash: string; chainId: number }) {
  let explorer = "";
  if (chainId === 1) explorer = `https://etherscan.io/tx/${hash}`;
  else if (chainId === 11155111)
    explorer = `https://sepolia.etherscan.io/tx/${hash}`;
  else explorer = `https://etherscan.io/tx/${hash}`;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2 text-green-600">
          Transaction Successful!
        </h3>
        <div className="mb-4 break-all text-gray-700 dark:text-gray-200">
          <span className="font-semibold">Tx Hash:</span>
          <br />
          <a
            href={explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {hash}
          </a>
        </div>
        <button
          className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// DialogTxSuccess helper should be outside the main component
