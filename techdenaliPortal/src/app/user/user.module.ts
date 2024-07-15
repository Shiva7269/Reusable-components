import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BreadCrumbModule } from '../bread-crumb/bread-crumb.module';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    RequestPasswordResetComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,  
    BreadCrumbModule
  ],
  exports:[
    RegisterComponent,
    LoginComponent
  ]
})
export class UserModule { }
