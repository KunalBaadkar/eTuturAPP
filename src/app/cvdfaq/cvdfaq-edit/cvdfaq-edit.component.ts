import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdfaq } from 'src/app/models/cvdfaq';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdfaqService } from 'src/app/services/cvdfaq.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdfaq-edit', 
 templateUrl: './cvdfaq-edit.component.html',
 styleUrls: ['./cvdfaq-edit.component.css']
})
export class CvdfaqEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdfaqForm: FormGroup;
 objCvdfaq: Cvdfaq;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdfaqForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdfaqForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdfaqService: CvdfaqService, private fb: FormBuilder) {
 this.validationMessages = {
   Name: {
   required: 'This field is required',
   minlength: 'This field requires atleast 3 characters.',
   maxlength: 'cannot exceed more than 50 characters.'
   },
  
  
 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
  }

 ngOnDestroy(): void {
 this.sub.unsubscribe();
 }

 GetQueryStringParams() {
 this.sub = this.route.paramMap.subscribe(
 params => {
 const id = +params.get('id');
 this.getCvdfaq(id);
 }
 );
 }

private InitializeForm() {
 this.CvdfaqForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
   
 

});
}

 displayCvdfaq(objCvdfaq: Cvdfaq): void {
 if (this.CvdfaqForm) {
 this.CvdfaqForm.reset();
 }
 this.objCvdfaq = objCvdfaq;

 if (this.objCvdfaq.id === 0) {
 this.pageTitle = 'Add FAQ';
 } else {
 this.pageTitle = `Edit FAQ: ${this.objCvdfaq.Name  }`;
 }

 this.CvdfaqForm.patchValue({
  Name: this.objCvdfaq.Name


 });
 }

 saveCvdfaq(): void {
 if (this.CvdfaqForm.valid) {
 if (this.CvdfaqForm.dirty) {
 const p = { ...this.objCvdfaq, ...this.CvdfaqForm.value };

 if (p.id === 0) {
 this.createCvdfaq(p);
 } else {
 this.updateCvdfaq(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdfaq.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdfaq(this.objCvdfaq.id)
 }
 }
 }

 PerformOperation(data: Cvdfaq): void { 
 this.displayCvdfaq(data);
 }
 getCvdfaq(id: number): void {
 this.objCvdfaqService.getCvdfaq(id)
 .subscribe({
 next: (data: Cvdfaq) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdfaq(p: Cvdfaq): void
 {
 this.objCvdfaqService.createCvdfaq(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdfaq(p: Cvdfaq): void
 {
 this.objCvdfaqService.updateCvdfaq(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdfaq(id: number): void {
 this.objCvdfaqService.deleteCvdfaq(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdfaqForm.reset();
 this.router.navigate(['/Cvdfaqs']);
 }
}
