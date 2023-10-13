import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safehtml'
})
export class SafehtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer){}
  transform(value: any) {
    if (this.sanitized.bypassSecurityTrustHtml(value) != undefined || this.sanitized.bypassSecurityTrustHtml(value) != null ) {
      if (value === undefined||value === null) {
      return "";
      }
      else {
        return this.sanitized.bypassSecurityTrustHtml(value);
      }
    }
    else {
      return this.sanitized.bypassSecurityTrustHtml("<p>"+value+"</p>");
    }
  }

}
