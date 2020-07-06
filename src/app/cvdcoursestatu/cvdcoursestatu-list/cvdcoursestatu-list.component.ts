
import { Component, OnInit } from '@angular/core';
import { CvdcoursestatuService } from 'src/app/services/cvdcoursestatu.service';
import { Cvdcoursestatu } from 'src/app/models/cvdcoursestatu';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdstatuService } from 'src/app/services/cvdstatu.service';
import { Cvdstatu } from 'src/app/models/cvdstatu';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
   selector: 'app-cvdcoursestatu-list',
   templateUrl: './cvdcoursestatu-list.component.html',
   styleUrls: ['./cvdcoursestatu-list.component.css']
})
export class CvdcoursestatuListComponent implements OnInit {
   isUserLoggedin: boolean;
   LoggedinUserName: string;
   constructor(private objCvdcourseService: CvdcourseService, private objCvdstatuService: CvdstatuService, private objCvdcoursestatuService: CvdcoursestatuService, private router: Router) { }
   ngOnInit() {
      if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
      this.getAllCvdstatu();
   }
  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
      next: data => {
        this.CvdcourseList = data;
        this.getAllCvdcoursestatu();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdcourseNameFromId(Id: Number): string {
    return this.CvdcourseList.find(r=>r.id===Id).Name;
  } 
     
     CvdstatuList: Cvdstatu[];
     getAllCvdstatu() {
       this.objCvdstatuService.getAllCvdstatu().subscribe({
         next: data => {
           this.CvdstatuList = data;
           this.getAllCvdcourse();
         },
         error: err => this.errorMessage = err
       });
     }
   
     getCvdstatuNameFromId(Id: Number): string {
       return this.CvdstatuList.find(r=>r.id===Id).Name;
     }
   errorMessage: any;
   pageTitle: string = "Course Status List";
   _listFilter = '';
   get listFilter(): string {
      return this._listFilter;
   }
   set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCvdcoursestatus = this.listFilter ? this.performFilter(this.listFilter) : this.CvdcoursestatuList;
   }

   filteredCvdcoursestatus: Cvdcoursestatu[] = [];
   CvdcoursestatuList: Cvdcoursestatu[] = [];

   performFilter(filterBy: string): Cvdcoursestatu[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.CvdcoursestatuList.filter((data: Cvdcoursestatu) =>
         data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

   getAllCvdcoursestatu() {
      this.objCvdcoursestatuService.getAllCvdcoursestatu().subscribe({
         next: data => {
            this.CvdcoursestatuList = data;
            this.CvdcoursestatuList.forEach(r=>r.CvdstatuName = this.getCvdstatuNameFromId(r.FCvdstatusId));
            this.CvdcoursestatuList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
            this.filteredCvdcoursestatus = this.CvdcoursestatuList;
         },
         error: err => this.errorMessage = err
      });
   }
}

