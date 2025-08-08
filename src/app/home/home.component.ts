import { Component, OnInit } from '@angular/core';
import { AnimationsModule } from '../modules/animations/animations.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  text = 'Hello, World!';

  constructor(private router: Router) {
    this.router.navigate['home'];
  }

  ngOnInit(): void {}
}
