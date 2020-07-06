
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdcourse } from '../models/cvdcourse';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdcourseService {

  constructor(private http: HttpClient) { }

 getAllCvdcourse(): Observable<Cvdcourse[]> {
 return this.http.get<Cvdcourse[]>(appconstants.url + "Cvdcourses")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdcourse(id: number): Observable<Cvdcourse> {
 if (id === 0) {
 return of(this.initializeCvdcourse());
 }
 const url = appconstants.url + "Cvdcourses/" + id;
 return this.http.get<Cvdcourse>(url)
 .pipe(
 tap(data => console.log('getCvdcourse: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdcourse(objCvdcourse: Cvdcourse): Observable<Cvdcourse> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdcourse>(appconstants.url + "Cvdcourses/", objCvdcourse, { headers })
 .pipe(
 tap(data => console.log('createCvdcourse: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdcourse(objCvdcourse: Cvdcourse): Observable<Cvdcourse> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdcourses/" + objCvdcourse.id;
 return this.http.put<Cvdcourse>(url, objCvdcourse, { headers })
 .pipe(
 tap(() => console.log('updateCvdcourse: ' + objCvdcourse.id)),
 map(() => objCvdcourse),
 catchError(this.handleError)
 );
 }

 deleteCvdcourse(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdcourses/" + id;
 return this.http.delete<Cvdcourse>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdcourse: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdcourse(): any {
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
