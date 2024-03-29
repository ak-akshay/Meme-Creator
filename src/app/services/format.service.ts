import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private db:AngularFirestore, private storage:AngularFireStorage) { }

  getFormats() {
    return this.db.collection('formats',ref=>ref).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
  }

  getFormatDetails(formatName) {
    return this.db.collection('formats',ref=>ref.where('name', '==', formatName)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ); 
  }

  setImgUrl(path) {
    localStorage.setItem('path', path)
  }

  deleteFile(path) {
  this.storage.ref(path).delete()
  }
}
