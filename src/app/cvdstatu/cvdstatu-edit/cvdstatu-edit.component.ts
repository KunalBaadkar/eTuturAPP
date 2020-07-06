import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdstatu } from 'src/app/models/cvdstatu';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdstatu-edit', 
 templateUrl: './cvdstatu-edit.component.html',
 styleUrls: ['./cvdstatu-edit.component.css']
})
export class CvdstatuEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdstatuForm: FormGroup;
 objCvdstatu: Cvdstatu;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdstatuForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdstatuForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdstatuService: CvdstatuService, private fb: FormBuilder) {
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
 this.getCvdstatu(id);
 }
 );
 }

private InitializeForm() {
 this.CvdstatuForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
   
   

});
}

 displayCvdstatu(objCvdstatu: Cvdstatu): void {
 if (this.CvdstatuForm) {
 this.CvdstatuForm.reset();
 }
 this.objCvdstatu = objCvdstatu;

 if (this.objCvdstatu.id === 0) {
 this.pageTitle = 'Add Statu';
 } else {
 this.pageTitle = `Edit Statu: ${this.objCvdstatu.Name  }`;
 }

 this.CvdstatuForm.patchValue({
  Name: this.objCvdstatu.Name


 });
 }

 saveCvdstatu(): void {
 if (this.CvdstatuForm.valid) {
 if (this.CvdstatuForm.dirty) {
 const p = { ...this.objCvdstatu, ...this.CvdstatuForm.value };

 if (p.id === 0) {
 this.createCvdstatu(p);
 } else {
 this.updateCvdstatu(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdstatu.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdstatu(this.objCvdstatu.id)
 }
 }
 }

 PerformOperation(data: Cvdstatu): void { 
 this.displayCvdstatu(data);
 }
 getCvdstatu(id: number): void {
 this.objCvdstatuService.getCvdstatu(id)
 .subscribe({
 next: (data: Cvdstatu) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdstatu(p: Cvdstatu): void
 {
 this.objCvdstatuService.createCvdstatu(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdstatu(p: Cvdstatu): void
 {
 this.objCvdstatuService.updateCvdstatu(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdstatu(id: number): void {
 this.objCvdstatuService.deleteCvdstatu(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdstatuForm.reset();
 this.router.navigate(['/Cvdstatus']);
 }
}
