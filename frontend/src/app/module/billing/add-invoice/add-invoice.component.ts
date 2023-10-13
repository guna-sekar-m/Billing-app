import { Component,HostListener,effect, signal } from '@angular/core';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import { APIinvoiceService } from 'src/app/shared/services/APIinvoice/apiinvoice.service';
import { MessageService } from 'primeng/api';
import * as html2pdf from 'html2pdf.js';
import { TokenService } from 'src/app/shared/services/Token/token.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
})
export class AddInvoiceComponent {
  suggestions : any;
  invoicedate : string;
  invoicedetails : any = signal({});
  invoiceItems : any = signal([{Invoice_ID:'', Item_Name: '',Discription:'', Quantity: 1,Sale_Price: '',Tax_Rate:0, Amount:0, Discount: 0 }]);
  Totalquatity : any = signal(0);
  Totalamount : any = signal(0);
  myDate : any;

  constructor(
    private APIitemsService : APIitemsService,
    private APIinvoiceService : APIinvoiceService,
    private messageService : MessageService,
    private TokenService : TokenService
  ){
    // Register a new effect.
    effect(() => {
      this.caltotalamountandqty();
      console.log(`The data is: ${this.invoiceItems()})`);
      //console.log(`The count is: ${JSON.stringify(this.invoiceItems())})`);
    },{
      allowSignalWrites: true,
    });
  }

  ngOnInit(){
    this.getnewinvoice();
  }

  async getnewinvoice(){
    var res=await this.APIinvoiceService.getnewinvoice();
    var dd:any;
    if(res==null){
      dd={Invoice_ID:1};
    }
    else{
      dd={Invoice_ID:res.Invoice_ID+1};
    }
    this.invoicedetails.set(dd);
    let today = new Date();
    this.invoicedetails.mutate((data)=>data.Invoice_Date= today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear());
  }

  async search(event:any,field:any) {
    var res=await this.APIitemsService.itemssearch(event.query,field);
    this.suggestions = res;
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    // Check the key code or key value to determine which key was pressed
    if (event.key === 'F2') {
      // Perform the desired action when Enter key is pressed
      this.addItem();
    }
  }

  addItem(){
    if(this.invoiceItems().length <15){
      this.invoiceItems.mutate((data : any) => data.push({Invoice_ID:'',Item_Name: '',Discription:'', Quantity: 1,Tax_Rate:0,Sale_Price: '',Amount:0,Discount: 0,}));
    }
    else{
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Only 11 Products are allowed per Invoice', life: 3000, });
    }

  }

