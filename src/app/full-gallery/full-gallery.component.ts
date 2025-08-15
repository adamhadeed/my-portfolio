// (imports and class definition follow)
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface GalleryItem {
  type: 'image' | 'video' | 'pdf';
  imageUrl?: string;
  webpUrl?: string;
  webpUrlMobile?: string; // mobile-optimized WebP image
  videoUrl?: string;
  posterUrl?: string; // for video thumbnails
  title: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-full-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './full-gallery.component.html',
  styleUrl: './full-gallery.component.css'
})
export class FullGalleryComponent implements OnInit, OnDestroy, AfterViewInit {
  animationTimeouts: any[] = [];
  currentModalItem: GalleryItem | null = null;
  currentModalIndex: number = 0;
  modalActive: boolean = false;
  transitioning: boolean = false; // Prevent rapid navigation
  private keydownListener: any = null; // Track listener for cleanup
  @ViewChild('masonryContainer', { static: false }) masonryContainer!: ElementRef;
  
  galleryItems: GalleryItem[] = [
    {
      type: 'image',
      imageUrl: 'assets/1.png',
      webpUrl: 'assets/1.webp',
      webpUrlMobile: 'assets/1-mobile.webp',
      title: 'TEDxUTM2025 Merchandise Photoshoot',
      category: 'Photography',
      description: 'A fun shoot I did for TEDxUTM tee which played with angle and perspective. It focused on the personality behind it. '
    },
    {
      type: 'image',
      imageUrl: 'assets/2.png',
      webpUrl: 'assets/2.webp',
      webpUrlMobile: 'assets/2-mobile.webp',
      title: 'TEDxUTM2025 Merchandise Photoshoot',
      category: 'Photography',
      description: 'Shot the TEDxUTM tee against a mosaic staircase as I loved how the colors and textures played with the silhouette. Felt like the stairs align with geometrical theme that I wanted to express alongside with the ruler design.'
    },
    {
      type: 'image',
      imageUrl: 'assets/3.png',
      webpUrl: 'assets/3.webp',
      webpUrlMobile: 'assets/3-mobile.webp',
      title: 'TEDxUTM2025 Main Poster',
      category: 'Photography',
      description: 'A clear UTM sky with a friend in frame. Used as the main poster for TEDxUTM2025. It captures the vibrant essence of the event.'
    },
    {
      type: 'video',
      videoUrl: 'assets/4.MOV',
      posterUrl: 'assets/4_thumbnail.webp',
      title: 'TEDxUTM2025 Theme Reveal',
      category: 'Graphic Design',
      description: 'A stop motion animation exploring the theme, frame by frame.'
    },
    {
      type: 'image',
      imageUrl: 'assets/5.png',
      webpUrl: 'assets/5.webp',
      webpUrlMobile: 'assets/5-mobile.webp',
      title: 'Talking-Ish 4.0 Poster',
      category: 'Graphic Design',
      description: 'Poster that is created entirely through manual design processes (without AI) to ensure authentic visual storytelling and a genuine connection with the community.'
    },
    {
      type: 'image',
      imageUrl: 'assets/6.JPG',
      webpUrl: 'assets/6.webp',
      webpUrlMobile: 'assets/6-mobile.webp',
      title: 'TEDxUTM2025 Merchandise Design',
      category: 'Graphic Design',
      description: 'A distinctive tee design to make the branding stand out more, focusing on trend and wearability.'
    },
    {
      type: 'image',
      imageUrl: 'assets/7.png',
      webpUrl: 'assets/7.webp',
      webpUrlMobile: 'assets/7-mobile.webp',
      title: 'TEDxUTM2025 Merchandise Design',
      category: 'Graphic Design',
      description: 'A distinctive tee design to make the branding stand out more, focusing on trend and wearability.'
    },
    {
      type: 'image',
      imageUrl: 'assets/8.png',
      webpUrl: 'assets/8.webp',
      webpUrlMobile: 'assets/8-mobile.webp',
      title: 'Merchandise Marketing',
      category: 'Marketing Campaign',
      description: 'Strategized and executed targeted marketing campaigns to effectively promote TEDxUTM2025 merchandise.'
    },
    {
      type: 'video',
      videoUrl: 'assets/9.MOV',
      posterUrl: 'assets/9_thumbnail.webp',
      title: 'TEDxUTM2025 Term Wrap-up Video',
      category: 'Videography',
      description: 'Directed a closing video featuring two actors that capture authentic emotions to reflect the core message and lasting impact of TEDxUTM2025.'
    },
    {
      type: 'image',
      imageUrl: 'assets/10.jpg',
      webpUrl: 'assets/10.webp',
      webpUrlMobile: 'assets/10-mobile.webp',
      title: 'Department Photoshoot',
      category: 'Photography',
      description: 'Executed a unique “back to school” themed photoshoot for each department. Got creative with diy lighting and backdrops setup to highlight the distinct character and energy of every team.'
    },
     {
      type: 'video',
      videoUrl: 'assets/11.MOV',
      posterUrl: 'assets/11_thumbnail.webp',
      title: 'Merchandise Teaser',
      category: 'Videography',
      description: 'A fast-paced teaser video tailored for social media and marketing, using quick cuts to build excitement and anticipation around the TEDxUTM2025 merchandise launch.'
    },
    {
      type: 'image',
      imageUrl: 'assets/12.png',
      webpUrl: 'assets/12.webp',
      webpUrlMobile: 'assets/12-mobile.webp',
      title: 'Performance Announcement',
      category: 'Graphic Design',
      description: 'Designed an eye-catching graphic to announce upcoming performances, combining clear information with engaging visuals to capture audience interest and boost event attendance.'
    },
    {
      type: 'image',
      imageUrl: 'assets/13.png',
      webpUrl: 'assets/13.webp',
      webpUrlMobile: 'assets/13-mobile.webp',
      title: 'Totebag Sale Poster',
      category: 'Graphic Design',
      description: 'A vibrant poster showcasing the versatility of the tote bag, using playful visuals to highlight everything you can fit inside'
    },
     {
      type: 'video',
      videoUrl: 'assets/14.mp4',
      posterUrl: 'assets/14_thumbnail.webp',
      title: 'Merchandise Reveal',
      category: 'Marketing Campaign',
      description: 'Marketing campaign unveiling merchandise and combining strategic messaging and engaging visuals to build community buzz.'
    },
    {
      type: 'image',
      imageUrl: 'assets/15.png',
      webpUrl: 'assets/15.webp',
      webpUrlMobile: 'assets/15-mobile.webp',
      title: 'Merch Sales',
      category: 'Graphic Design',
      description: 'Clear and engaging sales visuals featuring custom illustrations to highlight pricing and discounts, making it easy for the audience to understand and act on merchandise offers.'
    },
    {
      type: 'image',
      imageUrl: 'assets/16.png',
      webpUrl: 'assets/16.webp',
      webpUrlMobile: 'assets/16-mobile.webp',
      title: 'Event Countdown',
      category: 'Graphic Design',
      description: 'Compelling countdown poster that builds anticipation and keeps the audience engaged as the event day approaches.'
    },
    {
      type: 'image',
      imageUrl: 'assets/17.png',
      webpUrl: 'assets/17.webp',
      webpUrlMobile: 'assets/17-mobile.webp',
      title: 'Performance Announcement',
      category: 'Graphic Design',
      description: 'Designed an eye-catching graphic to announce upcoming performances, combining clear information with engaging visuals to capture audience interest and boost event attendance.'
    },
    {
      type: 'image',
      imageUrl: 'assets/18.pdf',
      webpUrl: 'assets/18.pdf',
      webpUrlMobile: 'assets/18-mobile.pdf',
      title: 'TEDxUTM2025 Booklet',
      category: 'Graphic Design',
      description: 'Designed the TEDxUTM booklet to guide attendees through the event with clear layouts to create an informative and memorable keepsake.'
    },
    {
      type: 'image',
      imageUrl: 'assets/19.png',
      webpUrl: 'assets/19.webp',
      webpUrlMobile: 'assets/19-mobile.webp',
      title: 'Logo Reveal',
      category: 'Graphic Design',
      description: 'Logo reveal that captures the brand\'s essence to enhance recognition and set a tone for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/20.png',
      webpUrl: 'assets/20.webp',
      webpUrlMobile: 'assets/20-mobile.webp',
      title: 'Team Recruitment Poster',
      category: 'Graphic Design',
      description: 'Recruitment campaign designed to attract passionate individuals using clear messaging.'
    },
    {
      type: 'image',
      imageUrl: 'assets/21.png',
      webpUrl: 'assets/21.webp',
      webpUrlMobile: 'assets/21-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/22.png',
      webpUrl: 'assets/22.webp',
      webpUrlMobile: 'assets/22-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/23.png',
      webpUrl: 'assets/23.webp',
      webpUrlMobile: 'assets/23-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/24.png',
      webpUrl: 'assets/24.webp',
      webpUrlMobile: 'assets/24-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/25.png',
      webpUrl: 'assets/25.webp',
      webpUrlMobile: 'assets/25-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/26.png',
      webpUrl: 'assets/26.webp',
      webpUrlMobile: 'assets/26-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/27.png',
      webpUrl: 'assets/27.webp',
      webpUrlMobile: 'assets/27-mobile.webp',
      title: 'TEDxUTM2025 Speaker Announcement',
      category: 'Graphic Design',
      description: 'Engaging graphic series to introduce the TEDxUTM2025 speakers that highlight their unique stories and expertise to build excitement for the event.'
    },
    {
      type: 'image',
      imageUrl: 'assets/28.png',
      webpUrl: 'assets/28.webp',
      webpUrlMobile: 'assets/28-mobile.webp',
      title: 'Event Registration',
      category: 'Graphic Design',
      description: 'A poster with balanced creativity with clarity, providing attendees an inviting way to join while reflecting the event\'s artistic identity.'
    },
    {
      type: 'image',
      imageUrl: 'assets/29.png',
      webpUrl: 'assets/29.webp',
      webpUrlMobile: 'assets/29-mobile.webp',
      title: 'TEDxUTM2025 Certificate',
      category: 'Graphic Design',
      description: 'An elegant and professional certificate design to recognize and celebrate the contributions of TEDxUTM participants.'
    },
    {
      type: 'image',
      imageUrl: 'assets/30.png',
      webpUrl: 'assets/30.webp',
      webpUrlMobile: 'assets/30-mobile.webp',
      title: 'TEDxUTM2025 Ticket',
      category: 'Graphic Design',
      description: 'Designed a physical TEDxUTM2025 ticket incorporating an interactive \'reflection\' feature to give a memorable and functional keepsake for attendees.'
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  // Returns true if the current modal image is portrait (height > width)
  get isPortraitModalImage(): boolean {
    if (!this.currentModalItem || this.currentModalItem.type !== 'image') return false;
    // Try to find the <img> element in the modal
    const imgEl = document.querySelector('.modal-content img') as HTMLImageElement | null;
    if (imgEl && imgEl.naturalWidth && imgEl.naturalHeight) {
      return imgEl.naturalHeight > imgEl.naturalWidth;
    }
    return false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Scroll to top immediately when entering gallery
      window.scrollTo(0, 0);
      
      // Add fade-in animation when entering the gallery
      setTimeout(() => {
        const galleryElement = document.querySelector('.full-gallery-container');
        if (galleryElement) {
          galleryElement.classList.add('fade-in');
        }
      }, 50);

      // Add scroll listener for animations
      setTimeout(() => {
        this.initializeAnimations();
      }, 100);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.setupMasonryLayout();
      }, 200);
    }
  }

  ngOnDestroy(): void {
    // Clear any pending timeouts
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.animationTimeouts = [];
    // Remove keyboard event listener if modal is still open
    if (isPlatformBrowser(this.platformId)) {
      if (this.keydownListener) {
        document.removeEventListener('keydown', this.keydownListener);
        this.keydownListener = null;
      }
      document.body.style.overflow = 'auto'; // Restore scroll in case modal was open
    }
  }

  private setupMasonryLayout(): void {
    // Simple masonry layout using CSS columns initially
    // Could enhance with more sophisticated positioning later
  }

  private initializeAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.classList.add('animate-in');
    });
  }

  openModal(item: GalleryItem, index: number): void {
    this.currentModalItem = item;
    this.currentModalIndex = index;
    this.modalActive = true;
    this.transitioning = false;
    // Prevent body scroll when modal is open
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
      // Only add one keydown listener
      if (!this.keydownListener) {
        this.keydownListener = (event: KeyboardEvent) => this.handleKeyPress(event);
        document.addEventListener('keydown', this.keydownListener);
      }
    }
  }

  closeModal(): void {
    this.modalActive = false;
    this.currentModalItem = null;
    this.transitioning = false;
    // Restore body scroll
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
      // Remove keyboard navigation
      if (this.keydownListener) {
        document.removeEventListener('keydown', this.keydownListener);
        this.keydownListener = null;
      }
    }
  }

  private handleKeyPress = (event: KeyboardEvent): void => {
    if (!this.modalActive) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeModal();
        break;
    }
  }

  previousImage(): void {
    if (this.transitioning) return;
    if (this.currentModalIndex > 0) {
      this.smoothImageTransition(() => {
        this.currentModalIndex--;
        this.currentModalItem = this.galleryItems[this.currentModalIndex];
      });
    }
  }

  nextImage(): void {
    if (this.transitioning) return;
    if (this.currentModalIndex < this.galleryItems.length - 1) {
      this.smoothImageTransition(() => {
        this.currentModalIndex++;
        this.currentModalItem = this.galleryItems[this.currentModalIndex];
      });
    }
  }

  private smoothImageTransition(changeImageCallback: () => void): void {
    if (!isPlatformBrowser(this.platformId)) {
      changeImageCallback();
      return;
    }
    if (this.transitioning) return;
    this.transitioning = true;
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      // Add transition class for fade out
      modalContent.classList.add('changing');
      // Wait for fade out, then change image
      const fadeOutTimeout = setTimeout(() => {
        changeImageCallback();
        // Remove transition class for fade in
        const fadeInTimeout = setTimeout(() => {
          modalContent.classList.remove('changing');
          this.transitioning = false;
        }, 50);
        this.animationTimeouts.push(fadeInTimeout);
      }, 200); // 200ms for fade out
      this.animationTimeouts.push(fadeOutTimeout);
    } else {
      changeImageCallback();
      this.transitioning = false;
    }
  }

  goBack(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Add fade out animation to the gallery page
      const galleryElement = document.querySelector('.full-gallery-container');
      if (galleryElement) {
        galleryElement.classList.add('fade-out');
      }

      // Navigate back to home after a short delay to show the fade animation
      setTimeout(() => {
        this.router.navigate(['/']).then(() => {
          // After navigation, scroll to gallery section with smooth animation
          setTimeout(() => {
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
              // Custom smooth scroll with easing
              this.smoothScrollToGallery(gallerySection);
            }
          }, 200); // Increased delay to ensure DOM is ready
        });
      }, 300); // 300ms for fade out animation
    } else {
      // Fallback for server-side rendering
      this.router.navigate(['/']);
    }
  }

  private smoothScrollToGallery(gallerySection: HTMLElement): void {
    const targetY = gallerySection.getBoundingClientRect().top + window.scrollY - 80; // Account for nav bar
    const startY = window.scrollY;
    const diff = targetY - startY;
    const duration = 800; // 800ms smooth scroll
    let start: number;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + diff * eased);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
