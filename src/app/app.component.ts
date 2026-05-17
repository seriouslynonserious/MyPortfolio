import { Component } from '@angular/core';
import { gsap } from 'gsap';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
   isAdminRoute = false;
     constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.url.includes('/admin');
      }
    });
  }
   ngAfterViewInit(): void {
    gsap.from('.hero h1', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    });

    gsap.from('.hero p', {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power4.out'
    });
  }
}
