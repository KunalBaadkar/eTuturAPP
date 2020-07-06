import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdquestion } from 'src/app/models/cvdquestion';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
 selector: 'app-cvdquestion-edit', 
 templateUrl: './cvdquestion-edit.component.html',
 styleUrls: ['./cvdquestion-edit.component.css']
})
export class CvdquestionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdquestionForm: FormGroup;
 objCvdquestion: Cvdquestion;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdquestionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdquestionForm);
 });
 }

 constructor(private objCvdcourseService: CvdcourseService, private route: ActivatedRoute, private router: Router, private objCvdquestionService: CvdquestionService, private fb: FormBuilder) {
 this.validationMessages = {

 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
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
        if(this.CvdquestionForm.controls.FCvdcourseId.value===undefined)
           this.CvdquestionForm.controls.FCvdcourseId.setValue(0);
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
 this.getCvdquestion(id);
 }
 );
 }

private InitializeForm() {
 this.CvdquestionForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdcourseId: [0, Validators.min(1)],

   
   

});
}

 displayCvdquestion(objCvdquestion: Cvdquestion): void {
 if (this.CvdquestionForm) {
 this.CvdquestionForm.reset();
 }
 this.objCvdquestion = objCvdquestion;

 if (this.objCvdquestion.id === 0) {
 this.pageTitle = 'Add Question';
 } else {
 this.pageTitle = `Edit Question: ${this.objCvdquestion.Name  }`;
 }

 this.CvdquestionForm.patchValue({
  Name: this.objCvdquestion.Name,
  
  FCvdcourseId: this.objCvdquestion.FCvdcourseId


 });
 }

 saveCvdquestion(): void {
 if (this.CvdquestionForm.valid) {
 if (this.CvdquestionForm.dirty) {
 const p = { ...this.objCvdquestion, ...this.CvdquestionForm.value };

 if (p.id === 0) {
 this.createCvdquestion(p);
 } else {
 this.updateCvdquestion(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdquestion.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdquestion(this.objCvdquestion.id)
 }
 }
 }

 PerformOperation(data: Cvdquestion): void { 
 this.displayCvdquestion(data);
 }
 getCvdquestion(id: number): void {
 this.objCvdquestionService.getCvdquestion(id)
 .subscribe({
 next: (data: Cvdquestion) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdquestion(p: Cvdquestion): void
 {
 this.objCvdquestionService.createCvdquestion(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdquestion(p: Cvdquestion): void
 {
 this.objCvdquestionService.updateCvdquestion(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdquestion(id: number): void {
 this.objCvdquestionService.deleteCvdquestion(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdquestionForm.reset();
 this.router.navigate(['/Cvdquestions']);
 }
}
