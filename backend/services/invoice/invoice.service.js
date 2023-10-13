const moment = require('moment-timezone');
const QRCode = require('qrcode');

const generateQR = async (text) => {
  try {
    //console.log(text.Invoice_ID,text.Customer_Mobilenumber,text.Total_Amount)
    var segs = `
    Company Name : ${text.Organization.Organization_Name},
    Customer Name : ${text.Customer_Name},
    Invoice No : ${text.Invoice_ID},
    Purchase Date : ${moment(text.Invoice_Date).format('DD-MM-YYYY')},
    Total Amount : ${text.Total_Amount},
    Total Quantity : ${text.Total_Quantity},
    Paid Status : ${text.Paid_Status},
    Company Address : ${text.Organization.Address},${text.Organization.City} - ${text.Organization.Zip_Code}, ${text.Organization.State}, ${text.Organization.Country}
    `
    return await QRCode.toDataURL(segs)
  } catch (err) {
    console.error(err)
  }
}

const inWords = async (num)=> {

  var a = ['','One ','Two ','Three ','Four ', 'Five ','Ssix ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
    return str;
}

const invoiceslipdesign = async (invoice)=>{
  console.log(invoice)
  var qrcode = await generateQR(invoice)
  //console.log('hiiiii',qrcode)

  return `
  <!DOCTYPE html>
<html>
<head>
<style>

  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: left;
  }

  .myhead th,td{
    border-top: 1px dashed;
  }

  .myhead th{
    font-size: 13px;
  }

  .total {
    font-weight: bold;
    font-size: 14px;
  }

  .banner{
    font-size: 13px;
  }
  .banner .th1{
    text-align: left;
  }

  .banner .th2,.th2{
    text-align: right;
  }

  .banner div {
    line-height: 10px;
  }

  .bolder{
    font-weight: bold;
  }

  .slip{
    border-bottom: 1px dashed black;
  }

  .logo{
    display:flex;
    justify-content: space-between;
    align-items:center;
    font-size: 13px;
  }

  hr{
    border:0;
    border-bottom: 1px dashed;
  }

  tr td{
    font-size: 12px;
  }

  .text-center{
    align-text: center;
  }

  .text-end{
    align-text: right;
  }

  .w-1{
    max-width: 5px !important;

  }

  .w-5{
    max-width: 150px !important;
  }

  .w-8{
    max-width: 250px !important;
  }

  .descrip{
    font-size:10px
  }

  .account{
    display : flex;
    justify-content: space-between;
    align-items:center;
    font-size : 13px
  }

  .mb0{
    margin-bottom:8px
  }

  .mt0{
    margin-top:8px
  }

  .d-flex{
    display : flex;
    align-items:center;
  }

  .border-top-none{
    border-top: none !important;
  }

</style>

</head>
<body>
    <div class="text-center"><strong>Tax Invoice</strong></div>

  <div class="logo">
    <div class="company">
    <img src="http://localhost:4000${invoice.Organization.logo}" width="75px"><br>
      ${invoice.Organization.Organization_Name},<br>
      ${invoice.Organization.Address},<br>
      ${invoice.Organization.City} - ${invoice.Organization.Zip_Code}, ${invoice.Organization.State}, ${invoice.Organization.Country}.<br>
    </div>
    <div class="customer text-end">
      <h6 class="bolder">Customer Address</h6>
      ${invoice.Customer_Name},<br>
      ${invoice.Address},<br>
      ${invoice.City} - ${invoice.Zip_Code}, ${invoice.State}<br>
      Mobile Number : ${invoice.Customer_Mobilenumber}
    </div>
  </div>
  <hr class="mb0 mt0" />
  <div class="account">
    <span>PAN Number : ${invoice.Organization.PAN_Number} </span>
    <span>GST Number : ${invoice.Organization.GST_Number}<span>
  </div>

  <hr class="mt0 mb0" />
  <table>
    <thead>
      <tr class='banner'>
        <th colspan="4" class='th1' >
          <div>
            <p>Invoice No: ${invoice.Invoice_ID}</p>
            <p>Invoice Date: ${moment(invoice.Invoice_Date).tz('Asia/Calcutta').format("DD-MM-YYYY")}</p>
          </div>
        </th>
        <th colspan="4" class='th2'>
          <div>
            <p><b>Payment Status</b> : ${invoice.Paid_Status}</p>
            <p><b>Payment Method</b> : ${invoice.Payment_Method}</p>
          </div>
        </th>
      </tr>
      <tr class='myhead'>
        <th style="width: 5px !importan">S.NO</th>
        <th style="min-width:  100% !importan">Product Name</th>
        <th style="width: 50px !importan; word-break: break-word">Price per item</th>
        <th style="width: 30px !importan">Quantity</th>
        <th style="width: 30px !importan">Taxable Amount</th>
        <th style="width: 30px !importan">GST%</th>
        <th style="width: 30px !importan">Discount</th>
        <th style="width: 30px !importan">Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, index) => `
        <tr>
          <td style="width: 5px !importan">${index+1}</td>
          <td style="min-width:  100% !importan">${item.Item_Name}</td>
          <td style="width: 50px !importan">${item.Sale_Price}</td>
          <td style="width: 30px !importan">${item.Quantity}</td>
          <td style="width: 30px !importan">${item.Tax_Status =='Inclusive'? ((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Tax_Rate)/(100*1 + item.Tax_Rate*1)).toFixed(2) : item.Sale_Price}</td>
          <td style="width: 30px !importan">${item.Tax_Rate}</td>
          <td style="width: 30px !importan">${item.Discount}</td>
          <td style="width: 30px !importan">${item.Tax_Status =='Inclusive'?  ((((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Discount)/100)-(((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Discount)/100)*item.Tax_Rate)/(100*1 + item.Tax_Rate*1)+((((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Discount)/100)*item.Tax_Rate)/(100*1 + item.Tax_Rate*1)))) : ((((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Discount)/100)*item.Tax_Rate/100)+((item.Quantity * item.Sale_Price)-((item.Quantity * item.Sale_Price)*item.Discount)/100)).toFixed(0) }.00</td>          

        </tr>
      `).join('')}
      <tr>
        <td colspan="1">Total</td>
        <td colspan="2"></td>

        <td style="width: 40px !importan"colspan="1">${invoice.Total_Quantity}</td>
        <td colspan="1" style="width: 30px"></td>
        <td style="width: 30px !importan"colspan="1"></td>
        <td style="width: 30px !importan"colspan="1"></td>
        <td style="width: 30px !importan">₹${invoice.Total_Amount.toFixed(2)}</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="6" rowspan="4">
          <span class="d-flex">
            <img src="${qrcode}" alt="QRcode" height="120px">
            <span>
              <b>Amount Chargeable (in word)</b> <br>
              INR ${await inWords(invoice.Total_Amount.toFixed(0))}
            </span>
          </span>
        </td>
        <td><b>Total Amount</b></td>
        <td>₹${invoice.Total_Amount.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" class="text-center"><b>For ${invoice.Organization.Organization_Name}</b></td>
      </tr>
      <tr>
        <td colspan="2" class="border-top-none" > <br> </td>
      </tr>
      <tr class="slip">
        <td colspan="2" class="text-center">Authorized Signature</td>
      </tr>
    </tfoot>

  </table>

  <div class="text-center descrip">
    <p>*** This is Computer Generated Invoice ***</p>
  </div>

</body>
  
</html>

`;

}
module.exports = {invoiceslipdesign}