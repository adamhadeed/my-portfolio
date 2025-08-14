import { Routes } from '@angular/router';
import { FullGalleryComponent } from './full-gallery/full-gallery.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: 'full-gallery', component: FullGalleryComponent },
  { path: 'contact', component: ContactComponent },
  // Let the empty path ('') be handled by the app component's isHomeRoute logic
];
