import { pluralize, _DISH_, _MENU_, _PRICE_, _DISH_FOR_MENU_, _DISH_MENU_ } from './WordsAndPrefixes';
import { fireDB } from './DBFirebase';

export const _S_DISH_ = fireDB.collection(pluralize(_DISH_));
export const _S_PRICE_ = (ref: FirebaseFirestore.DocumentReference): FirebaseFirestore.CollectionReference => ref.collection(pluralize(_PRICE_));
export const _S_MENU_ = fireDB.collection(pluralize(_MENU_));
export const _S_DISH_FOR_MENU_ = (ref: FirebaseFirestore.DocumentReference): FirebaseFirestore.CollectionReference => ref.collection(pluralize(_DISH_FOR_MENU_));
export const _S_DISH_MENU_ = (ref: FirebaseFirestore.DocumentReference): FirebaseFirestore.CollectionReference => ref.collection(pluralize(_DISH_MENU_));