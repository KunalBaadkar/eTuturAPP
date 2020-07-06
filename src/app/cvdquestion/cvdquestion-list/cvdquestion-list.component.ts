
import { Component, OnInit } from '@angular/core';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { Cvdquestion } from 'src/app/models/cvdquestion';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
 selector: 'app-cvdquestion-list',
 templateUrl: './cvdquestion-list.component.html',
 styleUrls: ['./cvdquestion-list.component.css']
})
export class CvdquestionListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdcourseService: CvdcourseService, private objCvdquestionService: CvdquestionService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdcourse();
}

  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
      next: data => {
        this.CvdcourseList = data;
        this.getAllCvdquestion();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdcourseNameFromId(Id: Number): string {
    return this.CvdcourseList.find(r=>r.id===Id).Name;
  }

errorMessage: any;
pageTitle: string = "Question List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdquestions = this.listFilter ? this.performFilter(this.listFilter) : this.CvdquestionList;
 }

 filteredCvdquestions: Cvdquestion[] = [];
 CvdquestionList: Cvdquestion[] = [];

 performFilter(filterBy: string): Cvdquestion[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdquestionList.filter((data: Cvdquestion) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdquestion() {
 this.objCvdquestionService.getAllCvdquestion().subscribe({
 next: data => {
 this.CvdquestionList = data;
 this.CvdquestionList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
 this.filteredCvdquestions = this.CvdquestionList;
 },
 error: err => this.errorMessage = err
 });
 }
}

