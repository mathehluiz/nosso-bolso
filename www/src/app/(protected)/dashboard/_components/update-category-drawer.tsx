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
import { cn } from "@/lib/utils";
import { createCategory } from "@/services/category/create-category";
import { deleteCategory } from "@/services/category/delete-category";
import { updateCategory } from "@/services/category/update-category";
import { Category } from "@/types/category";
import { useQueryClient } from "@tanstack/react-query";
import { ALargeSmallIcon, EditIcon, PlusIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

type Props = {
  category: Category;
};

export default function UpdateCategoryDrawer({ category }: Props) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const handleUpdateCategory = async (values: CategoryFormSchema) => {
    try {
      await updateCategory(values);
      await queryClient.invalidateQueries({
        queryKey: ["categories", session?.selectedOrganizationId],
      });
      toast.success("Categoria atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(category.id);
      await queryClient.invalidateQueries({
        queryKey: ["categories", session?.selectedOrganizationId],
      });
      toast.success("Categoria removida com sucesso");
    } catch (error) {
      toast.error("Erro ao remover categoria");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex gap-2 items-center my-2">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-green-400"
            )}
            style={{ backgroundColor: category.color }}
          >
            <ALargeSmallIcon className="w-5 h-5 rounded-full" />
          </div>
          <div className="flex flex-col">
            <span>{category.name}</span>
            <span className="text-xs text-muted-foreground">
              {category.description || "Sem descrição"}
            </span>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[45%] px-5">
        <DrawerHeader>
          <DrawerTitle>{category.name}</DrawerTitle>
        </DrawerHeader>
        <CategoryForm defaultValues={category} onSubmit={handleUpdateCategory}>
          <div className="flex justify-between gap-8">
            <DrawerClose asChild>
              <Button
                type="button"
                onClick={handleDeleteCategory}
                variant={"secondary"}
                className="w-full"
              >
                <XIcon className="w-4 h-4 mr-2" /> Remover{" "}
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button type="submit" className="w-full">
                <EditIcon className="w-4 h-4 mr-2" /> Atualizar{" "}
              </Button>
            </DrawerClose>
          </div>
        </CategoryForm>
      </DrawerContent>
    </Drawer>
  );
}
