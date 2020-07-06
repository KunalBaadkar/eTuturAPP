import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdlevel } from 'src/app/models/cvdlevel';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';
import { Cvdtrainingtype } from 'src/app/models/cvdtrainingtype';

@Component({
 selector: 'app-cvdlevel-edit', 
 templateUrl: './cvdlevel-edit.component.html',
 styleUrls: ['./cvdlevel-edit.component.css']
})
export class CvdlevelEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdlevelForm: FormGroup;
 objCvdlevel: Cvdlevel;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdlevelForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdlevelForm);
 });
 }

 constructor(private objCvdtrainingtypeService: CvdtrainingtypeService, private route: ActivatedRoute, private router: Router, private objCvdlevelService: CvdlevelService, private fb: FormBuilder) {
 this.validationMessages = {
   Name: {
   required: 'This field is required',
   minlength: 'This field requires atleast 3 characters.',
   maxlength: 'cannot exceed more than 50 characters.'
   },
    FCvdtrainingtypeId: {
    min: 'This field is required'
    },
   
   
  
 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdtrainingtype(); 
  }
// ngoninit 
 

CvdtrainingtypeList: Cvdtrainingtype[];
getAllCvdtrainingtype() {
  this.objCvdtrainingtypeService.getAllCvdtrainingtype().subscribe({
   next: data => {
      this.CvdtrainingtypeList = data;
      if(this.CvdlevelForm.controls.FCvdtrainingtypeId.value===undefined)
         this.CvdlevelForm.controls.FCvdtrainingtypeId.setValue(0);
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
 this.getCvdlevel(id);
 }
 );
 }

private InitializeForm() {
 this.CvdlevelForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdtrainingtypeId: [0, Validators.min(1)],
   
   
   
 

});
}

 displayCvdlevel(objCvdlevel: Cvdlevel): void {
 if (this.CvdlevelForm) {
 this.CvdlevelForm.reset();
 }
 this.objCvdlevel = objCvdlevel;

 if (this.objCvdlevel.id === 0) {
 this.pageTitle = 'Add Level';
 } else {
 this.pageTitle = `Edit Level: ${this.objCvdlevel.Name  }`;
 }

 this.CvdlevelForm.patchValue({
  Name: this.objCvdlevel.Name,
  FCvdtrainingtypeId: this.objCvdlevel.FCvdtrainingtypeId
  


 });
 }

 saveCvdlevel(): void {
 if (this.CvdlevelForm.valid) {
 if (this.CvdlevelForm.dirty) {
 const p = { ...this.objCvdlevel, ...this.CvdlevelForm.value };

 if (p.id === 0) {
 this.createCvdlevel(p);
 } else {
 this.updateCvdlevel(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdlevel.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdlevel(this.objCvdlevel.id)
 }
 }
 }

 PerformOperation(data: Cvdlevel): void { 
 this.displayCvdlevel(data);
 }
 getCvdlevel(id: number): void {
 this.objCvdlevelService.getCvdlevel(id)
 .subscribe({
 next: (data: Cvdlevel) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdlevel(p: Cvdlevel): void
 {
 this.objCvdlevelService.createCvdlevel(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdlevel(p: Cvdlevel): void
 {
 this.objCvdlevelService.updateCvdlevel(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdlevel(id: number): void {
 this.objCvdlevelService.deleteCvdlevel(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdlevelForm.reset();
 this.router.navigate(['/Cvdlevels']);
 }
}
