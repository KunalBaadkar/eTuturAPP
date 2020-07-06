
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdstatu } from '../models/cvdstatu';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdstatuService {

  constructor(private http: HttpClient) { }

 getAllCvdstatu(): Observable<Cvdstatu[]> {
 return this.http.get<Cvdstatu[]>(appconstants.url + "Cvdstatus")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdstatu(id: number): Observable<Cvdstatu> {
 if (id === 0) {
 return of(this.initializeCvdstatu());
 }
 const url = appconstants.url + "Cvdstatus/" + id;
 return this.http.get<Cvdstatu>(url)
 .pipe(
 tap(data => console.log('getCvdstatu: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdstatu(objCvdstatu: Cvdstatu): Observable<Cvdstatu> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdstatu>(appconstants.url + "Cvdstatus/", objCvdstatu, { headers })
 .pipe(
 tap(data => console.log('createCvdstatu: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdstatu(objCvdstatu: Cvdstatu): Observable<Cvdstatu> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdstatus/" + objCvdstatu.id;
 return this.http.put<Cvdstatu>(url, objCvdstatu, { headers })
 .pipe(
 tap(() => console.log('updateCvdstatu: ' + objCvdstatu.id)),
 map(() => objCvdstatu),
 catchError(this.handleError)
 );
 }

 deleteCvdstatu(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdstatus/" + id;
 return this.http.delete<Cvdstatu>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdstatu: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdstatu(): any {
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
