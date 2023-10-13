import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../Token/token.service';

@Injectable({
  providedIn: 'root'
})
export class APIProductsService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient, private TokenService :TokenService) { }
  Api_url : any = signal(this.apiurl.Apiurl());
  async getallproduct(){
    var data$ = this.http.get(`${this.Api_url()}/api/getallproduct`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }
  async suggestproduct(e:any){
    var data$ = this.http.get(`${this.Api_url()}/api/suggestproduct?key=${e}`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }
  async searchproduct(e:any){
    var data$ = this.http.get(`${this.Api_url()}/api/searchproduct?k=${JSON.stringify(e)}`,{headers: {Authorization: `Bearer ${this.TokenService.getAccessToken()}` },withCredentials: true});
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
