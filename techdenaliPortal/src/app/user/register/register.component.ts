import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  register!: FormGroup;
  showPassword: boolean = false;
  showPasswordcfm: boolean = false;
  registrationMessage: string | null = null;
  registrationError: string | null = null;
  passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/;

  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router,private toastr: ToastrService,private userSerivce:UserService) { }

  ngOnInit(): void {
    this.register = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern), Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  };

  registerData() {
    const formData = this.register.value;

    this.userSerivce.registerUser(formData)
        .subscribe({
            next: (response) => {
                console.log('Registration successful:', response);
                this.toastr.success(response, 'Success', {
                    positionClass: 'toast-bottom-center',
                    closeButton: true
                });
                this.registrationMessage = response;
                this.registrationError = null;

                this.router.navigate(['login']);
            },
            error: (error) => {
                console.error(error.error, error);
                this.toastr.error(error.error, 'Error', {
                    positionClass: 'toast-bottom-center',
                    closeButton: true
                });
                this.registrationMessage = null;
                this.registrationError = error;
            }
        });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showPasswordcfm = !this.showPasswordcfm;
    }
  } 
}