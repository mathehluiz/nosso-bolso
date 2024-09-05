import { CategoryFormSchema } from "@/components/forms/category-form";
import { httpClient } from "@/lib/http-client";

export const updateCategory = async (values: CategoryFormSchema) => {
  const { id, ...categoryData } = values;
  const response = await httpClient.patch(`/categories/${id}`, categoryData);
  return response.data;
};
