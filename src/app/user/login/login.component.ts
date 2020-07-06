import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { appconstants } from 'src/app/common/appconstants';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];


  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.LoginForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.LoginForm);
    });
  }

  constructor(private router: Router, private objCvduserService: CvduserService, private fb: FormBuilder) {
    this.validationMessages = {
      UserName: {
        required: 'This field is required',
        minlength: 'This field requires atleast 3 characters.',
        maxlength: 'cannot exceed more than 100 characters.'
      },
      Password: {
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

  errorMessage: any;

  ngOnInit() {
    this.InitializeForm();
    this.getAllCvduser();
  }

  LoginForm: FormGroup;
  pageTitle: string;
  private InitializeForm() {

    this.LoginForm = this.fb.group({
      UserName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      Password: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)]],
    });
  }

  CvduserList: Cvduser[] = [];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        //this.saveLogin();
      },
      error: err => this.errorMessage = err
    });
  }
  retainCvduser: Cvduser[];

  saveLogin() {
    appconstants.gblisUserLoggedin = true;
    let Count=0;
  //  const UserId = "yash@gmail.com";//this.LoginForm.controls.UserName.value;
  //  const Password = "123456";//this.LoginForm.controls.Password.value;
  const UserId = this.LoginForm.controls.UserName.value;
  const Password = this.LoginForm.controls.Password.value;
    this.retainCvduser =   this.CvduserList.filter((data: Cvduser) =>
    (data.EmailAddress == UserId || data.MobileNo == UserId) &&
    data.Password == Password);
    
    console.log('CL: ' + JSON.stringify(this.CvduserList));
    console.log('RC: ' + JSON.stringify(this.retainCvduser));
    Count = this.retainCvduser.length;

    if (Count === 1) {
      appconstants.gblisUserLoggedin = true;
      appconstants.gblobjCvduser = this.retainCvduser[0];
      appconstants.gblLoggedinUserName = this.retainCvduser[0].Name;
      appconstants.gblLoggedinUserId = this.retainCvduser[0].id;
      appconstants.gblLoggedinUserRole = this.retainCvduser[0].FCvdroleId;
      this.router.navigate(['/homes']);
    }
    else {
      alert("UserId or password not match.");
    }
  }

  Cancel() {
    this.router.navigate(['/homes']);
  }

}
