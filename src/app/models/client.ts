import { Service } from './service.model';

export interface Client {
  id: string;
  companyName: string;
  taxNumber: string;
  name: string;
  email: string;
  mol: string;
  address: string;
  bankName: string;
  iban: string;
  services: Service[];
}
