
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdclasse } from '../models/cvdclasse';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdclasseService {

  constructor(private http: HttpClient) { }

 getAllCvdclasse(): Observable<Cvdclasse[]> {
 return this.http.get<Cvdclasse[]>(appconstants.url + "Cvdclasss")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdclasse(id: number): Observable<Cvdclasse> {
 if (id === 0) {
 return of(this.initializeCvdclasse());
 }
 const url = appconstants.url + "Cvdclasss/" + id;
 return this.http.get<Cvdclasse>(url)
 .pipe(
 tap(data => console.log('getCvdclasse: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdclasse(objCvdclasse: Cvdclasse): Observable<Cvdclasse> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdclasse>(appconstants.url + "Cvdclasss/", objCvdclasse, { headers })
 .pipe(
 tap(data => console.log('createCvdclasse: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdclasse(objCvdclasse: Cvdclasse): Observable<Cvdclasse> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdclasss/" + objCvdclasse.id;
 return this.http.put<Cvdclasse>(url, objCvdclasse, { headers })
 .pipe(
 tap(() => console.log('updateCvdclasse: ' + objCvdclasse.id)),
 map(() => objCvdclasse),
 catchError(this.handleError)
 );
 }

 deleteCvdclasse(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdclasss/" + id;
 return this.http.delete<Cvdclasse>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdclasse: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdclasse(): any {
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
