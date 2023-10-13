import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiforgotPasswordService } from 'src/app/shared/services/APIForgotpassword/apiforgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  Email : any;
  formstatus : any ;
  password : boolean;

  constructor(
    private FPService : ApiforgotPasswordService,
    private messageService : MessageService,
    private Route : Router
  ){}

  async sendotp(data : any){
    this.Email = data.value.Email
    var res = await this.FPService.sendotp(data.value);

    this.formstatus = res.msg
    if(res.msg == 'OTP sended'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Sended Succesfully', life: 3000, });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res.msg+'!!', life: 3000, });
    }

  }

  async resendotp(){
    var res = await this.FPService.sendotp({Email:this.Email});
    this.formstatus = res.msg
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Resended Succesfully', life: 3000, });
  }

  async otpverify(data : any){
    var res = await this.FPService.verifyotp({Email : this.Email,OTP:data.value.OTP});
    this.formstatus = res.msg
    if(res.msg == 'OTP Verified'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Verified Succesfully', life: 3000, });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid OTP', life: 3000, });
    }
  }

  async resetpass(data : any){
    if(data.value.Password == data.value.Confirm_Password){
      var res = await this.FPService.completeregister({id:{Email:this.Email},data : data.value});
      //console.log(res)
      if(res.msg == 'succes'){
        this.Route.navigate(['/login'])
      }
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Confirm Password Not Matched', life: 3000, });
    }
  }


  checkpass(Password : any,Confirm_Password : any){
    this.password = Password.value == Confirm_Password.value?true:false
  }
}
