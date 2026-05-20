import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(
    private firestore: AngularFirestore
  ) {}

  getSkills() {
    return this.firestore
      .collection('skills')
      .valueChanges({ idField: 'id' });
  }

  addSkill(skill: any) {
  return this.firestore
    .collection('skills')
    .add(skill);
}

  deleteSkill(id: string) {
    return this.firestore
      .collection('skills')
      .doc(id)
      .delete();
  }
  updateSkill(id: string, skill: any) {
  return this.firestore
    .collection('skills')
    .doc(id)
    .update(skill);
}
}