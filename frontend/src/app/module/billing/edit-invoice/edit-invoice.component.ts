import { Component, HostListener, effect, signal } from '@angular/core';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import { APIinvoiceService } from 'src/app/shared/services/APIinvoice/apiinvoice.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css']
})
export class EditInvoiceComponent {
  suggestions: any;
  invoicedetails: any = signal({});
  invoiceItems: any = signal([{ Invoice_ID: '', Item_Name: '',Discription:'', Quantity: 1, Sale_Price: '', Amount: 0, Tax_Rate: 0, Discount: 0, }]);
  Totalquatity: any = signal(0);
  Totalamount: any = signal(0);

  constructor(private APIitemsService: APIitemsService, private APIinvoiceService: APIinvoiceService, private messageService: MessageService, private route: ActivatedRoute, public datepipe: DatePipe) {
    // Register a new effect.
    effect(() => {
      this.caltotalamountandqty();
      console.log("dD", this.invoicedetails());
      this.invoiceItems();

    }, {
      allowSignalWrites: true,
    });
  }

  ngOnInit() {
    this.getinvoicebyid();
  }

  async getinvoicebyid() {
    var res = await this.APIinvoiceService.getinvoicebyid(this.route.snapshot.params['id']);
    this.invoicedetails.set(res.invoice);
    //this.invoicedetails.mutate((data)=>data.Invoice_Date= new Date(data.Invoice_Date));
    this.invoiceItems.set(res.invoicemaster);
  }

  async search(event: any, field: any) {
    var res = await this.APIitemsService.itemssearch(event.query, field);
    this.suggestions = res;
  }

  addItem() {
    this.invoiceItems.mutate((data : any) => data.push({ Invoice_ID: '',Discription:'', Item_Name: '', Quantity: 1, Tax_Rate: 0, Sale_Price: '', Amount: 0, Discount: 0 }));
  }

  change(rowIndex: any) {
    this.caltotalamountandqty();
    this.invoiceItems.mutate(async (res : any) =>{
      var result = await this.APIitemsService.itemsqtyvalidation({Invoice_ID : res[rowIndex].Invoice_ID, Item_Code : res[rowIndex].Item_Code})

      if(result.qty >= res[rowIndex].Quantity){
        res[rowIndex] = { ...res[rowIndex], ...{ Amount: (res[rowIndex].Sale_Price * res[rowIndex].Quantity) - res[rowIndex].Discount }}
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Requested Quantity Not Available', life: 3000, });
        res[rowIndex].Quantity = 0
      }
    });

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.keyCode == 13) {
      //console.log(event)
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    // Check the key code or key value to determine which key was pressed
    //console.log(event.key)
    if (event.key === 'F2') {
      // Perform the desired action when Enter key is pressed
      this.addItem();
    }
  }

  loaddata(data: any, rowIndex: any) {
    if(data.Item_Stock == 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Requested Product is Out of Stock', life: 3000, });
    }
    else if(data.Item_Stock != 0 && data.Item_Stock <= 10){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Requested Product Quantity is Too Low', life: 3000, });
      this.invoiceItems.mutate((res) => res[rowIndex] = { ...data, ...{ Quantity: 1, Amount: (data.Sale_Price * res[rowIndex].Quantity) - data.Discount, Invoice_ID: this.invoicedetails().Invoice_ID } });
    }
    else{
      this.invoiceItems.mutate((res) => res[rowIndex] = { ...data, ...{ Quantity: 1, Amount: (data.Sale_Price * res[rowIndex].Quantity) - data.Discount, Invoice_ID: this.invoicedetails().Invoice_ID } });
    }

  }

  deletedata(rowIndex: any) {
    this.invoiceItems.mutate((res) => res.splice(rowIndex, 1));
  }

  caltotalamountandqty() {
    this.invoiceItems.mutate((data) => {
      this.Totalamount.set(data.reduce((accumulator: any, object: any) => {
         return accumulator + Number( object['Tax_Status'] =='Inclusive'?((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)-(((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate)/(100*1 + object.Tax_Rate*1)+((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate)/(100*1 + object.Tax_Rate*1)))) : ((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate/100)+((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)).toFixed(0));
        }, 0));
      this.Totalquatity.set(data.reduce((accumulator: any, object: any) => { return accumulator + Number(object.Quantity) }, 0));
    })
  }

  uupdatestatus(data : any){
    this.invoicedetails.mutate(values => console.log(values));
    //console.log(this.invoicedetails(),data.target.value)

  }

  invoiceprint : boolean;
  printdata : any;
  async updateinvoice() {

    var res = await this.APIinvoiceService.updateinvoice({ invoice: { ...this.invoicedetails(), ...{ Total_Amount: this.Totalamount(), Total_Quantity: this.Totalquatity() } }, invoicemaster: this.invoiceItems() })
    if (res.message == 'invoice Sucessfully Updated') {
      this.getinvoicebyid();

      this.printdata = res.data;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'invoice Sucessfully Updated',
        life: 3000,
      });
    }
    else {
      alert("Server error");
    }
  }

  downloadpdf(data:any){
    //console.log(this.getinvoicebyid())
    const options = {
      margin:5,
      filename: `Invoice_${this.route.snapshot.params['id']}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(data).set(options).save();
  }

  print(data:any){
    const options = {
      margin:5,
      filename: `Invoice_${this.route.snapshot.params['id']}`,
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

  onBlurMethod(e: any) {
    this.invoicedetails.mutate((data) => data.Invoice_Date = this.datepipe.transform(e, 'yyyy-MM-dd'));
  }

  updateandprintinvoice(){
    this.updateinvoice();
    this.invoiceprint = true;
  }

}
