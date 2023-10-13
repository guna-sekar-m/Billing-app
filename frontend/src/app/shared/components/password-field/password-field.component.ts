import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.css']
})
export class PasswordFieldComponent {
  @Input() name: string;
  @Input() value: string;
  @Input() className: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  public passwordVisible:boolean = true;
  icon:any='<i class="fa-regular fa-eye"></i>';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.icon=this.passwordVisible?'<i class="fa-regular fa-eye"></i>':'<i class="fa-regular fa-eye-slash"></i>';
  }
  public handleChange(): void {
    this.valueChange.emit(this.value);
  }

}
