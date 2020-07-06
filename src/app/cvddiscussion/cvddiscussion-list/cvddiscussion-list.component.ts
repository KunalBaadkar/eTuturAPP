
import { Component, OnInit } from '@angular/core';
import { CvddiscussionService } from 'src/app/services/cvddiscussion.service';
import { Cvddiscussion } from 'src/app/models/cvddiscussion';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
  selector: 'app-cvddiscussion-list',
  templateUrl: './cvddiscussion-list.component.html',
  styleUrls: ['./cvddiscussion-list.component.css']
})
export class CvddiscussionListComponent implements OnInit {
  isUserLoggedin: boolean;
  LoggedinUserName: string;
  constructor(private objCvduserService: CvduserService, private objCvdcourseService: CvdcourseService, private objCvddiscussionService: CvddiscussionService, private router: Router) { }
  ngOnInit() {
    if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
    this.getAllCvdcourse();
  }

  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        this.getAllCvddiscussion();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvduserNameFromId(Id: Number): string {
    return this.CvduserList.find(r => r.id === Id).Name;
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
    return this.CvdcourseList.find(r => r.id === Id).Name;
  }
  errorMessage: any;
  pageTitle: string = "Discussion List";
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCvddiscussions = this.listFilter ? this.performFilter(this.listFilter) : this.CvddiscussionList;
  }

  filteredCvddiscussions: Cvddiscussion[] = [];
  CvddiscussionList: Cvddiscussion[] = [];

  performFilter(filterBy: string): Cvddiscussion[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.CvddiscussionList.filter((data: Cvddiscussion) =>
      data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getAllCvddiscussion() {
    this.objCvddiscussionService.getAllCvddiscussion().subscribe({
      next: data => {
        this.CvddiscussionList = data;
        this.CvddiscussionList.forEach(r => r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
        this.CvddiscussionList.forEach(r => r.CvduserName = this.getCvduserNameFromId(r.FCvduserId));
        this.filteredCvddiscussions = this.CvddiscussionList;
      },
      error: err => this.errorMessage = err
    });
  }
}

