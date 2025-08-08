import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  state,
  AnimationBuilder,
} from '@angular/animations';

import { Router } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeInFromDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('1000ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('bounce', [
      state('hidden', style({ opacity: 0, transform: 'translateY(100%)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', [
        animate(
          '1s',
          keyframes([
            style({ transform: 'translateY(-100%)', offset: 0 }),
            style({ transform: 'translateY(0)', offset: 0.6 }),
            style({ transform: 'translateY(-30px)', offset: 0.75 }),
            style({ transform: 'translateY(0)', offset: 0.9 }),
            style({ transform: 'translateY(-15px)', offset: 0.95 }),
            style({ transform: 'translateY(0)', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),

    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(500)),
    ]),
  ],
})
export class LandingPageComponent implements OnInit {
  images: string[] = [
    '../../../assets/images/banks/1.png',
    '../../../assets/images/banks/2.png',
    '../../../assets/images/banks/3.png',
    '../../../assets/images/banks/4.png',
    '../../../assets/images/banks/5.png',
    '../../../assets/images/banks/6.png',

    '../../../assets/images/banks/7.png',
    '../../../assets/images/banks/8.png',
    '../../../assets/images/banks/9.png',
    '../../../assets/images/banks/10.png',
    '../../../assets/images/banks/11.png',
    '../../../assets/images/banks/12.png',
  ];

  numVisibleItems: number = 6;
  loanAmount: number = 2000000;
  tenure: number = 24;
  interestRate: number = 15.5;
  monthlyInstallment: string = '97,449';
  totalPayableAmount: string = '2,338,776';

  isVisible = false;

  carousalImages: any = [
    {
      url: 'assets/images/slider/slider-1.png',
    },
    {
      url: 'assets/images/slider/slider-2.png',
    },
    {
      url: 'assets/images/slider/slider-3.png',
    },
  ];

  constructor(private router: Router, private elRef: ElementRef) { }

  navigateToContact(): void {
    this.router.navigateByUrl('/contact');
  }

  ngOnInit() { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateNumVisibleItems(window.innerWidth);
  }

  private updateNumVisibleItems(width: number) {
    if (width <= 768) {
      this.numVisibleItems = 3;
    } else if (width <= 992) {
      this.numVisibleItems = 4;
    } else {
      this.numVisibleItems = 6;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const yOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.elRef.nativeElement.offsetTop;
    const elementHeight = this.elRef.nativeElement.offsetHeight;

    if (
      yOffset + windowHeight > elementOffsetTop &&
      yOffset < elementOffsetTop + elementHeight
    ) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

}
