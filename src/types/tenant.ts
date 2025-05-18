export type Tenant = {
  id: string;
  name: string;
  status: string;
  plan: string;
  email: string;
  memberships: [];
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
