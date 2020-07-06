import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvddiscussion } from 'src/app/models/cvddiscussion';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvddiscussionService } from 'src/app/services/cvddiscussion.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
 selector: 'app-cvddiscussion-edit', 
 templateUrl: './cvddiscussion-edit.component.html',
 styleUrls: ['./cvddiscussion-edit.component.css']
})
export class CvddiscussionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvddiscussionForm: FormGroup;
 objCvddiscussion: Cvddiscussion;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvddiscussionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvddiscussionForm);
 });
 }

 constructor(private objCvduserService: CvduserService, private objCvdcourseService: CvdcourseService, private route: ActivatedRoute, private router: Router, private objCvddiscussionService: CvddiscussionService, private fb: FormBuilder) {
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
  
   
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
     next: data => {
        this.CvduserList = data;
        if(this.CvddiscussionForm.controls.FCvduserId.value===undefined)
           this.CvddiscussionForm.controls.FCvduserId.setValue(0);
      },
       error: err => this.errorMessage = err
    });
  }
   
  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
     next: data => {
        this.CvdcourseList = data;
        if(this.CvddiscussionForm.controls.FCvdcourseId.value===undefined)
           this.CvddiscussionForm.controls.FCvdcourseId.setValue(0);
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
 this.getCvddiscussion(id);
 }
 );
 }

private InitializeForm() {
 this.CvddiscussionForm = this.fb.group({

  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdcourseId: [0, Validators.min(1)],
    
   FCvduserId: [0, Validators.min(1)],
  
 
    
   
    
   
   
});
}

 displayCvddiscussion(objCvddiscussion: Cvddiscussion): void {
 if (this.CvddiscussionForm) {
 this.CvddiscussionForm.reset();
 }
 this.objCvddiscussion = objCvddiscussion;

 if (this.objCvddiscussion.id === 0) {
 this.pageTitle = 'Add Discussion';
 } else {
 this.pageTitle = `Edit Discussion: ${this.objCvddiscussion.Name  }`;
 }

 this.CvddiscussionForm.patchValue({
  Name: this.objCvddiscussion.Name,
  FCvdcourseId: this.objCvddiscussion.FCvdcourseId,
  
  FCvduserId: this.objCvddiscussion.FCvduserId


 });
 }

 saveCvddiscussion(): void {
 if (this.CvddiscussionForm.valid) {
 if (this.CvddiscussionForm.dirty) {
 const p = { ...this.objCvddiscussion, ...this.CvddiscussionForm.value };

 if (p.id === 0) {
 this.createCvddiscussion(p);
 } else {
 this.updateCvddiscussion(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvddiscussion.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvddiscussion(this.objCvddiscussion.id)
 }
 }
 }

 PerformOperation(data: Cvddiscussion): void { 
 this.displayCvddiscussion(data);
 }
 getCvddiscussion(id: number): void {
 this.objCvddiscussionService.getCvddiscussion(id)
 .subscribe({
 next: (data: Cvddiscussion) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvddiscussion(p: Cvddiscussion): void
 {
 this.objCvddiscussionService.createCvddiscussion(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvddiscussion(p: Cvddiscussion): void
 {
 this.objCvddiscussionService.updateCvddiscussion(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvddiscussion(id: number): void {
 this.objCvddiscussionService.deleteCvddiscussion(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvddiscussionForm.reset();
 this.router.navigate(['/Cvddiscussions']);
 }
}
