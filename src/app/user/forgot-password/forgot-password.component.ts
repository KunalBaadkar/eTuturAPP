import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  showForm: boolean;
  objForgotPassword: Cvduser;

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.ForgotPasswordForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.ForgotPasswordForm);
    });
  }

  constructor(private router: Router, private fb: FormBuilder, private objCvduserService: CvduserService) {
    this.validationMessages = {
      EmailAddress: {
        required: 'This field is required. ',
        minlength: 'This field requires atleast 3 characters. ',
        maxlength: 'cannot exceed more than 50 characters. ',
        email: ' Valid Email Address is required. '
      },
      Code: {
        required: 'This field is required',
        minlength: 'This field requires atleast 6 characters.',
        maxlength: 'cannot exceed more than 6 characters.'
      },
      Password: {
        required: 'This field is required',
        minlength: 'This field requires atleast 6 characters.',
        maxlength: 'cannot exceed more than 25 characters.'
      },
      cnfPassword: {
        required: 'This field is required',
        minlength: 'This field requires atleast 6 characters.',
        maxlength: 'cannot exceed more than 25 characters.'
      },


    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  errorMessage: string;

  ForgotPasswordForm: FormGroup;

  private InitializeForm() {
    this.ForgotPasswordForm = this.fb.group({
      EmailAddress: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.email]],
      Code: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6)]],
      Password: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)]],
      cnfPassword: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)]],

    });
  }


  saveChangePassword(): void {
    if (this.ForgotPasswordForm.controls.Password.value == this.ForgotPasswordForm.controls.cnfPassword.value) {
      if (this.code == this.ForgotPasswordForm.controls.Code.value) {

        if (this.ForgotPasswordForm.valid) {
          if (this.ForgotPasswordForm.dirty) {
            this.objForgotPassword.Password = this.ForgotPasswordForm.controls.Password.value;
            this.updateCvduser(this.objForgotPassword);
          } else {
            //this.onSaveComplete();
          }
        } else {
          this.errorMessage = 'Please correct the validation errors.';
        }
      }
      else {
        alert("Entered code doesnot match.");
      }
    }
    else {
      alert("Password and confirm password must be same.");
    }
  }

  updateCvduser(p: Cvduser): void {
    this.objCvduserService.updateCvduser(p)
      .subscribe({
        next: () => { alert('Password updated successfully.'); this.router.navigate(["/logins"]); },
        error: err => this.errorMessage = err
      });

  }

  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnInit() {
    this.InitializeForm();
    this.getAllCvduser();
  }
  code: string;
  VerifyEmail() {
    const EmailAddress = this.ForgotPasswordForm.controls.EmailAddress.value.toLocaleLowerCase();
    let countEmailAddress = this.CvduserList.filter(r => r.EmailAddress.toLocaleLowerCase() == EmailAddress).length;
    if (countEmailAddress == 1) {
      this.objForgotPassword = this.CvduserList.filter(r => r.EmailAddress.toLocaleLowerCase() == EmailAddress)[0];
      this.showForm = true;
      this.code = this.CreateCode();
      this.sendEmail();
    } else {
      alert("This email Address doesnot exist. Check your email address and try again.");
      this.showForm = false;
    }

  }
  sendEmail(): any {
    console.log('code: ' + this.code);
  }

  CreateCode(): string {
   // var randomize = require('randomatic');
   // return randomize('0', 6);
   return "123456";
  }

  NavigateToLanding() {
    this.router.navigate(['/homes']);
  }

  Cancel() {
    this.router.navigate(['/homes']);
  }

  savePassword(){}
}


