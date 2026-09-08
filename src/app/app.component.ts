import { Component, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Initialize Vercel Web Analytics with proper configuration
    // Framework-agnostic integration for Angular/Ionic applications
    inject({
      mode: environment.production ? 'production' : 'development',
      debug: !environment.production, // Enable debug logging in development
    });
  }
}