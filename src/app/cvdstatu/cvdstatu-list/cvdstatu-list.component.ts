
import { Component, OnInit } from '@angular/core';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { Cvdstatu } from 'src/app/models/cvdstatu';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-cvdstatu-list',
 templateUrl: './cvdstatu-list.component.html',
 styleUrls: ['./cvdstatu-list.component.css']
})
export class CvdstatuListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdstatuService: CvdstatuService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdstatu(); 
}
errorMessage: any;
pageTitle: string = "Status List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdstatus = this.listFilter ? this.performFilter(this.listFilter) : this.CvdstatuList;
 }

 filteredCvdstatus: Cvdstatu[] = [];
 CvdstatuList: Cvdstatu[] = [];

 performFilter(filterBy: string): Cvdstatu[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdstatuList.filter((data: Cvdstatu) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdstatu() {
 this.objCvdstatuService.getAllCvdstatu().subscribe({
 next: data => {
 this.CvdstatuList = data;
 this.filteredCvdstatus = this.CvdstatuList;
 },
 error: err => this.errorMessage = err
 });
 }
}

