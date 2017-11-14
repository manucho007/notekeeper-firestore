import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Item } from '../models/item';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class ItemService {
  //We placed theinterface in another document, so it can be called from eveywhere
itemsCollection : AngularFirestoreCollection<Item>;
items: Observable<Item[]>;
itemDoc:AngularFirestoreDocument<Item>;
  constructor(public afs: AngularFirestore) {
    //The refparameter allows to sort the data
    this.itemsCollection = this.afs.collection('items', ref=>ref.orderBy('title','asc'));
    // this.items this.itemsCollection.valueChanges();

    this.items = this.itemsCollection.snapshotChanges().map(changes =>{
      return changes.map(a=>{
        const data = a .payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      })
    });
   }

getItems(){
  return this.items;
}
addItem(item :Item){
  this.itemsCollection.add(item);
}
deleteItem(item: Item){
  this.itemDoc = this.afs.doc(`items/${item.id}`);
  this.itemDoc.delete();
};
updateItem(item:Item){
  this.itemDoc = this.afs.doc(`items/${item.id}`);
  this.itemDoc.update(item);
};
}
