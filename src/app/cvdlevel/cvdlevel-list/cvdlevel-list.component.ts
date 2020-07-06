
import { Component, OnInit } from '@angular/core';
import { CvdlevelService } from 'src/app/services/cvdlevel.service';
import { Cvdlevel } from 'src/app/models/cvdlevel';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';
import { Cvdtrainingtype } from 'src/app/models/cvdtrainingtype';

@Component({
 selector: 'app-cvdlevel-list',
 templateUrl: './cvdlevel-list.component.html',
 styleUrls: ['./cvdlevel-list.component.css']
})
export class CvdlevelListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdtrainingtypeService: CvdtrainingtypeService, private objCvdlevelService: CvdlevelService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdtrainingtype();
}
  
  CvdtrainingtypeList: Cvdtrainingtype[];
  getAllCvdtrainingtype() {
    this.objCvdtrainingtypeService.getAllCvdtrainingtype().subscribe({
      next: data => {
        this.CvdtrainingtypeList = data;
        this.getAllCvdlevel();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdtrainingtypeNameFromId(Id: Number): string {
    return this.CvdtrainingtypeList.find(r=>r.id===Id).Name;
  }
errorMessage: any;
pageTitle: string = "Level List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdlevels = this.listFilter ? this.performFilter(this.listFilter) : this.CvdlevelList;
 }

 filteredCvdlevels: Cvdlevel[] = [];
 CvdlevelList: Cvdlevel[] = [];

 performFilter(filterBy: string): Cvdlevel[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdlevelList.filter((data: Cvdlevel) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdlevel() {
 this.objCvdlevelService.getAllCvdlevel().subscribe({
 next: data => {
 this.CvdlevelList = data;
 this.CvdlevelList.forEach(r=>r.CvdtrainingtypeName = this.getCvdtrainingtypeNameFromId(r.FCvdtrainingtypeId));
 this.filteredCvdlevels = this.CvdlevelList;
 },
 error: err => this.errorMessage = err
 });
 }
}

