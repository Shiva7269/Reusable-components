import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { BreadCrumbModule } from './bread-crumb/bread-crumb.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { authInterceptor } from './auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    SharedModule,
    HttpClientModule,
    CommonModule ,
    DashboardModule,
    BreadCrumbModule,
    ToastrModule,BrowserAnimationsModule,
    ToastrModule.forRoot()  
  ],
  providers: [
    provideClientHydration(),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useValue: authInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
