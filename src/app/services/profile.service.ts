import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private firestore: AngularFirestore) {}

  getProfile() {
    return this.firestore
      .collection('profile')
      .doc('main')
      .valueChanges();
  }

  updateProfile(profile: any) {
    return this.firestore
      .collection('profile')
      .doc('main')
      .set(profile, { merge: true });
  }
}