
import { Component, OnInit } from '@angular/core';
import { CvduserService } from 'src/app/services/cvduser.service';
import { Cvduser } from 'src/app/models/cvduser';
import { appconstants } from 'src/app/common/appconstants';
import { Router } from '@angular/router';
import { CvdroleService } from 'src/app/services/cvdrole.service';
import { Cvdrole } from 'src/app/models/cvdrole';

@Component({
   selector: 'app-cvduser-list',
   templateUrl: './cvduser-list.component.html',
   styleUrls: ['./cvduser-list.component.css']
})
export class CvduserListComponent implements OnInit {
   isUserLoggedin: boolean;
   LoggedinUserName: string;
   constructor(private objCvdroleService: CvdroleService, private objCvduserService: CvduserService, private router: Router) { }
   ngOnInit() {appconstants.gblisUserLoggedin =true;
      if (!appconstants.gblisUserLoggedin) this.router.navigate(['/homes']); this.isUserLoggedin = appconstants.gblisUserLoggedin; this.LoggedinUserName = appconstants.gblLoggedinUserName;
      this.getAllCvdrole();
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
   pageTitle: string = "User List";
   _listFilter = '';
   get listFilter(): string {
      return this._listFilter;
   }
   set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCvdusers = this.listFilter ? this.performFilter(this.listFilter) : this.CvduserList;
   }

   filteredCvdusers: Cvduser[] = [];
   CvduserList: Cvduser[] = [];

   performFilter(filterBy: string): Cvduser[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.CvduserList.filter((data: Cvduser) =>
         data.Name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

   getAllCvduser() {
      this.objCvduserService.getAllCvduser().subscribe({
         next: data => {
            this.CvduserList = data;
            this.CvduserList.forEach(r=>r.CvdroleName = this.getCvdroleNameFromId(r.FCvdroleId));
            this.filteredCvdusers = this.CvduserList;
         },
         error: err => this.errorMessage = err
      });
   }
}

