import { Component } from '@angular/core';
import { ApisettingsService } from 'src/app/shared/services/APIsettings/apisettings.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private ApisettingsService : ApisettingsService){}

  ngOnInit():void{
    this.gettheme()
  }
  async gettheme(){
   var theme = await this.ApisettingsService.getthemes();
    if(theme.primary_theme){
      document.querySelector('body')?.classList.add(theme.primary_theme);
      document.querySelector('footer')?.classList.add(theme.header_theme)
    }
  }
}
