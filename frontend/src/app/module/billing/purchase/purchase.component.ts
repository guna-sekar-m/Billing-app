import { Component, HostListener, effect, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { TokenService } from 'src/app/shared/services/Token/token.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {

  Tablecolumns: any;
  Tablebodydatas: any=signal([]);
  formdata: any = [];
  productDialog: boolean;
  submitted: boolean;
  loading: boolean = false;
  tempfile: File;
  dyfunform: any;
  formdynamicconfig:any={};
  height : any;
  invoiceprint: boolean;
  suggestions : any;

  //lazy load
  pageSize: any = signal(10);
  currentPage: any = signal(1);
  totalRecords: any = signal(0);
  searchQuery: any = '';
  formconfig:any =
  {
    addrecord: { title: 'Add Items',buttonlabel: 'Save' },
    editrecord: { title: 'Edit Items',buttonlabel: 'Update' },
    fields: [
      {elementtype: 'input',type:'text',id: 'Invoice_Number',name: 'Invoice_Number',label: 'Invoice Number',colname: 'row1'},
      {elementtype: 'autoComplete',type:'text',id: 'Item_Code',name: 'Item_Code',label: 'Item Code',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'HSN',name: 'HSN',label: 'HSN',colname: 'row1'},
      {elementtype: 'autoComplete',type:'text',id: 'Item_Name',name: 'Item_Name',label: 'Item Name',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Brand_Name',name: 'Brand_Name',label: 'Brand Name',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Item_Category',name: 'Item_Category',label: 'Item Category',colname: 'row2'},
      {elementtype: 'date',type:'date',id: 'Purchase_date',name: 'Purchase_date',label: 'Purchase Date',colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Purchase_qty',name: 'Purchase_qty',label: 'Quantity',colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Tax_Rate',name: 'Tax_Rate',label: 'Tax Rate',colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Purchase_Price',name: 'Purchase_Price',label: 'Purchase Price',colname: 'row2'},
    ],
    grid:[{ colsize: 6, colname: "row1" },{ colsize: 6, colname: "row2" }],
  };

  constructor(
    private APIitemsServic : APIitemsService,
    private messageService : MessageService,
    private confirmationService : ConfirmationService,
    private TokenService : TokenService
  ){
    effect(()=>{
      this.Tablebodydatas()
    })
  }

  ngOnInit() {
    this.getTablecolumns();
    this.onResize()
  }

  async getTablebodydatas(){
    this.loading = true;
    var res=await this.APIitemsServic.getpurchase(this.currentPage(),this.pageSize(),this.searchQuery);
    this.Tablebodydatas.set(res.data);
    this.totalRecords.set(res.totalRecords);
    this.loading = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.height = innerWidth < 992? 'calc(100vh - 206px)': 'calc(100vh - 258px)' ;
  }

  getTablecolumns() {
    this.Tablecolumns = [
      { field: 'Invoice_Number', header: 'Invoice Number' },
      { field: 'Item_Code', header: 'Item Code' },
      { field: 'HSN', header: 'HSN' },
      { field: 'Item_Name', header: 'Item Name' },
      { field: 'Brand_Name', header: 'Brand Name' },
      { field: 'Item_Category', header: 'Item Category' },
      { field: 'Purchase_date', header: 'Purchase Date',formattype: 'date' },
      { field: 'Purchase_qty', header: 'Quantity' },
      { field: 'Tax_Rate', header: 'Tax Rate'},
      { field: 'Purchase_Price', header: 'Purchase Price'},

    ];
  }

  onPageChange(event: any) {
    this.pageSize.set(event.rows);
    this.currentPage.set(event.first / event.rows + 1);
    this.getTablebodydatas();
  }

  async search(event: any, field: any) {
    var res = await this.APIitemsServic.itemssearch(event.query, field);
    this.suggestions = res;
  }

  onSearchInputChange() {
    this.getTablebodydatas();
  }

  openNew(){

    if((this.TokenService.getUserDetails().data.Product_Status == 'Trial'&&this.totalRecords()>9)||(this.TokenService.getUserDetails().data.Product_Status == 'Trial'&&this.Tablebodydatas().length>9)){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Trail Version Limit Reached!!', life: 3000 });
    }
    else if(this.TokenService.getUserDetails().data.Product_Status =='Trial Expired'){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Trial Version Expired!!', life: 3000, });
    }
    else if(this.TokenService.getUserDetails().data.Product_Status =='Expired'){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product License Expired!!', life: 3000 });
    }
    else{
      this.autocomplete_Field=null;
      this.formdata = {};
      this.formdynamicconfig={};
      this.dyfunform = 'Save';
      this.formdynamicconfig={title:this.formconfig.addrecord.title,buttonlabel:this.formconfig.addrecord.buttonlabel};
      this.submitted = false;
      this.productDialog = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.keyCode == 13) {
      //console.log(event)
    }
  }

  autocomplete_Field: any
  loaddata(data : any, field: any){
    this.autocomplete_Field = field;
    this.formdata={...this.formdata,Item_Code : data['Item_Code'], Item_Name : data['Item_Name'],Brand_Name : data['Brand_Name'], HSN: data['HSN'], Item_Category :data['Item_Category']};
    //console.log(this.formdata)
  }

  //table crud
  async Save(formdata:any){
    var savedata : any;
    if(this.autocomplete_Field){
      savedata = {...formdata.value,...{[this.autocomplete_Field]:formdata.value[this.autocomplete_Field][this.autocomplete_Field]}}
    }
    var res = await this.APIitemsServic.savepurchase(savedata);
    if(!res.msg){
      this.Tablebodydatas.mutate((data:any)=>data.unshift(res));
      this.productDialog = false;
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res.msg, life: 3000, });
    }

  }

  edititems(rowData: any){
    this.autocomplete_Field=null;
    this.formdata = {};
    this.formdynamicconfig={};
    this.dyfunform='Update';
    this.formdynamicconfig={title:this.formconfig.editrecord.title,buttonlabel:this.formconfig.editrecord.buttonlabel};
    this.formdata = { ...rowData };
    this.productDialog = true;
  }

  Update(formdata:any,file:any,id:any){
    console.log(formdata.value)
  }

  clear(daat: any){

  }

  deleteitems(data: any){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + data.Item_Name + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        var deleteres=await this.APIitemsServic.deletepurchase(data.id);
        this.Tablebodydatas.mutate((res : any) =>res.splice(res.filter((val : any) => val.id == deleteres.id), 1));
        this.productDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
      },
    });
  }

  async downloadxlx(data : any,name : any){
     await this.APIitemsServic.downloadxls('purchase');
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, name);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + moment(new Date()).format('DD-MM-YYYY') + EXCEL_EXTENSION);
  }

}
