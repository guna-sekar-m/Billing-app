import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { TokenService } from '../Token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ApisettingsService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient, private TokenService : TokenService) { }
  Api_url : any = signal(this.apiurl.Apiurl());

  async getuserdt(){
    var data$ = this.http.get(`${this.Api_url()}/api/getusersdt`,{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getallusers(page: number, pageSize: number,searchQuery: string){
    var params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    if(searchQuery){
      params =params.set('search', searchQuery.toString());
    }
    var data$ = this.http.get(`${this.Api_url()}/api/getallusers`,{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true,params});
    var response : any = await lastValueFrom(data$);

    return response;
  }

  async updateusers(data:any,file:any){
    var datats = new FormData();
    console.log(file)
    if(file){
      datats.append(`file`,file[0]);
    }

    datats.append('data',JSON.stringify(data));

    var data$ = this.http.put(`${this.Api_url()}/api/updateuser`,datats,{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async getthemes(){
    var data$ = this.http.get(`${this.Api_url()}/api/get_theme`,{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

  async updatethemes(data : any){
    var data$ = this.http.put(`${this.Api_url()}/api/updatethemes`,data,{headers: { Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }

}
