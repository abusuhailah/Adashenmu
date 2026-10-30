export interface NigerianBank {
  name: string;
  code: string;
  ussd: string;
  type: 'Commercial' | 'Microfinance' | 'Non-Interest';
  cbnLicensed: boolean;
  ndicInsured: boolean;
  color: string;
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  {
    name: 'Access Bank',
    code: '044',
    ussd: '*901#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#004B87',
  },
  {
    name: 'Guaranty Trust Bank (GTBank)',
    code: '058',
    ussd: '*737#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#DD4F05',
  },
  {
    name: 'Zenith Bank',
    code: '057',
    ussd: '*966#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#D81E05',
  },
  {
    name: 'First Bank of Nigeria',
    code: '011',
    ussd: '*894#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#002D62',
  },
  {
    name: 'United Bank for Africa (UBA)',
    code: '033',
    ussd: '*919#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#D10000',
  },
  {
    name: 'Kuda Microfinance Bank',
    code: '50211',
    ussd: '*894#',
    type: 'Microfinance',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#40196D',
  },
  {
    name: 'OPay (Paycom)',
    code: '999992',
    ussd: '*955#',
    type: 'Microfinance',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#12B980',
  },
  {
    name: 'PalmPay',
    code: '999991',
    ussd: '*861#',
    type: 'Microfinance',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#652D90',
  },
  {
    name: 'Stanbic IBTC Bank',
    code: '221',
    ussd: '*909#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#0033AA',
  },
  {
    name: 'Jaiz Bank (Islamic / Non-Interest)',
    code: '301',
    ussd: '*773#',
    type: 'Non-Interest',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#0F8A5F',
  },
  {
    name: 'TAJ Bank (Non-Interest)',
    code: '302',
    ussd: '*898#',
    type: 'Non-Interest',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#B72025',
  },
  {
    name: 'Lotus Bank (Non-Interest)',
    code: '303',
    ussd: '*5043#',
    type: 'Non-Interest',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#341539',
  },
  {
    name: 'Sterling Bank',
    code: '232',
    ussd: '*822#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#E01A22',
  },
  {
    name: 'Fidelity Bank',
    code: '070',
    ussd: '*770#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#082567',
  },
  {
    name: 'Union Bank of Nigeria',
    code: '032',
    ussd: '*826#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#0097D7',
  },
  {
    name: 'Wema Bank (ALAT)',
    code: '035',
    ussd: '*945#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#9B1B62',
  },
  {
    name: 'FCMB',
    code: '214',
    ussd: '*329#',
    type: 'Commercial',
    cbnLicensed: true,
    ndicInsured: true,
    color: '#5C1D82',
  },
];

/**
 * Validates a Nigerian NUBAN (10 numeric digits)
 */
export function validateNuban(accountNumber: string): boolean {
  const cleaned = accountNumber.replace(/\s+/g, '');
  return /^[0-9]{10}$/.test(cleaned);
}

/**
 * Validates a Nigerian National Identification Number (11 numeric digits)
 */
export function validateNin(nin: string): boolean {
  const cleaned = nin.replace(/\s+/g, '');
  return /^[0-9]{11}$/.test(cleaned);
}
