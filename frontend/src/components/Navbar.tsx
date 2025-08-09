"use client";
import { useState } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-lg z-20">
      {/* Main container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/batch-logo.svg"
            alt="Batch-Sender Logo"
            width={36}
            height={36}
            className="shrink-0"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-blue-700 dark:text-blue-400">
              Batch-Sender
            </span>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Batch send ERC-20 & ERC-721 tokens
            </span>
          </div>
        </div>

        {/* Desktop Connect Button */}
        <div className="hidden sm:block">
          <ConnectButton showBalance={false} />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden mt-3 px-3 pb-3 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="flex flex-col items-center gap-3 pt-3">
            {/* Mobile Logo Text */}
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg tracking-tight text-blue-700 dark:text-blue-400">
                Batch-Sender
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Batch send ERC-20 & ERC-721 tokens
              </span>
            </div>

            {/* Connect Button */}
            <ConnectButton showBalance={false} />
          </div>
        </div>
      )}
    </nav>
  );
}
