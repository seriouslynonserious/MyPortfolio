import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);


@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements AfterViewInit{

 ngAfterViewInit(): void {
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
  }

}
