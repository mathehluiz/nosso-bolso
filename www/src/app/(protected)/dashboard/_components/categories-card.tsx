"use client";

import React from "react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArchiveRestoreIcon } from "lucide-react";
import CreateCategoryDrawer from "./create-category-drawer";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category/get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UpdateCategoryDrawer from "./update-category-drawer";
import { useSession } from "next-auth/react";

export default function CategoriesCard() {
  const { data: session } = useSession();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", session?.selectedOrganizationId],
    queryFn: async () => await getCategories(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <Card className="border-none shadow-sm mt-1 py-5 flex flex-col">
      <div className="flex justify-between px-5 items-start">
        <div className="flex gap-2">
          <ArchiveRestoreIcon className="w-5 h-5" />
          <span>
            minhas <span className="font-bold text-green-600">categorias</span>
          </span>
        </div>
        <CreateCategoryDrawer />
      </div>
      <Separator className="w-11/12 self-center my-2" />
      <ScrollArea className="flex !flex-col gap-3 px-5 h-52 ">
        <ScrollBar orientation="vertical" />
        {isLoading &&
          !categories &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10 my-2" />
          ))}
        {categories?.map((category) => (
          <UpdateCategoryDrawer key={category.id} category={category} />
        ))}
      </ScrollArea>
    </Card>
  );
}
