import { httpClient } from "@/lib/http-client";
import { Category } from "@/types/category";

export const getCategories = async () => {
  const response = await httpClient.get<Category[]>("/categories");
  return response.data;
};
