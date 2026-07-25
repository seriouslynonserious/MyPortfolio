import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ExperienceService } from '../../services/experience.service';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  companies: any[] = [];
  companyProjects: any[] = [];
  activeCompany: any = null;

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.experienceService.getCompanies().subscribe((data: any) => {
      this.companies = data;
    });
  }

  toggleCompany(company: any): void {
  if (this.activeCompany && this.activeCompany.id === company.id) {
    this.activeCompany = null;
    this.companyProjects = [];
    return;
  }

  this.activeCompany = company;

  this.experienceService.getProjects(company.id).subscribe((data: any) => {
    this.companyProjects = data;

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
  });
}

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
}