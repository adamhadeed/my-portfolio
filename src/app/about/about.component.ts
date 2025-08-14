
import { Component, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Make MBTI flip card tappable on touch devices only
  onMbtiFlipCardTap(mbtiToggle: HTMLInputElement, event: Event) {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      mbtiToggle.checked = !mbtiToggle.checked;
      event.stopPropagation();
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const highlight = this.document.querySelector('.text-highlight') as HTMLElement;
    if (highlight) {
      highlight.style.backgroundSize = '0% 100%';
      highlight.style.transition = 'background-size 2.5s linear';
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            highlight.style.transition = 'background-size 1.0s linear';
            highlight.style.backgroundSize = '100% 100%'; // highlight animates in
          } else {
            highlight.style.transition = 'background-size 0.1s linear';
            highlight.style.backgroundSize = '0% 100%';   // highlight animates out (unhighlight)
          }
        });
      }, { threshold: 0.3 });
      observer.observe(highlight);
    }
  }
}
