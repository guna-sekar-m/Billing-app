import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiforgotPasswordService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient) { }
  Api_url : any = signal(this.apiurl.Apiurl());

  async sendotp(data : any){
    var data$ = this.http.post(`${this.Api_url()}/api/passotp`,data);
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async verifyotp(data : any){
    var data$ = this.http.post(`${this.Api_url()}/api/passverifyotp`,data);
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async completeregister(data : any){
    var data$ = this.http.put(`${this.Api_url()}/api/resetpassword`,data);
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
