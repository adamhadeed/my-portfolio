import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, AfterViewInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  ngOnInit() {}

  ngAfterViewInit() {
    // Ensure video is muted programmatically
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.muted = true;
      video.volume = 0;
      
      // Additional safety check
      video.addEventListener('loadstart', () => {
        video.muted = true;
        video.volume = 0;
      });
      
      video.addEventListener('canplay', () => {
        video.muted = true;
        video.volume = 0;
      });
    }
  }
}
