// ============================================================
// GST Utility Functions — Ramdev Biocoal Industries
// ============================================================

// GSTIN format validator (15 chars: 2 state + 10 PAN + 1 entity + 1 Z + 1 checksum)
export const isValidGSTIN = (gstin) => {
  if (!gstin) return false;
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.trim().toUpperCase());
};

// Extract state code from GSTIN
export const getStateCodeFromGSTIN = (gstin) => {
  if (!gstin || gstin.length < 2) return '';
  return gstin.slice(0, 2);
};

// State code to state name map (all Indian states)
const STATE_MAP = {
  '01': 'JAMMU & KASHMIR', '02': 'HIMACHAL PRADESH', '03': 'PUNJAB',
  '04': 'CHANDIGARH', '05': 'UTTARAKHAND', '06': 'HARYANA',
  '07': 'DELHI', '08': 'RAJASTHAN', '09': 'UTTAR PRADESH',
  '10': 'BIHAR', '11': 'SIKKIM', '12': 'ARUNACHAL PRADESH',
  '13': 'NAGALAND', '14': 'MANIPUR', '15': 'MIZORAM',
  '16': 'TRIPURA', '17': 'MEGHALAYA', '18': 'ASSAM',
  '19': 'WEST BENGAL', '20': 'JHARKHAND', '21': 'ODISHA',
  '22': 'CHHATTISGARH', '23': 'MADHYA PRADESH', '24': 'GUJARAT',
  '25': 'DAMAN & DIU', '26': 'DADRA & NAGAR HAVELI', '27': 'MAHARASHTRA',
  '28': 'ANDHRA PRADESH', '29': 'KARNATAKA', '30': 'GOA',
  '31': 'LAKSHADWEEP', '32': 'KERALA', '33': 'TAMIL NADU',
  '34': 'PUDUCHERRY', '35': 'ANDAMAN & NICOBAR ISLANDS', '36': 'TELANGANA',
  '37': 'ANDHRA PRADESH (NEW)', '38': 'LADAKH',
};

export const getStateName = (code) => STATE_MAP[code] || '';

// Calculate GST amounts for intra/inter-state supply
export const calculateGST = ({ taxableValue, gstRate, supplyType = 'intra' }) => {
  const tv = parseFloat(taxableValue) || 0;
  const rate = parseFloat(gstRate) || 5;
  if (supplyType === 'inter') {
    return {
      cgst: 0,
      sgst: 0,
      igst: parseFloat(((tv * rate) / 100).toFixed(2)),
    };
  }
  const half = rate / 2;
  return {
    cgst: parseFloat(((tv * half) / 100).toFixed(2)),
    sgst: parseFloat(((tv * half) / 100).toFixed(2)),
    igst: 0,
  };
};

// Convert number to Indian words
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const numToWords = (num) => {
  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numToWords(num % 100) : '');
  if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
  if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numToWords(num % 100000) : '');
  return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numToWords(num % 10000000) : '');
};

export const amountInWords = (amount) => {
  const n = Math.abs(Math.round(parseFloat(amount) || 0));
  return numToWords(n) + ' Rupees Only';
};

// Format number as Indian currency string
export const formatINR = (amount) => {
  const n = parseFloat(amount) || 0;
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Round off to nearest 0.50
export const roundOff = (value) => {
  const rounded = Math.round(value);
  return parseFloat((rounded - value).toFixed(2));
};

// Format date as DD-MM-YYYY
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Today as YYYY-MM-DD for input[type=date]
export const todayISO = () => new Date().toISOString().slice(0, 10);
