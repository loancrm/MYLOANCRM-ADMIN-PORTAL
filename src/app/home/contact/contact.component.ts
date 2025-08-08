import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @ViewChild('nameInput') nameInputRef!: ElementRef;
  @ViewChild('emailInput') emailInputRef!: ElementRef;
  @ViewChild('numberInput') numberInputRef!: ElementRef;

  @ViewChild('messageInput') messageInputRef!: ElementRef;

  constructor(private renderer: Renderer2, private router: Router) {}

  sendEmail(): void {
    const name = this.nameInputRef.nativeElement.value;
    const email = this.emailInputRef.nativeElement.value;
    const number = this.numberInputRef.nativeElement.value;
    const message = this.messageInputRef.nativeElement.value;

    const subject = 'Contact Form Submission';
    const body = `Name: ${name}\nEmail: ${email}\nMobile No:${number}\nMessage: ${message}`;

    const mailtoLink = `mailto:cnarendra329@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  }
}
