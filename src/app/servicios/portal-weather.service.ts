import { Injectable } from "@angular/core";
import { Subject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class PortalWeatherService {

  dataSubject = new Subject<any[]>();
  
  constructor(private http: HttpClient) {}

  getInfo(ciudad: string): Observable<any> {
    
    return this.http.get<any>(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a31105db43d64c458e842114200705&q=${ciudad}&format=json&num_of_days=5`)      
    .pipe(
        map(resData => {          
        return resData.data;
      })    
    ).pipe(
        catchError(err => {
            console.log('Traza de error...', err);
            return throwError(err);
        }));
  }

}