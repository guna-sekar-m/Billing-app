import { Injectable, signal } from '@angular/core';
import { APIEndpointService } from '../APIEndpoint/apiendpoint.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiloginService {

  constructor(private apiurl:APIEndpointService,private http:HttpClient) { }
  Api_url : any = signal(this.apiurl.Apiurl());
  async login(data:any){
    var data$ = this.http.post(`${this.Api_url()}/api/login`,data);
    var response : any = await lastValueFrom(data$);
    return response;
  }
}
