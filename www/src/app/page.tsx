"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ReceiptPoundSterlingIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email precisa ser maior que 2 caracteres.",
  }),
  password: z.string().min(2, {
    message: "Senha precisa ser maior que 2 caracteres.",
  }),
});

export default function Login() {
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl")
    ? (params?.get("callbackUrl") as string)
    : "/dashboard";
  const router = useRouter();

  const login = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then(({ ok, error }: any) => {
      if (ok) {
        router.push(callbackUrl);
      } else {
        console.log(error);
        setLoading(false);
        toast.error("Falha ao conectar, verifique seus dados!");
      }
    });
    setLoading(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await login(values);
    setLoading(false);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Bem-vindo de volta!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/logonossobolso.png"
                  alt="Logo"
                  width={40}
                  height={40}
                />
                <span className="text-lg font-semibold">Nosso bolso</span>
              </div>
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                Login
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com.br" {...field} />
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
                    {loading && (
                      <Loader2Icon className="animate-spin w-4 h-4" />
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
