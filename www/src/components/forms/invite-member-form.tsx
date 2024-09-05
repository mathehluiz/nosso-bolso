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

const inviteMemberFormSchema = z.object({
  email: z.string().max(255),
});

type Props = {
  onSubmit: (values: InviteMemberFormSchema) => void;
  defaultValues?: InviteMemberFormSchema;
  children?: React.ReactNode;
};

export type InviteMemberFormSchema = z.infer<typeof inviteMemberFormSchema>;

export function InviteMemberForm({ onSubmit, children }: Props) {
  const form = useForm<InviteMemberFormSchema>({
    resolver: zodResolver(inviteMemberFormSchema),
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Email do agente" {...field} />
              </FormControl>
              <FormDescription>Insira o email do agente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
