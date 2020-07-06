import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from 'src/app/common/generic-validator';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Cvdpermission } from 'src/app/models/cvdpermission';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CvdpermissionService } from 'src/app/services/cvdpermission.service';
import { appconstants } from 'src/app/common/appconstants';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
 selector: 'app-cvdpermission-edit', 
 templateUrl: './cvdpermission-edit.component.html',
 styleUrls: ['./cvdpermission-edit.component.css']
})
export class CvdpermissionEditComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

isUserLoggedin: boolean;
LoggedinUserName: string;
 displayMessage: { [key: string]: string } = {};
 private validationMessages: { [key: string]: { [key: string]: string } };
 private genericValidator: GenericValidator;
 private sub: Subscription;
 CvdpermissionForm: FormGroup;
 objCvdpermission: Cvdpermission;
 pageTitle: string;
 errorMessage: string;

 ngAfterViewInit(): void {
 const controlBlurs: Observable<any>[] = this.formInputElements
 .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

 merge(this.CvdpermissionForm.valueChanges, ...controlBlurs).pipe(
 debounceTime(800)
 ).subscribe(value => {
 this.displayMessage = this.genericValidator.processMessages(this.CvdpermissionForm);
 });
 }

 constructor(private objCvduserService: CvduserService, private objCvdroleService: CvdroleService, private route: ActivatedRoute, private router: Router, private objCvdpermissionService: CvdpermissionService, private fb: FormBuilder) {
 this.validationMessages = {
 Name: {
 required: 'This field is required',
 minlength: 'This field requires atleast 3 characters.',
 maxlength: 'cannot exceed more than 50 characters.'
 },
 FCvdroleId: {
 min: 'This field is required'
 },
 FCvduserId: {
 min: 'This field is required'
 },




 };
 this.genericValidator = new GenericValidator(this.validationMessages);
 }

  ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.InitializeForm();
    this.GetQueryStringParams();
    this.getAllCvdrole(); 
    this.getAllCvduser(); 
  }

  // ngoninit 
   // ngoninit 
    
   
   CvduserList: Cvduser[];
   getAllCvduser() {
     this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
         this.CvduserList = data;
         if(this.CvdpermissionForm.controls.FCvduserId.value===undefined)
            this.CvdpermissionForm.controls.FCvduserId.setValue(0);
       },
        error: err => this.errorMessage = err
     });
   }  
  
  CvdroleList: Cvdrole[];
  getAllCvdrole() {
    this.objCvdroleService.getAllCvdrole().subscribe({
     next: data => {
        this.CvdroleList = data;
        if(this.CvdpermissionForm.controls.FCvdroleId.value===undefined)
           this.CvdpermissionForm.controls.FCvdroleId.setValue(0);
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
 this.getCvdpermission(id);
 }
 );
 }

private InitializeForm() {
 this.CvdpermissionForm = this.fb.group({
  Name: ['', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)]],
    FCvdroleId: [0, Validators.min(1)],

    FCvduserId: [0, Validators.min(1)],


   

});
}

 displayCvdpermission(objCvdpermission: Cvdpermission): void {
 if (this.CvdpermissionForm) {
 this.CvdpermissionForm.reset();
 }
 this.objCvdpermission = objCvdpermission;

 if (this.objCvdpermission.id === 0) {
 this.pageTitle = 'Add Permission';
 } else {
 this.pageTitle = `Edit Permission: ${this.objCvdpermission.Name  }`;
 }

 this.CvdpermissionForm.patchValue({
  Name: this.objCvdpermission.Name,
  
FCvdroleId: this.objCvdpermission.FCvdroleId,

FCvduserId: this.objCvdpermission.FCvduserId


 });
 }

 saveCvdpermission(): void {
 if (this.CvdpermissionForm.valid) {
 if (this.CvdpermissionForm.dirty) {
 const p = { ...this.objCvdpermission, ...this.CvdpermissionForm.value };

 if (p.id === 0) {
 this.createCvdpermission(p);
 } else {
 this.updateCvdpermission(p);
 }
 } else {
 this.onSaveComplete();
 }
 } else {
 this.errorMessage = 'Please correct the validation errors.';
 }
 }

 DeleteConfirmation(): void{
 if (this.objCvdpermission.id === 0) {
 this.onSaveComplete();
 } else {
 if (confirm("Are you sure you want to delete this record. ")) {
 this.deleteCvdpermission(this.objCvdpermission.id)
 }
 }
 }

 PerformOperation(data: Cvdpermission): void { 
 this.displayCvdpermission(data);
 }
 getCvdpermission(id: number): void {
 this.objCvdpermissionService.getCvdpermission(id)
 .subscribe({
 next: (data: Cvdpermission) => this.PerformOperation(data),
 error: err => this.errorMessage = err
 });
 }

 createCvdpermission(p: Cvdpermission): void
 {
 this.objCvdpermissionService.createCvdpermission(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }

 updateCvdpermission(p: Cvdpermission): void
 {
 this.objCvdpermissionService.updateCvdpermission(p)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });

 }
 deleteCvdpermission(id: number): void {
 this.objCvdpermissionService.deleteCvdpermission(id)
 .subscribe({
 next: () => this.onSaveComplete(),
 error: err => this.errorMessage = err
 });
 }


 onSaveComplete(): void {
 // Reset the form to clear the flags
 this.CvdpermissionForm.reset();
 this.router.navigate(['/Cvdpermissions']);
 }
}
