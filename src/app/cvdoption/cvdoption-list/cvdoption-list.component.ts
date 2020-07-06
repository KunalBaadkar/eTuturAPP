
import { Component, OnInit } from '@angular/core';
import { CvdoptionService } from 'src/app/services/cvdoption.service';
import { Cvdoption } from 'src/app/models/cvdoption';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdquestionService } from 'src/app/services/cvdquestion.service';
import { Cvdquestion } from 'src/app/models/cvdquestion';

@Component({
 selector: 'app-cvdoption-list',
 templateUrl: './cvdoption-list.component.html',
 styleUrls: ['./cvdoption-list.component.css']
})
export class CvdoptionListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdquestionService: CvdquestionService, private objCvdoptionService: CvdoptionService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdquestion();
}

  
  CvdquestionList: Cvdquestion[];
  getAllCvdquestion() {
    this.objCvdquestionService.getAllCvdquestion().subscribe({
      next: data => {
        this.CvdquestionList = data;
        this.getAllCvdoption();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdquestionNameFromId(Id: Number): string {
    return this.CvdquestionList.find(r=>r.id===Id).Name;
  }

errorMessage: any;
pageTitle: string = "Option List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdoptions = this.listFilter ? this.performFilter(this.listFilter) : this.CvdoptionList;
 }

 filteredCvdoptions: Cvdoption[] = [];
 CvdoptionList: Cvdoption[] = [];

 performFilter(filterBy: string): Cvdoption[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdoptionList.filter((data: Cvdoption) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdoption() {
 this.objCvdoptionService.getAllCvdoption().subscribe({
 next: data => {
 this.CvdoptionList = data;
 this.CvdoptionList.forEach(r=>r.CvdquestionName = this.getCvdquestionNameFromId(r.FCvdquestionId));
 this.filteredCvdoptions = this.CvdoptionList;
 },
 error: err => this.errorMessage = err
 });
 }
}

