import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//primng
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule} from 'primeng/dataview';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

//billing module
import { BillingRoutingModule } from './billing-routing.module';
import { InvoiceDashboardComponent } from './invoice-dashboard/invoice-dashboard.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ItemsComponent } from './items/items.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { SafehtmlPipe } from 'src/app/shared/Pipes/safehtml/safehtml.pipe';
import { SettingsComponent } from './settings/settings.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CheckobjPipe } from 'src/app/shared/Pipes/checkobj/checkobj.pipe';
import { SoftwareLicenseComponent } from './software-license/software-license.component';
import { InstantInvoiceComponent } from './instant-invoice/instant-invoice.component';

@NgModule({
  declarations: [
    InvoiceDashboardComponent,
    AddInvoiceComponent,
    TableComponent,
    ItemsComponent,
    InvoiceListComponent,
    EditInvoiceComponent,
    SafehtmlPipe,
    SettingsComponent,
    PurchaseComponent,
    CheckobjPipe,
    SoftwareLicenseComponent,
    InstantInvoiceComponent

  ],
  imports: [
    CommonModule,

    FormsModule,
    BillingRoutingModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    DialogModule,
    MessagesModule,
    ToastModule,
    ConfirmDialogModule,
    DataViewModule,
    AutoCompleteModule,
    CheckboxModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule
  ],
  providers:[ConfirmationService, MessageService],
  exports:[ TableComponent]

})
export class BillingModule { }
