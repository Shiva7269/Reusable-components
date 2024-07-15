import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, UserModel } from '../../models/user';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedInUser: UserModel | null = null;
  loginStatus: boolean = false;
  menuItems: any[] = [];
  authLinks:any[]=[];

  constructor( public authService:AuthService,private router: Router,private navigationService:NavigationService) {}

  ngOnInit(): void {
    this.navigationService.getMenuItems().subscribe(data => {
      this.menuItems = data;
    });
    this.navigationService.getAuthLinks().subscribe(data => {
      this.authLinks = data;
    });
    this.loggedInUser = this.authService.getLoggedUser();
    this.authService.isLoggedIn().subscribe(status => {
      this.loginStatus = status;
    });
  }
  logout() {
    this.authService.logout()
    this.loginStatus = false;
    this.loggedInUser = null;
  }
  
}
