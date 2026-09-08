import { Component, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/** Cal.com booking page (opens in a new tab from the CTA). */
const CAL_BOOKING_URL =
  'https://cal.com/xhanti-mzozoyana-50g1ck/process-zero-risk-free-client-acquisition-and-lead-vetting';

@Component({
  selector: 'app-squeeze',
  templateUrl: './squeeze.page.html',
  styleUrls: ['./squeeze.page.scss'],
  standalone: false,
})
export class SqueezePage implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private el: ElementRef,
    private zone: NgZone,
  ) {}

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  /** Open the Cal.com booking page in a new tab. */
  bookCall(): void {
    window.open(CAL_BOOKING_URL, '_blank', 'noopener');
  }

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** IntersectionObserver-based scroll reveal (same pattern as the home page). */
  private setupScrollAnimations(): void {
    const options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, options);

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        const sections = this.el.nativeElement.querySelectorAll('.reveal-on-scroll');
        sections.forEach((s: Element) => this.observer!.observe(s));
            }, 100);
    });
  }
}
