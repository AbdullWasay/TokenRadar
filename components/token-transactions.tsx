import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"

interface TokenTransactionsProps {
  transactions: Transaction[]
}

export default function TokenTransactions({ transactions }: TokenTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Address</th>
            <th className="text-right py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-800">
              <td className="py-3 px-4">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    tx.type === "buy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {tx.type.toUpperCase()}
                </span>
              </td>
              <td className="py-3 px-4 text-sm">{tx.amount}</td>
              <td className="py-3 px-4 text-sm">{tx.value}</td>
              <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(tx.time, { addSuffix: true })}
              </td>
              <td className="py-3 px-4 text-sm">
                <code className="text-xs bg-gray-50 dark:bg-gray-800 p-1 rounded">{tx.address}</code>
              </td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
