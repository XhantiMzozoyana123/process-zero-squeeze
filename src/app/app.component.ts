import { Component, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';
import { environment } from 'src/environments/environment';

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
    // Production builds always send events to Vercel; development builds log to the
    // browser console (debug) and never report to the dashboard.
    inject({
      mode: environment.production ? 'production' : 'development',
      debug: !environment.production,
    });
  }
}