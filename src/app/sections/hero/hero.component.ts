import { AfterViewInit, Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
 ngAfterViewInit(): void {
    gsap.from('.hero .eyebrow', {
      y: 30,
      opacity: 0,
      duration: 0.8
    });

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
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;

window.addEventListener('mousemove', (event: MouseEvent) => {
  if (!cursor) return;

  gsap.to(cursor, {
    x: event.clientX,
    y: event.clientY,
    duration: 0.15,
    ease: 'power2.out'
  });
});

  }

}
