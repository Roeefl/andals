import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// const NEW_USER = 'NEW_USER';

const firebaseConfig = {
  apiKey: "AIzaSyBFbhnThQ5Ay7I7DwQ4S_7RuV2a24yXqPw",
  authDomain: "andals-client.firebaseapp.com",
  databaseURL: "https://andals-client.firebaseio.com",
  projectId: "andals-client",
  storageBucket: "andals-client.appspot.com",
  messagingSenderId: "434543683133",
  appId: "1:434543683133:web:235e6b770954fea9f1ec54",
  measurementId: "G-JE415CWZKY"
};

class FirebaseService {
  constructor() {
    this._ = {
      app: {},
      isInitialized: false
    };
  }

  get db() {
    return firebase.database();
  }

  get auth() {
    return firebase.auth();
  }

  async init(onAuthStateChanged) {
    console.log(this._);
    if (this._.isInitialized) return;
    
    this._.app = firebase.initializeApp(firebaseConfig);
    this._.isInitialized = true;

    firebase.auth().onAuthStateChanged(
      async () => {
        const dbUserRef = await this.currentDbUser();
        onAuthStateChanged(dbUserRef);
      }
    );
  }

  async login() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    try {
      await this.auth.signInWithPopup(googleProvider);
      
      const currUser = this.auth.currentUser;
      const { email } = currUser;
      if (!email) return false;

      const dbUserRef = await this.currentDbUser();

      if (!dbUserRef)
        return this.addUser(currUser); 

      return dbUserRef;
    } catch (error) {
      console.error('Google Login Error.', error);
    }
  }

  async addUser(user) {
    const {
      uid,
      email = '',
      displayName = email,
      photoURL
    } = user;

    console.log("FirebaseService -> addUser -> uid", uid)

    try {
      await firebase.database().ref(`users/${uid}`).set({
        email,
        displayName,
        photoURL,
        nickname: 'John Doe',
        avatar: 1,
        color: '#2c3e50',
        isAdmin: false,
        games: 0,
        wins: 0,
        elo: 0,
        friends: [],
        isPremium: false
      });

      return this.currentDbUser();
    } catch (err) {
      console.error(err);
    }
  }

  async logout() {
    await this.auth.signOut();
    return this.auth.currentUser;
  }
  
  isUserSignedIn() {
    return !!this.auth.currentUser;
  }
  
  async currentDbUser() {
    if (!this._.isInitialized) return {};
    
    const currUser = firebase.auth().currentUser;
    if (!currUser) return {};

    const { email, uid } = currUser;

    const snapshot = await firebase.database()
      .ref(`/users/${uid}`)
      .once('value');

    const userData = snapshot.val();
    
    return {
      uid,
      ...userData
    };
  }

  async updateProfile(nickname, color, avatar) {
    const currUser = this.auth.currentUser;
    const { uid } = currUser;
    if (!uid) return false;

    try {
      const currentDbUser = await this.currentDbUser();

      await firebase.database().ref(`users/${uid}`).update({
        nickname: nickname || currentDbUser.nickname,
        color: color || currentDbUser.color,
        avatar: avatar || currentDbUser.avatar
      });

      return this.currentDbUser();
    } catch (err) {
      console.error(err);
    }
  }

  async addNote(note) {
    const currUser = this.auth.currentUser ;
    const { email } = currUser;
    if (!email) return false;

    try {
      const userRef = await this.db.collection('users').doc(email).get();
      const userData = userRef.data() ;
      const { notes = [] } = userData;

      const updatedNotes = [
        ...notes,
        note
      ];

      await this.db.collection('users').doc(email).update({
        notes: updatedNotes
      });

      await this._.refetchUser();

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  async removeNote(noteCreated) {
    const currUser = this.auth.currentUser ;
    const { email } = currUser;
    if (!email) return false;

    try {
      const userRef = await this.db.collection('users').doc(email).get();
      const userData = userRef.data() ;
      const { notes = [] } = userData;

      const updatedNotes = notes.filter(({ created }) => created !==noteCreated);
      
      await this.db.collection('users').doc(email).update({
        notes: updatedNotes
      });

      await this._.refetchUser();

      return true;
    } catch (err) {
      console.error(err);
    }
  }
}

export default new FirebaseService();
