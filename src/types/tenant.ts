export type Tenant = {
  id: number;
  name: string;
  status: string;
  plan: string;
  email: string;
  users: [];
  subdomain: string;
  createdAt: string;
};

export type TenantFormInputs = {
  name: string;
  subdomain: string;
  status: string;
  plan: string;
  email: string;
};
