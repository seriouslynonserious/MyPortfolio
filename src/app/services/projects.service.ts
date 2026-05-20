import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private firestore: AngularFirestore) {}

  getProjects() {
    return this.firestore
      .collection('projects')
      .valueChanges({ idField: 'id' });
  }

  addProject(project: any) {
    return this.firestore
      .collection('projects')
      .add(project);
  }

  deleteProject(id: string) {
    return this.firestore
      .collection('projects')
      .doc(id)
      .delete();
  }
  updateProject(id: string, project: any) {
  return this.firestore
    .collection('projects')
    .doc(id)
    .update(project);
}
}