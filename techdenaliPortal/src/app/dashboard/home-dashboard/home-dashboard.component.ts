import { Component, OnInit } from '@angular/core';
import { User, UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.scss'
})
export class HomeDashboardComponent implements OnInit{
  loginStatus: boolean = false;
  loggedInUser: UserModel | null = null;
  userDetails: User[] = [];

  constructor(public authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedUser();
    console.log(this.loggedInUser?.privilege)
  }
 
}
