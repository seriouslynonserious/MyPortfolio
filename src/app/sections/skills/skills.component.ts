import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SkillsService } from '../../services/skills.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skills: any[] = [];
  private readonly isBrowser: boolean;

  constructor(
    private skillsService: SkillsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.skillsService.getSkills().subscribe(
      data => {
        console.log('Firebase skills data:', data);
        this.skills = data;
        
        // Wait for Angular to render the cards in the DOM
        if (this.isBrowser) {
          setTimeout(() => {
            this.initAnimation();
          }, 100);
        }
      },
      error => {
        console.error('Firebase error:', error);
      }
    );
  } 

  private initAnimation(): void {
    if (!this.isBrowser) return;

    gsap.fromTo('.skills .card', 
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }
}