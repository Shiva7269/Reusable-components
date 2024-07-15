import { Component, OnInit } from '@angular/core';
import { User, UserModel } from '../../models/user';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit{
    searchQuery: string = '';
    userDetails: UserModel[] = [];
    filteredUsers: UserModel[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 5; 
    totalItems: number = 0;
    errorMsg:boolean=false
    pageSizeOptions: number[] = [5, 10, 25, 50];

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadUserDetails();
    }

    loadUserDetails(): void {
        this.userService.getUsersDetails().subscribe(users => {
            this.userDetails = users;
            this.applySearchFilter();
        });
    }

    applySearchFilter(): void {
      this.filteredUsers = this.userDetails.filter(user =>
          (user.privilege === 'Viewer') &&
          (user.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
      this.totalItems = this.filteredUsers.length;
      this.errorMsg = this.filteredUsers.length <= 0;
      this.currentPage = 1;
  }
  

    onItemsPerPageChange(): void {
      this.currentPage = 1;
      this.applySearchFilter();
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.applySearchFilter();
}

  toggleStatus(user: UserModel): void {
    this.userService.toggleUserStatus(user._id)
        .subscribe(
            (response: any) => {
                user.status = response.status;
                this.toastr.success(
                    `You changed the status successfully to ${user.status}`,
                    'Success',
                    {
                        positionClass: 'toast-bottom-center',
                        closeButton: true
                    }
                );
            },
            (error) => {
                console.error('Error toggling user status:', error);
                this.toastr.error('Error toggling user status', 'Error', {
                    positionClass: 'toast-bottom-center',
                    closeButton: true
                });
            }
        );
}

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to delete this user?'
  });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.userService.deleteUser(userId).subscribe(
                () => {
                    this.userDetails = this.userDetails.filter(user => user._id !== userId);
                    this.applySearchFilter();
                    this.toastr.success('User deleted successfully', 'Success',{
                      positionClass: 'toast-bottom-center',
                      closeButton: true
                    });
                },
                (error) => {
                    console.error('Error deleting user:', error);
                    this.toastr.error('Error deleting user', 'Error',{
                      positionClass: 'toast-bottom-center',
                      closeButton: true
                    });
                }
            );
        }
    });
}

getDisplayedRange(): string {
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  return `${start}–${end}`;
}
}