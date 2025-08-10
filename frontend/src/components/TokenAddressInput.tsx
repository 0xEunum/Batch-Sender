"use client";
import { useState } from "react";
import { usePublicClient } from "wagmi";
import { erc20Abi } from "viem";

export default function TokenAddressInput({
  value,
  onChange,
  onError,
  onTokenInfo,
}: {
  value: string;
  onChange: (val: string) => void;
  onError?: (err: string) => void;
  onTokenInfo?: (info: {
    name: string;
    symbol: string;
    decimals: number;
  }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
  } | null>(null);
  const publicClient = usePublicClient();

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const fetchTokenInfo = async (addr: string) => {
    setLoading(true);
    setError("");
    setTokenInfo(null);
    try {
      if (!publicClient) throw new Error("No public client available");
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: addr as `0x${string}`,
          abi: erc20Abi,
          functionName: "name",
        }),
        publicClient.readContract({
          address: addr as `0x${string}`,
          abi: erc20Abi,
          functionName: "symbol",
        }),
        publicClient.readContract({
          address: addr as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        }),
      ]);
      setTokenInfo({ name: name as string, symbol: symbol as string });
      onTokenInfo?.({
        name: name as string,
        symbol: symbol as string,
        decimals: Number(decimals),
      });
    } catch {
      setError(
        "Could not fetch token details. Make sure this is a valid ERC-20 token address."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setTokenInfo(null);
    setError("");
    onError?.("");
  };

  const handleBlur = () => {
    if (!value) return;
    if (!isValidAddress(value)) {
      setError(
        "Invalid token address. Must be 42 characters and hexadecimal (0x...)"
      );
      setTokenInfo(null);
      onError?.(
        "Invalid token address. Must be 42 characters and hexadecimal (0x...)"
      );
      return;
    }
    setError("");
    onError?.("");
    fetchTokenInfo(value);
  };

  return (
    <div className="mb-6 w-full max-w-md mx-auto">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        ERC-20 Token Address
      </label>
      <input
        type="text"
        className={`w-full px-3 py-2 rounded border ${
          error ? "border-red-500" : "border-gray-300"
        } dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors`}
        placeholder="0x..."
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={42}
        spellCheck={false}
      />

      {loading && (
        <div className="mt-2 text-blue-500 animate-pulse">
          Loading token details...
        </div>
      )}

      {error && <div className="mt-2 text-red-500">{error}</div>}

      {tokenInfo && !loading && !error && (
        <div className="mt-3 flex gap-2 items-center">
          <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-base break-words">
            Name: "{tokenInfo.name}"
          </span>
          <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-base break-words">
            Symbol: "{tokenInfo.symbol}"
          </span>
        </div>
      )}
    </div>
  );
}
