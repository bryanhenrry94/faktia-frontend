import { Tenant } from "./tenant";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  lastLogin: Date;
  tenantId: string;
  tenant: Tenant;
  createdAt: Date;
};

export type UserFormInputs = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  tenantId: string;
};

export type UserChangePassword = {
  password: string;
  confirmPassword: string;
};
