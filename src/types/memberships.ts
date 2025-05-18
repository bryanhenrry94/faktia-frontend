import { Tenant } from "./tenant";
import { User } from "./user";

export type Membership = {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  tenant: Tenant;
};
