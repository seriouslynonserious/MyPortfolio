import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  projects: any[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((data: any) => {
      this.projects = data;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      gsap.from('.personal-project-card', {
        y: 80,
        opacity: 0,
        rotateX: 12,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 70%'
        }
      });
    }, 500);
  }
}