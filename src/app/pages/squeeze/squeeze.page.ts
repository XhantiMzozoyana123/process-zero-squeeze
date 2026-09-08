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
    { icon: 'shield-checkmark-outline', title: 'No Risk to You', description: 'No big upfront fees and no long contracts. You only pay for meetings we actually book that match what you asked for. The risk is on us, not you.' },
    { icon: 'people-outline', title: 'Real Decision Makers', description: 'Before we book anyone, we check they have the money, the say-so, and a real reason to buy. You only meet people who can actually say yes.' },
    { icon: 'calendar-outline', title: 'New Meetings Every Month', description: 'Fresh meetings with interested people, added to your calendar every month. No more cold calling or chasing leads that go nowhere.' },
    { icon: 'checkmark-circle-outline', title: 'Ready to Buy', description: 'We check every person before the meeting: do they need what you sell, can they afford it, and can they decide? If not, they never reach your calendar.' },
    { icon: 'chatbubbles-outline', title: 'We Do All the Legwork', description: 'We find the leads, reach out, follow up, and handle questions. You just show up to the meeting and close the deal.' },
    { icon: 'card-outline', title: 'No Credit Card Needed', description: 'Book a free call to see how we would fill your calendar. No sign-up forms, no card, no risk.' },
  ];

  /** How-it-works steps. */
  howItWorks = [
    { step: '1', title: 'Book a Free Call', description: 'Pick a time on our calendar. The call is free and you are not committing to anything. We explain how it all works.' },
    { step: '2', title: 'Tell Us Who You Want to Meet', description: 'Together we agree on your perfect customer: who they are and what they need before you would want to meet them.' },
    { step: '3', title: 'We Reach Out for You', description: 'Our team contacts your ideal customers by email, LinkedIn, and phone. We do all of it — you never have to.' },
    { step: '4', title: 'We Check Every Lead', description: 'Before booking anyone, we make sure they want what you sell, can afford it, and can make the decision. Only serious people move forward.' },
    { step: '5', title: 'Meetings Show Up in Your Calendar', description: 'We book the good ones straight into your calendar and send reminders. All you do is show up and close.' },
  ];

  /** FAQ accordion items. */
  faqs = [
    { question: 'What exactly do you do?', answer: 'We book sales meetings for you. You tell us the type of customer you want, and our team finds people who are ready to buy, checks they are a good fit, and puts them in your calendar.', open: false },
    { question: 'What does "ready to buy" mean?', answer: 'Before we book anyone, we check three things: do they need what you sell, can they afford it, and are they the person who makes the decision. If the answer to any of these is no, we do not book them. That way you only spend time on meetings that can actually lead to a sale.', open: false },
    { question: 'Do I have to find the leads myself?', answer: 'No. We do everything — finding people, contacting them, checking they are a good fit, and booking the calls. All you do is show up to the meetings and focus on closing.', open: false },
    { question: 'How many meetings will I get?', answer: 'It depends on your market and how many meetings you can handle each week. We agree on a monthly number together, so you get a steady flow of meetings without your calendar being overloaded.', open: false },
    { question: 'How do meetings get into my calendar?', answer: 'As soon as someone passes our checks, we book them straight into your calendar. You get a confirmation and a reminder for every meeting, so you always know who you are meeting and when. No double bookings, no missed calls.', open: false },
    { question: 'How soon will I get my first meeting?', answer: 'Most clients get their first meetings within two weeks. Once we know who your ideal customer is, we move fast and keep your calendar full month after month.', open: false },
  ];

  /** Social proof / trust stats. */
  trustStats = [
    { value: '500+', label: 'Appointments Booked' },
    { value: '95%', label: 'Appointment Show-Up Rate' },
    { value: '14 Days', label: 'Average Time to First Booking' },
    { value: '4.9/5', label: 'Client Satisfaction Score' },
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

  Cal.ns["process-zero-risk-free-client-acquisition-and-lead-vetting"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});`;

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



