import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private firestore: AngularFirestore) {}

  getResume() {
    return this.firestore
      .collection('settings')
      .doc('resume')
      .valueChanges();
  }

  saveResumeUrl(url: string) {
    return this.firestore
      .collection('settings')
      .doc('resume')
      .set({
        url: url,
        updatedAt: new Date()
      });
  }

  deleteResumeUrl() {
    return this.firestore
      .collection('settings')
      .doc('resume')
      .delete();
  }
}