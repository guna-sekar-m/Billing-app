import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIEndpointService {

  Apiurl(){
    var url="http://localhost:4000";
    return url;
  }
}
