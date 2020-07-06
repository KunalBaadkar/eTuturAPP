
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdoption } from '../models/cvdoption';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdoptionService {

  constructor(private http: HttpClient) { }

 getAllCvdoption(): Observable<Cvdoption[]> {
 return this.http.get<Cvdoption[]>(appconstants.url + "Cvdoptions")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdoption(id: number): Observable<Cvdoption> {
 if (id === 0) {
 return of(this.initializeCvdoption());
 }
 const url = appconstants.url + "Cvdoptions/" + id;
 return this.http.get<Cvdoption>(url)
 .pipe(
 tap(data => console.log('getCvdoption: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdoption(objCvdoption: Cvdoption): Observable<Cvdoption> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdoption>(appconstants.url + "Cvdoptions/", objCvdoption, { headers })
 .pipe(
 tap(data => console.log('createCvdoption: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdoption(objCvdoption: Cvdoption): Observable<Cvdoption> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdoptions/" + objCvdoption.id;
 return this.http.put<Cvdoption>(url, objCvdoption, { headers })
 .pipe(
 tap(() => console.log('updateCvdoption: ' + objCvdoption.id)),
 map(() => objCvdoption),
 catchError(this.handleError)
 );
 }

 deleteCvdoption(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdoptions/" + id;
 return this.http.delete<Cvdoption>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdoption: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdoption(): any {
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
