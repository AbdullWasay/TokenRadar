interface TransactionsTableProps {
  transactions: {
    id: string
    date: string
    owner: string
    type: string
    tradedToken: string
    usd: string
    tokenAmount: string
    hash: string
  }[]
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Owner</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Trade Type</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Token Traded</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">USD</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Token Amount</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500">Hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{tx.date}</td>
              <td className="px-4 py-3 text-sm">{tx.owner}</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">{tx.type}</span>
              </td>
              <td className="px-4 py-3 text-sm">{tx.tradedToken}</td>
              <td className="px-4 py-3 text-sm">{tx.usd}</td>
              <td className="px-4 py-3 text-sm text-red-500">{tx.tokenAmount}</td>
              <td className="px-4 py-3 text-sm">{tx.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
