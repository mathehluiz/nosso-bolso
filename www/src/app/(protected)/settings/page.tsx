"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import OrganizationMembers from "./_components/organization-member";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const { data: session } = useSession();
  return (
    <div className="py-4 flex flex-col gap-3">
      <div className="flex items-center gap-1 ml-10">
        <div className="flex-1">
          <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Configurações</h1>
            </div>
            <div className="flex flex-col xl:grid xl:grid-cols-[200px_1fr] gap-8">
              <div className="flex flex-col space-y-1">
                <Link
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                  prefetch={false}
                >
                  Perfil
                </Link>
                <Link
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                  prefetch={false}
                >
                  Grupo
                </Link>
              </div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Meu perfil</CardTitle>
                  <CardDescription>
                    Informações básicas, como seu nome e endereço de email
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        defaultValue={session?.user?.name || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        disabled
                        id="email"
                        defaultValue={session?.user?.email || ""}
                      />
                    </div>
                  </form>
                  <Button
                    className="mt-5 self-end"
                    onClick={() => {
                      toast.success("Perfil atualizado com sucesso");
                    }}
                  >
                    Salvar
                  </Button>
                </CardContent>
              </Card>
              <OrganizationMembers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
