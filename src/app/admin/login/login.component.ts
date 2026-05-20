import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  passwordFocused = false;

  securityPassed = false;

  secretAnswer = '';

  funnyMessage =
'WAITTTT 👀\nBefore entering Shivam OS...\n\nTell me:\nWhat does Shivam like the most?';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  verifyAnswer(): void {
    const answer = this.secretAnswer.toLowerCase().trim();

    if (answer === 'Nothing' || answer === 'nothing' || answer === 'Nothing.' || answer === 'nothing.') {
      this.funnyMessage =
        'Identity confirmed 😂\nYou ARE Shivam.\nOpening admin portal...';

      setTimeout(() => {
        this.securityPassed = true;
      }, 1600);

      return;
    }

    const roasts = [
      'Nice try hacker 😭',
      'Even ChatGPT knows that is wrong.',
      'Bro really thought that would work 💀',
      'Suspicious human detected 🚨',
      'That answer hurts my AI brain.',
      'Access denied. Go touch grass 🌱',
      'You are definitely NOT Shivam.'
    ];

    this.funnyMessage =
      roasts[Math.floor(Math.random() * roasts.length)];
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password)
      .then((result: any) => {

        this.loading = false;

        if (result.user.email !== environment.adminEmail) {
          this.authService.logout();

          this.errorMessage =
            'Access denied. This panel is only for Shivam.';

          return;
        }

        this.router.navigate(['/admin/dashboard']);
      })
      .catch(() => {

        this.loading = false;

        this.errorMessage = 'Invalid email or password.';
      });
  }
}