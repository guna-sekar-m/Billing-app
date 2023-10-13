import { Component, HostListener } from '@angular/core';
import { ApisettingsService } from 'src/app/shared/services/APIsettings/apisettings.service';
import { TokenService } from 'src/app/shared/services/Token/token.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],

})
export class SidebarComponent {

  addclass:any;
  theme : any;

constructor(public  TokenService:TokenService, private ApisettingsService : ApisettingsService ){}
  ngOnInit(){
    var offcanvas: any = document.querySelector('#offcanvasNavbar');
    if (window.innerWidth >= 992) {
      if(!offcanvas.classList.contains('show')){
        offcanvas.classList.add('show');
      }
    } else {
      if(offcanvas.classList.contains('show')){
      offcanvas.classList.remove('show');
      }
    }
    this.gettheme();
  }

 async gettheme(){
  this.theme = await this.ApisettingsService.getthemes();

 }

  @HostListener('window:resize', ['$event'])
  resize(){
    var offcanvas: any = document.querySelector('#offcanvasNavbar');
    var body: any = document.querySelector('#my-container');
    if (window.innerWidth >= 992) {
      if(!offcanvas.classList.contains('show')){
        offcanvas.classList.add('show');
        body.classList.add('my-container');
      }
    }
    else {
      if(offcanvas.classList.contains('show')){
      offcanvas.classList.remove('show');
      }
    }
  }
  ngAfterViewInit(){
    var offcanvas: any = document.querySelector('#offcanvasNavbar');
    if (window.innerWidth >= 992) {
      if(!offcanvas.classList.contains('show')){
        offcanvas.classList.add('show');
      }
    } else {
      if(offcanvas.classList.contains('show')){
      offcanvas.classList.remove('show');
      }
    }
  }
  logout(){
    return this.TokenService.logout();
   }
}
