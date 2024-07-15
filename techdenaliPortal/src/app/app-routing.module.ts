import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';
import { AccountComponent } from './dashboard/account/account.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { CreateUsersComponent } from './dashboard/create-users/create-users.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { MyAccountComponent } from './dashboard/my-account/my-account.component';
import { TechpageComponent } from './shared/techpage/techpage.component';
import { HomeComponent } from './shared/home/home.component';
import { RequestPasswordResetComponent } from './user/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ContactUsComponent } from './shared/contact-us/contact-us.component';



const routes: Routes = [
  {
    path:'registration',component:RegisterComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'contact-us',component:ContactUsComponent
  },
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumbs: ['Home']
    }
  },
  {
    path:'request-password-reset',component:RequestPasswordResetComponent,data:{
      breadcrumbs: ['Home','request-password-reset']
    }
  },
  {
    path: 'reset-password/:token', component: ResetPasswordComponent ,
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'myAccount',
        pathMatch: 'full'
      },
      {
        path: 'myAccount',
        component: MyAccountComponent,
        data: {
          breadcrumbs: ['Home','Account']
        }
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        data: {
          breadcrumbs: ['Home','Account', 'Manage Users']
        }
      },
      {
        path: 'create-user',
        component: CreateUsersComponent,
        data: {
          breadcrumbs: ['Home','Account', 'Create User']
        }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          breadcrumbs: ['Home','Account', 'Change Password']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
