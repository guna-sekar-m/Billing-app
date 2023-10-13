import { Component, HostListener, effect, signal } from '@angular/core';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import { APIinvoiceService } from 'src/app/shared/services/APIinvoice/apiinvoice.service';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent {
  Tablecolumns: any;
  Tablebodydatas: any=signal([]);
  formdata: any = [];
  productDialog: boolean;
  submitted: boolean;
  tempfile: File;
  dyfunform: any;
  formdynamicconfig:any={};
  invoiceid:any=signal(null);
  height : any
  formconfig:any = {
    addrecord: { title: 'Add Items',buttonlabel: 'Save' },
    editrecord: { title: 'Edit Items',buttonlabel: 'Update' },
    fields: [
      {elementtype: 'input',type:'text',id: 'Item_Code',name: 'Item_Code',label: 'Item Code',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Item_Name',name: 'Item_Name',label: 'Item Name',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Item_Category',name: 'Item_Category',label: 'Item Category',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Purchase_Price',name: 'Purchase_Price',label: 'Purchase Price',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Sale_Price',name: 'Sale_Price',label: 'Sale Price',colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Item_Stock',name: 'Item_Stock',label: 'Item Stock',colname: 'row2'},
      {elementtype: 'dropdown',id: 'Item_Status',name: 'Item_Status',label: 'Item Status',value:['Active','Inactive'],colname: 'row2'},
    ],
    grid:[{ colsize: 6, colname: "row1" },{ colsize: 6, colname: "row2" }],
  };
  //lazy load
  loading: boolean = false;
  pageSize: any = signal(10);
  currentPage: any = signal(1);
  totalRecords: any = signal(0);
  searchQuery: any = '';

  constructor(private APIitemsService:APIitemsService,private messageService: MessageService,private confirmationService: ConfirmationService,private APIinvoiceService:APIinvoiceService){
    effect(()=>{
     console.log(`Table body data:${this.Tablebodydatas()}`);
    })
  }

  ngOnInit() {
    this.getTablecolumns();
    this.getTablebodydatas();
    this.onResize()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.height = innerWidth < 992? 'calc(100vh - 206px)': 'calc(100vh - 274px)' ;
  }

  getTablecolumns() {
    this.Tablecolumns = [
      { field: 'Invoice_ID', header: 'Invoice ID' },
      { field: 'Customer_Name', header: 'Customer Name' },
      { field: 'Customer_Mobilenumber', header: 'Customer Mobile Number' },
      { field: 'Total_Quantity', header: 'Total Quantity' },
      { field: 'Total_Amount', header: 'Total Amount' },
      { field: 'Invoice_Date', header: 'Invoice Date',formattype:'date'},
      { field: 'Paid_Status', header: 'Payment Status'},
    ];
  }

  async getTablebodydatas(){
    this.loading = true;
    var res=await this.APIinvoiceService.getallinvoices(this.currentPage(),this.pageSize(),this.searchQuery);
    this.Tablebodydatas.set(res.data);
    this.totalRecords.set(res.totalRecords);
    this.loading = false;
  }

  onPageChange(event: any) {
    this.pageSize.set(event.rows);
    this.currentPage.set(event.first / event.rows + 1);
    this.getTablebodydatas();
  }

  onSearchInputChange() {
    this.getTablebodydatas();
  }
  //form config

  openNew() {
    this.formdata = {};
    this.formdynamicconfig={};
    this.dyfunform = 'Save';
    this.formdynamicconfig={title:this.formconfig.addrecord.title,buttonlabel:this.formconfig.addrecord.buttonlabel};
    this.submitted = false;
    this.productDialog = true;
  }

  edititems(product: any) {
    this.formdata = {};
    this.formdynamicconfig={};
    this.dyfunform='Update';
    this.formdynamicconfig={title:this.formconfig.editrecord.title,buttonlabel:this.formconfig.editrecord.buttonlabel};
    this.formdata = { ...product };
    this.productDialog = true;
  }

  clear(table: Table) {
    table.clear();
  }

  invoiceprint : boolean;
  printdata : any;
  //table crud
  printfun : any;
  downloadfun : any;

  async printpdf(invoiceid:Number, size : any){
    this.invoiceid.set(invoiceid)
    var response=await this.APIinvoiceService.printpdf(invoiceid,size);
    this.invoiceprint = true
    this.printdata = response

    if(size == 'a4'){
      this.printfun = 'print';
      this.downloadfun = 'downloadpdf';
    }
    else{
      this.printfun = 'miniprint';
      this.downloadfun = 'downloadminipdf';
    }

  }

  async downloadpdf(data: any){
    const options = {
      margin:5,
      filename: `Invoice_${this.invoiceid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(data).set(options).save();
  }

  print(data:any){
    const options = {
      margin:5,
      filename: `Invoice_${this.invoiceid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(data).outputPdf().get('pdf')
    .then((pdfObj)=> {
      pdfObj.autoPrint();
      window.open(pdfObj.output("bloburl"), "F")
    });
  }

  miniprint(data:any){
    var element : any = document.getElementsByClassName('p-dialog-content')
    var height = Math.max(element[0].scrollHeight, element[0].offsetHeight, element[0].clientHeight, element[0].scrollHeight, element[0].offsetHeight)
    var height_mm  = Number(((height / 96) * 25.4).toFixed(0))+8;

    const options = {
      margin:5,
      filename: `Invoice_${this.invoiceid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: { mode: 'css', after: '.pagebreak' },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: [80,height_mm], orientation: 'portrait' }
    };

    html2pdf().set(options).from(data).outputPdf().get('pdf')
    .then((pdfObj)=> {
      pdfObj.autoPrint();
      window.open(pdfObj.output("bloburl"), "F")
    });
  }

  async downloadminipdf(data: any){
    var element : any = document.getElementsByClassName('p-dialog-content')
    var height = Math.max(element[0].scrollHeight, element[0].offsetHeight, element[0].clientHeight, element[0].scrollHeight, element[0].offsetHeight)
    var height_mm  = Number(((height / 96) * 25.4).toFixed(0))+8;

    const options = {
      margin:5,
      filename: `Invoice_${this.invoiceid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: { mode: 'css', after: '.pagebreak' },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: [80,height_mm], orientation: 'portrait' }
    };
    html2pdf().from(data).set(options).save();
  }



}
