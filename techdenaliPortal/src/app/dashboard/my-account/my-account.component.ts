import { Component } from '@angular/core';
import { User, UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  loginStatus: boolean = false;
  loggedInUser: UserModel | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedUser();

    if (this.loggedInUser) {
      console.log('Logged-in user:', this.loggedInUser);
    }
  }


  logout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully', 'Success', {
      positionClass: 'toast-bottom-center',
      closeButton: true
    });
    this.router.navigate(['/login'])
    
  }
}