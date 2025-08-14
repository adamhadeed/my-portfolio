import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private scrollHandler = this.handleScroll.bind(this);
  private scatterLetters: HTMLElement[] = [];
  private homeSection: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0); // Always reset scroll to top on load
      this.scatterLetters = Array.from(this.el.nativeElement.querySelectorAll('.scatter-letter'));
      this.homeSection = this.el.nativeElement.closest('section') || document.getElementById('home');
      window.addEventListener('scroll', this.scrollHandler);
      this.handleScroll(); // Initial state
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  handleScroll() {
    if (typeof window === 'undefined' || !this.homeSection) return;
    const rect = this.homeSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Progress: 0 at top, 1 at bottom of Home section
    const total = rect.height - windowHeight * 0.3;
    // Clamp scrollY to 0 if near top to avoid mobile browser quirks
    const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    let progress = 1 - Math.max(0, Math.min(1, (rect.bottom - windowHeight * 0.3) / total));
    if (scrollY <= 2) progress = 0; // Force 0 progression if at top
    progress = Math.max(0, Math.min(1, progress));
    // Fade out at the end
    const fadeStart = 0.7;
    const fadeEnd = 1.0;
    let fadeOpacity = 1;
    if (progress >= fadeStart) {
      fadeOpacity = 1 - (progress - fadeStart) / (fadeEnd - fadeStart);
      fadeOpacity = Math.max(0, Math.min(1, fadeOpacity));
    }
    this.scatterLetters.forEach((el, i) => {
      // Deterministic scatter for each letter
      const angle = (i * 137.5) % 360; // Golden angle for nice spread
      const rad = angle * Math.PI / 180;
      const maxDist = 400; // px, more hardcore scatter
      const tx = Math.cos(rad) * maxDist * progress;
      const ty = Math.sin(rad) * maxDist * progress;
      const rot = angle * 1.2 * progress; // more rotation
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      el.style.opacity = `${fadeOpacity}`;
    });
  }
}
