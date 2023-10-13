import { Component, HostListener, effect, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIEndpointService } from 'src/app/shared/services/APIEndpoint/apiendpoint.service';
import { ApisettingsService } from 'src/app/shared/services/APIsettings/apisettings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

  imageurl : any;
  userdata : any

  constructor(
    private ApisettingsService : ApisettingsService,
    private messageService : MessageService,
    private confirmationService : ConfirmationService,
    public APIEndpointService : APIEndpointService
  ){ }

  api : string = this.APIEndpointService.Apiurl()

  ngOnInit() {
    this.getuserdetails()
  }

  tempflie : any
  onFileSelected(data : any){
    let reader = new FileReader();
    this.tempflie = data.target.files;
    reader.readAsDataURL(data.target.files[0]);
    reader.onload = () => { this.imageurl = reader.result; };
  }

  async getuserdetails(){
    this.userdata = await this.ApisettingsService.getuserdt();
  }

  async updateuser(data : any){
    var datas = await this.ApisettingsService.updateusers(data.value,this.tempflie);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Details Update Succussfully', life: 3000 });
  }

  async header_bg(theme : any){
    var gettheme = await this.ApisettingsService.getthemes();
    if(gettheme.header_theme){
      document.querySelector('header')?.classList.remove(gettheme.header_theme);
      document.querySelector('footer')?.classList.remove(gettheme.header_theme);
    }
    var res = await this.ApisettingsService.updatethemes({header_theme:theme});
    document.querySelector('header')?.classList.add(theme)
    document.querySelector('footer')?.classList.add(theme)
  }

  async sidemenu_bg(theme : any){
    var gettheme = await this.ApisettingsService.getthemes();
    if(gettheme.sidemenu_theme){
      document.getElementById('offcanvasNavbar')?.classList.remove(gettheme.sidemenu_theme);
    }
    var res = await this.ApisettingsService.updatethemes({sidemenu_theme:theme});
    document.getElementById('offcanvasNavbar')?.classList.add(theme)
  }

  async primary_bg(theme : any){
    var gettheme = await this.ApisettingsService.getthemes();
    if(gettheme.primary_theme){
      document.querySelector('body')?.classList.remove(gettheme.primary_theme);
    }
    var res = await this.ApisettingsService.updatethemes({primary_theme:theme});
    document.querySelector('body')?.classList.add(theme)
  }

  async resettheme(theme : any){
    var gettheme = await this.ApisettingsService.getthemes();
    if(gettheme[theme] && theme == 'header_theme'){
      document.querySelector('header')?.classList.remove(gettheme[theme]);
      document.querySelector('footer')?.classList.remove(gettheme[theme]);
    }
    else if(gettheme[theme] && theme == 'sidemenu_theme'){
      document.getElementById('offcanvasNavbar')?.classList.remove(gettheme[theme]);
    }
    else if(gettheme[theme] && theme == 'primary_theme'){
      document.querySelector('body')?.classList.remove(gettheme[theme]);
    }
    var res = await this.ApisettingsService.updatethemes({[theme]:''});
  }



}
