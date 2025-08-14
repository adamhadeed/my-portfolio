import { Component, Inject, PLATFORM_ID, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VideoComponent } from './video/video.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    AboutComponent,
    GalleryComponent,
    ProjectsComponent,
    VideoComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'my-portfolio-website-2';
  activeSection = 'home';
  isHomeRoute = true;
  isFullGalleryRoute = false; // Track if the current route is the full gallery

  private scrollListener: (() => void) | null = null;
  private navClickListener: (() => void) | null = null;
  private cursorEl: HTMLElement | null = null;
  private mouseMoveListener: ((e: MouseEvent) => void) | null = null;
  private animationFrameId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private cursorX = 0;
  private cursorY = 0;
  private vx = 0;
  private vy = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollListener = () => this.onScroll();
      window.addEventListener('scroll', this.scrollListener);
      window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
      });
    }

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.isHomeRoute = event.url === '/' || event.url === '' || event.url.startsWith('/#');
        this.isFullGalleryRoute = event.url.includes('full-gallery'); // Update route tracking
      });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait a moment to ensure DOM is ready
    setTimeout(() => {
      this.initializeCursor();
    }, 100);
  }
  
  private initializeCursor(): void {
    // Remove previous cursor if exists
    const oldCursor = this.document.querySelector('.pink-cursor');
    if (oldCursor && oldCursor.parentNode) {
      oldCursor.parentNode.removeChild(oldCursor);
    }

    // Use existing cursor element if possible, otherwise create a new one
    this.cursorEl = this.document.getElementById('pink-cursor');
    
    if (!this.cursorEl) {
      this.cursorEl = this.document.createElement('div');
      this.cursorEl.id = 'pink-cursor';
      this.cursorEl.className = 'pink-cursor';
      this.document.body.appendChild(this.cursorEl);
    }
    
    // Set cursor styles
    this.cursorEl.style.position = 'fixed';
    this.cursorEl.style.pointerEvents = 'none';
    this.cursorEl.style.width = '35px';
    this.cursorEl.style.height = '35px';
    this.cursorEl.style.borderRadius = '50%';
    this.cursorEl.style.background = '#ffffff'; // Set to white color for pure inversion
    this.cursorEl.style.mixBlendMode = 'difference'; // Creates inverse effect
    this.cursorEl.style.zIndex = '999999';
    this.cursorEl.style.transform = 'translate(-50%, -50%)';

    this.renderer.addClass(this.document.body, 'hide-cursor');

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    this.cursorEl.style.left = this.cursorX + 'px';
    this.cursorEl.style.top = this.cursorY + 'px';

    this.mouseMoveListener = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    this.document.addEventListener('mousemove', this.mouseMoveListener);

    this.animatePinkCursor();

    const navBar = this.document.querySelector('.nav-bar');
    if (navBar) {
      this.navClickListener = this.renderer.listen(navBar, 'click', (e: Event) => {
        let target = e.target as HTMLElement;
        while (target && target !== navBar && !target.classList.contains('nav-link')) {
          target = target.parentElement as HTMLElement;
        }
        if (target && target.classList.contains('nav-link')) {
          const href = target.getAttribute('href');
          if (href && href.startsWith('#')) {
            const section = this.document.getElementById(href.substring(1));
            if (section) {
              e.preventDefault();
              // Special handling for contact section - position hero image to fill viewport
              let offset = -80; // Default offset for navbar
              if (href.substring(1) === 'contact') {
                offset = 0; // No offset - position hero image to fill entire viewport
              }
              const y = section.getBoundingClientRect().top + window.scrollY + offset;
              this.customSmoothScrollTo(y, 900, 250, href.substring(1));
            }
          }
        }
      });
    }
  }

  private animatePinkCursor() {
    // Safety check to avoid errors
    if (!this.cursorEl || !isPlatformBrowser(this.platformId)) {
      // Don't continue animation if element is missing or not in browser
      return;
    }

    try {
      const magneticStrength = 0.5; // Reduced strength for smoother movement
      const spring = 1.0;           // Slightly reduced spring
      const friction = 0.1;        // Slightly increased friction for stability
      
      // Calculate distance between mouse and cursor
      const dx = this.mouseX - this.cursorX;
      const dy = this.mouseY - this.cursorY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If cursor is close enough to mouse position, snap to it
      if (distance < 5) {
        this.cursorX = this.mouseX;
        this.cursorY = this.mouseY;
        this.vx = 0;
        this.vy = 0;
      } else {
        // Apply physics for smooth following
        const ax = dx * magneticStrength;
        const ay = dy * magneticStrength;
        
        this.vx += ax + (dx * spring);
        this.vy += ay + (dy * spring);
        
        // Apply friction to prevent oscillation
        this.vx *= friction;
        this.vy *= friction;
        
        // Limit maximum velocity to prevent erratic movement
        const maxVelocity = 20;
        const currentVelocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity;
          this.vx *= scale;
          this.vy *= scale;
        }
        
        // Update cursor position
        this.cursorX += this.vx;
        this.cursorY += this.vy;
      }

      // Keep cursor within viewport bounds
      this.cursorX = Math.max(0, Math.min(window.innerWidth, this.cursorX));
      this.cursorY = Math.max(0, Math.min(window.innerHeight, this.cursorY));

      // Apply position to the cursor element
      if (this.cursorEl) {
        this.cursorEl.style.left = `${this.cursorX}px`;
        this.cursorEl.style.top = `${this.cursorY}px`;
      }
    } catch (err) {
      console.error('Error in cursor animation:', err);
    }

    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(() => this.animatePinkCursor());
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
        this.scrollListener = null;
      }
      if (this.navClickListener) {
        this.navClickListener();
        this.navClickListener = null;
      }
      if (this.mouseMoveListener) {
        this.document.removeEventListener('mousemove', this.mouseMoveListener);
        this.mouseMoveListener = null;
      }
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.renderer.removeClass(this.document.body, 'hide-cursor');
      // Remove cursor element on destroy
      if (this.cursorEl && this.cursorEl.parentNode) {
        this.cursorEl.parentNode.removeChild(this.cursorEl);
        this.cursorEl = null;
      }
    }
  }

  onScroll() {
    const sections = ['home', 'video', 'about', 'gallery', 'projects', 'contact'];
    let current = 'home';
    for (const id of sections) {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 80) {
        current = id;
      }
    }
  this.activeSection = current;
}

// Restore custom velocity ramp smooth scroll
customSmoothScrollTo(targetY: number, duration = 900, pause = 250, sectionId?: string) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let start: number | undefined;
    const step = (timestamp: number) => {
      try {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        if (elapsed < pause) {
          window.requestAnimationFrame(step);
          return;
        }
        const effectiveElapsed = Math.max(0, elapsed - pause);
        const progress = Math.min(effectiveElapsed / duration, 1);
        const eased = this.easeInOutCubic(progress);
        window.scrollTo(0, startY + diff * eased);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else if (sectionId) {
          this.activeSection = sectionId;
        }
      } catch (err) {
        console.error('Smooth scroll error:', err);
      }
    };
    window.requestAnimationFrame(step);
  }

  easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
