import { Component, AfterViewInit, OnDestroy, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-squeeze',
  templateUrl: './squeeze.page.html',
  styleUrls: ['./squeeze.page.scss'],
  standalone: false,
})
export class SqueezePage implements AfterViewInit, OnDestroy {
  /** Whether the Cal.com embed script has already been loaded. */
  calScriptLoaded = false;

  constructor(
    private router: Router,
    private el: ElementRef,
    private zone: NgZone,
    private renderer: Renderer2,
  ) {}

  
  /** Benefit cards shown in the value proposition section. */
  benefits = [
    { icon: 'time-outline', title: 'Get Your Week Back', description: 'No cold calls. No chasing people who never reply. We do all of that for you.' },
    { icon: 'people-outline', title: 'Only Real Buyers', description: 'Everyone we book needs what you sell, can afford it, and can say yes. No time-wasters.' },
    { icon: 'calendar-outline', title: 'A Full Calendar', description: 'New meetings with interested buyers, added to your calendar every month.' },
    { icon: 'shield-checkmark-outline', title: 'Zero Risk', description: 'Free for 14 days. No credit card, no contract, no invoicing. No catch — just results.' },
  ];

  /** How-it-works steps. */
  howItWorks = [
    { step: '1', title: 'Book the Free Call', description: 'Pick a time below. Takes 30 seconds. Free for 14 days — no card needed.' },
    { step: '2', title: 'We Go Find Your Buyers', description: 'Tell us your perfect customer on the call. Our team reaches out, tests every lead, and filters out the time-wasters.' },
    { step: '3', title: 'Buyers Land in Your Calendar', description: 'We book the serious ones in and send reminders. You show up and close.' },
  ];

  /** FAQ accordion items. */
  faqs = [
    { question: 'Is it really free?', answer: 'Yes. Your first 14 days are completely free. No credit card, no contract, no invoicing. If we don\'t book meetings for you, you pay nothing at all.', open: false },
    { question: 'What exactly do you do?', answer: 'We book sales meetings for you. You tell us the type of customer you want, and our team finds people who are ready to buy, checks they are a good fit, and puts them in your calendar.', open: false },
    { question: 'Do I have to find the leads myself?', answer: 'No. We do everything — finding people, contacting them, checking they are a good fit, and booking the calls. All you do is show up to the meetings and close.', open: false },
    { question: 'How soon will I get my first meeting?', answer: 'Most clients meet their first buyer within two weeks. We move fast and keep your calendar full month after month.', open: false },
  ];

  /** Social proof / trust stats. */
  trustStats = [
    { value: '500+', label: 'Meetings Booked for Clients' },
    { value: '95%', label: 'Of Booked Buyers Show Up' },
    { value: '14 Days', label: 'To Your First Meeting' },
    { value: 'R0', label: 'To Start — 14 Days Free' },
  ];

  private observer: IntersectionObserver | null = null;
  private calCleanupFn: (() => void) | null = null;

  @ViewChild('calEmbedContainer', { static: false }) calEmbedContainer!: ElementRef;

  
  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  /** Trigger the booking flow — scrolls to the Cal.com inline embed. */
  bookCall(): void {
    this.scrollToBooking();
  }

  /** Smooth-scroll to the video showcase section. */
  scrollToVideo(): void {
    const section = this.el.nativeElement.querySelector('.video-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Smooth-scroll back up to the Cal.com booking embed at the top of the page. */
  scrollToBooking(): void {
    const container = this.el.nativeElement.querySelector('.cal-embed-wrapper');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  /**
   * Programmatically inject the Cal.com inline embed snippet into the container.
   * Uses the official Cal.com inline embed code (calendar renders straight into the target div).
   */
  private loadCalEmbed(): void {
    if (this.calScriptLoaded || !this.calEmbedContainer) {
      return;
    }

    this.calScriptLoaded = true;
    const container = this.calEmbedContainer.nativeElement;

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.textContent = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "process-zero-risk-free-client-acquisition-and-lead-vetting", {origin:"https://app.cal.com"});
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;

  Cal.ns["process-zero-risk-free-client-acquisition-and-lead-vetting"]("inline", {
    elementOrSelector:"#my-cal-inline-process-zero-risk-free-client-acquisition-and-lead-vetting",
    config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
    calLink: "${environment.cal.embedLink}",
  });

  Cal.ns["process-zero-risk-free-client-acquisition-and-lead-vetting"]("ui", {"hideEventTypeDetails":true,"layout":"month_view"});`;

    this.renderer.appendChild(container, script);

    this.calCleanupFn = () => {
      if (script.parentNode) {
        this.renderer.removeChild(container, script);
      }
    };
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
    setTimeout(() => this.loadCalEmbed(), 200);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.calCleanupFn?.();
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



