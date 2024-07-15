import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
// Make sure to import your UserModel

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
  passwordForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loggedInUserId!: number;
  loggedInUser: UserModel | null = null;

  constructor(private formBuilder: FormBuilder,private toastr: ToastrService, private userService: UserService,private authService:AuthService) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/)]],
      confirmPassword: ['', Validators.required]
    });

    this.userService.getUsersDetails().subscribe(
      (users: UserModel[]) => {
        
      },
      error => {
        console.error('Error fetching logged-in user details:', error);
      }
    );
  }
  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedUser();

    if (this.loggedInUser) {
      console.log('Logged-in user:', this.loggedInUser);
    } 
  this.loggedInUserId=this.loggedInUser?.userId;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.controls['newPassword'].errors?.['pattern']) {
        this.errorMessage = 'Password must contain at least 8 characters including one letter, one number, and one special character.';
      } else {
        this.toastr.error('Please fill out all required fields.', 'Error',{
          positionClass: 'toast-bottom-center',
          closeButton: true
        });
      }
      this.clearMessagesAfterDelay();
      return;
    }

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
  
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirm password must match.', 'Error', {
        positionClass: 'toast-bottom-center',
        closeButton: true 
      });
      this.clearMessagesAfterDelay();
      return;
    }
  
    this.userService.changePassword(
      this.loggedInUserId,
      currentPassword,
      newPassword
    ).subscribe(
      () => {
        this.toastr.success('Password updated successfully', 'Updated Success', {
          positionClass: 'toast-bottom-center',
          closeButton: true
        }); 
        this.clearMessagesAfterDelay();
        this.passwordForm.reset();
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error',{
          positionClass: 'toast-bottom-center',
          closeButton: true 
        });
        this.clearMessagesAfterDelay();
      }
    );
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  showError(controlName: string): void {
    if (!this.passwordForm.controls[controlName].valid) {
      this.passwordForm.controls[controlName].markAsTouched();
    }
  }
}
