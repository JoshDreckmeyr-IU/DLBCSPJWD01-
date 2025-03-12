
import React, { useState } from "react";
import { 
  ArrowUpDown, 
  ChevronDown, 
  ChevronsUpDown, 
  MoreHorizontal, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { format } from "date-fns";

import { useTrades } from "@/hooks/useTrades";
import type { Trade } from "@/types/trade.types";
import { formatCurrency } from "@/utils/tradeAnalytics";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SortField = "date" | "symbol" | "direction" | "pnl";
type SortDirection = "asc" | "desc";

const TradeHistory = () => {
  const { trades, deleteTrade, calculatePnL } = useTrades();
  const { toast } = useToast();
  
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTrades = [...trades].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "date":
        aValue = a.date.getTime();
        bValue = b.date.getTime();
        break;
      case "symbol":
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case "direction":
        aValue = a.direction;
        bValue = b.direction;
        break;
      case "pnl":
        aValue = calculatePnL(a);
        bValue = calculatePnL(b);
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const handleDelete = (id: string) => {
    deleteTrade(id);
    toast({
      title: "Trade Deleted",
      description: "The trade has been removed from your journal.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="flex items-center p-0 h-8"
                  >
                    Date
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("symbol")}
                    className="flex items-center p-0 h-8"
                  >
                    Symbol
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("direction")}
                    className="flex items-center p-0 h-8"
                  >
                    Direction
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("pnl")}
                    className="flex items-center p-0 h-8 ml-auto"
                  >
                    P&L
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.length > 0 ? (
                sortedTrades.map((trade) => {
                  const pnl = calculatePnL(trade);
                  const isProfitable = pnl > 0;

                  return (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {format(trade.date, "MM/dd/yy")}
                      </TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>
                        <span className={trade.direction === "long" ? "text-green-600" : "text-red-600"}>
                          {trade.direction.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>{trade.exitPrice.toFixed(2)}</TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell className={`text-right font-medium ${isProfitable ? "text-profit" : "text-loss"}`}>
                        {formatCurrency(pnl)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDelete(trade.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No trades recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistory;
