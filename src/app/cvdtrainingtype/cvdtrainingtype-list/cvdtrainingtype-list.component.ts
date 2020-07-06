
import { Component, OnInit } from '@angular/core';
import { CvdtrainingtypeService } from 'src/app/services/cvdtrainingtype.service';
import { Cvdtrainingtype } from 'src/app/models/cvdtrainingtype';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-cvdtrainingtype-list',
 templateUrl: './cvdtrainingtype-list.component.html',
 styleUrls: ['./cvdtrainingtype-list.component.css']
})
export class CvdtrainingtypeListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdtrainingtypeService: CvdtrainingtypeService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdtrainingtype(); 
}
errorMessage: any;
pageTitle: string = "Training Type List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdtrainingtypes = this.listFilter ? this.performFilter(this.listFilter) : this.CvdtrainingtypeList;
 }

 filteredCvdtrainingtypes: Cvdtrainingtype[] = [];
 CvdtrainingtypeList: Cvdtrainingtype[] = [];

 performFilter(filterBy: string): Cvdtrainingtype[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdtrainingtypeList.filter((data: Cvdtrainingtype) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdtrainingtype() {
 this.objCvdtrainingtypeService.getAllCvdtrainingtype().subscribe({
 next: data => {
 this.CvdtrainingtypeList = data;
 this.filteredCvdtrainingtypes = this.CvdtrainingtypeList;
 },
 error: err => this.errorMessage = err
 });
 }
}

