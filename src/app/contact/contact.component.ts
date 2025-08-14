import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']

})
export class ContactComponent implements AfterViewInit, OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  slideIndex = 0;
  isHeroTextActive = false;
  private observer: IntersectionObserver | null = null;
  private touchStartX = 0;
  private touchEndX = 0;
  private sliderEl: HTMLElement | null = null;
  private keyListener = (e: KeyboardEvent) => this.handleKey(e);
  private touchStartListener = (e: TouchEvent) => this.handleTouchStart(e);
  private touchEndListener = (e: TouchEvent) => this.handleTouchEnd(e);

  goToNextSlide() {
    if (this.slideIndex < 1) this.slideIndex = 1;
  }

  goToPrevSlide() {
    if (this.slideIndex > 0) this.slideIndex = 0;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sliderEl = document.querySelector('.contact-slider');
      // Keyboard navigation
      window.addEventListener('keydown', this.keyListener);
      // Touch navigation
      if (this.sliderEl) {
        this.sliderEl.addEventListener('touchstart', this.touchStartListener, { passive: true });
        this.sliderEl.addEventListener('touchend', this.touchEndListener, { passive: true });
      }

      // IntersectionObserver for hero text animation
      const section = document.querySelector('.contact-section');
      if (section) {
        this.observer = new window.IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this.isHeroTextActive = false;
              // Force reflow to restart animation
              void (section as HTMLElement).offsetWidth;
              setTimeout(() => this.isHeroTextActive = true, 10);
            } else {
              this.isHeroTextActive = false;
            }
          },
          { threshold: 0.5 }
        );
        this.observer.observe(section);
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('keydown', this.keyListener);
      if (this.sliderEl) {
        this.sliderEl.removeEventListener('touchstart', this.touchStartListener);
        this.sliderEl.removeEventListener('touchend', this.touchEndListener);
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  private handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      this.goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      this.goToPrevSlide();
    }
  }

  private handleTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  private handleTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        this.goToNextSlide();
      } else {
        this.goToPrevSlide();
      }
    }
  }
}
