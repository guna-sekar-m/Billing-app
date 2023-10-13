import { Component, HostListener } from '@angular/core';
import { Table } from 'primeng/table';
import { APIitemsService } from 'src/app/shared/services/APIitems/apiitems.service';
import { Chart, registerables } from 'chart.js';
import { APIdashboardService } from 'src/app/shared/services/APIdashboard/apidashboard.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-dashboard',
  templateUrl: './invoice-dashboard.component.html',
  styleUrls: ['./invoice-dashboard.component.css']
})
export class InvoiceDashboardComponent {
  datas:any;
  Tablecolumns:any;
  Tablebodydatas:any;
  dashbord_Count : any;
  dropdown : any = ['Current Week','Last Week','Current Month','Last Month','Select Month'];
  selectedCharttype: any ='Current Month';
  selecteMonth : any;
  topsaleproducts : any;
  notsoldproduct: any;
  outofstockproduct : any;
  width : any;
  public reportchat: Chart;
  tablepanelsetting:any={
    paneltitle:"Invoice Details",
    addrecord:{viewactive:false,label:'New Invoice',routerlink:'/tcz/billing/add-invoice'},
    importrecord:{viewactive:false},
    exportrecord:{viewactive:false}
  };

  constructor(private APIitemsService:APIitemsService, private APIdashboardService : APIdashboardService){
    Chart.register(...registerables);
  }

  ngOnInit(){
    this.getTablecolumns();
    this.getdashborsd();
    this.getsalesreport();
    this.getrecentbestsale();
    this.getnotsoldproducts();
    this.getoutofstock();
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.width = innerWidth < 992? '100vw': '50vw' ;
  }

  async getdashborsd(){
    var res = await this.APIdashboardService.getdashboard();
    this.dashbord_Count= res;
    if(res.msg){
      alert(res.msg)
    }
  }

  async getsalesreport(){
    var res = await this.APIdashboardService.getsalesreport();
    this.getchat(res)
  }

  async getrecentbestsale(){
    var res = await this.APIdashboardService.getrecentbestsales();
    this.topsaleproducts = res;
  }

  async getnotsoldproducts(){
    var res = await this.APIdashboardService.notsoldproducts();
    //console.log(res)
    this.notsoldproduct = res;
  }

  async getoutofstock(){
    var res = await this.APIdashboardService.outofstockproducts()
    this.outofstockproduct = res;
  }

  getTablecolumns(){
    this.Tablecolumns = [
      { field: 'Invoice ID', header: 'Invoice ID' },
      { field: 'Invoice to', header: 'Invoice to' },
      { field: 'Amount', header: 'Amount' },
      { field: 'Status', header: 'Status' },
      { field: 'Created on', header: 'Created on' }
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  getchat(datas : any){
    //console.log(datas,datas.map(res =>res.date))
    const data = {
      labels: datas.map(res =>res.date),
      datasets: [{
        label: 'Purchase',
        data: datas.map(res =>res.purchase),
        fill: false,
        borderColor: '#d63384',
        backgroundColor: '#d63384',
      },
      {
        label: 'Sales',
        data: datas.map(res =>res.sales),
        fill: false,
        borderColor: '#d63384',
        backgroundColor: '#28C76F',
      }]
    };
    if(this.reportchat) this.reportchat.destroy();
    this.reportchat =  new Chart( 'acquisitions', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        aspectRatio: 2.9,

      }
    });
  }

  async changecharttype(data : any){
    if(data.value != 'Select Month'){
      await this.getchartbydate({value:{selectedCharttype:data.value}})
    }
  }

  async getchartbydate(data : any){
    var response = await this.APIdashboardService.getsalesreportbycutom(data.value);
    this.getchat(response)
  }

  downloadxlx(data : any,name : any){
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

  visible : boolean;
  title : any;
  invoicedata : any;
  async getinvoicedt(data: any){
    var res = await this.APIdashboardService.getinvoicebydb(data);
    this.invoicedata = res;
    this.visible = true;
    this.title = (data.data == 'all'? 'All':data.data) + ' Invoice Details'
  }

}
