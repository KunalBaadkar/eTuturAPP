import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdclasse } from 'src/app/models/cvdclasse';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';
import { Cvdlevel } from 'src/app/models/cvdlevel';

@Component({
 selector: 'app-classe-edit', 
 templateUrl: './cvdclasse-edit.component.html',
 styleUrls: ['./cvdclasse-edit.component.css']
})
export class CvdclasseEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdclasseForm: FormGroup;
 objCvdclasse: Cvdclasse;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdclasseForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdclasseForm);
 });
 }

 constructor(
  private objCvdlevelService: CvdlevelService,private route: ActivatedRoute, private router: Router, private objCvdclasseService: CvdclasseService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
  FCvdlevelId: {
  min: 'This field is required'
  },
 
 

 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdlevel(); 
  }
  // ngoninit
  
  CvdlevelList: Cvdlevel[];
  getAllCvdlevel() {
    this.objCvdlevelService.getAllCvdlevel().subscribe({
     next: data => {
        this.CvdlevelList = data;
        if(this.CvdclasseForm.controls.FCvdlevelId.value===undefined)
           this.CvdclasseForm.controls.FCvdlevelId.setValue(0);
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
 this.getCvdclasse(id);
 }
 );
 }

private InitializeForm() {
 this.CvdclasseForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdlevelId: [0, Validators.min(1)],
 

   

});
}

 displayCvdclasse(objCvdclasse: Cvdclasse): void {
 if (this.CvdclasseForm) {
 this.CvdclasseForm.reset();
 }
 this.objCvdclasse = objCvdclasse;

 if (this.objCvdclasse.id === 0) {
 this.pageTitle = 'Add Class';
 } else {
 this.pageTitle = `Edit Class: ${this.objCvdclasse.Name  }`;
 }

 this.CvdclasseForm.patchValue({
  Name: this.objCvdclasse.Name,
  
 FCvdlevelId: this.objCvdclasse.FCvdlevelId


 });
 }

 saveCvdclasse(): void {
 if (this.CvdclasseForm.valid) {
 if (this.CvdclasseForm.dirty) {
 const p = { ...this.objCvdclasse, ...this.CvdclasseForm.value };

 if (p.id === 0) {
 this.createCvdclasse(p);
 } else {
 this.updateCvdclasse(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdclasse.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdclasse(this.objCvdclasse.id)
 }
 }
 }

 PerformOperation(data: Cvdclasse): void { 
 this.displayCvdclasse(data);
 }
 getCvdclasse(id: number): void {
 this.objCvdclasseService.getCvdclasse(id)
 .subscribe({
 next: (data: Cvdclasse) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdclasse(p: Cvdclasse): void
 {
 this.objCvdclasseService.createCvdclasse(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdclasse(p: Cvdclasse): void
 {
 this.objCvdclasseService.updateCvdclasse(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdclasse(id: number): void {
 this.objCvdclasseService.deleteCvdclasse(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdclasseForm.reset();
 this.router.navigate(['/Cvdclasses']);
 }
}
