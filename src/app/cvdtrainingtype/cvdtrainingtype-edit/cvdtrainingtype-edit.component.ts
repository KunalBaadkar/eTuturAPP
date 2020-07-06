import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdtrainingtype } from 'src/app/models/cvdtrainingtype';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdtrainingtype-edit', 
 templateUrl: './cvdtrainingtype-edit.component.html',
 styleUrls: ['./cvdtrainingtype-edit.component.css']
})
export class CvdtrainingtypeEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdtrainingtypeForm: FormGroup;
 objCvdtrainingtype: Cvdtrainingtype;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdtrainingtypeForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdtrainingtypeForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdtrainingtypeService: CvdtrainingtypeService, private fb: FormBuilder) {
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
 this.getCvdtrainingtype(id);
 }
 );
 }

private InitializeForm() {
 this.CvdtrainingtypeForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
   
   

});
}

 displayCvdtrainingtype(objCvdtrainingtype: Cvdtrainingtype): void {
 if (this.CvdtrainingtypeForm) {
 this.CvdtrainingtypeForm.reset();
 }
 this.objCvdtrainingtype = objCvdtrainingtype;

 if (this.objCvdtrainingtype.id === 0) {
 this.pageTitle = 'Add Training Type';
 } else {
 this.pageTitle = `Edit Training Type: ${this.objCvdtrainingtype.Name  }`;
 }

 this.CvdtrainingtypeForm.patchValue({
  Name: this.objCvdtrainingtype.Name


 });
 }

 saveCvdtrainingtype(): void {
 if (this.CvdtrainingtypeForm.valid) {
 if (this.CvdtrainingtypeForm.dirty) {
 const p = { ...this.objCvdtrainingtype, ...this.CvdtrainingtypeForm.value };

 if (p.id === 0) {
 this.createCvdtrainingtype(p);
 } else {
 this.updateCvdtrainingtype(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdtrainingtype.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdtrainingtype(this.objCvdtrainingtype.id)
 }
 }
 }

 PerformOperation(data: Cvdtrainingtype): void { 
 this.displayCvdtrainingtype(data);
 }
 getCvdtrainingtype(id: number): void {
 this.objCvdtrainingtypeService.getCvdtrainingtype(id)
 .subscribe({
 next: (data: Cvdtrainingtype) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdtrainingtype(p: Cvdtrainingtype): void
 {
 this.objCvdtrainingtypeService.createCvdtrainingtype(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdtrainingtype(p: Cvdtrainingtype): void
 {
 this.objCvdtrainingtypeService.updateCvdtrainingtype(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdtrainingtype(id: number): void {
 this.objCvdtrainingtypeService.deleteCvdtrainingtype(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdtrainingtypeForm.reset();
 this.router.navigate(['/Cvdtrainingtypes']);
 }
}
