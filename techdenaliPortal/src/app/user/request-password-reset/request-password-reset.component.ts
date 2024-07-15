import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrl: './request-password-reset.component.scss'
})
export class RequestPasswordResetComponent {


resetPassword!: FormGroup;
message: string | null = null;
error: string | null = null;
constructor(
  private fb: FormBuilder,
  private passwordResetService: UserService,
  private toastr: ToastrService
) { }

ngOnInit(): void {
  this.resetPassword = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}

forgetPassword(): void {
  const email = this.resetPassword.get('email')?.value;

  this.passwordResetService.requestPasswordReset(email).subscribe(
    response => {
      this.toastr.success(response.message, 'Success',{
        positionClass: 'toast-bottom-center',
        closeButton: true
      });
      this.message = response.message;
      this.resetPassword.reset();
    },
    error => {
      this.toastr.error(error.error, 'Error',{
         positionClass: 'toast-bottom-center',
        closeButton: true
      });
      this.error = error.error.message;
    }
  );
}
}