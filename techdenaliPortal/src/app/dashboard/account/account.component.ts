import { Component, OnInit } from '@angular/core';
import { User, UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{
  loginStatus: boolean = false;
  loggedInUser: UserModel | null = null;

  constructor(public authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedUser();
  }
}