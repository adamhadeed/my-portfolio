import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnDestroy {
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      
      // Listen for route changes to reinitialize animations
      this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (event.url === '/') {
            // We're back on the home page, reinitialize after a delay
            setTimeout(() => {
              this.initializeGalleryAnimation();
            }, 500);
          }
        });

      // Initialize the gallery animation
      setTimeout(() => {
        this.initializeGalleryAnimation();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private cleanup(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Kill all existing tweens
      gsap.killTweensOf('.row-1');
      gsap.killTweensOf('.row-2');
      
      // Kill specific ScrollTrigger instance
      if (this.scrollTriggerInstance) {
        this.scrollTriggerInstance.kill(true);
        this.scrollTriggerInstance = null;
      }
      
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  }

  private initializeGalleryAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const gallerySection = document.querySelector('.gallery-section');
    const row1 = document.querySelector('.row-1');
    const row2 = document.querySelector('.row-2');
    
    if (!gallerySection || !row1 || !row2) {
      console.log('Gallery elements not found, retrying...');
      setTimeout(() => this.initializeGalleryAnimation(), 100);
      return;
    }

    // Clean up first
    this.cleanup();
    
    // Force refresh ScrollTrigger
    ScrollTrigger.refresh();
    
    const viewportWidth = window.innerWidth;
    const scrollDistance = viewportWidth * 2;

    // Reset and set initial positions
    gsap.set(row1, {
      x: 0
    });

    gsap.set(row2, {
      x: -viewportWidth * 1.0
    });

    console.log('Creating ScrollTrigger for gallery horizontal scroll...');

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: gallerySection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Row 1: Move left as user scrolls down
        gsap.set(row1, {
          x: 0 - (scrollDistance * progress)
        });
        
        // Row 2: Move right as user scrolls down  
        gsap.set(row2, {
          x: -viewportWidth * 4.0 + (scrollDistance * progress)
        });
      }
    });

    console.log('Gallery horizontal scroll ScrollTrigger created successfully');
  }

  navigateToFullGallery(): void {
    this.router.navigate(['/full-gallery']);
  }
}
