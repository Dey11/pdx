import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Muted } from "../typography/muted";

type Transaction = {
  updatedAt: string;
  createdAt: string;
  paymentId: string;
  amount: number;
  tax: number;
  type: "payment";
  currency: string;
  status: "pending" | "failed" | "succeeded";
};

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setError(null);
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy HH:mm");
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "succeeded":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "failed":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto">
      {
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.paymentId}>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                <TableCell>{transaction.paymentId}</TableCell>
                <TableCell>
                  {formatAmount(transaction.amount, transaction.currency)}
                </TableCell>
                <TableCell>
                  {formatAmount(transaction.tax, transaction.currency)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(transaction.status)} text-white`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }

      {transactions.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <Muted>No transactions found</Muted>
        </div>
      )}

      {error && (
        <div className="flex h-full w-full items-center justify-center">
          <Muted>Error loading transactions</Muted>
        </div>
      )}
    </div>
  );
}
