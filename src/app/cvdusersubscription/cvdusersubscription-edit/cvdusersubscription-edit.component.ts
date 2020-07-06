import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdusersubscription } from 'src/app/models/cvdusersubscription';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdusersubscriptionService } from 'src/app/services/cvdusersubscription.service';
import { appconstants } from 'src/app/common/appconstants';
import { Cvduser } from 'src/app/models/cvduser';
import { CvduserService } from 'src/app/services/cvduser.service';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { Cvdsubscription } from 'src/app/models/cvdsubscription';

@Component({
 selector: 'app-cvdusersubscription-edit', 
 templateUrl: './cvdusersubscription-edit.component.html',
 styleUrls: ['./cvdusersubscription-edit.component.css']
})
export class CvdusersubscriptionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdusersubscriptionForm: FormGroup;
 objCvdusersubscription: Cvdusersubscription;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdusersubscriptionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdusersubscriptionForm);
 });
 }

 constructor(private objCvdsubscriptionService: CvdsubscriptionService, private objCvdcourseService: CvdcourseService, private objCvduserService: CvduserService, private route: ActivatedRoute, private router: Router, private objCvdusersubscriptionService: CvdusersubscriptionService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 FCvduserId: {
 min: 'This field is required'
 },
 FCvdcourseId: {
 min: 'This field is required'
 },
 FCvdsubscriptionId: {
 min: 'This field is required'
 },


 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvduser(); 
    this.getAllCvdcourse(); 
    this.getAllCvdsubscription(); 
  }

// ngoninit 
 

CvdsubscriptionList: Cvdsubscription[];
getAllCvdsubscription() {
  this.objCvdsubscriptionService.getAllCvdsubscription().subscribe({
   next: data => {
      this.CvdsubscriptionList = data;
      if(this.CvdusersubscriptionForm.controls.FCvdsubscriptionId.value===undefined)
         this.CvdusersubscriptionForm.controls.FCvdsubscriptionId.setValue(0);
    },
     error: err => this.errorMessage = err
  });
}
 

CvdcourseList: Cvdcourse[];
getAllCvdcourse() {
  this.objCvdcourseService.getAllCvdcourse().subscribe({
   next: data => {
      this.CvdcourseList = data;
      if(this.CvdusersubscriptionForm.controls.FCvdcourseId.value===undefined)
         this.CvdusersubscriptionForm.controls.FCvdcourseId.setValue(0);
    },
     error: err => this.errorMessage = err
  });
} 

CvduserList: Cvduser[];
getAllCvduser() {
  this.objCvduserService.getAllCvduser().subscribe({
   next: data => {
      this.CvduserList = data;
      if(this.CvdusersubscriptionForm.controls.FCvduserId.value===undefined)
         this.CvdusersubscriptionForm.controls.FCvduserId.setValue(0);
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
 this.getCvdusersubscription(id);
 }
 );
 }

private InitializeForm() {
 this.CvdusersubscriptionForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvduserId: [0, Validators.min(1)],
    FCvdcourseId: [0, Validators.min(1)],
    FCvdsubscriptionId: [0, Validators.min(1)],

    
    
   
   

});
}

 displayCvdusersubscription(objCvdusersubscription: Cvdusersubscription): void {
 if (this.CvdusersubscriptionForm) {
 this.CvdusersubscriptionForm.reset();
 }
 this.objCvdusersubscription = objCvdusersubscription;

 if (this.objCvdusersubscription.id === 0) {
 this.pageTitle = 'Add User Subscription';
 } else {
 this.pageTitle = `Edit User Subscription: ${this.objCvdusersubscription.Name  }`;
 }

 this.CvdusersubscriptionForm.patchValue({
  Name: this.objCvdusersubscription.Name,
  FCvduserId: this.objCvdusersubscription.FCvduserId,
  FCvdcourseId: this.objCvdusersubscription.FCvdcourseId,
  FCvdsubscriptionId: this.objCvdusersubscription.FCvdsubscriptionId


 });
 }

 saveCvdusersubscription(): void {
 if (this.CvdusersubscriptionForm.valid) {
 if (this.CvdusersubscriptionForm.dirty) {
 const p = { ...this.objCvdusersubscription, ...this.CvdusersubscriptionForm.value };

 if (p.id === 0) {
 this.createCvdusersubscription(p);
 } else {
 this.updateCvdusersubscription(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdusersubscription.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdusersubscription(this.objCvdusersubscription.id)
 }
 }
 }

 PerformOperation(data: Cvdusersubscription): void { 
 this.displayCvdusersubscription(data);
 }
 getCvdusersubscription(id: number): void {
 this.objCvdusersubscriptionService.getCvdusersubscription(id)
 .subscribe({
 next: (data: Cvdusersubscription) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdusersubscription(p: Cvdusersubscription): void
 {
 this.objCvdusersubscriptionService.createCvdusersubscription(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdusersubscription(p: Cvdusersubscription): void
 {
 this.objCvdusersubscriptionService.updateCvdusersubscription(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdusersubscription(id: number): void {
 this.objCvdusersubscriptionService.deleteCvdusersubscription(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdusersubscriptionForm.reset();
 this.router.navigate(['/Cvdusersubscriptions']);
 }
}
