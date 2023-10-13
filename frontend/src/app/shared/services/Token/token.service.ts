import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router : Router) {}

  getAccessToken() {
    return localStorage.getItem('Billing_token');
  }

  getUserDetails() {
    const token = this.getAccessToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    let authToken = localStorage.getItem('Billing_token');
    return (authToken !== null) ? true : false;
  }


  logout() {
    if (localStorage.removeItem('Billing_token') !== null) {
      this.router.navigate(['/login']);

    }
  }
}
