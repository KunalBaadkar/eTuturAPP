
import { Component, OnInit } from '@angular/core';
import { CvdpermissionService } from 'src/app/services/cvdpermission.service';
import { Cvdpermission } from 'src/app/models/cvdpermission';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';

@Component({
 selector: 'app-cvdpermission-list',
 templateUrl: './cvdpermission-list.component.html',
 styleUrls: ['./cvdpermission-list.component.css']
})
export class CvdpermissionListComponent implements OnInit {
isUserLoggedin: boolean;
LoggedinUserName: string;
   constructor(private objCvduserService: CvduserService, private objCvdroleService: CvdroleService, 
      private objCvdpermissionService: CvdpermissionService, private router: Router) { }
ngOnInit() {
if(!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
this.getAllCvdrole();
}
//model


//ctor


//getallCvdpermission


//oninit


//html 
  
  CvduserList: Cvduser[];
  getAllCvduser() {
    this.objCvduserService.getAllCvduser().subscribe({
      next: data => {
        this.CvduserList = data;
        this.getAllCvdpermission();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvduserNameFromId(Id: Number): string {
    return this.CvduserList.find(r=>r.id===Id).Name;
  }
  
  CvdroleList: Cvdrole[];
  getAllCvdrole() {
    this.objCvdroleService.getAllCvdrole().subscribe({
      next: data => {
        this.CvdroleList = data;
        this.getAllCvduser();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdroleNameFromId(Id: Number): string {
    return this.CvdroleList.find(r=>r.id===Id).Name;
  }

errorMessage: any;
pageTitle: string = "Permission List";
 _listFilter = '';
 get listFilter(): string {
 return this._listFilter;
 }
 set listFilter(value: string) {
 this._listFilter = value;
 this.filteredCvdpermissions = this.listFilter ? this.performFilter(this.listFilter) : this.CvdpermissionList;
 }

 filteredCvdpermissions: Cvdpermission[] = [];
 CvdpermissionList: Cvdpermission[] = [];

 performFilter(filterBy: string): Cvdpermission[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.CvdpermissionList.filter((data: Cvdpermission) =>
 data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
 }

 getAllCvdpermission() {
 this.objCvdpermissionService.getAllCvdpermission().subscribe({
 next: data => {
 this.CvdpermissionList = data;
 this.CvdpermissionList.forEach(r=>r.CvdroleName = this.getCvdroleNameFromId(r.FCvdroleId));
 this.CvdpermissionList.forEach(r=>r.CvduserName = this.getCvduserNameFromId(r.FCvduserId));
 this.filteredCvdpermissions = this.CvdpermissionList;
 },
 error: err => this.errorMessage = err
 });
 }
}

