// ============================================================
// GST JSON Generator — E-Invoice (IRP/NIC format) + E-Way Bill
// Ramdev Biocoal Industries
// ============================================================
import { COMPANY } from './companyConfig';
import { formatDate } from './gstUtils';

/**
 * Generate E-Invoice JSON (NIC IRP Schema v1.1)
 * Upload this JSON to: https://einvoice1.gst.gov.in
 */
export const generateEInvoiceJSON = (invoice, items) => {
  const supplyType = invoice.supply_type === 'inter' ? 'B2B' : 'B2B';
  const isInterState = invoice.supply_type === 'inter';

  const itemList = items.map((item, idx) => ({
    SlNo: String(idx + 1),
    PrdDesc: item.description.replace(/\n/g, ' '),
    IsServc: 'N',
    HsnCd: item.hsn_sac || '44013900',
    Qty: parseFloat(item.qty) || 0,
    Unit: item.unit || 'KGS',
    UnitPrice: parseFloat(item.rate) || 0,
    TotAmt: parseFloat(item.taxable_value) || 0,
    Discount: 0,
    PreTaxVal: parseFloat(item.taxable_value) || 0,
    AssAmt: parseFloat(item.taxable_value) || 0,
    GstRt: parseFloat(item.gst_rate) || 5,
    IgstAmt: isInterState ? parseFloat(item.igst_amount) || 0 : 0,
    CgstAmt: !isInterState ? parseFloat(item.cgst_amount) || 0 : 0,
    SgstAmt: !isInterState ? parseFloat(item.sgst_amount) || 0 : 0,
    CesRt: 0,
    CesAmt: 0,
    CesNonAdvlAmt: 0,
    StateCesRt: 0,
    StateCesAmt: 0,
    StateCesNonAdvlAmt: 0,
    OthChrg: 0,
    TotItemVal: parseFloat(item.total_amount) || 0,
  }));

  const totalTaxable = parseFloat(invoice.taxable_value) || 0;
  const totalCGST = parseFloat(invoice.cgst_amount) || 0;
  const totalSGST = parseFloat(invoice.sgst_amount) || 0;
  const totalIGST = parseFloat(invoice.igst_amount) || 0;
  const grandTotal = parseFloat(invoice.grand_total) || 0;

  const einvoice = {
    Version: '1.1',
    TranDtls: {
      TaxSch: 'GST',
      SupTyp: supplyType,
      RegRev: 'N',
      EcmGstin: null,
      IgstOnIntra: 'N',
    },
    DocDtls: {
      Typ: invoice.invoice_type === 'tax' ? 'INV' : 'BOS',
      No: invoice.invoice_no,
      Dt: formatDate(invoice.invoice_date), // DD/MM/YYYY
    },
    SellerDtls: {
      Gstin: COMPANY.gstin,
      LglNm: COMPANY.name,
      TrdNm: COMPANY.nameShort,
      Addr1: COMPANY.address,
      Addr2: COMPANY.city,
      Loc: COMPANY.district,
      Pin: parseInt(COMPANY.pincode),
      Stcd: COMPANY.stateCode,
      Ph: COMPANY.phone,
      Em: '',
    },
    BuyerDtls: {
      Gstin: invoice.party_gstin || 'URP',
      LglNm: invoice.party_name,
      TrdNm: invoice.party_name,
      Pos: invoice.party_state_code || COMPANY.stateCode,
      Addr1: invoice.party_address || '',
      Loc: invoice.party_state || 'Gujarat',
      Pin: 0,
      Stcd: invoice.party_state_code || COMPANY.stateCode,
      Ph: '',
      Em: '',
    },
    DispDtls: null,
    ShipDtls: invoice.consignee_name
      ? {
          Gstin: invoice.consignee_gstin || '',
          LglNm: invoice.consignee_name,
          TrdNm: invoice.consignee_name,
          Addr1: invoice.consignee_address || '',
          Loc: '',
          Pin: 0,
          Stcd: invoice.party_state_code || COMPANY.stateCode,
        }
      : null,
    ItemList: itemList,
    ValDtls: {
      AssVal: totalTaxable,
      CgstVal: totalCGST,
      SgstVal: totalSGST,
      IgstVal: totalIGST,
      CesVal: 0,
      StCesVal: 0,
      Discount: 0,
      OthChrg: parseFloat(invoice.freight) || 0,
      RndOffAmt: parseFloat(invoice.round_off) || 0,
      TotInvVal: grandTotal,
      TotInvValFc: 0,
    },
    PayDtls: {
      Nm: COMPANY.bank.name,
      AccDet: COMPANY.bank.accountNo,
      Mode: 'Cash/NEFT/RTGS',
      FinInsBr: COMPANY.bank.ifsc,
      PayTerm: 'Within 45 days',
      PayLoc: COMPANY.bank.jurisdiction,
      DirDr: 'N',
      CrDay: 45,
      PaidAmt: 0,
      PaymtDue: grandTotal,
    },
    RefDtls: invoice.po_ref
      ? {
          InvRm: invoice.po_ref,
          DocPerdDtls: null,
          PrecDocDtls: null,
        }
      : null,
    AddlDocDtls: null,
    ExpDtls: null,
    EwbDtls: null,
  };

  return einvoice;
};

