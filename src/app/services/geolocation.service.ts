import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            observer.next(position);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      } else {
        observer.error(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}