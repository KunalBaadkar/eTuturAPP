import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdfeedback } from 'src/app/models/cvdfeedback';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdfeedbackService } from 'src/app/services/cvdfeedback.service';
import { appconstants } from 'src/app/common/appconstants';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
 selector: 'app-cvdfeedback-edit', 
 templateUrl: './cvdfeedback-edit.component.html',
 styleUrls: ['./cvdfeedback-edit.component.css']
})
export class CvdfeedbackEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdfeedbackForm: FormGroup;
 objCvdfeedback: Cvdfeedback;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdfeedbackForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdfeedbackForm);
 });
 }

 constructor( private objCvduserService: CvduserService, private objCvdcourseService: CvdcourseService, private route: ActivatedRoute, private router: Router, private objCvdfeedbackService: CvdfeedbackService, private fb: FormBuilder) {
 this.validationMessages = {
   Name: {
   required: 'This field is required',
   minlength: 'This field requires atleast 3 characters.',
   maxlength: 'cannot exceed more than 50 characters.'
   },
  
    FCvdcourseId: {
    min: 'This field is required'
    },
     FCvduserId: {
     min: 'This field is required'
     },
    
    
   
   
  
 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdcourse(); 
    this.getAllCvduser(); 
  }

  // ngoninit 
  
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
     next: data => {
        this.CvduserList = data;
        if(this.CvdfeedbackForm.controls.FCvduserId.value===undefined)
           this.CvdfeedbackForm.controls.FCvduserId.setValue(0);
      },
       error: err => this.errorMessage = err
    });
  }
   
  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
     next: data => {
        this.CvdcourseList = data;
        if(this.CvdfeedbackForm.controls.FCvdcourseId.value===undefined)
           this.CvdfeedbackForm.controls.FCvdcourseId.setValue(0);
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
 this.getCvdfeedback(id);
 }
 );
 }

private InitializeForm() {
 this.CvdfeedbackForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdcourseId: [0, Validators.min(1)],
    FCvduserId: [0, Validators.min(1)],
    
 

});
}

 displayCvdfeedback(objCvdfeedback: Cvdfeedback): void {
 if (this.CvdfeedbackForm) {
 this.CvdfeedbackForm.reset();
 }
 this.objCvdfeedback = objCvdfeedback;

 if (this.objCvdfeedback.id === 0) {
 this.pageTitle = 'Add Feedback';
 } else {
 this.pageTitle = `Edit Feedback: ${this.objCvdfeedback.Name  }`;
 }

 this.CvdfeedbackForm.patchValue({
  Name: this.objCvdfeedback.Name,
  FCvdcourseId: this.objCvdfeedback.FCvdcourseId,
  FCvduserId: this.objCvdfeedback.FCvduserId

 });
 }

 saveCvdfeedback(): void {
 if (this.CvdfeedbackForm.valid) {
 if (this.CvdfeedbackForm.dirty) {
 const p = { ...this.objCvdfeedback, ...this.CvdfeedbackForm.value };

 if (p.id === 0) {
 this.createCvdfeedback(p);
 } else {
 this.updateCvdfeedback(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdfeedback.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdfeedback(this.objCvdfeedback.id)
 }
 }
 }

 PerformOperation(data: Cvdfeedback): void { 
 this.displayCvdfeedback(data);
 }
 getCvdfeedback(id: number): void {
 this.objCvdfeedbackService.getCvdfeedback(id)
 .subscribe({
 next: (data: Cvdfeedback) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdfeedback(p: Cvdfeedback): void
 {
 this.objCvdfeedbackService.createCvdfeedback(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdfeedback(p: Cvdfeedback): void
 {
 this.objCvdfeedbackService.updateCvdfeedback(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdfeedback(id: number): void {
 this.objCvdfeedbackService.deleteCvdfeedback(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdfeedbackForm.reset();
 this.router.navigate(['/Cvdfeedbacks']);
 }
}
