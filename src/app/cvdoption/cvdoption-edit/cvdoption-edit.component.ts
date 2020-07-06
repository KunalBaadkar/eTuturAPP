
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdoption } from 'src/app/models/cvdoption';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdoptionService } from 'src/app/services/cvdoption.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { Cvdquestion } from 'src/app/models/cvdquestion';

@Component({
 selector: 'app-cvdoption-edit', 
 templateUrl: './cvdoption-edit.component.html',
 styleUrls: ['./cvdoption-edit.component.css']
})

export class CvdoptionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdoptionForm: FormGroup;
 objCvdoption: Cvdoption;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdoptionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdoptionForm);
 });
 }

 constructor(private objCvdquestionService: CvdquestionService, private route: ActivatedRoute, private router: Router, private objCvdoptionService: CvdoptionService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 Answer: {
 required: 'This field is required'
 },


 FCvdquestionId: {
 min: 'This field is required'
 },


 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdquestion(); 
  }
  // ngoninit 
   
  
  CvdquestionList: Cvdquestion[];
  getAllCvdquestion() {
    this.objCvdquestionService.getAllCvdquestion().subscribe({
     next: data => {
        this.CvdquestionList = data;
        if(this.CvdoptionForm.controls.FCvdquestionId.value===undefined)
           this.CvdoptionForm.controls.FCvdquestionId.setValue(0);
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
 this.getCvdoption(id);
 }
 );
 }

private InitializeForm() {
 this.CvdoptionForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    Answer: ['', Validators.required],
    FCvdquestionId: [0, Validators.min(1)],
   

    
   
   

});
}

 displayCvdoption(objCvdoption: Cvdoption): void {
 if (this.CvdoptionForm) {
 this.CvdoptionForm.reset();
 }
 this.objCvdoption = objCvdoption;

 if (this.objCvdoption.id === 0) {
 this.pageTitle = 'Add Option';
 } else {
 this.pageTitle = `Edit Option: ${this.objCvdoption.Name  }`;
 }

 this.CvdoptionForm.patchValue({
  Name: this.objCvdoption.Name,
  Answer: this.objCvdoption.Answer,
  FCvdquestionId: this.objCvdoption.FCvdquestionId


 });
 }

 saveCvdoption(): void {
 if (this.CvdoptionForm.valid) {
 if (this.CvdoptionForm.dirty) {
 const p = { ...this.objCvdoption, ...this.CvdoptionForm.value };

 if (p.id === 0) {
 this.createCvdoption(p);
 } else {
 this.updateCvdoption(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdoption.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdoption(this.objCvdoption.id)
 }
 }
 }

 PerformOperation(data: Cvdoption): void { 
 this.displayCvdoption(data);
 }
 getCvdoption(id: number): void {
 this.objCvdoptionService.getCvdoption(id)
 .subscribe({
 next: (data: Cvdoption) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdoption(p: Cvdoption): void
 {
 this.objCvdoptionService.createCvdoption(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdoption(p: Cvdoption): void
 {
 this.objCvdoptionService.updateCvdoption(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdoption(id: number): void {
 this.objCvdoptionService.deleteCvdoption(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdoptionForm.reset();
 this.router.navigate(['/Cvdoptions']);
 }
}
