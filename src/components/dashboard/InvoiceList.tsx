import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Send, RefreshCw } from "lucide-react";
import { Invoice } from "@/lib/invoicing";

interface InvoiceListProps {
  invoices?: Invoice[];
  onDownload?: (invoiceId: string) => void;
  onResend?: (invoiceId: string) => void;
  onRetry?: (invoiceId: string) => void;
}

const defaultInvoices: Invoice[] = [
  {
    id: "1",
    subscriptionId: "sub_1",
    userId: "user_1",
    amount: 99.99,
    tax: 10,
    taxRate: {
      id: "tax_1",
      country: "US",
      rate: 0.1,
      type: "sales",
    },
    status: "paid",
    dueDate: "2024-04-01",
    paidAt: "2024-03-25",
    items: [
      {
        description: "Monthly Subscription",
        quantity: 1,
        unitPrice: 99.99,
        amount: 99.99,
        taxable: true,
      },
    ],
  },
];

const InvoiceList = ({
  invoices = defaultInvoices,
  onDownload = () => {},
  onResend = () => {},
  onRetry = () => {},
}: InvoiceListProps) => {
  const getStatusBadgeColor = (status: Invoice["status"]) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  return (
    <Card className="w-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Recent Invoices</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>#{invoice.id}</TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>${invoice.tax.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(invoice.status)}`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResend(invoice.id)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  {invoice.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(invoice.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InvoiceList;
