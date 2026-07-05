import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private resumePath = 'resume/shivam-resume.pdf';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getResume() {
    return this.firestore
      .collection('settings')
      .doc('resume')
      .valueChanges();
  }

  uploadResume(file: File) {
    const fileRef = this.storage.ref(this.resumePath);
    const task = this.storage.upload(this.resumePath, file);

    return new Promise((resolve, reject) => {
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              url => {
                this.firestore
                  .collection('settings')
                  .doc('resume')
                  .set({
                    url: url,
                    path: this.resumePath,
                    fileName: file.name,
                    updatedAt: new Date()
                  })
                  .then(resolve)
                  .catch(reject);
              },
              error => reject(error)
            );
          })
        )
        .subscribe();
    });
  }

  deleteResume() {
    const fileRef = this.storage.ref(this.resumePath);

    return fileRef.delete().toPromise()
      .then(() => {
        return this.firestore
          .collection('settings')
          .doc('resume')
          .delete();
      });
  }
}