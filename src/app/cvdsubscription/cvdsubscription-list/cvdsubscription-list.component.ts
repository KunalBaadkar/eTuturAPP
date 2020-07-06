
import { Component, OnInit } from '@angular/core';
import { CvdsubscriptionService } from 'src/app/services/cvdsubscription.service';
import { Cvdsubscription } from 'src/app/models/cvdsubscription';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';

@Component({
 selector: 'app-cvdsubscription-list',
 templateUrl: './cvdsubscription-list.component.html',
 styleUrls: ['./cvdsubscription-list.component.css']
})
export class CvdsubscriptionListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdsubscriptionService: CvdsubscriptionService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdsubscription(); 
}
errorMessage: any;
pageTitle: string = "Subscription List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdsubscriptions = this.listFilter ? this.performFilter(this.listFilter) : this.CvdsubscriptionList;
 }

 filteredCvdsubscriptions: Cvdsubscription[] = [];
 CvdsubscriptionList: Cvdsubscription[] = [];

 performFilter(filterBy: string): Cvdsubscription[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdsubscriptionList.filter((data: Cvdsubscription) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdsubscription() {
 this.objCvdsubscriptionService.getAllCvdsubscription().subscribe({
 next: data => {
 this.CvdsubscriptionList = data;
 this.filteredCvdsubscriptions = this.CvdsubscriptionList;
 },
 error: err => this.errorMessage = err
 });
 }
}

