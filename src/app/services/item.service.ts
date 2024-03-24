import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Item } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  $item = this.firestoreDb
    .collection<Item>('item')
    .valueChanges({ idField: 'id' });

  itemToEdit: Item | null = null;

  private readonly PAGINATION_SETTINGS = 'paginationSettings';

  constructor(public firestoreDb: AngularFirestore) {}

  delete(itemId: Item) {
    const allow = window.confirm('Willst du wirklich dieses Item löschen?');

    if (allow) {
      this.firestoreDb.collection('item').doc(itemId.id).delete();
    }
  }

  addUser(item: Item) {
    this.firestoreDb.collection('item').add(item);
  }

  updateItem(item: Item) {
    this.firestoreDb.collection('item').doc(item.id).update(item);
  }

  deleteAll() {
    this.firestoreDb
      .collection('item')
      .get()
      .subscribe((res) => {
        if (res.empty) {
          return;
        }
        res.forEach((data) => {
          data.ref.delete();
        });
      });
  }

  saveSettings(settings: any) {
    localStorage.setItem(this.PAGINATION_SETTINGS, JSON.stringify(settings));
  }

  loadSettings() {
    const settings = localStorage.getItem(this.PAGINATION_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  }
}
