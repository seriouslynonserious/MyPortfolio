import { AfterViewInit, Component, OnInit } from '@angular/core';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SkillsService } from '../../services/skills.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, AfterViewInit {
  skills: any[] = [];

  constructor(private skillsService: SkillsService) {}

ngOnInit() {
  this.skillsService.getSkills().subscribe(
    data => {
      console.log('Firebase skills data:', data);
      this.skills = data;
    },
    error => {
      console.error('Firebase error:', error);
    }
  );
} 

  ngAfterViewInit(): void {
    setTimeout(() => {
      gsap.from('.skills .card', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills',
          start: 'top 70%'
        }
      });
    }, 500);
  }
}