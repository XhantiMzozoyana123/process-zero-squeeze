import { Component, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Start collecting Vercel Web Analytics views for the squeeze page.
    // Framework-agnostic integration (this app is Angular, not Next.js).
    inject();
  }
}