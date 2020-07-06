import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appconstants } from '../common/appconstants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }
  isUserLoggedin: boolean;
  LoggedinUserName: string;

  ngOnInit() {
    this.isUserLoggedin= appconstants.gblisUserLoggedin;
    this.LoggedinUserName = appconstants.gblLoggedinUserName;
  }

}
