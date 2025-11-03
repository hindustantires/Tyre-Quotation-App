export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number; // Represents unit price inclusive of tax
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  lineItems: LineItem[];
  discount: number; // fixed amount
  taxRate: number; // percentage
  notes: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  upiQrCode?: string;
  defaultNotes?: string;
  defaultTaxRate?: number;
  password?: string;
}
