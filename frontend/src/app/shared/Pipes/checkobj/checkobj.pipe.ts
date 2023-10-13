import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkobj'
})
export class CheckobjPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    console.log(value,args,typeof value == 'object'?args[0]:null)
    return typeof value == 'object'?args[0]:'';
  }

}
