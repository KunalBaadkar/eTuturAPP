
import { Component, OnInit } from '@angular/core';
import { CvdlearncheckService } from 'src/app/services/cvdlearncheck.service';
import { Cvdlearncheck } from 'src/app/models/cvdlearncheck';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { Cvdquestion } from 'src/app/models/cvdquestion';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
 selector: 'app-cvdlearncheck-list',
 templateUrl: './cvdlearncheck-list.component.html',
 styleUrls: ['./cvdlearncheck-list.component.css']
})
export class CvdlearncheckListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdcourseService: CvdcourseService, private objCvdquestionService: CvdquestionService, private objCvduserService: CvduserService, private objCvdlearncheckService: CvdlearncheckService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvduser();
}

  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
      next: data => {
        this.CvdcourseList = data;
        this.getAllCvdlearncheck();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdcourseNameFromId(Id: Number): string {
    return this.CvdcourseList.find(r=>r.id===Id).Name;
  }

goToLink(url: string){
    window.open(url, "_blank");
}
  
  CvdquestionList: Cvdquestion[];
  getAllCvdquestion() {
    this.objCvdquestionService.getAllCvdquestion().subscribe({
      next: data => {
        this.CvdquestionList = data;
        this.getAllCvdcourse();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdquestionNameFromId(Id: Number): string {
    return this.CvdquestionList.find(r=>r.id===Id).Name;
  }
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        this.getAllCvdquestion();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvduserNameFromId(Id: Number): string {
    return this.CvduserList.find(r=>r.id===Id).Name;
  }
errorMessage: any;
pageTitle: string = "Learn Check List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdlearnchecks = this.listFilter ? this.performFilter(this.listFilter) : this.CvdlearncheckList;
 }

 filteredCvdlearnchecks: Cvdlearncheck[] = [];
 CvdlearncheckList: Cvdlearncheck[] = [];

 performFilter(filterBy: string): Cvdlearncheck[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdlearncheckList.filter((data: Cvdlearncheck) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdlearncheck() {
 this.objCvdlearncheckService.getAllCvdlearncheck().subscribe({
 next: data => {
 this.CvdlearncheckList = data;
 this.CvdlearncheckList.forEach(r=>r.CvduserName = this.getCvduserNameFromId(r.FCvduserId));
 this.CvdlearncheckList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
this.CvdlearncheckList.forEach(r=>r.CvdquestionName = this.getCvdquestionNameFromId(r.FCvdquestionId));

 this.filteredCvdlearnchecks = this.CvdlearncheckList;
 },
 error: err => this.errorMessage = err
 });
 }
}

