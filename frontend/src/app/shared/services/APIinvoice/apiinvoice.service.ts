import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../Token/token.service';

@Injectable({
  providedIn: 'root'
})
export class APIinvoiceService {
  constructor(
    private apiurl:APIEndpointService,
    private http:HttpClient,
    private TokenService : TokenService
  ) { }
  Api_url : any = signal(this.apiurl.Apiurl());
  async getnewinvoice(){
    var data$ = this.http.get(`${this.Api_url()}/api/getnewinvoice`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getallinvoices(page: number, pageSize: number,searchQuery: string){
    var params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
   // console.log(searchQuery)
    if(searchQuery){
      params =params.set('search', searchQuery.toString());
    }
    var data$ = this.http.get(`${this.Api_url()}/api/getallinvoices`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true,params});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async itemssearch(){
    var data$ = this.http.get(`${this.Api_url()}/api/getitems`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async addnewinvoice(data:any,size: any){
    var data$ = this.http.post(`${this.Api_url()}/api/addnewinvoice`,{data:data,size:size},{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async updateinvoice(data:any){
    var data$ = this.http.put(`${this.Api_url()}/api/updateinvoice`,data,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  //edit invoice
  async getinvoicebyid(id:any){
    var data$ = this.http.get(`${this.Api_url()}/api/getinvoicebyid?invoiceid=${id}`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async printpdf(id:any,size : any){
    var data$ = this.http.post(`${this.Api_url()}/api/printpdf`,{id:id,size:size},{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true,'responseType': 'text'});
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
