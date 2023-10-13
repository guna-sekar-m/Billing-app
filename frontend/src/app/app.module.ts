import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//pipes
import { DatePipe } from '@angular/common'
//primng
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

//core components
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { FooterComponent } from './core/footer/footer.component';
import { MainComponent } from './core/main/main.component';
//module components
import { LoginComponent } from './module/login/login.component';
import { RegisterComponent } from './module/register/register.component';
import { ForgotPasswordComponent } from './module/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TableModule,
    ToastModule,
    MessagesModule
  ],
  providers: [DatePipe,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
