import { Component, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Cal.com booking page (opens in a new tab after the lead is saved). */
const CAL_BOOKING_URL =
  'https://cal.com/xhanti-mzozoyana-50g1ck/process-zero-risk-free-client-acquisition-and-lead-vetting';

@Component({
  selector: 'app-squeeze',
  templateUrl: './squeeze.page.html',
  styleUrls: ['./squeeze.page.scss'],
  standalone: false,
})
export class SqueezePage implements AfterViewInit, OnDestroy {
  /** Lead-capture form state — shown when the visitor clicks the CTA. */
  showForm = false;
  submitting = false;
  submitted = false;
  errorMessage = '';

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  /** Honeypot — must stay empty. Bots fill it; humans never see it. */
  website = '';

  constructor(
    private router: Router,
    private el: ElementRef,
    private zone: NgZone,
    private http: HttpClient,
  ) {}

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  /** CTA click: first show the quick form modal, then (after submit) open Cal.com. */
  bookCall(): void {
    if (this.submitted) {
      window.open(CAL_BOOKING_URL, '_blank', 'noopener');
      return;
    }
    this.showForm = true;
  }

  /** Dismiss the lead-capture modal. */
  closeForm(): void {
    if (this.submitting) return;
    this.showForm = false;
    this.errorMessage = '';
  }

  /** Save the lead into the LeadLake table, then open the booking calendar. */
  submitLead(): void {
    if (this.submitting) return;

    if (!this.firstName.trim() || !this.email.trim()) {
      this.errorMessage = 'Please fill in your name and email.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.http
      .post(`${environment.apiUrl}/LeadLake/lead-capture`, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        website: this.website, // honeypot
      })
      .subscribe({
        next: () => {
          this.zone.run(() => {
            this.submitting = false;
            this.submitted = true;
          });
          window.open(CAL_BOOKING_URL, '_blank', 'noopener');
        },
        error: () => {
          this.zone.run(() => {
            this.submitting = false;
            this.errorMessage = 'Something went wrong — please try again.';
          });
        },
      });
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
