
import { Component, OnInit } from '@angular/core';
import { CvdfaqService } from 'src/app/services/cvdfaq.service';
import { Cvdfaq } from 'src/app/models/cvdfaq';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-cvdfaq-list',
 templateUrl: './cvdfaq-list.component.html',
 styleUrls: ['./cvdfaq-list.component.css']
})
export class CvdfaqListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdfaqService: CvdfaqService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdfaq(); 
}
errorMessage: any;
pageTitle: string = "FAQ List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdfaqs = this.listFilter ? this.performFilter(this.listFilter) : this.CvdfaqList;
 }

 filteredCvdfaqs: Cvdfaq[] = [];
 CvdfaqList: Cvdfaq[] = [];

 performFilter(filterBy: string): Cvdfaq[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdfaqList.filter((data: Cvdfaq) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdfaq() {
 this.objCvdfaqService.getAllCvdfaq().subscribe({
 next: data => {
 this.CvdfaqList = data;
 this.filteredCvdfaqs = this.CvdfaqList;
 },
 error: err => this.errorMessage = err
 });
 }
}

