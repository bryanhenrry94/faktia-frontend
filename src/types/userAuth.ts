import { Tenant } from "./tenant";

export type UserAuth = {
  userId: string;
  email: string;
  name: string;
  role: string;
  tenant: Tenant;
};
