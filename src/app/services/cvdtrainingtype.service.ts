
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdtrainingtype } from '../models/cvdtrainingtype';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdtrainingtypeService {

  constructor(private http: HttpClient) { }

 getAllCvdtrainingtype(): Observable<Cvdtrainingtype[]> {
 return this.http.get<Cvdtrainingtype[]>(appconstants.url + "Cvdtrainingtypes")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdtrainingtype(id: number): Observable<Cvdtrainingtype> {
 if (id === 0) {
 return of(this.initializeCvdtrainingtype());
 }
 const url = appconstants.url + "Cvdtrainingtypes/" + id;
 return this.http.get<Cvdtrainingtype>(url)
 .pipe(
 tap(data => console.log('getCvdtrainingtype: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdtrainingtype(objCvdtrainingtype: Cvdtrainingtype): Observable<Cvdtrainingtype> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdtrainingtype>(appconstants.url + "Cvdtrainingtypes/", objCvdtrainingtype, { headers })
 .pipe(
 tap(data => console.log('createCvdtrainingtype: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdtrainingtype(objCvdtrainingtype: Cvdtrainingtype): Observable<Cvdtrainingtype> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdtrainingtypes/" + objCvdtrainingtype.id;
 return this.http.put<Cvdtrainingtype>(url, objCvdtrainingtype, { headers })
 .pipe(
 tap(() => console.log('updateCvdtrainingtype: ' + objCvdtrainingtype.id)),
 map(() => objCvdtrainingtype),
 catchError(this.handleError)
 );
 }

 deleteCvdtrainingtype(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdtrainingtypes/" + id;
 return this.http.delete<Cvdtrainingtype>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdtrainingtype: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdtrainingtype(): any {
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
