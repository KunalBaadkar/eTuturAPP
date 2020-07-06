import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdcoursestatu } from 'src/app/models/cvdcoursestatu';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdcoursestatuService } from 'src/app/services/cvdcoursestatu.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { Cvdstatu } from 'src/app/models/cvdstatu';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';

@Component({
 selector: 'app-cvdcoursestatu-edit', 
 templateUrl: './cvdcoursestatu-edit.component.html',
 styleUrls: ['./cvdcoursestatu-edit.component.css']
})
export class CvdcoursestatuEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdcoursestatuForm: FormGroup;
 objCvdcoursestatu: Cvdcoursestatu;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdcoursestatuForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdcoursestatuForm);
 });
 }

 constructor(private objCvdcourseService: CvdcourseService, private objCvdstatuService: CvdstatuService, private objCvduserService: CvduserService, private route: ActivatedRoute, private router: Router, private objCvdcoursestatuService: CvdcoursestatuService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 FCvduserId: {
 min: 'This field is required'
 },
 FCvdstatusId: {
 min: 'This field is required'
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
    this.getAllCvduser(); 
    this.getAllCvdstatu(); 
    this.getAllCvdcourse(); 
  }

  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
     next: data => {
        this.CvdcourseList = data;
        if(this.CvdcoursestatuForm.controls.FCvdcourseId.value===undefined)
           this.CvdcoursestatuForm.controls.FCvdcourseId.setValue(0);
      },
       error: err => this.errorMessage = err
    });
  }


CvdstatuList: Cvdstatu[];
getAllCvdstatu() {
  this.objCvdstatuService.getAllCvdstatu().subscribe({
   next: data => {
      this.CvdstatuList = data;
      if(this.CvdcoursestatuForm.controls.FCvdstatusId.value===undefined)
         this.CvdcoursestatuForm.controls.FCvdstatusId.setValue(0);
    },
     error: err => this.errorMessage = err
  });
}
   
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
     next: data => {
        this.CvduserList = data;
        if(this.CvdcoursestatuForm.controls.FCvduserId.value===undefined)
           this.CvdcoursestatuForm.controls.FCvduserId.setValue(0);
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
 this.getCvdcoursestatu(id);
 }
 );
 }

private InitializeForm() {
 this.CvdcoursestatuForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvduserId: [0, Validators.min(1)],
    FCvdstatusId: [0, Validators.min(1)],
    FCvdcourseId: [0, Validators.min(1)],

    
    

   

});
}

 displayCvdcoursestatu(objCvdcoursestatu: Cvdcoursestatu): void {
 if (this.CvdcoursestatuForm) {
 this.CvdcoursestatuForm.reset();
 }
 this.objCvdcoursestatu = objCvdcoursestatu;

 if (this.objCvdcoursestatu.id === 0) {
 this.pageTitle = 'Add Course Status';
 } else {
 this.pageTitle = `Edit Course Status: ${this.objCvdcoursestatu.Name  }`;
 }

 this.CvdcoursestatuForm.patchValue({
  Name: this.objCvdcoursestatu.Name,
  FCvduserId: this.objCvdcoursestatu.FCvduserId,
  FCvdstatusId: this.objCvdcoursestatu.FCvdstatusId,
  FCvdcourseId: this.objCvdcoursestatu.FCvdcourseId





 });
 }

 saveCvdcoursestatu(): void {
 if (this.CvdcoursestatuForm.valid) {
 if (this.CvdcoursestatuForm.dirty) {
 const p = { ...this.objCvdcoursestatu, ...this.CvdcoursestatuForm.value };

 if (p.id === 0) {
 this.createCvdcoursestatu(p);
 } else {
 this.updateCvdcoursestatu(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdcoursestatu.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdcoursestatu(this.objCvdcoursestatu.id)
 }
 }
 }

 PerformOperation(data: Cvdcoursestatu): void { 
 this.displayCvdcoursestatu(data);
 }
 getCvdcoursestatu(id: number): void {
 this.objCvdcoursestatuService.getCvdcoursestatu(id)
 .subscribe({
 next: (data: Cvdcoursestatu) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdcoursestatu(p: Cvdcoursestatu): void
 {
 this.objCvdcoursestatuService.createCvdcoursestatu(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdcoursestatu(p: Cvdcoursestatu): void
 {
 this.objCvdcoursestatuService.updateCvdcoursestatu(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdcoursestatu(id: number): void {
 this.objCvdcoursestatuService.deleteCvdcoursestatu(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdcoursestatuForm.reset();
 this.router.navigate(['/Cvdcoursestatus']);
 }
}
