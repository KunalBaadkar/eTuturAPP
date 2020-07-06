
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdtableofcontent } from '../models/cvdtableofcontent';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdtableofcontentService {

  constructor(private http: HttpClient) { }

 getAllCvdtableofcontent(): Observable<Cvdtableofcontent[]> {
 return this.http.get<Cvdtableofcontent[]>(appconstants.url + "Cvdtableofcontents")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdtableofcontent(id: number): Observable<Cvdtableofcontent> {
 if (id === 0) {
 return of(this.initializeCvdtableofcontent());
 }
 const url = appconstants.url + "Cvdtableofcontents/" + id;
 return this.http.get<Cvdtableofcontent>(url)
 .pipe(
 tap(data => console.log('getCvdtableofcontent: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdtableofcontent(objCvdtableofcontent: Cvdtableofcontent): Observable<Cvdtableofcontent> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdtableofcontent>(appconstants.url + "Cvdtableofcontents/", objCvdtableofcontent, { headers })
 .pipe(
 tap(data => console.log('createCvdtableofcontent: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdtableofcontent(objCvdtableofcontent: Cvdtableofcontent): Observable<Cvdtableofcontent> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdtableofcontents/" + objCvdtableofcontent.id;
 return this.http.put<Cvdtableofcontent>(url, objCvdtableofcontent, { headers })
 .pipe(
 tap(() => console.log('updateCvdtableofcontent: ' + objCvdtableofcontent.id)),
 map(() => objCvdtableofcontent),
 catchError(this.handleError)
 );
 }

 deleteCvdtableofcontent(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdtableofcontents/" + id;
 return this.http.delete<Cvdtableofcontent>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdtableofcontent: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdtableofcontent(): any {
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
