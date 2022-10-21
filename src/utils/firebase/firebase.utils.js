import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyAE37Vc6uxyuEemqI5oSI3dZLwZB8rb-l0",
  authDomain: "crwn-clothing-66199.firebaseapp.com",
  projectId: "crwn-clothing-66199",
  storageBucket: "crwn-clothing-66199.appspot.com",
  messagingSenderId: "223869747839",
  appId: "1:223869747839:web:427b2f2ce50663856e354a"
};

firebase.initializeApp(config);

const googleProvider = new firebase.auth.GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export const auth = firebase.auth();
export const signInWithGooglePopup = () => auth.signInWithPopup(googleProvider);
export const signInWithGoogleRedirect = () => auth.signInWithRedirect(googleProvider);
export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);
  
  objectsToAdd.forEach((object) => {
     const docRef = doc(collectionRef, object.title.toLowerCase());
     batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnapshot => docSnapshot.data());
};

export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
  ) => {
    if (!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      
      try {
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          ...additionalInformation
        })
      }
      catch (error) {
        console.log('error creating user', error);
      }
    }

    return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await auth.createUserWithEmailAndPassword(email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await auth.signInWithEmailAndPassword(email, password);
};

export const signOutUser = async () => await auth.signOut();

export const onAuthStateChangedListener = (callback) => auth.onAuthStateChanged(callback);