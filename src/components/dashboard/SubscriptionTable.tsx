import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronDown } from "lucide-react";

import { Subscription } from "@/lib/subscriptions";

interface SubscriptionDisplay extends Subscription {
  customerName: string;
  amount: number;
  lastBilled: string;
  nextBilling: string;
}

interface SubscriptionTableProps {
  subscriptions?: Subscription[];
  onSearch?: (term: string) => void;
  onFilter?: (filter: string) => void;
}

const defaultSubscriptions: Subscription[] = [
  {
    id: "1",
    customerName: "John Doe",
    plan: "Premium",
    status: "Active",
    amount: 49.99,
    lastBilled: "2024-03-01",
    nextBilling: "2024-04-01",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    plan: "Basic",
    status: "Active",
    amount: 29.99,
    lastBilled: "2024-03-15",
    nextBilling: "2024-04-15",
  },
  {
    id: "3",
    customerName: "Bob Johnson",
    plan: "Enterprise",
    status: "Cancelled",
    amount: 199.99,
    lastBilled: "2024-02-28",
    nextBilling: "N/A",
  },
];

const SubscriptionTable = ({
  subscriptions = defaultSubscriptions,
  onSearch = () => {},
  onFilter = () => {},
}: SubscriptionTableProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search subscriptions..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Last Billed</TableHead>
              <TableHead>Next Billing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.customerName}</TableCell>
                <TableCell>{subscription.plan}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      subscription.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.status}
                  </span>
                </TableCell>
                <TableCell>${subscription.amount.toFixed(2)}</TableCell>
                <TableCell>{subscription.lastBilled}</TableCell>
                <TableCell>{subscription.nextBilling}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionTable;
