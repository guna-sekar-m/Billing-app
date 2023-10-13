import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../Token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ApilicenseService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient, private TokenService :TokenService) { }

  Api_url : any = signal(this.apiurl.Apiurl());

  async getlicensedt(){
    var data$ = this.http.get(`${this.Api_url()}/api/getlicensedt`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async ActivateKey(data: any){
    var data$ = this.http.post(`${this.Api_url()}/api/activatekey`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async GenerateKey(data: any){
    console.log(data)
    var data$ = this.http.post(`${this.Api_url()}/api/generatekey`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
