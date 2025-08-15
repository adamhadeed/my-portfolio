// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  imports: [CommonModule]
})
export class ProjectsComponent {
  projects = [
    {
      image: 'assets/Project1.JPG',
      imageMobile: 'assets/Project1-mobile.webp',
      title: 'ECHORUSH: GAME FOR THE VISUALLY IMPAIRED',
      date: 'Ongoing',
      description: 'An innovative audio-based game designed to provide an immersive and inclusive gaming experience for visually impaired players. Echorush aligns with SDG 10 (Reduced Inequalities) and SDG 3 (Good Health & Well-being), proving that games can be both fun and empowering for everyone.',
      link: 'assets/Project1.pdf'
    },
    {
      image: 'assets/Project2-mobile.webp',
      imageMobile: 'assets/Project2-mobile.webp',
      title: 'Executive Producer, TEDxUTM2025',
      date: '2024/2025',
      description: 'Led the production of TEDxUTM2025: "Axis: Dimensions of Change", managing marketing strategy, creative direction and coordination across multiple departments. Oversaw social media production and visual identity to ensure a powerful event branding.',
      link: 'assets/18.pdf'
    },
    {
      image: 'assets/Project2.5.JPG',
      imageMobile: 'assets/Project2.5-mobile.webp',
      title: 'Director, Putrajaya Festival of Ideas 2024',
      date: 'November 2024',
      description: 'Directed the Putrajaya Talk from start to finish attended by YBhg. Datuk Prof. Dr. Azlinda Azman, the Director General of Higher Education. It involved planning, coordination and on-site execution. I also managed multiple departments to ensure the program ran smoothly and the event atmosphere matched its vision. It was successful thanks to the team as we delivered an impactful experience for all attendees and speakers.'
    },
    {
      image: 'assets/Project3.webp',
      imageMobile: 'assets/Project3-mobile.webp',
      title: 'HELIO4.0: Mental Health Volunteering',
      date: 'August 2023',
      description: 'Helio4.0 is a one-month mental health volunteering journey under AIESEC JB that brings youth together to listen, support and educate various communities in Johor Bahru. I believe with empathy and understanding can only we truly grow.',
      link: 'assets/Project3.mp4'
    },
    {
      image: 'assets/Project4.JPG',
      imageMobile: 'assets/Project4-mobile.webp',
      title: '#1000GIRLS Campaign: World Vision Malaysia',
      date: 'September 2023',
      description: 'Contributed to a global movement amplifying the voices of girls whose dignity, rights and futures are at risk. Through visual storytelling and advocacy, I helped shed light on issues such as menstrual inequity, early and forced marriage and the barriers girls face in accessing education. The campaign aimed to inspire action, raise awareness and connect the public to the sufferings.',
      // link: '#'
    },
    {
      image: 'assets/Project5.webp',
      imageMobile: 'assets/Project5-mobile.webp',
      title: 'Marketing Head of Department: TEDxUTM2024',
      date: '2023/2024',
      description: 'Led the marketing team in developing and executing trending strategies to promote the brand, ensure strong audience engagement and event visibility. Responsible for campaign planning, content direction and brand consistency across all platforms while collaborating with other departments to promote ticket sales, partnerships and community outreach.',
      link: 'assets/project5.mp4'
    },
    {
      image: 'assets/Coming Soon-2.png',
      imageMobile: 'assets/Coming Soon-2-mobile.webp',
      title: 'TEDxUTM Official Website',
      date: 'Coming Soon',
      description: 'The first official website for TEDxUTM will be designed and developed to tackle ticketing problem by making it more intuitive instead of relying on Google Form. It will display event details, speaker profiles and ticketing information that serves as both an information hub and a promotional platform for the event.',
      // link: '#'
    },
    {
      image: 'assets/Coming Soon-3.png',
      imageMobile: 'assets/Coming Soon-3-mobile.webp',
      title: 'Restaurant Operations System',
      date: 'Coming Soon',
      description: 'A real custom-built system designed for a relative to streamline restaurant operations, including order management, billing and inventory tracking. The solution focuses on an intuitive interface for staff, faster service turnaround and automated reporting to support better business decisions.'
      // link: '#'
    }
  ];


  openCardIndex: number | null = null;

  // Minimal, robust handler: toggle card unless a link was clicked
  onProjectCardTap(index: number, event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      // Don't toggle if a link was clicked
      return;
    }
    // Toggle open/close
    this.openCardIndex = this.openCardIndex === index ? null : index;
    event.preventDefault();
  }
}
