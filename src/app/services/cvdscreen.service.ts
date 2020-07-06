
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Cvdscreen } from '../models/cvdscreen';
import { appconstants } from '../common/appconstants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CvdscreenService {

  constructor(private http: HttpClient) { }

 getAllCvdscreen(): Observable<Cvdscreen[]> {
 return this.http.get<Cvdscreen[]>(appconstants.url + "Cvdscreens")
 .pipe(
 tap(data => console.log(JSON.stringify(data))),
 catchError(this.handleError)
 );
 }
 
 getCvdscreen(id: number): Observable<Cvdscreen> {
 if (id === 0) {
 return of(this.initializeCvdscreen());
 }
 const url = appconstants.url + "Cvdscreens/" + id;
 return this.http.get<Cvdscreen>(url)
 .pipe(
 tap(data => console.log('getCvdscreen: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 createCvdscreen(objCvdscreen: Cvdscreen): Observable<Cvdscreen> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post<Cvdscreen>(appconstants.url + "Cvdscreens/", objCvdscreen, { headers })
 .pipe(
 tap(data => console.log('createCvdscreen: ' + JSON.stringify(data))),
 catchError(this.handleError)
 );
 }

 updateCvdscreen(objCvdscreen: Cvdscreen): Observable<Cvdscreen> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdscreens/" + objCvdscreen.id;
 return this.http.put<Cvdscreen>(url, objCvdscreen, { headers })
 .pipe(
 tap(() => console.log('updateCvdscreen: ' + objCvdscreen.id)),
 map(() => objCvdscreen),
 catchError(this.handleError)
 );
 }

 deleteCvdscreen(id: number): Observable<{}> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 const url = appconstants.url + "Cvdscreens/" + id;
 return this.http.delete<Cvdscreen>(url, { headers })
 .pipe(
 tap(data => console.log('deleteCvdscreen: ' + id)),
 catchError(this.handleError)
 );
 }

 initializeCvdscreen(): any {
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