  change(rowIndex:any){
    this.caltotalamountandqty();
    this.invoiceItems.mutate((res : any) =>{
      if(res[rowIndex].Item_Stock >= res[rowIndex].Quantity){
        res[rowIndex]={...res[rowIndex],...{Amount:(((res[rowIndex].Sale_Price * res[rowIndex].Quantity)* res[rowIndex].Tax_Rate / 100)+(res[rowIndex].Sale_Price * res[rowIndex].Quantity))-res[rowIndex].Discount}}
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

  loaddata(data:any,rowIndex:any){
    if(data.Item_Stock == 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Requested Product is Out of Stock', life: 3000, });
    }
    else if(data.Item_Stock != 0 && data.Item_Stock <= 10){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Requested Product Quantity is Too Low', life: 3000, });
      this.invoiceItems.mutate((res : any) =>res[rowIndex]={...data,...{Quantity:1,Amount:(data.Sale_Price * res[rowIndex].Quantity)-data.Discount,Invoice_ID:this.invoicedetails().Invoice_ID}});
    }
    else{
      this.invoiceItems.mutate((res : any) =>res[rowIndex]={...data,...{Quantity:1,Amount:(data.Sale_Price * res[rowIndex].Quantity)-data.Discount,Invoice_ID:this.invoicedetails().Invoice_ID}});
    }
  }


  deletedata(rowIndex:any){
    this.invoiceItems.mutate((res : any) =>res.splice(rowIndex, 1));
  }

  caltotalamountandqty(){
    this.invoiceItems.mutate((data : any)=>{
      this.Totalamount.set(data.reduce((accumulator:any, object:any) => {
        return accumulator + Number( object['Tax_Status'] =='Inclusive'?((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)-(((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate)/(100*1 + object.Tax_Rate*1)+((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate)/(100*1 + object.Tax_Rate*1)))) : ((((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)*object.Tax_Rate/100)+((object.Quantity * object.Sale_Price)-((object.Quantity * object.Sale_Price)*object.Discount)/100)).toFixed(0));
      }, 0));

      this.Totalquatity.set(data.reduce((accumulator:any, object:any) => {
        return accumulator + Number(object.Quantity);
      }, 0));
    })
  }

  getinvoicebyid: any = signal(null);
  invoiceprint : boolean;
  printdata : any;
  printfun : any;
  downloadfun : any;

  async saveinvoice(size:any){
    if(this.TokenService.getUserDetails().data.Product_Status =='Trial'&& this.invoicedetails().Invoice_ID> 10 ){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Trail Version Limit Reached!!', life: 3000, });
    }
    else if(this.TokenService.getUserDetails().data.Product_Status =='Trial Expired'){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Trial Version Expired!!', life: 3000, });
    }
    else if(this.TokenService.getUserDetails().data.Product_Status =='Expired'){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product License Expired!!', life: 3000, });
    }
    else if(this.invoiceItems()[0].Item_Code&&this.invoicedetails().Customer_Mobilenumber && this.invoicedetails().Customer_Name && this.invoicedetails().Address && this.invoicedetails().City && this.invoicedetails().State && this.invoicedetails().Zip_Code && this.invoicedetails().Paid_Status && this.invoicedetails().Payment_Method ){
      var res=await this.APIinvoiceService.addnewinvoice({Invoice_Date:this.invoicedetails().Invoice_Date,invoice:{Total_Amount:this.Totalamount(),Total_Quantity:this.Totalquatity(),Invoice_ID:this.invoicedetails().Invoice_ID,Customer_Mobilenumber:this.invoicedetails().Customer_Mobilenumber,Customer_Name:this.invoicedetails().Customer_Name,Address : this.invoicedetails().Address, City:this.invoicedetails().City, State : this.invoicedetails().State, Zip_Code : this.invoicedetails().Zip_Code,Paid_Status:this.invoicedetails().Paid_Status,Payment_Method: this.invoicedetails().Payment_Method},invoicemaster:this.invoiceItems()},size)
      if(res.message=='invoice Sucessfully Saved'){
        this.getnewinvoice();
        this.invoiceItems.set([{Invoice_ID:'', Item_Name: '', Quantity: 1,Tax_Rate:0 ,Sale_Price: '', Amount:0, Discount: 0 }]);
        this.getinvoicebyid.set(res.id);
        this.printdata = res.data

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'invoice Sucessfully Saved', life: 3000, });
      }
    }
    else{
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Some field not filled!!', life: 3000, });
    }
  }

  async downloadpdf(data:any){
    const options = {
      margin:5,
      pagesplit: true,
      filename: `Invoice_${this.getinvoicebyid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(data).set(options).save();
  }

  print(data:any){
    const options = {
      margin:5,
      filename: `Invoice_${this.getinvoicebyid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(data).outputPdf().get('pdf').then((pdfObj)=> {
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
      filename: `Invoice_${this.getinvoicebyid()}`,
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
      filename: `Invoice_${this.getinvoicebyid()}`,
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: { mode: 'css', after: '.pagebreak' },
      html2canvas: { scale: 2,useCORS: true },
      jsPDF: { unit: 'mm', format: [80,height_mm], orientation: 'portrait' }
    };
    html2pdf().from(data).set(options).save();
  }

  saveandprintinvoice(size:any){
    this.saveinvoice(size);
    if(this.invoiceItems()[0].Item_Code&&this.invoicedetails().Customer_Mobilenumber && this.invoicedetails().Customer_Name && this.invoicedetails().Address && this.invoicedetails().City && this.invoicedetails().State && this.invoicedetails().Zip_Code && this.invoicedetails().Paid_Status && this.invoicedetails().Payment_Method ){
      this.invoiceprint = true;

      if(size == 'a4'){
        this.printfun = 'print';
        this.downloadfun = 'downloadpdf';
      }
      else{
        this.printfun = 'miniprint';
        this.downloadfun = 'downloadminipdf';
      }
    }
  }

}
