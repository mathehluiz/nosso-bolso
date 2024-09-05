"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { getBankAccounts } from "@/services/bank-account/get-bank-accounts";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category/get-categories";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useSession } from "next-auth/react";

const transactionFormSchema = z.object({
  id: z.string().optional(),
  note: z.string().max(255),
  organizationId: z.string().optional(),
  categoryId: z.string({ required_error: "Selecione um grupo" }),
  bankAccountId: z.string({ required_error: "Selecione uma conta bancária" }),
  amount: z.coerce
    .number({ required_error: "Informe um valor" })
    .positive({ message: "O valor deve ser positivo" }),
  date: z.coerce.date({ required_error: "Informe uma data" }),
  type: z.enum(["INCOME", "EXPENSE"]),
  paid: z.boolean({ required_error: "Informe se a transação foi finalizada" }),
});

type Props = {
  onSubmit: (values: TransactionFormSchema) => void;
  defaultValues?: TransactionFormSchema;
  children?: React.ReactNode;
};

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

export function TransactionForm({ defaultValues, onSubmit, children }: Props) {
  const { data: session } = useSession();
  const form = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  const { data: bankAccounts } = useQuery({
    queryKey: ["bank-accounts", session?.selectedOrganizationId],
    queryFn: () => getBankAccounts(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", session?.selectedOrganizationId],
    queryFn: () => getCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 px-5"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  className="grid w-full grid-cols-2 gap-3"
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value={"INCOME"} className="hidden" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <Card
                        className={
                          "INCOME" === field.value
                            ? "border-green-500"
                            : "" + " cursor-pointer"
                        }
                      >
                        <CardHeader>
                          <span className="text-lg font-bold text-green-500">
                            Receita
                          </span>
                          <CardDescription className="text-md text-green-500">
                            Recebimento de dinheiro
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value={"EXPENSE"} className="hidden" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <Card
                        className={
                          "EXPENSE" === field.value
                            ? "border-red-500"
                            : "" + " cursor-pointer"
                        }
                      >
                        <CardHeader>
                          <span className="text-lg font-bold text-red-500">
                            Despesa
                          </span>
                          <CardDescription className="text-md text-red-500">
                            Um gasto de dinheiro
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs">Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da transação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-xs">Valor</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    locale={ptBR}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {bankAccounts && (
          <FormField
            control={form.control}
            name="bankAccountId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Conta</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Conta bancária" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankAccounts.map((bankAccount: any) => (
                      <SelectItem key={bankAccount.id} value={bankAccount.id}>
                        {bankAccount.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {categories && (
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((group: any) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="paid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Transação finalizada
                </FormLabel>
                <FormDescription>
                  Marque se a transação foi finalizada ou ainda está pendente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
