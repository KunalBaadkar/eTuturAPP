import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdlearncheck } from 'src/app/models/cvdlearncheck';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdlearncheckService } from 'src/app/services/cvdlearncheck.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { Cvdquestion } from 'src/app/models/cvdquestion';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
 selector: 'app-cvdlearncheck-edit', 
 templateUrl: './cvdlearncheck-edit.component.html',
 styleUrls: ['./cvdlearncheck-edit.component.css']
})
export class CvdlearncheckEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdlearncheckForm: FormGroup;
 objCvdlearncheck: Cvdlearncheck;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdlearncheckForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdlearncheckForm);
 });
 }

 constructor(private objCvdcourseService: CvdcourseService, private objCvdquestionService: CvdquestionService, private objCvduserService: CvduserService, private route: ActivatedRoute, private router: Router, private objCvdlearncheckService: CvdlearncheckService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 Status: {
 required: 'This field is required'
 },
 Totalques: {
 required: 'This field is required'
 },
 CorrectAns: {
 required: 'This field is required'
 },




  FCvduserId: {
  min: 'This field is required'
  },
 
   FCvdquestionId: {
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
    this.getAllCvdquestion(); 
    this.getAllCvdcourse(); 
  }

// ngoninit 
 

CvdcourseList: Cvdcourse[];
getAllCvdcourse() {
  this.objCvdcourseService.getAllCvdcourse().subscribe({
   next: data => {
      this.CvdcourseList = data;
      if(this.CvdlearncheckForm.controls.FCvdcourseId.value===undefined)
         this.CvdlearncheckForm.controls.FCvdcourseId.setValue(0);
    },
     error: err => this.errorMessage = err
  });
}
   
   CvdquestionList: Cvdquestion[];
   getAllCvdquestion() {
     this.objCvdquestionService.getAllCvdquestion().subscribe({
      next: data => {
         this.CvdquestionList = data;
         if(this.CvdlearncheckForm.controls.FCvdquestionId.value===undefined)
            this.CvdlearncheckForm.controls.FCvdquestionId.setValue(0);
       },
        error: err => this.errorMessage = err
     });
   }
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
     next: data => {
        this.CvduserList = data;
        if(this.CvdlearncheckForm.controls.FCvduserId.value===undefined)
           this.CvdlearncheckForm.controls.FCvduserId.setValue(0);
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
 this.getCvdlearncheck(id);
 }
 );
 }

private InitializeForm() {
 this.CvdlearncheckForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    Status: ['', Validators.required],
    Totalques: ['', Validators.required],
    CorrectAns: ['', Validators.required],

    
    
      
  FCvduserId: [0, Validators.min(1)],
  FCvdquestionId: [0, Validators.min(1)],
  FCvdcourseId: [0, Validators.min(1)],  
});
}

 displayCvdlearncheck(objCvdlearncheck: Cvdlearncheck): void {
 if (this.CvdlearncheckForm) {
 this.CvdlearncheckForm.reset();
 }
 this.objCvdlearncheck = objCvdlearncheck;

 if (this.objCvdlearncheck.id === 0) {
 this.pageTitle = 'Add Learn Check';
 } else {
 this.pageTitle = `Edit Learn Check: ${this.objCvdlearncheck.Name  }`;
 }

 this.CvdlearncheckForm.patchValue({
  Name: this.objCvdlearncheck.Name,
  FCvduserId: this.objCvdlearncheck.FCvduserId,
  FCvdquestionId: this.objCvdlearncheck.FCvdquestionId,
  FCvdcourseId: this.objCvdlearncheck.FCvdcourseId,
  Status: this.objCvdlearncheck.Status,
  Totalques: this.objCvdlearncheck.Totalques,
  CorrectAns: this.objCvdlearncheck.CorrectAns

});
 }

 saveCvdlearncheck(): void {
 if (this.CvdlearncheckForm.valid) {
 if (this.CvdlearncheckForm.dirty) {
 const p = { ...this.objCvdlearncheck, ...this.CvdlearncheckForm.value };

 if (p.id === 0) {
 this.createCvdlearncheck(p);
 } else {
 this.updateCvdlearncheck(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdlearncheck.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdlearncheck(this.objCvdlearncheck.id)
 }
 }
 }

 PerformOperation(data: Cvdlearncheck): void { 
 this.displayCvdlearncheck(data);
 }
 getCvdlearncheck(id: number): void {
 this.objCvdlearncheckService.getCvdlearncheck(id)
 .subscribe({
 next: (data: Cvdlearncheck) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdlearncheck(p: Cvdlearncheck): void
 {
 this.objCvdlearncheckService.createCvdlearncheck(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdlearncheck(p: Cvdlearncheck): void
 {
 this.objCvdlearncheckService.updateCvdlearncheck(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdlearncheck(id: number): void {
 this.objCvdlearncheckService.deleteCvdlearncheck(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdlearncheckForm.reset();
 this.router.navigate(['/Cvdlearnchecks']);
 }
}
