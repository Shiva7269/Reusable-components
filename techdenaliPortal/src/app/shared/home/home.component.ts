import { Component } from '@angular/core';
import { User, UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loginStatus: boolean = false;
  loggedInUser: UserModel | null = null;

  constructor( private authService:AuthService,private router: Router) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedUser();

  }
}
