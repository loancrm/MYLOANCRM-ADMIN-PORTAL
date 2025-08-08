import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // BrowserAnimationsModule
  ],
  exports: [
    // BrowserAnimationsModule
  ]
})
export class AnimationsModule {
  static fadeInFast = trigger('fadeInFast', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
      animate('1000ms', style({ opacity: 1 }))
    ])
  ]);


  static fadeInSlowly = trigger('fadeInSlowly', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
      animate('3000ms', style({ opacity: 1 }))
    ])
  ]);

  static fadeOutFast = trigger('fadeOutFast', [
    state('void', style({ opacity: 1 })),
    transition(':enter, :leave', [
      animate('1000ms', style({ opacity: 0 }))
    ])
  ]);


  static fadeOutSlowly = trigger('fadeOutSlowly', [
    state('void', style({ opacity: 1 })),
    transition(':enter, :leave', [
      animate('300ms', style({ opacity: 0 }))
    ])
  ]);

  static stagger = trigger('stagger', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger('100ms', [
          animate('300ms', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true })
    ])
  ]);


  static staggerAnimationFromLeft = trigger('staggerAnimationFromLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-120px)' }),
      animate('2000ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('3000ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);


  static staggerAnimationFastFromLeft = trigger('staggerAnimationFastFromLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-120px)' }),
      animate('700ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('1500ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);


  static staggerAnimationFastFromRight = trigger('staggerAnimationFastFromRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-120px)' }),
      animate('700ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('1500ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);

  static staggerAnimationFromTop = trigger('staggerAnimationFromTop', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-120px)' }),
      animate('2000ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('3000ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);

  static staggerAnimationFromRight = trigger('staggerAnimationFromRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(120px)' }),
      animate('2000ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('3000ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);

  static staggerAnimationFromBottom = trigger('staggerAnimationFromBottom', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(120px)' }),
      animate('2000ms', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('3000ms', style({ opacity: 0, transform: 'translateX(20px)' }))
    ])
  ]);

  constructor() { }
}
