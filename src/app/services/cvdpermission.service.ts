
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdpermission } from '../models/cvdpermission';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdpermissionService {

  constructor(private http: HttpClient) { }

 getAllCvdpermission(): Observable<Cvdpermission[]> {
 return this.http.get<Cvdpermission[]>(appconstants.url + "Cvdpermissions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdpermission(id: number): Observable<Cvdpermission> {
 if (id === 0) {
 return of(this.initializeCvdpermission());
 }
 const url = appconstants.url + "Cvdpermissions/" + id;
 return this.http.get<Cvdpermission>(url)
 .pipe(
 tap(data => console.log('getCvdpermission: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdpermission(objCvdpermission: Cvdpermission): Observable<Cvdpermission> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdpermission>(appconstants.url + "Cvdpermissions/", objCvdpermission, { headers })
 .pipe(
 tap(data => console.log('createCvdpermission: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdpermission(objCvdpermission: Cvdpermission): Observable<Cvdpermission> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdpermissions/" + objCvdpermission.id;
 return this.http.put<Cvdpermission>(url, objCvdpermission, { headers })
 .pipe(
 tap(() => console.log('updateCvdpermission: ' + objCvdpermission.id)),
 map(() => objCvdpermission),
 catchError(this.handleError)
 );
 }

 deleteCvdpermission(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdpermissions/" + id;
 return this.http.delete<Cvdpermission>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdpermission: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdpermission(): any {
 return {
 id: 0,
 Name: null
 };
}

 private handleError(err) {
 let errorMessage: string;
 if (err.error instanceof ErrorEvent) {
 errorMessage = "An error occurred:" + err.error.message;
 } else {
 errorMessage = "Backend returned code " + err.status + ":" + err.body.error;
 }
 console.error(err);
 return throwError(errorMessage);
 }
}
