import { Component } from '@angular/core';
import * as moment from 'moment';
import { ApilicenseService } from 'src/app/shared/services/APILicense/apilicense.service';
import { TokenService } from 'src/app/shared/services/Token/token.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-software-license',
  templateUrl: './software-license.component.html',
  styleUrls: ['./software-license.component.css']
})
export class SoftwareLicenseComponent {

  license : any;
  trialexprie : any;
  productkey : any;
  activate : any;
  constructor(
    private ApilicenseService : ApilicenseService,
    public TokenService : TokenService,
    private messageService : MessageService,
    private Route : Router
  ){}

  ngOnInit():void{
    this.getlicense()
  }

  async getlicense(){
    this.license = await this.ApilicenseService.getlicensedt();
    var trial_expiredate = moment(this.license.createdAt).add(30, 'days');
    var currentdate = moment(new Date())
    this.trialexprie = moment(trial_expiredate).diff(moment(currentdate), 'days')
  }

  async Activatekey(data : any){
    this.activate = await this.ApilicenseService.ActivateKey(data.value);
    if(this.activate.msg == 'License Activated Successfully'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: this.activate.msg, life: 3000, });
      this.Route.navigate(['/login'])
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.activate.msg, life: 3000, });
    }
  }

  async Generatekey(data : any){
    var res = await this.ApilicenseService.GenerateKey(data.value);
    if(res.msg == 'Key Generated Successfully'){
      this.productkey = res.Product_Key;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Key Generated Successfully', life: 3000, });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: res.msg, life: 3000, });
    }
  }
}
