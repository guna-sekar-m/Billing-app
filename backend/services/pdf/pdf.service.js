const printer = require("pdf-to-printer");
const PDFDocument = require('pdfkit');
const { createWriteStream } = require('fs');
const path = require('path');
const font = 'Times-Roman';
const fontbold = 'Times-Bold';
const createInvoice=(invoice, filename)=>{ 
	let doc = new PDFDocument({ margin: 50 });
	generateHeader(doc,invoice); // Invoke `generateHeader` function.
  generateInvoiceTable(doc,invoice);
	generateFooter(doc,invoice); // Invoke `generateFooter` function.
  doc.pipe(createWriteStream("D:/2023 projects/May 2023/Billing Software/billing-backend/dist/win-unpacked/invoices/"+filename));
  doc.end(); 
  return doc;
}
function generateHeader(doc,invoice) {
  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.font(fontbold).fontSize(16).text(`Bill`, { align: "center" }, 20, 0);
  // Address
  doc.font(font).fontSize(12).text("Company Name,", { align: "center" }, 40, 0);
  doc.font(font).fontSize(12).text("KK Nagar Rd,", { align: "center" }, 60, 0);
  doc
    .font(font)
    .fontSize(12)
    .text("Viluppuram,Tamil Nadu 605401", { align: "center" }, 80, 0);
  doc
    .lineCap("butt")
    .moveTo(40, 100)
    .lineTo(560, 100)
    .dash(5, { space: 5 })
    .stroke();
  //Employee Details start
  doc.font(fontbold).fontSize(12).text("Invoice No", { align: "left" }, 120, 0);
  doc.font(fontbold).fontSize(12).text("Customer", { align: "left" }, 140, 0);
  doc.font(fontbold).fontSize(12).text("Contact", { align: "left" }, 160, 0);
  doc.font(font).fontSize(12).text(invoice.invoicemain['Invoice_ID'], 180, 120);

  doc.font(font).fontSize(12).text(invoice.invoicemain['Customer_Name'], 180, 140);
  doc.font(font).fontSize(12).text(invoice.invoicemain['Customer_Mobilenumber'], 180, 160);
  //vertical line end
  doc.font(fontbold).fontSize(12).text("Date", 420, 120);
  doc.font(font).fontSize(12).text(invoice.invoicemain['Invoice_Date'], 460, 120);

  //Employee Details end
  doc.lineCap("butt").moveTo(40, 200).lineTo(560, 200).stroke();
  //salary head details start
  doc.font(fontbold).fontSize(12).text("S.NO", 60, 210);
  doc.font(fontbold).fontSize(12).text("Item", 150, 210);
  doc.font(fontbold).fontSize(12).text("QTY", 260, 210);
  doc.font(fontbold).fontSize(12).text("Rate", 340, 210);
  doc.font(fontbold).fontSize(12).text("Dis.", 400, 210);
  doc.font(fontbold).fontSize(12).text("Amount", 460, 210);
  //salary head details end
  doc.lineCap("butt").moveTo(40, 230).lineTo(560, 230).stroke();

}

function generateFooter(doc,invoice) {
  
    doc.lineCap("butt").moveTo(40, 600).lineTo(560, 600).stroke();
    doc.font(fontbold).fontSize(12).text("Total", 60, 610);
    doc.font(font).fontSize(12).text(invoice.invoicemain['Total_Quantity'], 260, 610);
    doc.font(font).fontSize(12).text(invoice.invoicemain['Total_Amount'], 460, 610);
    doc.lineCap("butt").moveTo(40, 630).lineTo(560, 630).stroke();
    //Total details end

    doc.font(fontbold).fontSize(12).text("Total Amount", 340, 640);
    doc.font(font).fontSize(12).text(invoice.invoicemain['Total_Amount'], 460, 640);
    doc.lineCap("butt").moveTo(40, 660).lineTo(560, 660).stroke();
}

function generateInvoiceTable(doc, invoice) {
	let i,invoiceTableTop = 220;
	for (i = 0; i < invoice.invoiceitems.length; i++) {
		const item = invoice.invoiceitems[i];
		const position = invoiceTableTop + (i + 1) * 20;
		generateTableRow(
			doc,
			position,
      i+1,
			item.Item_Name,
			item.Quantity,
			item.Sale_Price,
			item.Discount,
      item.Amount
		);
	}
}
function generateTableRow(doc, y, index,c1, c2, c3, c4, c5) {
	doc.fontSize(10)
		.text(index,60, y)
		.text(c1, 150, y,{align: 'left'})
		.text(c2, 260, y)
		.text(c3, 340, y)
		.text(c4, 400, y)
    .text(c5, 460, y);
}
module.exports = {createInvoice};