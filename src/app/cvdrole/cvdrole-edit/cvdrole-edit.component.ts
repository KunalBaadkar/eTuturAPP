import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdrole } from 'src/app/models/cvdrole';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { appconstants } from 'src/app/common/appconstants';

@Component({
 selector: 'app-cvdrole-edit', 
 templateUrl: './cvdrole-edit.component.html',
 styleUrls: ['./cvdrole-edit.component.css']
})
export class CvdroleEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdroleForm: FormGroup;
 objCvdrole: Cvdrole;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdroleForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdroleForm);
 });
 }

 constructor(private route: ActivatedRoute, private router: Router, private objCvdroleService: CvdroleService, private fb: FormBuilder) {
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
 this.getCvdrole(id);
 }
 );
 }

private InitializeForm() {
 this.CvdroleForm = this.fb.group({
    Name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
       
       

});
}

 displayCvdrole(objCvdrole: Cvdrole): void {
 if (this.CvdroleForm) {
 this.CvdroleForm.reset();
 }
 this.objCvdrole = objCvdrole;

 if (this.objCvdrole.id === 0) {
 this.pageTitle = 'Add Role';
 } else {
 this.pageTitle = `Edit Role: ${this.objCvdrole.Name  }`;
 }

 this.CvdroleForm.patchValue({
    Name: this.objCvdrole.Name
 });
 }

 saveCvdrole(): void {
 if (this.CvdroleForm.valid) {
 if (this.CvdroleForm.dirty) {
 const p = { ...this.objCvdrole, ...this.CvdroleForm.value };

 if (p.id === 0) {
 this.createCvdrole(p);
 } else {
 this.updateCvdrole(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdrole.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdrole(this.objCvdrole.id)
 }
 }
 }

 PerformOperation(data: Cvdrole): void { 
 this.displayCvdrole(data);
 }
 getCvdrole(id: number): void {
 this.objCvdroleService.getCvdrole(id)
 .subscribe({
 next: (data: Cvdrole) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdrole(p: Cvdrole): void
 {
 this.objCvdroleService.createCvdrole(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdrole(p: Cvdrole): void
 {
 this.objCvdroleService.updateCvdrole(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdrole(id: number): void {
 this.objCvdroleService.deleteCvdrole(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdroleForm.reset();
 this.router.navigate(['/Cvdroles']);
 }
}
