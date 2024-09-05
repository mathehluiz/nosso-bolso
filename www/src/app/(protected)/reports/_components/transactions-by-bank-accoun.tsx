"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
};

export function TransactionsByBankAccount({ transactions }: Props) {
  const chartConfig: any = transactions.reduce((acc: any, transaction) => {
    if (transaction.bank_account.name in acc) {
      acc[transaction.bank_account.name] += transaction.amount;
    } else {
      acc[transaction.bank_account.name] = transaction.amount;
    }
    return acc;
  }, {}) satisfies ChartConfig;

  const chartData = Object.keys(chartConfig).map((key) => ({
    bankAccount: key,
    total: chartConfig[key],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações por conta</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="total">
              <LabelList position="top" dataKey="bankAccount" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.bankAccount}
                  fill={item.total > 0 ? "#22c55e" : "red"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <CardDescription className="flex gap-2">
          {chartData
            .reduce((acc, item) => (acc += item.total), 0)
            .toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
          no mês
          <TrendingUp size={16} />
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
