import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDashboardComponent } from './invoice-dashboard/invoice-dashboard.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { ItemsComponent } from './items/items.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { AuthguardService } from 'src/app/shared/services/authguard/authguard.service';
import { SettingsComponent } from './settings/settings.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SoftwareLicenseComponent } from './software-license/software-license.component';
import { InstantInvoiceComponent } from './instant-invoice/instant-invoice.component';


const routes: Routes = [
  {path:'invoice-dashboard',component:InvoiceDashboardComponent,title:"Billing | Invoice Dashboard",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin',]}},
  {path:'add-invoice',component:AddInvoiceComponent,title:"Billing | New Invoice",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'instant-invoice',component:InstantInvoiceComponent,title:"Billing | Instant Invoice",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'invoice-list',component:InvoiceListComponent,title:"Billing | Invoice List",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'edit-invoice/:id',component:EditInvoiceComponent,title:"Billing | Edit Invoice",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'items',component:ItemsComponent,title:"Billing | Items",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'purchase',component:PurchaseComponent,title:"Billing | Purchase",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'product-license',component:SoftwareLicenseComponent,title:"Billing | License",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},
  {path:'settings',component:SettingsComponent,title:"Billing | Settings",canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin']}},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
