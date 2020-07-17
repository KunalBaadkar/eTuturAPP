
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdcoursestatu } from '../models/cvdcoursestatu';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdcoursestatuService {

  constructor(private http: HttpClient) { }

 getAllCvdcoursestatu(): Observable<Cvdcoursestatu[]> {
 return this.http.get<Cvdcoursestatu[]>(appconstants.url + "Cvdcoursestatuss")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdcoursestatu(id: number): Observable<Cvdcoursestatu> {
 if (id === 0) {
 return of(this.initializeCvdcoursestatu());
 }
 const url = appconstants.url + "Cvdcoursestatuss/" + id;
 return this.http.get<Cvdcoursestatu>(url)
 .pipe(
 tap(data => console.log('getCvdcoursestatu: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdcoursestatu(objCvdcoursestatu: Cvdcoursestatu): Observable<Cvdcoursestatu> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdcoursestatu>(appconstants.url + "Cvdcoursestatuss/", objCvdcoursestatu, { headers })
 .pipe(
 tap(data => console.log('createCvdcoursestatu: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdcoursestatu(objCvdcoursestatu: Cvdcoursestatu): Observable<Cvdcoursestatu> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdcoursestatuss/" + objCvdcoursestatu.id;
 return this.http.put<Cvdcoursestatu>(url, objCvdcoursestatu, { headers })
 .pipe(
 tap(() => console.log('updateCvdcoursestatu: ' + objCvdcoursestatu.id)),
 map(() => objCvdcoursestatu),
 catchError(this.handleError)
 );
 }

 deleteCvdcoursestatu(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdcoursestatuss/" + id;
 return this.http.delete<Cvdcoursestatu>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdcoursestatu: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdcoursestatu(): any {
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
