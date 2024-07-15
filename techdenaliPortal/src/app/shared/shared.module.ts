import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TechpageComponent } from './techpage/techpage.component';
import { HomeComponent } from './home/home.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FormsModule } from '@angular/forms';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    TechpageComponent,
    HomeComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    DashboardModule,
    FormsModule,
    RichTextEditorModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    TechpageComponent,
    HomeComponent
  ],
  providers:[ToolbarService, LinkService,ImageService, HtmlEditorService]

})
export class SharedModule { }
