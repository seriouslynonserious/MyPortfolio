import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = environment.adminEmail;
  errorMessage = '';
  loading = false;
  passwordFocused = false;
  loginLinkSent = false;
  cooldownMessage = '';
  private loginCooldownMinutes = 10;

  securityPassed = false;
  secretAnswer = '';

  funnyMessage =
    'WAITTTT 👀\nBefore entering Shivam OS...\n\nTell me:\nWhat does Shivam like the most?';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLoginCooldown();
    this.checkEmailLoginLink();
  }

 verifyAnswer(): void {
  const answer = this.secretAnswer.toLowerCase().trim();

  if (answer === 'nothing') {
    this.funnyMessage = 'Identity confirmed 😂\nOpening secure login...';

    setTimeout(() => {
      this.securityPassed = true;
    }, 1200);

    return;
  }

  this.playWrongSound();
  this.shakeSecurityBot();

  if (this.containsBadWord(answer)) {
    this.funnyMessage =
      'Aye aye! No bad words here 😭\nPanda security is disappointed.';
    this.secretAnswer = '';
    return;
  }

  const roasts = [
    'Fahhh! Wrong answer 😭',
    'Nice try hacker 💀',
    'That answer made the bot lose brain cells.',
    'Suspicious human detected 🚨',
    'Nope. Shivam would never say that.',
    'Access denied. Go drink water and try again.',
    'Wrong answer. Bot is judging you silently.'
  ];

  this.funnyMessage = roasts[Math.floor(Math.random() * roasts.length)];
  this.secretAnswer = '';
}

  sendLoginLink(): void {
    this.loading = true;
    this.errorMessage = '';

    const actionCodeSettings = {
      url: window.location.origin + '/admin/login',
      handleCodeInApp: true
    };

    this.afAuth.auth.sendSignInLinkToEmail(
      environment.adminEmail,
      actionCodeSettings
    )
      .then(() => {
        this.loading = false;

        localStorage.setItem('adminEmailForSignIn', environment.adminEmail);
        localStorage.setItem('adminLoginLinkSentAt', String(Date.now()));

        this.loginLinkSent = true;
        this.cooldownMessage =
          'Login link sent to admin Gmail. Please open it to enter Shivam OS.';

        this.errorMessage = '';
      })
      .catch((error: any) => {
        this.loading = false;
        console.error(error);
        this.errorMessage = 'Failed to send login link.';
      });
  }

  checkEmailLoginLink(): void {
    if (!firebase.auth().isSignInWithEmailLink(window.location.href)) {
      return;
    }

    const email =
      localStorage.getItem('adminEmailForSignIn') || environment.adminEmail;

    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then((result: any) => {
         localStorage.removeItem('adminEmailForSignIn');
    localStorage.removeItem('adminLoginLinkSentAt');

        if (!result.user || result.user.email !== environment.adminEmail) {
          firebase.auth().signOut();
          this.errorMessage = 'Access denied.';
          return;
        }

        this.router.navigate(['/admin/dashboard']);
      })
      .catch((error: any) => {
        console.error(error);
        this.errorMessage = 'Invalid or expired login link.';
      });
  }
  checkLoginCooldown(): void {
    const sentAt = localStorage.getItem('adminLoginLinkSentAt');

    if (!sentAt) {
      this.loginLinkSent = false;
      this.cooldownMessage = '';
      return;
    }

    const sentTime = Number(sentAt);
    const now = Date.now();

    const cooldownMs = this.loginCooldownMinutes * 60 * 1000;
    const timePassed = now - sentTime;

    if (timePassed < cooldownMs) {
      this.loginLinkSent = true;

      const remainingMs = cooldownMs - timePassed;
      const remainingMinutes = Math.ceil(remainingMs / 60000);

      this.cooldownMessage =
        'Login link already sent. Please check Gmail. You can resend after ' +
        remainingMinutes +
        ' minute(s).';
    } else {
      localStorage.removeItem('adminLoginLinkSentAt');
      this.loginLinkSent = false;
      this.cooldownMessage = '';
    }
  }
  playWrongSound(): void {
  const audio = new Audio('assets/audio/fahhhhh.mp3');

  audio.volume = 0.7;

  audio.play().catch((error) => {
    console.log('Audio play failed:', error);
  });
}

badWords = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'madarchod',
  'bhenchod',
  'mc',
  'bc',
  'lund'
];

containsBadWord(text: string): boolean {
  const cleanText = text.toLowerCase().trim();

  return this.badWords.some(word => cleanText.indexOf(word) !== -1);
}

shakeSecurityBot(): void {
  const bot = document.querySelector('.funny-bot') as HTMLElement;

  if (!bot) {
    return;
  }

  bot.classList.remove('wrong-shake');
  void bot.offsetWidth;
  bot.classList.add('wrong-shake');
}
}