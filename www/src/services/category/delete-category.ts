import { httpClient } from "@/lib/http-client";

export const deleteCategory = async (id: string) => {
  await httpClient.delete(`/categories/${id}`);
};
