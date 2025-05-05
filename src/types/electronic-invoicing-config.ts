import { IssuancePoint } from "./issuance-point";

export type ElectronicInvoicingConfig = {
  id: string;
  digitalCertificate: Buffer;
  certificatePassword: string;
  certificateExpiryDate: Date;
  issuancePoints: IssuancePoint[];
  createdAt: Date;
  updatedAt: Date;
};

export type ElectronicInvoicingConfigFormInput = {
  digitalCertificate: Buffer;
  certificatePassword: string;
  certificateExpiryDate: Date;
  issuancePoints: IssuancePoint[];
  createdAt: Date;
  updatedAt: Date;
};
