import { AfterViewInit, Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProfileService } from '../../services/profile.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  profile: any = {
    aboutHeading: 'About Me',
    aboutText: 'I’m a Full Stack Engineer focused on building scalable web platforms, high-performance frontends, and modern digital experiences.'
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((data: any) => {
      if (data) {
        this.profile = {
          ...this.profile,
          ...data
        };
      }
    });
  }

  ngAfterViewInit(): void {
    gsap.from('.about h2, .about p', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 70%'
      }
    });
  }
}