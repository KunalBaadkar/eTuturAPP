
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdfaq } from '../models/cvdfaq';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdfaqService {

  constructor(private http: HttpClient) { }

 getAllCvdfaq(): Observable<Cvdfaq[]> {
 return this.http.get<Cvdfaq[]>(appconstants.url + "Cvdfaqs")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdfaq(id: number): Observable<Cvdfaq> {
 if (id === 0) {
 return of(this.initializeCvdfaq());
 }
 const url = appconstants.url + "Cvdfaqs/" + id;
 return this.http.get<Cvdfaq>(url)
 .pipe(
 tap(data => console.log('getCvdfaq: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdfaq(objCvdfaq: Cvdfaq): Observable<Cvdfaq> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdfaq>(appconstants.url + "Cvdfaqs/", objCvdfaq, { headers })
 .pipe(
 tap(data => console.log('createCvdfaq: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdfaq(objCvdfaq: Cvdfaq): Observable<Cvdfaq> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdfaqs/" + objCvdfaq.id;
 return this.http.put<Cvdfaq>(url, objCvdfaq, { headers })
 .pipe(
 tap(() => console.log('updateCvdfaq: ' + objCvdfaq.id)),
 map(() => objCvdfaq),
 catchError(this.handleError)
 );
 }

 deleteCvdfaq(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdfaqs/" + id;
 return this.http.delete<Cvdfaq>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdfaq: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdfaq(): any {
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
