import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../Token/token.service';
TokenService

@Injectable({
  providedIn: 'root'
})
export class APIdashboardService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient, private TokenService : TokenService) { }
  Api_url : any = signal(this.apiurl.Apiurl());

  async getdashboard(){
    var data$ = this.http.get(`${this.Api_url()}/api/getdashboard`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getsalesreport(){
    var data$ = this.http.get(`${this.Api_url()}/api/pruchase&salesreport`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getsalesreportbycutom(data: any){
    var data$ = this.http.post(`${this.Api_url()}/api/pruchase&salesreport`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getrecentbestsales(){
    var data$ = this.http.get(`${this.Api_url()}/api/recentbestsales`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getinvoices(){
    var data$ = this.http.get(`${this.Api_url()}/api/getinvoices`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async notsoldproducts(){
    var data$ = this.http.get(`${this.Api_url()}/api/notsoldproducts`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async outofstockproducts(){
    var data$ = this.http.get(`${this.Api_url()}/api/outofstock`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getinvoicebydb(data : any){
    var data$ = this.http.post(`${this.Api_url()}/api/getinvoicebydb`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
