import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  



  passwordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  token!: string;
tokenExpired: boolean = true; 
 constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.checkPasswords
    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.token = params['token'];
    });


  this.userService.tokenValidate(this.token).subscribe({ next: (v) => this.tokenExpired=false,
    error:(e) =>this.tokenExpired=true

  });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  onSubmit(): void {
    const password = this.passwordForm.get('password')?.value;

    this.userService.resetPassword(this.token, password).subscribe(
      response => {
        this.successMessage = response.message;
        this.toastr.success(response.message, 'Success',{
          positionClass: 'toast-bottom-center',
          closeButton: true
        });
        console.log(this.successMessage);
        this.errorMessage = null;
        this.passwordForm.reset();
      },
      error => {
        this.errorMessage = error.error.message;
        this.toastr.error(error.error.message, 'Error'),{
          positionClass: 'toast-bottom-center',
          closeButton: true
        };
        this.successMessage = null;
      }
    );
  }
 
}
