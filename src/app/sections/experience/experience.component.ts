import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements AfterViewInit {
  activeCompany: string | null = null;

  ngAfterViewInit(): void {
    gsap.from('.experience .section-label, .experience h2, .company-card', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.experience',
        start: 'top 75%'
      }
    });
  }

  toggleCompany(company: string): void {
    this.activeCompany = this.activeCompany === company ? null : company;

    setTimeout(() => {
      gsap.from('.project-panel .project-card', {
        y: -40,
        opacity: 0,
        scale: 0.94,
        duration: 0.7,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      });
    }, 0);
  }
}