import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvduser } from 'src/app/models/cvduser';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvduserService } from 'src/app/services/cvduser.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';

@Component({
 selector: 'app-cvduser-edit', 
 templateUrl: './cvduser-edit.component.html',
 styleUrls: ['./cvduser-edit.component.css']
})
export class CvduserEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvduserForm: FormGroup;
 objCvduser: Cvduser;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvduserForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvduserForm);
 });
 }

 constructor(private objCvdroleService: CvdroleService, private route: ActivatedRoute, private router: Router, private objCvduserService: CvduserService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 EmailAddress: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 MobileNo: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 12 characters.'
 },
 Password: {
 required: 'This field is required',
 minlength: 'This field requires atleast 6 characters.',
 maxlength: 'cannot exceed more than 20 characters.'
 },
 FCvdroleId: {
 min: 'This field is required'
 },


 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdrole(); 
  }

// ngoninit 
 

CvdroleList: Cvdrole[];
getAllCvdrole() {
  this.objCvdroleService.getAllCvdrole().subscribe({
   next: data => {
      this.CvdroleList = data;
      if(this.CvduserForm.controls.FCvdroleId.value===undefined)
         this.CvduserForm.controls.FCvdroleId.setValue(0);
    },
     error: err => this.errorMessage = err
  });
}


 ngOnDestroy(): void {
 this.sub.unsubscribe();
 }

 GetQueryStringParams() {
 this.sub = this.route.paramMap.subscribe(
 params => {
 const id = +params.get('id');
 this.getCvduser(id);
 }
 );
 }

private InitializeForm() {
 this.CvduserForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    EmailAddress: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      MobileNo: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12)]],
        Password: ['', [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)]],
          FCvdroleId: [0, Validators.min(1)],

                   
                
            
        
   

});
}

 displayCvduser(objCvduser: Cvduser): void {
 if (this.CvduserForm) {
 this.CvduserForm.reset();
 }
 this.objCvduser = objCvduser;

 if (this.objCvduser.id === 0) {
 this.pageTitle = 'Add User';
 } else {
 this.pageTitle = `Edit User: ${this.objCvduser.Name  }`;
 }

 this.CvduserForm.patchValue({
  Name: this.objCvduser.Name,
  EmailAddress: this.objCvduser.EmailAddress,
  MobileNo: this.objCvduser.MobileNo,
  Password: this.objCvduser.Password,
  FCvdroleId: this.objCvduser.FCvdroleId



 });
 }

 saveCvduser(): void {
 if (this.CvduserForm.valid) {
 if (this.CvduserForm.dirty) {
 const p = { ...this.objCvduser, ...this.CvduserForm.value };

 if (p.id === 0) {
 this.createCvduser(p);
 } else {
 this.updateCvduser(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvduser.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvduser(this.objCvduser.id)
 }
 }
 }

 PerformOperation(data: Cvduser): void { 
 this.displayCvduser(data);
 }
 getCvduser(id: number): void {
 this.objCvduserService.getCvduser(id)
 .subscribe({
 next: (data: Cvduser) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvduser(p: Cvduser): void
 {
 this.objCvduserService.createCvduser(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvduser(p: Cvduser): void
 {
 this.objCvduserService.updateCvduser(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvduser(id: number): void {
 this.objCvduserService.deleteCvduser(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvduserForm.reset();
 this.router.navigate(['/Cvdusers']);
 }
}
