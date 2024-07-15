import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
const localStorageAvailable = typeof localStorage !== 'undefined';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent {
  showPassword: boolean = false;
  public login!: FormGroup;
  errorMessage!: string;
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private userService: UserService,
    private auth: AuthService, 
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {  this.loginForm = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });}

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    if (localStorageAvailable) {
      const storedUser = localStorage.getItem('authToken');
      if (storedUser) {
        
        this.auth.loadUserFromToken();
        this.router.navigate(['']);
      }
    }
  
  }

  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
        return;
    }

    const loginData = this.loginForm.value;

    this.userService.loginUser(loginData)
        .subscribe({
            next: (response) => {
                localStorage.setItem('authToken', response.token);
                this.auth.loadUserFromToken();
                this.login.reset();

                this.router.navigate(['']);

                this.toastr.success('Login successful!', 'Success',{
                  positionClass: 'toast-bottom-center',
                  closeButton: true
                });
            },
            error: (error) => {
                console.error(error.error, error);
                this.toastr.error(error.error, 'Error',{
                  positionClass: 'toast-bottom-center',
                  closeButton: true
                });
            }
        });
}


}