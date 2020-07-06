import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.CvduserForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800)).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.CvduserForm);
      });
  }

  constructor( private objCvduserService: CvduserService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder) {
    this.validationMessages = {
      Name: {
        required: 'This field is required',
        minlength: 'This field requires atleast 3 characters.',
        maxlength: 'cannot exceed more than 50 characters.'
      },
      EmailAddress: {
        required: 'This field is required',
        email: 'Email Address is invalid.',
        minlength: 'This field requires atleast 3 characters.',
        maxlength: 'cannot exceed more than 50 characters.'
      },
      Password: {
        required: 'This field is required',
        minlength: 'This field requires atleast 6 characters.',
        maxlength: 'cannot exceed more than 25 characters.'
      },
      MobileNo: {
        required: 'This field is required',
        minlength: 'This field requires atleast 1 characters.',
        maxlength: 'cannot exceed more than 50 characters.'
      },        
      userrole: {
        required: 'This field is required'
      } 
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  CvduserForm: FormGroup;
  objCvduser: Cvduser;
  pageTitle: string;
  errorMessage: any;
  
  ngOnInit() {
    this.InitializeForm();
 
  }
  private InitializeForm() {
    this.CvduserForm = this.fb.group({
      Name: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      EmailAddress: ['', [Validators.required,
      Validators.email,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      Password: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)]],
      userrole: ['', Validators.required]
    });
  }

  saveCvduser(): void {
    if (this.CvduserForm.valid) {
      if (this.CvduserForm.dirty) {
        const p = { ...this.objCvduser, ...this.CvduserForm.value };
console.log('role: ' + this.CvduserForm.controls.userrole.value);
if(this.CvduserForm.controls.userrole.value=="teacher")
        p.FCvdroleId = 3;
        else
        p.FCvdroleId = 4;
        this.createCvduser(p);
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  createCvduser(p: Cvduser): void {
    this.objCvduserService.createCvduser(p)
      .subscribe({
        next: () => this.onSaveComplete(),
        error: err => this.errorMessage = err
      });
  }

  onSaveComplete(): void {
    this.CvduserForm.reset();
    this.router.navigate(['/homes']);
  }

  NavigateToLanding() {
    this.saveCvduser();
    this.router.navigate(['/homes']);
  }

  Cancel() {
    this.router.navigate(['/homes']);
  }
}

