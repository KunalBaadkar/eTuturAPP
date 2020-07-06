
import { Component, OnInit } from '@angular/core';
import { CvdscreenService } from 'src/app/services/cvdscreen.service';
import { Cvdscreen } from 'src/app/models/cvdscreen';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-cvdscreen-list',
 templateUrl: './cvdscreen-list.component.html',
 styleUrls: ['./cvdscreen-list.component.css']
})
export class CvdscreenListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdscreenService: CvdscreenService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdscreen(); 
}
errorMessage: any;
pageTitle: string = "Screen List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdscreens = this.listFilter ? this.performFilter(this.listFilter) : this.CvdscreenList;
 }

 filteredCvdscreens: Cvdscreen[] = [];
 CvdscreenList: Cvdscreen[] = [];

 performFilter(filterBy: string): Cvdscreen[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdscreenList.filter((data: Cvdscreen) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdscreen() {
 this.objCvdscreenService.getAllCvdscreen().subscribe({
 next: data => {
 this.CvdscreenList = data;
 this.filteredCvdscreens = this.CvdscreenList;
 },
 error: err => this.errorMessage = err
 });
 }
}

