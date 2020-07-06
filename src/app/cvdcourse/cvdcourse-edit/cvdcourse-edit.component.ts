import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';
import { Cvdclasse } from 'src/app/models/cvdclasse';

@Component({
 selector: 'app-cvdcourse-edit', 
 templateUrl: './cvdcourse-edit.component.html',
 styleUrls: ['./cvdcourse-edit.component.css']
})
export class CvdcourseEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdcourseForm: FormGroup;
 objCvdcourse: Cvdcourse;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdcourseForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdcourseForm);
 });
 }

 constructor(private objCvdclasseService: CvdclasseService, private route: ActivatedRoute, private router: Router, private objCvdcourseService: CvdcourseService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
  Description: {
  required: 'This field is required'
  },
  DurationHr: {
  required: 'This field is required'
  },
 DurationMin: {
 required: 'This field is required'
 },

 

 FCvdclassId: {
 min: 'This field is required'
 },


 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdclasse();
  }

   
  
  CvdclasseList: Cvdclasse[];
  getAllCvdclasse() {
    this.objCvdclasseService.getAllCvdclasse().subscribe({
     next: data => {
        this.CvdclasseList = data;
        if(this.CvdcourseForm.controls.FCvdclassId.value===undefined)
           this.CvdcourseForm.controls.FCvdclassId.setValue(0);
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
 this.getCvdcourse(id);
 }
 );
 }

private InitializeForm() {
 this.CvdcourseForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    Description: ['', Validators.required],
    DurationHr: ['', Validators.required],
    DurationMin: ['', Validators.required],
    FCvdclassId: [0, Validators.min(1)],    

  });
}

 displayCvdcourse(objCvdcourse: Cvdcourse): void {
 if (this.CvdcourseForm) {
 this.CvdcourseForm.reset();
 }
 this.objCvdcourse = objCvdcourse;

 if (this.objCvdcourse.id === 0) {
 this.pageTitle = 'Add Course';
 } else {
 this.pageTitle = `Edit Course: ${this.objCvdcourse.Name  }`;
 }

 this.CvdcourseForm.patchValue({
  Name: this.objCvdcourse.Name
  ,Description: this.objCvdcourse.Description
  ,DurationHr: this.objCvdcourse.DurationHr
  ,DurationMin: this.objCvdcourse.DurationMin,
  FCvdclassId: this.objCvdcourse.FCvdclassId
 

});
 }

 saveCvdcourse(): void {
 if (this.CvdcourseForm.valid) {
 if (this.CvdcourseForm.dirty) {
 const p = { ...this.objCvdcourse, ...this.CvdcourseForm.value };

 if (p.id === 0) {
 this.createCvdcourse(p);
 } else {
 this.updateCvdcourse(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdcourse.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdcourse(this.objCvdcourse.id)
 }
 }
 }

 PerformOperation(data: Cvdcourse): void { 
 this.displayCvdcourse(data);
 }
 getCvdcourse(id: number): void {
 this.objCvdcourseService.getCvdcourse(id)
 .subscribe({
 next: (data: Cvdcourse) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdcourse(p: Cvdcourse): void
 {
 this.objCvdcourseService.createCvdcourse(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdcourse(p: Cvdcourse): void
 {
 this.objCvdcourseService.updateCvdcourse(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdcourse(id: number): void {
 this.objCvdcourseService.deleteCvdcourse(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdcourseForm.reset();
 this.router.navigate(['/Cvdcourses']);
 }
}
