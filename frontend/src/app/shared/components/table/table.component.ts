import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() Tablecolumns:any;
  @Input() Tablebodydatas:any;
  @Input() tablepanelsetting:any={paneltitle:"Panalname",addrecord:{viewactive:true},importrecord:{viewactive:true},exportrecord:{viewactive:true}};
  datas:any;
  clear(table: Table) {
    table.clear();
  }
}
