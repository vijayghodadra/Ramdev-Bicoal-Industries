// ============================================================
// RAMDEV BIOCOAL INDUSTRIES — Company Configuration
// ============================================================

export const COMPANY = {
  name: 'RAMDEV BIOCOAL INDUSTRIES',
  nameShort: 'Ramdev Biocoal Industries',
  tagline: '|| Jay Ramdevji ||',
  gstin: '24ABFFR8167B1Z8',
  pan: 'ABFFR8167B',
  stateCode: '24',
  state: 'GUJARAT',
  address: 'R/s No.154, Plot No.2, Veraval Highway, Behind Ganga Warehouse',
  city: 'Sondarda',
  district: 'Junagadh',
  pincode: '362227',
  phone: '9978760987',
  fullAddress: 'R/s No.154, Plot No.2, Veraval Highway, Behind Ganga Warehouse, Sondarda - 362227 Mo. 9978760987',
  bank: {
    name: 'BANK OF BARODA - KESHOD',
    accountNo: '25090500004773',
    ifsc: 'BARB0KESJUN',
    branch: 'Keshod',
    jurisdiction: 'Keshod',
  },
  termsAndConditions: [
    'We are not responsible for goods after delivered from our premises.',
    'Good ones sold will not be taken back.',
    'Payment condition within 45 days from invoice date.',
  ],
  signatory: 'For, Ramdev Biocoal Industries',
};

// Default product (Biomass Briquettes)
export const DEFAULT_PRODUCT = {
  description: 'BIOMASS BRIQUETTES\n100% GROUNDNUTS',
  hsn: '44013900',
  unit: 'KGS',
  gstRate: 5.0,
  cgstRate: 2.5,
  sgstRate: 2.5,
  igstRate: 5.0, // used for inter-state
};

// Financial year helper
export const getCurrentFY = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-based
  if (month >= 4) {
    return `${String(year).slice(2)}${String(year + 1).slice(2)}`;
  }
  return `${String(year - 1).slice(2)}${String(year).slice(2)}`;
};

// Invoice prefix
export const INVOICE_PREFIX = `RBI/${getCurrentFY()}/`;
