import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetHatServiceService {
  private selectedPetHatUrlSubject = new BehaviorSubject<string>(null);

  selectedPetHatUrl$: Observable<string | null> =
    this.selectedPetHatUrlSubject.asObservable();

  constructor() {}

  setSelectedPetHatUrl(url: string) {
    this.selectedPetHatUrlSubject.next(url);
  }

  getSelectedPetHatUrl(): string {
    const selectedPetHatUrl = this.selectedPetHatUrlSubject.getValue();
    return (
      selectedPetHatUrl || localStorage.getItem('selectedPetHatUrl') || null
    );
  }
}
