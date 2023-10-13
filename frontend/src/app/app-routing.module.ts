import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './shared/services/authguard/authguard.service';
//core components
import { MainComponent } from './core/main/main.component';
//module components
import { LoginComponent } from './module/login/login.component';
import { RegisterComponent } from './module/register/register.component';
import { ForgotPasswordComponent } from './module/forgot-password/forgot-password.component';

const routes: Routes = [
  {path:'login',component:LoginComponent,title:"Billing | Login"},
  {
    path:'billing',component:MainComponent,
    children:[

      {path:'app',loadChildren:()=>import('./module/billing/billing.module').then(m=>m.BillingModule),canActivate:[AuthguardService],data:{roles:['Primaryadmin','Admin',]}}

    ]
  },
  {path:'register',component:RegisterComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'',redirectTo:'/login',pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'top',useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
