import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetBodyServiceService {
  private selectedPetBodyUrlSubject = new BehaviorSubject<string>(null);

  private selectedPetHatUrlSubject = new BehaviorSubject<string>(null);

  selectedPetBodyUrl$: Observable<string | null> =
    this.selectedPetBodyUrlSubject.asObservable();

  selectedPetHatUrl$: Observable<string | null> =
    this.selectedPetHatUrlSubject.asObservable();

  constructor() {}

  setSelectedPetBodyUrl(url: string) {
    this.selectedPetBodyUrlSubject.next(url);
  }

  setSelectedPetHatUrl(url: string) {
    this.selectedPetHatUrlSubject.next(url);
  }

  getSelectedPetBodyUrl(): string {
    const firestorePetBodyUrl = this.selectedPetBodyUrlSubject.getValue();
    return (
      firestorePetBodyUrl || localStorage.getItem('selectedPetBodyUrl') || null
    );
  }

  getSelectedPetHatUrl(): string {
    const selectedPetHatUrl = this.selectedPetHatUrlSubject.getValue();
    return (
      selectedPetHatUrl || localStorage.getItem('selectedPetHatUrl') || null
    );
  }
}
