import { useAccount } from "wagmi";
import { FaWallet } from "react-icons/fa"; // Install react-icons if you haven't

export default function PleaseConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return null;

  return (
    <div className="flex items-center justify-center min-h-[40vh] px-4">
      <div className="bg-white/80 dark:bg-zinc-900/80 w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 flex flex-col items-center backdrop-blur-lg">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <span className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-green-400 shadow-md">
            <FaWallet className="text-white text-2xl sm:text-3xl" />
          </span>
        </div>

        {/* Title */}
        <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Connect Wallet Required
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          To securely use the <b>Batch Sender dApp</b>, please connect your
          wallet.
        </p>
      </div>
    </div>
  );
}
