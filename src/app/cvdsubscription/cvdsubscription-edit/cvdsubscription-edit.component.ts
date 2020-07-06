import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdsubscription } from 'src/app/models/cvdsubscription';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdsubscription-edit', 
 templateUrl: './cvdsubscription-edit.component.html',
 styleUrls: ['./cvdsubscription-edit.component.css']
})
export class CvdsubscriptionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdsubscriptionForm: FormGroup;
 objCvdsubscription: Cvdsubscription;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdsubscriptionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdsubscriptionForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdsubscriptionService: CvdsubscriptionService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 Description: {
 required: 'This field is required'
 },
 Price: {
 required: 'This field is required'
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
 this.getCvdsubscription(id);
 }
 );
 }

private InitializeForm() {
 this.CvdsubscriptionForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    Description: ['', Validators.required],
    Price: ['', Validators.required],

    

   

});
}

 displayCvdsubscription(objCvdsubscription: Cvdsubscription): void {
 if (this.CvdsubscriptionForm) {
 this.CvdsubscriptionForm.reset();
 }
 this.objCvdsubscription = objCvdsubscription;

 if (this.objCvdsubscription.id === 0) {
 this.pageTitle = 'Add Subscription';
 } else {
 this.pageTitle = `Edit Subscription: ${this.objCvdsubscription.Name  }`;
 }

 this.CvdsubscriptionForm.patchValue({
  Name: this.objCvdsubscription.Name,
  Description: this.objCvdsubscription.Description,
  Price: this.objCvdsubscription.Price



 });
 }

 saveCvdsubscription(): void {
 if (this.CvdsubscriptionForm.valid) {
 if (this.CvdsubscriptionForm.dirty) {
 const p = { ...this.objCvdsubscription, ...this.CvdsubscriptionForm.value };

 if (p.id === 0) {
 this.createCvdsubscription(p);
 } else {
 this.updateCvdsubscription(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdsubscription.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdsubscription(this.objCvdsubscription.id)
 }
 }
 }

 PerformOperation(data: Cvdsubscription): void { 
 this.displayCvdsubscription(data);
 }
 getCvdsubscription(id: number): void {
 this.objCvdsubscriptionService.getCvdsubscription(id)
 .subscribe({
 next: (data: Cvdsubscription) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdsubscription(p: Cvdsubscription): void
 {
 this.objCvdsubscriptionService.createCvdsubscription(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdsubscription(p: Cvdsubscription): void
 {
 this.objCvdsubscriptionService.updateCvdsubscription(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdsubscription(id: number): void {
 this.objCvdsubscriptionService.deleteCvdsubscription(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdsubscriptionForm.reset();
 this.router.navigate(['/Cvdsubscriptions']);
 }
}
