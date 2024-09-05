import { httpClient } from "@/lib/http-client";
import axios from "axios";

export const getMe = async (token: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
