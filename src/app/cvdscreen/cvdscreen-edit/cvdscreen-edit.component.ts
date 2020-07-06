import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdscreen } from 'src/app/models/cvdscreen';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdscreenService } from 'src/app/services/cvdscreen.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdscreen-edit', 
 templateUrl: './cvdscreen-edit.component.html',
 styleUrls: ['./cvdscreen-edit.component.css']
})
export class CvdscreenEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdscreenForm: FormGroup;
 objCvdscreen: Cvdscreen;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdscreenForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdscreenForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdscreenService: CvdscreenService, private fb: FormBuilder) {
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
 this.getCvdscreen(id);
 }
 );
 }

private InitializeForm() {
 this.CvdscreenForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
});
}

 displayCvdscreen(objCvdscreen: Cvdscreen): void {
 if (this.CvdscreenForm) {
 this.CvdscreenForm.reset();
 }
 this.objCvdscreen = objCvdscreen;

 if (this.objCvdscreen.id === 0) {
 this.pageTitle = 'Add Screen';
 } else {
 this.pageTitle = `Edit Screen: ${this.objCvdscreen.Name  }`;
 }

 this.CvdscreenForm.patchValue({
  Name: this.objCvdscreen.Name
 });
 }

 saveCvdscreen(): void {
 if (this.CvdscreenForm.valid) {
 if (this.CvdscreenForm.dirty) {
 const p = { ...this.objCvdscreen, ...this.CvdscreenForm.value };

 if (p.id === 0) {
 this.createCvdscreen(p);
 } else {
 this.updateCvdscreen(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdscreen.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdscreen(this.objCvdscreen.id)
 }
 }
 }

 PerformOperation(data: Cvdscreen): void { 
 this.displayCvdscreen(data);
 }
 getCvdscreen(id: number): void {
 this.objCvdscreenService.getCvdscreen(id)
 .subscribe({
 next: (data: Cvdscreen) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdscreen(p: Cvdscreen): void
 {
 this.objCvdscreenService.createCvdscreen(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdscreen(p: Cvdscreen): void
 {
 this.objCvdscreenService.updateCvdscreen(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdscreen(id: number): void {
 this.objCvdscreenService.deleteCvdscreen(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdscreenForm.reset();
 this.router.navigate(['/Cvdscreens']);
 }
}