/**
 * Generate E-Way Bill JSON (EWB API v1.03 format)
 * Upload to: https://ewaybillgst.gov.in
 * Only needed when invoice value >= ₹50,000
 */
export const generateEWayBillJSON = (invoice, items, transportDetails = {}) => {
  const isInterState = invoice.supply_type === 'inter';
  const totalTaxable = parseFloat(invoice.taxable_value) || 0;
  const totalCGST = parseFloat(invoice.cgst_amount) || 0;
  const totalSGST = parseFloat(invoice.sgst_amount) || 0;
  const totalIGST = parseFloat(invoice.igst_amount) || 0;
  const grandTotal = parseFloat(invoice.grand_total) || 0;

  const itemList = items.map((item) => ({
    productName: item.description.replace(/\n/g, ' ').split(' ').slice(0, 5).join(' '),
    productDesc: item.description.replace(/\n/g, ' '),
    hsnCode: item.hsn_sac || '44013900',
    quantity: parseFloat(item.qty) || 0,
    qtyUnit: item.unit || 'KGS',
    cgstRate: !isInterState ? parseFloat(item.cgst_rate) || 2.5 : 0,
    sgstRate: !isInterState ? parseFloat(item.sgst_rate) || 2.5 : 0,
    igstRate: isInterState ? parseFloat(item.igst_rate) || 5 : 0,
    cessRate: 0,
    cessNonadvRate: 0,
    taxableAmount: parseFloat(item.taxable_value) || 0,
  }));

  return {
    supplyType: 'O',    // O = Outward
    subSupplyType: '1', // 1 = Supply
    docType: 'INV',
    docNo: invoice.invoice_no,
    docDate: formatDate(invoice.invoice_date),
    fromGstin: COMPANY.gstin,
    fromTrdName: COMPANY.nameShort,
    fromAddr1: COMPANY.address,
    fromAddr2: COMPANY.city,
    fromPlace: COMPANY.district,
    fromPincode: parseInt(COMPANY.pincode),
    fromStateCode: parseInt(COMPANY.stateCode),
    toGstin: invoice.party_gstin || 'URP',
    toTrdName: invoice.party_name,
    toAddr1: invoice.party_address || '',
    toAddr2: '',
    toPlace: invoice.party_state || '',
    toPincode: 0,
    toStateCode: parseInt(invoice.party_state_code || COMPANY.stateCode),
    totalValue: totalTaxable,
    cgstValue: totalCGST,
    sgstValue: totalSGST,
    igstValue: totalIGST,
    cessValue: 0,
    cessNonAdvolValue: 0,
    otherValue: parseFloat(invoice.freight) || 0,
    totInvValue: grandTotal,
    transactionType: 1,
    transMode: transportDetails.transMode || '1', // 1=Road
    transDistance: transportDetails.transDistance || '',
    transporterName: transportDetails.transporterName || '',
    transporterId: transportDetails.transporterId || '',
    transDocNo: transportDetails.transDocNo || '',
    transDocDate: transportDetails.transDocDate || formatDate(invoice.invoice_date),
    vehicleNo: invoice.vehicle_no || transportDetails.vehicleNo || '',
    vehicleType: 'R', // R = Regular
    itemList,
  };
};

// Download JSON file helper
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
