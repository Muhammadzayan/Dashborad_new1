export interface Client {
  id: string;
  name: string;
  cnic: string;
  contact: string;
  email: string;
  address: string;
  agentId: string;
  createdAt: string;
}

export interface Policy {
  id: string;
  policyNo: string;
  clientId: string;
  clientName?: string;
  policyType: 'Life' | 'Health' | 'Savings';
  sumAssured: number;
  premium: number;
  startDate: string;
  maturityDate: string;
  status: 'Active' | 'Expired';
  createdAt: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    cnic: '42101-1234567-8',
    contact: '+92-300-1234567',
    email: 'ahmed.khan@example.com',
    address: 'House 123, Street 45, F-8, Islamabad',
    agentId: 'AGT001',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fatima Ali',
    cnic: '42201-2345678-9',
    contact: '+92-321-2345678',
    email: 'fatima.ali@example.com',
    address: 'Apartment 56, Block B, DHA, Karachi',
    agentId: 'AGT002',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Muhammad Hassan',
    cnic: '42301-3456789-0',
    contact: '+92-333-3456789',
    email: 'hassan@example.com',
    address: 'House 789, Model Town, Lahore',
    agentId: 'AGT001',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Ayesha Malik',
    cnic: '42401-4567890-1',
    contact: '+92-345-4567890',
    email: 'ayesha.malik@example.com',
    address: 'Villa 321, Gulshan-e-Iqbal, Karachi',
    agentId: 'AGT003',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Omar Sheikh',
    cnic: '42501-5678901-2',
    contact: '+92-302-5678901',
    email: 'omar.sheikh@example.com',
    address: 'House 654, Blue Area, Islamabad',
    agentId: 'AGT002',
    createdAt: '2024-02-15',
  },
];

export const mockPolicies: Policy[] = [
  {
    id: '1',
    policyNo: 'IGI-LIFE-001',
    clientId: '1',
    clientName: 'Ahmed Khan',
    policyType: 'Life',
    sumAssured: 5000000,
    premium: 50000,
    startDate: '2024-01-15',
    maturityDate: '2044-01-15',
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    policyNo: 'IGI-HEALTH-002',
    clientId: '2',
    clientName: 'Fatima Ali',
    policyType: 'Health',
    sumAssured: 2000000,
    premium: 25000,
    startDate: '2024-01-20',
    maturityDate: '2025-01-20',
    status: 'Active',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    policyNo: 'IGI-SAVE-003',
    clientId: '3',
    clientName: 'Muhammad Hassan',
    policyType: 'Savings',
    sumAssured: 3000000,
    premium: 35000,
    startDate: '2024-02-01',
    maturityDate: '2034-02-01',
    status: 'Active',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    policyNo: 'IGI-LIFE-004',
    clientId: '4',
    clientName: 'Ayesha Malik',
    policyType: 'Life',
    sumAssured: 4000000,
    premium: 40000,
    startDate: '2024-02-10',
    maturityDate: '2044-02-10',
    status: 'Active',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    policyNo: 'IGI-HEALTH-005',
    clientId: '5',
    clientName: 'Omar Sheikh',
    policyType: 'Health',
    sumAssured: 1500000,
    premium: 20000,
    startDate: '2023-12-15',
    maturityDate: '2024-12-15',
    status: 'Expired',
    createdAt: '2023-12-15',
  },
  {
    id: '6',
    policyNo: 'IGI-SAVE-006',
    clientId: '1',
    clientName: 'Ahmed Khan',
    policyType: 'Savings',
    sumAssured: 2500000,
    premium: 30000,
    startDate: '2024-03-01',
    maturityDate: '2029-03-01',
    status: 'Active',
    createdAt: '2024-03-01',
  },
];