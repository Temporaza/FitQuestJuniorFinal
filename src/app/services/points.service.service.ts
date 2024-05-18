import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsServiceService {

  private pointsSubject = new BehaviorSubject<number>(0);
  points$ = this.pointsSubject.asObservable();

  updatePoints(newPoints: number) {
    this.pointsSubject.next(newPoints);
  }

  constructor() { }
}
