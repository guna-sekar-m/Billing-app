import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { TokenService } from 'src/app/shared/services/Token/token.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
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
  formconfig:any =
  {
    addrecord: { title: 'Add Items',buttonlabel: 'Save' },
    editrecord: { title: 'Edit Items',buttonlabel: 'Update' },
    fields: [
      {elementtype: 'input',type:'text',id: 'Item_Code',name: 'Item_Code',label: 'Item Code',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'HSN',name: 'HSN',label: 'HSN',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Item_Name',name: 'Item_Name',label: 'Item Name',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Item_Category',name: 'Item_Category',label: 'Item Category',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Brand_Name',name: 'Brand_Name',label: 'Brand Name',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Purchase_Price',name: 'Purchase_Price',label: 'Purchase Price',colname: 'row1'},
      {elementtype: 'input',type:'text',id: 'Sale_Price',name: 'Sale_Price',label: 'Sale Price',colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Tax_Rate',name: 'Tax_Rate',label: 'Tax Rate',colname: 'row2'},
      {elementtype: 'dropdown',id: 'Tax_Status',name: 'Tax_Status',label: 'Tax Status',value:['Inclusive','Exclusive'],colname: 'row2'},
      {elementtype: 'input',type:'text',id: 'Item_Stock',name: 'Item_Stock',label: 'Item Stock',colname: 'row2'},
      {elementtype: 'dropdown',id: 'Item_Status',name: 'Item_Status',label: 'Item Status',value:['Active','Inactive'],colname: 'row2'},
    ],
    grid:[{ colsize: 6, colname: "row1" },{ colsize: 6, colname: "row2" }],
  };
  //lazy load
  pageSize: any = signal(10);
  currentPage: any = signal(1);
  totalRecords: any = signal(0);
  searchQuery: any = '';
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.height = innerWidth < 992? 'calc(100vh - 206px)': 'calc(100vh - 258px)';
  }

  getTablecolumns() {
    this.Tablecolumns = [
      { field: 'Item_Code', header: 'Item Code' },
      { field: 'HSN', header: 'HSN' },
      { field: 'Item_Name', header: 'Item Name',filtertype:'select'},
      { field: 'Item_Category', header: 'Item Category' },
      { field: 'Brand_Name', header: 'Brand Name'},
      { field: 'Purchase_Price', header: 'Purchase Price'},
      { field: 'Sale_Price', header: 'Sale Price'},
      { field: 'Tax_Status', header: 'Tax Status'},
      { field: 'Tax_Rate', header: 'Tax Rate'},
      { field: 'Item_Stock', header: 'Item Stock' },
      { field: 'Item_Status', header: 'Item Status' }
    ];
  }

  async getTablebodydatas(){
    this.loading = true;
    var res=await this.APIitemsServic.getallitems(this.currentPage(),this.pageSize(),this.searchQuery);
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
      this.formdata = {};
      this.formdynamicconfig={};
      this.dyfunform = 'Save';
      this.formdynamicconfig={title:this.formconfig.addrecord.title,buttonlabel:this.formconfig.addrecord.buttonlabel};
      this.submitted = false;
      this.productDialog = true;
    }

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

  //table crud
  async Save(formdata:any){
    var res=await this.APIitemsServic.saveitems(formdata.value);
    if(!res.msg){
      this.Tablebodydatas.mutate((data:any)=>data.unshift(res));
      this.productDialog = false;
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res.msg, life: 3000, });
    }

  }

  async Update(formdata:any,file:any,id:any){
    var updateres=await this.APIitemsServic.updateitems(formdata.value,id);
    this.Tablebodydatas.mutate((data:any)=>{
     var index=data.findIndex(d=>d.id==updateres.id);
     data[index]=updateres;
    });
    this.productDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Updated', life: 3000 });
  }

  invoiceprint: boolean;
  handleFile(event: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to import this file?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        const jsonResult : any = [];
        fileReader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          workbook.SheetNames.forEach(sheetName => {
            const jsonData : any = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{raw: false,dateNF: 'yyyy-mm-dd'});
            jsonResult.push({ [sheetName]: jsonData });
          });
          var field = Object.keys(jsonResult[0])[0]
          var finaljson = jsonResult[0][field];

          var cols = this.Tablecolumns.filter((data: any) => { return data.formattype == 'date' }).map(res=>res.field);
          finaljson.forEach((customer: any) => {
            cols.forEach((col: string) => { customer[col] = new Date(customer[col]) });
          });
          this.saveDataToBackend(finaljson);
        };
        fileReader.readAsArrayBuffer(file);
      },
    });
  }

  async saveDataToBackend(data: any[]) {
    var res = await this.APIitemsServic.importitems(data);
    res.map((obj : any)=>this.Tablebodydatas.mutate((data:any)=>data.push(obj)));
    this.invoiceprint = false;
  }

  async deleteitems(item:any){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete <b>' + item.Item_Name + '</b>?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        var deleteres=await this.APIitemsServic.deleteitems(item.id);
        this.Tablebodydatas.mutate((res) =>res.splice(res.filter((val) => val.id == deleteres.id), 1));
        this.productDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
      },
    });
  }

  async downloadxlx(name : any){
    var data = await this.APIitemsServic.downloadxls('items')
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

  fitered_Data : any
  async getfilterlist(header : any){
    this.fitered_Data = await this.APIitemsServic.getfilter_items(header);
  }
}
