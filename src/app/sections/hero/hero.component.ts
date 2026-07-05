import { AfterViewInit, Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ProfileService } from '../../services/profile.service';
import { ResumeService } from '../../services/resume.service';
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit {
  profile: any = {
    heroSubtitle: 'Angular • Spring Boot • Interactive Web Experiences',
    heroLine: 'I build scalable web platforms, high-performance frontends, and modern full-stack applications.'
  };
  resumeUrl: string = '';

  constructor(private profileService: ProfileService,private resumeService: ResumeService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((data: any) => {
      if (data) {
        this.profile = {
          ...this.profile,
          ...data
        };
      }
    });
    this.resumeService.getResume().subscribe((data: any) => {
  this.resumeUrl = data && data.url ? data.url : '';
});
  }

  ngAfterViewInit(): void {
    gsap.from('.hero .eyebrow', { y: 30, opacity: 0, duration: 0.8 });

    gsap.from('.hero h1', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power4.out'
    });

    gsap.from('.hero h2, .hero .summary, .hero .actions', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }
}