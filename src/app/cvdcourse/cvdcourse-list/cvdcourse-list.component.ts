
import { Component, OnInit } from '@angular/core';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdclasseService } from 'src/app/services/cvdclasse.service';
import { Cvdclasse } from 'src/app/models/cvdclasse';

@Component({
 selector: 'app-cvdcourse-list',
 templateUrl: './cvdcourse-list.component.html',
 styleUrls: ['./cvdcourse-list.component.css']
})
export class CvdcourseListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdclasseService: CvdclasseService,private objCvdcourseService: CvdcourseService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdclasse();
}

 
  CvdclasseList: Cvdclasse[];
  getAllCvdclasse() {
    this.objCvdclasseService.getAllCvdclasse().subscribe({
      next: data => {
        this.CvdclasseList = data;
        this.getAllCvdcourse();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdclasseNameFromId(Id: Number): string {
    return this.CvdclasseList.find(r=>r.id===Id).Name;
  }

errorMessage: any;
pageTitle: string = "Course List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdcourses = this.listFilter ? this.performFilter(this.listFilter) : this.CvdcourseList;
 }

 filteredCvdcourses: Cvdcourse[] = [];
 CvdcourseList: Cvdcourse[] = [];

 performFilter(filterBy: string): Cvdcourse[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdcourseList.filter((data: Cvdcourse) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdcourse() {
 this.objCvdcourseService.getAllCvdcourse().subscribe({
 next: data => {
 this.CvdcourseList = data;
 this.CvdcourseList.forEach(r=>r.CvdclasseName = this.getCvdclasseNameFromId(r.FCvdclassId));
 this.filteredCvdcourses = this.CvdcourseList;
 },
 error: err => this.errorMessage = err
 });
 }
}

