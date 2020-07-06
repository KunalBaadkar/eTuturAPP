import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdtableofcontent } from 'src/app/models/cvdtableofcontent';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdtableofcontentService } from 'src/app/services/cvdtableofcontent.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
 selector: 'app-cvdtableofcontent-edit', 
 templateUrl: './cvdtableofcontent-edit.component.html',
 styleUrls: ['./cvdtableofcontent-edit.component.css']
})
export class CvdtableofcontentEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdtableofcontentForm: FormGroup;
 objCvdtableofcontent: Cvdtableofcontent;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdtableofcontentForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdtableofcontentForm);
 });
 }

 constructor(private objCvdcourseService: CvdcourseService, private route: ActivatedRoute, private router: Router, private objCvdtableofcontentService: CvdtableofcontentService, private fb: FormBuilder) {
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
 Filepath: {
 required: 'This field is required'
 },


 FCvdcourseId: {
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
  }
// ngoninit 
 

CvdcourseList: Cvdcourse[];
getAllCvdcourse() {
  this.objCvdcourseService.getAllCvdcourse().subscribe({
   next: data => {
      this.CvdcourseList = data;
      if(this.CvdtableofcontentForm.controls.FCvdcourseId.value===undefined)
         this.CvdtableofcontentForm.controls.FCvdcourseId.setValue(0);
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
 this.getCvdtableofcontent(id);
 }
 );
 }

private InitializeForm() {
 this.CvdtableofcontentForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    
    Description: ['', Validators.required],
    DurationHr: ['', Validators.required],
    DurationMin: ['', Validators.required],
    Filepath: ['', Validators.required],
    FCvdcourseId: [0, Validators.min(1)],
       

});
}

 displayCvdtableofcontent(objCvdtableofcontent: Cvdtableofcontent): void {
 if (this.CvdtableofcontentForm) {
 this.CvdtableofcontentForm.reset();
 }
 this.objCvdtableofcontent = objCvdtableofcontent;

 if (this.objCvdtableofcontent.id === 0) {
 this.pageTitle = 'Add Table of Content';
 } else {
 this.pageTitle = `Edit Table of Content: ${this.objCvdtableofcontent.Name  }`;
 }

 this.CvdtableofcontentForm.patchValue({
  Name: this.objCvdtableofcontent.Name
  ,Description: this.objCvdtableofcontent.Description
  ,DurationHr: this.objCvdtableofcontent.DurationHr
  ,DurationMin: this.objCvdtableofcontent.DurationMin
  ,FCvdcourseId: this.objCvdtableofcontent.FCvdcourseId


  ,Filepath: this.objCvdtableofcontent.Filepath

 });
 }

 saveCvdtableofcontent(): void {
 if (this.CvdtableofcontentForm.valid) {
 if (this.CvdtableofcontentForm.dirty) {
 const p = { ...this.objCvdtableofcontent, ...this.CvdtableofcontentForm.value };

 if (p.id === 0) {
 this.createCvdtableofcontent(p);
 } else {
 this.updateCvdtableofcontent(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdtableofcontent.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdtableofcontent(this.objCvdtableofcontent.id)
 }
 }
 }

 PerformOperation(data: Cvdtableofcontent): void { 
 this.displayCvdtableofcontent(data);
 }
 getCvdtableofcontent(id: number): void {
 this.objCvdtableofcontentService.getCvdtableofcontent(id)
 .subscribe({
 next: (data: Cvdtableofcontent) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdtableofcontent(p: Cvdtableofcontent): void
 {
 this.objCvdtableofcontentService.createCvdtableofcontent(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdtableofcontent(p: Cvdtableofcontent): void
 {
 this.objCvdtableofcontentService.updateCvdtableofcontent(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdtableofcontent(id: number): void {
 this.objCvdtableofcontentService.deleteCvdtableofcontent(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdtableofcontentForm.reset();
 this.router.navigate(['/Cvdtableofcontents']);
 }
}
