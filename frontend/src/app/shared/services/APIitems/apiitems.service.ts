import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../Token/token.service';

@Injectable({
  providedIn: 'root'
})
export class APIitemsService {
  constructor(private apiurl:APIEndpointService, private http:HttpClient, private TokenService : TokenService) { }

  Api_url : any = signal(this.apiurl.Apiurl());

  async itemssearch(data:any,field:any){
    var data$ = this.http.post(`${this.Api_url()}/api/searchitems`,{data:data,field:field},{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getallitems(page: number, pageSize: number,searchQuery: string){
    var params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if(searchQuery){
      params =params.set('search', searchQuery);
    }
    var data$ = this.http.get(`${this.Api_url()}/api/getitems`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true,params});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async saveitems(data:any){
    var data$ = this.http.post(`${this.Api_url()}/api/saveitems`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async importitems(data:any){
    var data$ = this.http.post(`${this.Api_url()}/api/importitems`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async updateitems(data:any,id:any){
    var data$ = this.http.put(`${this.Api_url()}/api/updateitems`,{data:data,id:id},{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async deleteitems(id:any){
    var data$ = this.http.delete(`${this.Api_url()}/api/deleteitems`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true, body: {id:id}});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async itemsqtyvalidation(data : any){
    var data$ = this.http.post(`${this.Api_url()}/api/itemsqtyvalidation`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getpurchase(page: number, pageSize: number,searchQuery: string){
    var params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if(searchQuery){
      params =params.set('search', searchQuery);
    }
    var data$ = this.http.get(`${this.Api_url()}/api/getpurchase`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true,params});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async savepurchase(data:any){
    var data$ = this.http.post(`${this.Api_url()}/api/savepurchase`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async deletepurchase(data:any){
    var data$ = this.http.delete(`${this.Api_url()}/api/deletepurchase`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true, body: {id:data}});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getfilter_items(data:any){
    var data$ = this.http.post(`${this.Api_url()}/api/getfilteritems`,{field : data},{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async downloadxls(data){
    var data$ = this.http.post(`${this.Api_url()}/api/downloadxls`,{field : data},{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

}
