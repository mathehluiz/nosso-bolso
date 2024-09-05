export type Member = {
  id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  userId: string;
  organizationId: string;
  organization: Organization;
  user: User;
};

export type User = {
  id: string;
  avatar: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
};

export type Organization = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
};
