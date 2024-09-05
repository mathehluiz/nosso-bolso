import { CategoryFormSchema } from "@/components/forms/category-form";
import { httpClient } from "@/lib/http-client";

export const createCategory = async (values: CategoryFormSchema) => {
  const response = await httpClient.post("/categories", values);
  return response.data;
};
