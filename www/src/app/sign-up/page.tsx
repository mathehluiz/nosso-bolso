"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardFooter } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { createUser } from "@/services/users/create-user";
import { createOrganization } from "@/services/organizations/create-organization";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Nome precisa ser maior que 2 caracteres.",
  }),
  password: z.string().min(2, {
    message: "Senha precisa ser maior que 2 caracteres.",
  }),
  email: z.string().min(2, {
    message: "Email precisa ser maior que 2 caracteres.",
  }),
  orgName: z.string().min(2, {
    message: "Grupo precisa ser maior que 2 caracteres.",
  }),
});

export type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  async function onSubmit(values: SignUpFormValues) {
    try {
      setLoading(true);
      const user = await createUser({
        avatar: "https://avatar.iran.liara.run/public",
        name: values.username,
        email: values.email,
        password: values.password,
      });
      await createOrganization({
        name: values.orgName,
        ownerId: user.id,
      });
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao criar conta, tente novamente mais tarde.");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Cadastre-se</h1>
          <p className="text-muted-foreground">
            Faça parte da revolução financeira
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do seu grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="***********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="p-0">
              <Button type="submit" className="w-full">
                Entrar{" "}
                {loading && <Loader2Icon className="animate-spin w-4 h-4" />}
              </Button>
            </CardFooter>
          </form>
        </Form>
        <div className="text-center mt-4 text-muted-foreground">
          Já possui uma conta?{" "}
          <Link
            href="/"
            className="text-primary hover:underline"
            prefetch={false}
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
