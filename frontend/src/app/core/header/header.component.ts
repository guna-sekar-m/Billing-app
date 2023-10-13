import { Component} from '@angular/core';
import { APIEndpointService } from 'src/app/shared/services/APIEndpoint/apiendpoint.service';
import { ApisettingsService } from 'src/app/shared/services/APIsettings/apisettings.service';
import { TokenService } from 'src/app/shared/services/Token/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  sidebar : boolean;
  headertheme : any
 constructor(public TokenService:TokenService, public APIEndpointService : APIEndpointService, private ApisettingsService : ApisettingsService){}

 api : string = this.APIEndpointService.Apiurl()

  ngOnInit():void{
    this.sidebar= window.innerWidth >= 992? true : false;
    this.gettheme();
  }

  resizebody(){
    var body: any = document.querySelector('#my-container');
    var offcanvas: any = document.querySelector('#offcanvasNavbar');

    if (body.classList.contains('my-container')&&offcanvas.classList.contains('show')) {
      body.classList.remove('my-container');
      offcanvas.classList.remove('show');
      this.sidebar = false;
    }
    else if(body.classList.contains('my-container')&&!offcanvas.classList.contains('show')){
      offcanvas.classList.add('show');
      this.sidebar = true;
    }
    else if(!body.classList.contains('my-container')&&!offcanvas.classList.contains('show')) {
      body.classList.add('my-container');
      offcanvas.classList.add('show');
      this.sidebar = true;
    }
  }

  async gettheme(){
    this.headertheme = await this.ApisettingsService.getthemes();
  }

  toggleFullScreen() {
    !document.fullscreenElement? (document as any).documentElement.requestFullscreen() :  document.exitFullscreen()
  }

  logout(){
   return this.TokenService.logout();
  }

}
