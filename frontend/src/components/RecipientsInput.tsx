import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface Recipient {
  address: string;
  amount: string;
}

export default function RecipientsInput({
  value,
  onChange,
}: {
  value: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}) {
  const [addressErrors, setAddressErrors] = useState<string[]>([]);

  const handleRecipientChange = (
    idx: number,
    field: keyof Recipient,
    val: string
  ) => {
    const updated = value.map((r, i) =>
      i === idx ? { ...r, [field]: val } : r
    );
    onChange(updated);
    if (field === "address") {
      setAddressErrors((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
    }
  };

  const handleAddressBlur = (idx: number, address: string) => {
    if (!address) return;
    if (address.length !== 42) {
      setAddressErrors((prev) => {
        const next = [...prev];
        next[idx] = "Address must be exactly 42 characters.";
        return next;
      });
    } else {
      setAddressErrors((prev) => {
        const next = [...prev];
        next[idx] = "";
        return next;
      });
    }
  };

  const handleAdd = () => {
    onChange([...value, { address: "", amount: "" }]);
  };

  const handleDelete = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4 mb-4">
      {value.map((recipient, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-300 dark:border-gray-700 p-3 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          {/* Desktop layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full">
            <input
              type="text"
              className="w-full sm:flex-[7] px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Recipient address"
              value={recipient.address}
              onChange={(e) =>
                handleRecipientChange(idx, "address", e.target.value)
              }
              onBlur={() => handleAddressBlur(idx, recipient.address)}
              maxLength={42}
              spellCheck={false}
            />

            {/* Desktop amount + delete */}
            <div className="hidden sm:flex sm:flex-[3] items-center gap-2">
              <input
                type="number"
                className={`px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${
                  idx === 0 ? "flex-1" : ""
                }`}
                placeholder="Amount"
                value={recipient.amount}
                onChange={(e) =>
                  handleRecipientChange(idx, "amount", e.target.value)
                }
                min={0}
              />
              {idx !== 0 && (
                <button
                  type="button"
                  className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(idx)}
                  aria-label="Delete recipient"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile amount + delete row */}
          <div className="mt-2 flex sm:hidden items-center gap-2">
            <input
              type="number"
              className={`px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${
                idx === 0 ? "w-full" : "w-[85%]"
              }`}
              placeholder="Amount"
              value={recipient.amount}
              onChange={(e) =>
                handleRecipientChange(idx, "amount", e.target.value)
              }
              min={0}
            />
            {idx !== 0 && (
              <button
                type="button"
                className="flex p-2 text-red-500 hover:text-red-700 cursor-pointer justify-center items-center"
                onClick={() => handleDelete(idx)}
                aria-label="Delete recipient"
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>

          {/* Address Error */}
          {addressErrors[idx] && (
            <div className="text-xs text-red-500 mt-1 ml-1">
              {addressErrors[idx]}
            </div>
          )}
        </div>
      ))}

      {/* Add recipient button - no huge gap */}
      <div>
        <button
          type="button"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          onClick={handleAdd}
        >
          <FiPlus /> Add recipient
        </button>
      </div>
    </div>
  );
}
