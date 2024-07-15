import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { AccountComponent } from './account/account.component';
import { BrowserModule } from '@angular/platform-browser';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { RouterModule } from '@angular/router';
import { CreateUsersComponent } from './create-users/create-users.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { BreadCrumbModule } from '../bread-crumb/bread-crumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    HomeDashboardComponent,
     AccountComponent,
     ManageUsersComponent,
     CreateUsersComponent,
     ChangePasswordComponent,
     MyAccountComponent,
     ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    BreadCrumbModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
   NgxPaginationModule
  ],
  exports:[
    HomeDashboardComponent,
    AccountComponent,
    BrowserModule,
    RouterModule,
    ConfirmationDialogComponent
  ]
})
export class DashboardModule { }
