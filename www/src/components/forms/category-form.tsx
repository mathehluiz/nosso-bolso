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
import { ColorPicker } from "../ui/color-picker";
import { Textarea } from "../ui/textarea";

const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(255),
  description: z.string().optional(),
  color: z.string(),
});

type Props = {
  onSubmit: (values: CategoryFormSchema) => void;
  defaultValues?: CategoryFormSchema;
  children?: React.ReactNode;
};

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export function CategoryForm({ defaultValues, onSubmit, children }: Props) {
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: defaultValues?.id ?? "",
      color: defaultValues?.color ?? "#000000",
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
  });
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da categoria" {...field} />
                </FormControl>
                <FormDescription>Insira o nome da categoria</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs">Cor</FormLabel>
                <FormControl>
                  <ColorPicker className="w-full" {...field} />
                </FormControl>
                <FormDescription>uma cor para a categoria</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Descrição</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={3}
                  placeholder="Uma categoria"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Caso queira, insira uma descrição para a categoria
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
