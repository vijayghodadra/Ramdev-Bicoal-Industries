// ============================================================
// Invoice PDF Generator using jsPDF
// Exact format matching Ramdev Biocoal Industries sample invoice
// ============================================================
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COMPANY } from './companyConfig';
import { formatINR, amountInWords, formatDate } from './gstUtils';

export const generateInvoicePDF = (invoice, items, download = true) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210; // page width
  const ML = 10; // margin left
  const MR = 10; // margin right
  const CW = PW - ML - MR; // content width
  let y = 10;

  // ── Helper functions ──────────────────────────────────────
  const line = (x1, y1, x2, y2, lw = 0.3) => {
    doc.setLineWidth(lw);
    doc.line(x1, y1, x2, y2);
  };
  const rect = (x, rx, ry, rw, rh, lw = 0.3) => {
    doc.setLineWidth(lw);
    doc.rect(rx, ry, rw, rh);
  };
  const text = (t, x, ty, opts = {}) => {
    doc.text(t, x, ty, opts);
  };
  const setFont = (style = 'normal', size = 9) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
  };

  // ── HEADER ─────────────────────────────────────────────────
  // Top: "|| Jay Ramdevji ||" centered
  setFont('bold', 9);
  doc.setTextColor(80, 80, 80);
  text('|| Jay Ramdevji ||', PW / 2, y + 4, { align: 'center' });

  // GSTIN top-left
  setFont('normal', 8);
  doc.setTextColor(0, 0, 0);
  text(`GSTIN : ${COMPANY.gstin}`, ML, y + 4);

  // Original/Duplicate/Triplicate top-right
  setFont('normal', 7.5);
  text('Original/Duplicate/Triplicate', PW - MR, y + 4, { align: 'right' });

  y += 8;

  // Company name (big bold)
  setFont('bold', 18);
  doc.setTextColor(20, 20, 20);
  text(COMPANY.nameShort, ML + 22, y + 7);

  // RBI Logo circle (left side)
  doc.setDrawColor(30, 80, 160);
  doc.setFillColor(30, 80, 160);
  doc.circle(ML + 10, y + 5, 9, 'S');
  setFont('bold', 9);
  doc.setTextColor(30, 80, 160);
  text('RBI', ML + 10, y + 6, { align: 'center' });

  // "Tax Invoice" — top right
  setFont('bold', 11);
  doc.setTextColor(0, 0, 0);
  text('Tax Invoice', PW - MR, y + 3, { align: 'right' });

  // Invoice number
  setFont('bold', 22);
  text(String(invoice.invoice_no).replace(/.*\//, ''), PW - MR, y + 12, { align: 'right' });

  y += 16;

  // Address line
  setFont('normal', 8);
  doc.setTextColor(50, 50, 50);
  text(COMPANY.fullAddress, ML + 22, y);

  // Date — right aligned
  setFont('normal', 9);
  doc.setTextColor(0, 0, 0);
  text(formatDate(invoice.invoice_date), PW - MR, y, { align: 'right' });

  y += 5;

  // PAN line
  setFont('normal', 8);
  doc.setTextColor(50, 50, 50);
  text(`PAN : ${COMPANY.pan}`, ML + 22, y);

  y += 4;

  // Horizontal line
  doc.setDrawColor(0);
  line(ML, y, PW - MR, y, 0.5);
  y += 3;

  // "Cash Debit Memo" center
  setFont('bold', 9);
  doc.setTextColor(0, 0, 0);
  text('Cash Debit Memo', PW / 2, y + 3, { align: 'center' });
  y += 6;
  line(ML, y, PW - MR, y, 0.5);
  y += 3;

  // ── BILL TO / SHIPPED TO ───────────────────────────────────
  const halfW = (CW - 5) / 2;
  const leftX = ML;
  const rightX = ML + halfW + 5;

  // Bill To box
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(leftX, y, halfW, 38);
  doc.rect(rightX, y, halfW, 38);

  setFont('bold', 8);
  doc.setTextColor(0, 0, 0);
  text('Detail Of Receiver (Bill To)', leftX + 2, y + 4);
  text('Detail Of Consignee (Shipped To)', rightX + 2, y + 4);

  // Party details (Bill To)
  setFont('bold', 8.5);
  const billLines = doc.splitTextToSize(invoice.party_name || '', halfW - 4);
  doc.text(billLines, leftX + 2, y + 9);

  setFont('normal', 7.5);
  const billAddr = doc.splitTextToSize(invoice.party_address || '', halfW - 4);
  doc.text(billAddr, leftX + 2, y + 14);

  let billY = y + 14 + billAddr.length * 3.5;
  text(`State / Code : ${invoice.party_state || ''} - ${invoice.party_state_code || ''}`, leftX + 2, billY + 2);
  text(`GSTIN : ${invoice.party_gstin || ''}`, leftX + 2, billY + 6);
  text(`Vehicle No : ${invoice.vehicle_no || ''}`, leftX + 2, billY + 10);

  // Consignee details (Shipped To)
  const consName = invoice.consignee_name || invoice.party_name || '';
  const consAddr = invoice.consignee_address || invoice.party_address || '';
  const consGstin = invoice.consignee_gstin || invoice.party_gstin || '';
  const consState = invoice.party_state || '';
  const consStateCode = invoice.party_state_code || '';

  setFont('bold', 8.5);
  const shipLines = doc.splitTextToSize(consName, halfW - 4);
  doc.text(shipLines, rightX + 2, y + 9);

  setFont('normal', 7.5);
  const shipAddr = doc.splitTextToSize(consAddr, halfW - 4);
  doc.text(shipAddr, rightX + 2, y + 14);

  let shipY = y + 14 + shipAddr.length * 3.5;
  text(`State / Code : ${consState} - ${consStateCode}`, rightX + 2, shipY + 2);
  text(`GSTIN : ${consGstin}`, rightX + 2, shipY + 6);
  text(`Broker :`, rightX + 2, shipY + 10);

  y += 41;

  // ── ITEMS TABLE ────────────────────────────────────────────
  const tableBody = items.map((item, idx) => [
    idx + 1,
    item.description,
    item.hsn_sac || '44013900',
    formatINR(item.qty),
    formatINR(item.rate),
    formatINR(item.taxable_value),
  ]);

  // Pad to minimum 5 rows for visual consistency
  while (tableBody.length < 4) tableBody.push(['', '', '', '', '', '']);

  autoTable(doc, {
    startY: y,
    head: [['Sr.\nNo.', 'Discription Of Goods', 'HSN/SAC\nCode', 'Total Kg', 'Rate/Kg', 'Total Amount']],
    body: tableBody,
    theme: 'grid',
    margin: { left: ML, right: MR },
    styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8, halign: 'center' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 62 },
      2: { halign: 'center', cellWidth: 24 },
      3: { halign: 'right', cellWidth: 22 },
      4: { halign: 'right', cellWidth: 22 },
      5: { halign: 'right', cellWidth: 30 },
    },
    didDrawPage: () => {},
  });

  y = doc.lastAutoTable.finalY;

  // Sub Total row
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 7);
  setFont('bold', 8.5);
  text('Sub Total', PW - MR - 33, y + 4.5, { align: 'right' });
  text(formatINR(invoice.taxable_value), PW - MR, y + 4.5, { align: 'right' });
  y += 7;

  // ── BOTTOM SECTION ─────────────────────────────────────────
  const bottomH = 68;
  const taxBoxW = 58;
  const leftBotW = CW - taxBoxW;

  // Left bottom box
  doc.rect(ML, y, leftBotW, bottomH);
  // Right tax box
  doc.rect(ML + leftBotW, y, taxBoxW, bottomH);

  let lY = y + 4;
  let rY = y + 4;
  const rX = ML + leftBotW + 2;
  const rRight = PW - MR - 2;

  // Other Detail
  setFont('bold', 8);
  text('Other Detail :', ML + 2, lY);
  lY += 4;
  setFont('normal', 8);
  if (invoice.po_ref) {
    const poLines = doc.splitTextToSize(invoice.po_ref, leftBotW - 6);
    doc.text(poLines, ML + 2, lY);
    lY += poLines.length * 4 + 2;
  } else {
    lY += 4;
  }

  // Terms & Conditions
  setFont('bold', 8);
  text('Term & Condition :', ML + 2, lY);
  lY += 4;
  setFont('normal', 7.5);
  COMPANY.termsAndConditions.forEach((tc, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${tc}`, leftBotW - 6);
    doc.text(lines, ML + 2, lY);
    lY += lines.length * 3.5;
  });

  lY += 3;
  line(ML, lY, ML + leftBotW, lY, 0.2);
  lY += 3;

  // Total Tax
  setFont('bold', 8.5);
  const totalTax = (parseFloat(invoice.cgst_amount) || 0) + (parseFloat(invoice.sgst_amount) || 0) + (parseFloat(invoice.igst_amount) || 0);
  text(`Total Tax : ${formatINR(totalTax)}`, ML + 2, lY);
  lY += 5;

  line(ML, lY, ML + leftBotW, lY, 0.2);
  lY += 3;

  // Amount in words
  setFont('bold', 7.5);
  text('In Word :', ML + 2, lY);
  setFont('normal', 7.5);
  const words = doc.splitTextToSize(amountInWords(invoice.grand_total), leftBotW - 6);
  doc.text(words, ML + 2, lY + 4);
  lY += words.length * 3.5 + 6;

  line(ML, lY, ML + leftBotW, lY, 0.2);
  lY += 3;

  // Bank Details
  setFont('bold', 8);
  text('Bank Detail :', ML + 2, lY);
  lY += 4;
  setFont('normal', 7.5);
  text(COMPANY.bank.name, ML + 2, lY); lY += 3.5;
  text(`A/c No. : ${COMPANY.bank.accountNo}`, ML + 2, lY); lY += 3.5;
  text(`IFSC Code : ${COMPANY.bank.ifsc}`, ML + 2, lY); lY += 3.5;
  text(`Subject To ${COMPANY.bank.jurisdiction} Jurisdiction`, ML + 2, lY);

  // ── RIGHT TAX BOX ──────────────────────────────────────────
  const taxRow = (label, val, isTotal = false) => {
    if (isTotal) {
      doc.setFillColor(230, 230, 230);
      doc.rect(ML + leftBotW, rY - 3, taxBoxW, 7, 'F');
      setFont('bold', 8.5);
    } else {
      setFont('normal', 8);
    }
    text(label, rX, rY);
    text(formatINR(val), rRight, rY, { align: 'right' });
    rY += 6;
    if (!isTotal) line(ML + leftBotW, rY - 1, PW - MR, rY - 1, 0.2);
  };

  taxRow('Freight &', '');
  rY -= 6;
  text('Other Charge', rX, rY + 3.5);
  text(formatINR(invoice.freight || 0), rRight, rY + 3.5, { align: 'right' });
  rY += 6;
  line(ML + leftBotW, rY - 1, PW - MR, rY - 1, 0.2);

  taxRow(`SGST 2.50%`, invoice.sgst_amount || 0);
  taxRow(`CGST 2.50%`, invoice.cgst_amount || 0);
  taxRow(`IGST 5.00%`, invoice.igst_amount || 0);
  taxRow('Round Off', invoice.round_off || 0);

  // Separator
  line(ML + leftBotW, rY, PW - MR, rY, 0.5);
  rY += 5;

  // Grand Total
  doc.setFillColor(220, 220, 220);
  doc.rect(ML + leftBotW, rY - 4, taxBoxW, 9, 'F');
  setFont('bold', 9.5);
  text('Grand Total', rX, rY + 1);
  text(formatINR(invoice.grand_total), rRight, rY + 1, { align: 'right' });
  rY += 8;

  // Signature block (bottom right of right box)
  setFont('bold', 8);
  const sigY = y + bottomH - 10;
  text(COMPANY.signatory, PW - MR, sigY, { align: 'right' });

  // Outer border for entire invoice
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(ML, 8, CW, y + bottomH - 8);

  // ── OUTPUT ────────────────────────────────────────────────
  const filename = `Invoice_${invoice.invoice_no.replace(/\//g, '-')}_${formatDate(invoice.invoice_date)}.pdf`;
  if (download) {
    doc.save(filename);
  }
  return doc;
};
