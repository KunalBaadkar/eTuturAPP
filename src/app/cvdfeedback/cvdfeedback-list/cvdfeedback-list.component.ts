
import { Component, OnInit } from '@angular/core';
import { CvdfeedbackService } from 'src/app/services/cvdfeedback.service';
import { Cvdfeedback } from 'src/app/models/cvdfeedback';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvduserService } from 'src/app/services/cvduser.service';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvduser } from 'src/app/models/cvduser';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
 selector: 'app-cvdfeedback-list',
 templateUrl: './cvdfeedback-list.component.html',
 styleUrls: ['./cvdfeedback-list.component.css']
})
export class CvdfeedbackListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvduserService: CvduserService, private objCvdcourseService: CvdcourseService, private objCvdfeedbackService: CvdfeedbackService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdcourse();
}

  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        this.getAllCvdfeedback();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvduserNameFromId(Id: Number): string {
    return this.CvduserList.find(r=>r.id===Id).Name;
  }
  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
      next: data => {
        this.CvdcourseList = data;
        this.getAllCvduser();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdcourseNameFromId(Id: Number): string {
    return this.CvdcourseList.find(r=>r.id===Id).Name;
  }
errorMessage: any;
pageTitle: string = "Feedback List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdfeedbacks = this.listFilter ? this.performFilter(this.listFilter) : this.CvdfeedbackList;
 }

 filteredCvdfeedbacks: Cvdfeedback[] = [];
 CvdfeedbackList: Cvdfeedback[] = [];

 performFilter(filterBy: string): Cvdfeedback[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdfeedbackList.filter((data: Cvdfeedback) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdfeedback() {
 this.objCvdfeedbackService.getAllCvdfeedback().subscribe({
 next: data => {
 this.CvdfeedbackList = data;
 this.CvdfeedbackList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
 this.CvdfeedbackList.forEach(r=>r.CvduserName = this.getCvduserNameFromId(r.FCvduserId));
 this.filteredCvdfeedbacks = this.CvdfeedbackList;
 },
 error: err => this.errorMessage = err
 });
 }
}

