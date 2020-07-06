
import { Component, OnInit } from '@angular/core';
import { CvdtableofcontentService } from 'src/app/services/cvdtableofcontent.service';
import { Cvdtableofcontent } from 'src/app/models/cvdtableofcontent';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdcourseService } from 'src/app/services/cvdcourse.service';
import { Cvdcourse } from 'src/app/models/cvdcourse';

@Component({
   selector: 'app-cvdtableofcontent-list',
   templateUrl: './cvdtableofcontent-list.component.html',
   styleUrls: ['./cvdtableofcontent-list.component.css']
})
export class CvdtableofcontentListComponent implements OnInit {
   isUserLoggedin: boolean;
   LoggedinUserName: string;
   constructor(private objCvdcourseService: CvdcourseService, private objCvdtableofcontentService: CvdtableofcontentService, private router: Router) { }
   ngOnInit() {
      if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
      this.getAllCvdcourse();
   }

  
  CvdcourseList: Cvdcourse[];
  getAllCvdcourse() {
    this.objCvdcourseService.getAllCvdcourse().subscribe({
      next: data => {
        this.CvdcourseList = data;
        this.getAllCvdtableofcontent();
      },
      error: err => this.errorMessage = err
    });
  }

  getCvdcourseNameFromId(Id: Number): string {
    return this.CvdcourseList.find(r=>r.id===Id).Name;
  }

   errorMessage: any;
   pageTitle: string = "Table of Content List";
   _listFilter = '';
   get listFilter(): string {
      return this._listFilter;
   }
   set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCvdtableofcontents = this.listFilter ? this.performFilter(this.listFilter) : this.CvdtableofcontentList;
   }

   filteredCvdtableofcontents: Cvdtableofcontent[] = [];
   CvdtableofcontentList: Cvdtableofcontent[] = [];

   performFilter(filterBy: string): Cvdtableofcontent[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.CvdtableofcontentList.filter((data: Cvdtableofcontent) =>
         data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

   getAllCvdtableofcontent() {
      this.objCvdtableofcontentService.getAllCvdtableofcontent().subscribe({
         next: data => {
            this.CvdtableofcontentList = data;
            this.CvdtableofcontentList.forEach(r=>r.CvdcourseName = this.getCvdcourseNameFromId(r.FCvdcourseId));
            this.filteredCvdtableofcontents = this.CvdtableofcontentList;
         },
         error: err => this.errorMessage = err
      });
   }
}

