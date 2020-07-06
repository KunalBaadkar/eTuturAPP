
import { Component, OnInit } from '@angular/core';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';


@Component({
 selector: 'app-cvdrole-list',
 templateUrl: './cvdrole-list.component.html',
 styleUrls: ['./cvdrole-list.component.css']
})
export class CvdroleListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvdroleService: CvdroleService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
 this.getAllCvdrole(); 
}
errorMessage: any;
pageTitle: string = "Role List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdroles = this.listFilter ? this.performFilter(this.listFilter) : this.CvdroleList;
 }

 filteredCvdroles: Cvdrole[] = [];
 CvdroleList: Cvdrole[] = [];

 performFilter(filterBy: string): Cvdrole[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdroleList.filter((data: Cvdrole) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdrole() {
 this.objCvdroleService.getAllCvdrole().subscribe({
 next: data => {
 this.CvdroleList = data;
 this.filteredCvdroles = this.CvdroleList;
 },
 error: err => this.errorMessage = err
 });
 }
}

