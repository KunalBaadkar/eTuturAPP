import { Cvduser } from '../models/cvduser';

export class appconstants {
    public static url: string = "https://etutorapi.eu-gb.mybluemix.net/api/";
    public static gblisUserLoggedin: boolean = false;
    public static gblLoggedinUserName: string;
    public static gblLoggedinUserId: number;
    public static gblLoggedinUserRole: number = 0;
  static gblobjCvduser: Cvduser;
    //public static gblobjCustomer: Cvduser;
}


