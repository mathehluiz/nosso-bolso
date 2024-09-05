import axios from "axios";

export const createOrganization = async (data: {
  name: string;
  ownerId: string;
}) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/organization`, data);
};
