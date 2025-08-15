import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCpoWaqs_i8moDuB17CZAaClMcplcYFOg",
  authDomain: "my-portfolio-1790f.firebaseapp.com",
  projectId: "my-portfolio-1790f",
  storageBucket: "my-portfolio-1790f.firebasestorage.app",
  messagingSenderId: "123138911075",
  appId: "1:123138911075:web:c5c70e2379a2bd7f190156",
  measurementId: "G-2140BY444C"
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public app: FirebaseApp;
  public analytics: Analytics;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
  }
}
