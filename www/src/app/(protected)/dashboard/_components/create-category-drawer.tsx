import {
  CategoryForm,
  CategoryFormSchema,
} from "@/components/forms/category-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { createCategory } from "@/services/category/create-category";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

export default function CreateCategoryDrawer() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const handleCreateAccount = async (values: CategoryFormSchema) => {
    try {
      await createCategory(values);
      await queryClient.invalidateQueries({
        queryKey: ["categories", session?.selectedOrganizationId],
      });
      toast.success("Categoria criada com sucesso");
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="-mt-3 !p-0">
          <PlusIcon className="w-6 h-6 text-green-400 " />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[45%] px-5">
        <DrawerHeader>
          <DrawerTitle>Nova categoria</DrawerTitle>
        </DrawerHeader>
        <CategoryForm onSubmit={handleCreateAccount}>
          <DrawerClose asChild>
            <Button type="submit" className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" /> Adicionar{" "}
            </Button>
          </DrawerClose>
        </CategoryForm>
      </DrawerContent>
    </Drawer>
  );
}
