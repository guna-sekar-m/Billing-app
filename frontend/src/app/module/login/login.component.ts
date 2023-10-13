import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiloginService } from 'src/app/shared/services/APIlogin/apilogin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emslogindata:any={};
  constructor(private router:Router,private ApiloginService:ApiloginService,private messageService: MessageService){}
  async emslogin(data:any){
   var res:any=await this.ApiloginService.login(data.value);
   if(res.message=="Success"){
    localStorage.setItem('Billing_token',res.token);
    this.router.navigate(['/billing/app/invoice-dashboard'])
   }
   else{
    //alert("Invalid Email or Password")
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Email or Password' });
   }
  }
}
