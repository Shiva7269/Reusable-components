import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactUsService } from '../../services/contact-us.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  storefrontContent: string = '';
  constructor(private contactus:ContactUsService,  private toastr: ToastrService ){}
  ngOnInit(): void {
  }
  formData = {
    name: '',
    email: '',
    message: '',
    phone:''
  };

  submitForm() {

    
    console.log(this.storefrontContent);

    this.contactus.saveContacts( this.formData).subscribe(
      response => {
        console.log('Form data saved successfully', response);
        this.toastr.success(response.msg, 'Success', {
          positionClass: 'toast-bottom-center',
          closeButton: true
        });
       
        this.resetForm();
        
      },
      
      error => {
        this.toastr.error(error.error.msg, 'error',{
          positionClass: 'toast-bottom-center',
          closeButton: true
        })
      }
    );
  }
  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
  }