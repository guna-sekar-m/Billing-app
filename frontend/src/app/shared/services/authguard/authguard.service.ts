import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../Token/token.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(public auth: TokenService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    if (this.auth.isLoggedIn() !== true) {
      this.router.navigate(['/login']);
    }

    return this.CheckLoginAccess(route);
  }

  async CheckLoginAccess(route : any): Promise<boolean>{
    if(this.auth.isLoggedIn()){
    const userRole = this.auth.getUserDetails().data.Role;
   if(route.data['roles'] !=undefined){
    if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1){
      this.router.navigate(['/login']);
      return false;
    }
   }
    return true
    }
    else{
      this.router.navigate(['/login']);
      return false
    }
  }
}
