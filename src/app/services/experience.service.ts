import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private firestore: AngularFirestore) {}

  getCompanies() {
    return this.firestore
      .collection('experience')
      .valueChanges({ idField: 'id' });
  }

  addCompany(company: any) {
    return this.firestore
      .collection('experience')
      .add(company);
  }

  deleteCompany(companyId: string) {
    return this.firestore
      .collection('experience')
      .doc(companyId)
      .delete();
  }

  getProjects(companyId: string) {
    return this.firestore
      .collection(`experience/${companyId}/projects`)
      .valueChanges({ idField: 'id' });
  }

  addProject(companyId: string, project: any) {
    return this.firestore
      .collection(`experience/${companyId}/projects`)
      .add(project);
  }

  deleteProject(companyId: string, projectId: string) {
    return this.firestore
      .collection(`experience/${companyId}/projects`)
      .doc(projectId)
      .delete();
  }
  updateCompany(companyId: string, company: any) {
  return this.firestore
    .collection('experience')
    .doc(companyId)
    .update(company);
}

updateProject(companyId: string, projectId: string, project: any) {
  return this.firestore
    .collection(`experience/${companyId}/projects`)
    .doc(projectId)
    .update(project);
}
}