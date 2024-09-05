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

const bankAccountFormSchema = z.object({
  name: z.string().max(255),
  id: z.string().optional(),
  balance: z.number().optional(),
  ownerId: z.string().optional(),
  organizationId: z.string().optional(),
});

type Props = {
  onSubmit: (values: BankAccountFormSchema) => void;
  defaultValues?: BankAccountFormSchema;
  children?: React.ReactNode;
};

export type BankAccountFormSchema = z.infer<typeof bankAccountFormSchema>;

export function BankAccountForm({ defaultValues, onSubmit, children }: Props) {
  const form = useForm<BankAccountFormSchema>({
    resolver: zodResolver(bankAccountFormSchema),
    defaultValues: {
      ...defaultValues,
      name: defaultValues?.name ?? "",
    },
  });
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da conta bancária" {...field} />
              </FormControl>
              <FormDescription>Insira o nome da conta bancária</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
