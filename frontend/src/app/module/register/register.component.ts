import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiregisterService } from 'src/app/shared/services/APIregister/apiregister.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  Email : any;
  formstatus : any ;

  constructor(
    private ApiregisterService : ApiregisterService,
    private messageService : MessageService,
    private Route : Router
  ){}

  async emsregister(data : any){
    this.Email = data.value.Email
    var res = await this.ApiregisterService.sendotp(data.value);
    this.formstatus = res.msg
    if(res.msg == 'OTP sended'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Sended Succesfully', life: 3000, });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email already exists', life: 3000, });
    }
    //msg: "OTP sended"
  }

  async otpverify(data : any){
    var res = await this.ApiregisterService.verifyotp({Email : this.Email,OTP:data.value.OTP});
    this.formstatus = res.msg
    if(res.msg == 'OTP Verified'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Verified Succesfully', life: 3000, });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid OTP', life: 3000, });
    }
  }

  async resendotp(){
    var res = await this.ApiregisterService.sendotp({Email:this.Email});
    this.formstatus = res.msg
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP Resended Succesfully', life: 3000, });
  }

  password : boolean;
  async checkpass(Password : any,Confirm_Password : any){
    //console.log(Password.value,Confirm_Password.value)
    this.password = Password.value == Confirm_Password.value?true:false
  }

  async detaild(data : any){
    if(data.value.Password == data.value.Confirm_Password){
      var res = await this.ApiregisterService.completeregister({id:{Email:this.Email},data : {...data.value,OTP_Status : 'Verified',Status :'Active'}});
      //console.log(res)
      if(res.msg == 'succes'){
        this.Route.navigate(['/login'])
      }
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Confirm Password Not Matched', life: 3000, });
    }
  }
}
