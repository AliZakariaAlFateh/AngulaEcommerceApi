import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingbasketService {

  // //to update the bin inside the navbar component ..........
  // private binSource = new BehaviorSubject<string>(''); // or any initial value
  // currentBin = this.binSource.asObservable();

  // constructor() { }

  // updateBin(bin: string) {
  //   this.binSource.next(bin);
  // }



  private binSource: BehaviorSubject<string>;
  public currentBin;

  constructor() {
    const bin = localStorage.getItem('bin') ?? '0'; // Load the value from local storage and default to '0' if not present
    this.binSource = new BehaviorSubject<string>(bin);
    this.currentBin = this.binSource.asObservable(); // Initialize the observable after setting binSource
  }

  updateBin(bin: string) {
    this.binSource.next(bin);
    localStorage.setItem('bin', bin); // Save the value to local storage
  }

  getBin() {
    return this.binSource.asObservable();
  }

  
}
