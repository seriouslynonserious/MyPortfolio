import { Component } from '@angular/core';
import { gsap } from 'gsap';
declare let emailjs: any;


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  botMessage = 'Hi! I am your message bot. Fill the form and I will deliver it to Shivam on Earth.';
  
  formFolding = false;
  botFlying = false;
  


  form = {
    name: '',
    email: '',
    message: ''
  };

  submitForm(): void {
    this.formFolding = false;
    this.botFlying = false;

    if (!this.form.name.trim()) {
      this.botMessage = 'Oops! Please enter your name first.';
      this.shakeBot();
      return;
    }

    if (this.form.name.trim().length < 3) {
      this.botMessage = 'Your name looks too short. Please enter at least 3 characters.';
      this.shakeBot();
      return;
    }

    if (!this.form.email.trim()) {
      this.botMessage = 'I need your email so Shivam can reply to you.';
      this.shakeBot();
      return;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.botMessage = 'This email does not look correct. Try something like name@example.com';
      this.shakeBot();
      return;
    }

    if (!this.form.message.trim()) {
      this.botMessage = 'Your message is empty. Write something before I fly!';
      this.shakeBot();
      return;
    }

    if (this.form.message.trim().length < 10) {
      this.botMessage = 'Message is too short. Please write at least 10 characters.';
      this.shakeBot();
      return;
    }

    this.botMessage = 'Perfect! Folding your message and packing it inside me...';
    emailjs.send(
      'service_yj0dzmo',
      'template_cn4jkfc',
      {
        from_name: this.form.name,
        from_email: this.form.email,
        message: this.form.message,
        to_email: 'shivaay251202@gmail.com'
      }
    )
      .then(() => {

        this.botMessage = 'Message sent successfully 🚀';

        this.form = {
          name: '',
          email: '',
          message: ''
        };

      })
      .catch((error: any) => {

        console.error(error);

        this.botMessage = 'Failed to send message.';
      });

    setTimeout(() => {
      this.foldFormIntoBot();
    }, 200);
  }

  private foldFormIntoBot(): void {
    const form = document.querySelector('.contact-form') as HTMLElement;
    const botBody = document.querySelector('.bot-body') as HTMLElement;
    const bot = document.querySelector('.bot-wrapper') as HTMLElement;

    if (!form || !botBody || !bot) return;

    const formRect = form.getBoundingClientRect();
    const bodyRect = botBody.getBoundingClientRect();

    const targetX =
      bodyRect.left + bodyRect.width / 2 - (formRect.left + formRect.width / 2);

    const targetY =
      bodyRect.top + bodyRect.height / 2 - (formRect.top + formRect.height / 2);

    gsap.to(form, {
      x: targetX,
      y: targetY,
      scale: 0.08,
      rotation: -25,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        this.botMessage = 'Message packed! Launching to Earth...';
        this.launchBotToEarth();
      }
    });
  }

  private launchBotToEarth(): void {
    const bot = document.querySelector('.bot-wrapper') as HTMLElement;

    if (!bot) return;

    this.botFlying = true;

    const botRect = bot.getBoundingClientRect();

    gsap.set(bot, {
      position: 'fixed',
      left: botRect.left,
      top: botRect.top,
      width: botRect.width,
      zIndex: 9999,
      margin: 0
    });

    gsap.to(bot, {
      left: window.innerWidth / 2 - botRect.width / 2,
      top: window.innerHeight / 2 - botRect.height / 2,
      scale: 0.04,
      rotation: 45,
      opacity: 0,
      duration: 2.6,
      ease: 'power3.inOut',
      onComplete: () => {
        this.resetContact();
      }
    });
  }

  private resetContact(): void {
    this.botMessage = 'Delivered successfully! Shivam will contact you soon.';

    this.form = {
      name: '',
      email: '',
      message: ''
    };

    this.formFolding = false;
    this.botFlying = false;

    const form = document.querySelector('.contact-form') as HTMLElement;
    const bot = document.querySelector('.bot-wrapper') as HTMLElement;

    if (form) {
      gsap.set(form, {
        clearProps: 'all'
      });
    }

    if (bot) {
      gsap.set(bot, {
        clearProps: 'all'
      });
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private shakeBot(): void {
    const bot = document.querySelector('.bot-wrapper') as HTMLElement;

    if (!bot) return;

    bot.classList.remove('shake');
    void bot.offsetWidth;
    bot.classList.add('shake');
  }


}