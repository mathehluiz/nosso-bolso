import axios from "axios";

export const createUser = async (input: {
  avatar?: string;
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user`,
    input
  );
  return data;
};
