import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  private readonly isBrowser: boolean;

  constructor(
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((data: any) => {
      this.projects = data;
      
      // Wait for Angular to render the cards in the DOM
      if (this.isBrowser) {
        setTimeout(() => {
          this.initAnimation();
        }, 100);
      }
    });
  }

  private initAnimation(): void {
    if (!this.isBrowser) return;

    gsap.fromTo('.personal-project-card', 
      {
        y: 50,
        opacity: 0,
        rotateX: 8
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }
}