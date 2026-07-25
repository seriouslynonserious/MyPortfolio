import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  activeSection = 'hero';
  private readonly isBrowser: boolean;

  private sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.checkScroll();
      this.determineActiveSection();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  checkScroll(): void {
    this.isScrolled = window.pageYOffset > 30;
  }

  scrollToSection(sectionId: string, event: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isMenuOpen = false;
    this.activeSection = sectionId;

    const element = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
    if (element) {
      const offset = 80; // height of the navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  private determineActiveSection(): void {
    const scrollPosition = window.pageYOffset + 120; // offset for navbar height + buffer

    for (const sectionId of this.sections) {
      const el = document.getElementById(sectionId) || document.querySelector('.' + sectionId);
      if (el) {
        const top = (el as HTMLElement).offsetTop;
        const height = (el as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection = sectionId;
          break;
        }
      }
    }
  }
}
