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
    { icon: 'time-outline', title: 'Get Your Week Back', description: 'No more cold calls, follow-ups, or chasing people who never reply. We do the finding and the chasing. You get your time back to actually run your business.' },
    { icon: 'people-outline', title: 'Only Real Buyers', description: 'Before we book anyone, we check they need what you sell, can afford it, and can say yes. No time-wasters. No tyre-kickers. No "let me think about it".' },
    { icon: 'calendar-outline', title: 'A Calendar That Sells Itself', description: 'New meetings with interested buyers, added to your calendar every month. While your competitors cold call, you are closing.' },
    { icon: 'trending-up-outline', title: 'First Meeting in 14 Days', description: 'Most clients meet their first buyer within two weeks of starting. Fast results you can see on your own calendar.' },
    { icon: 'shield-checkmark-outline', title: 'You Cannot Lose', description: 'Free for 14 days. No credit card. And after that, you only pay for meetings we actually book. If we don\'t book, you don\'t pay — the risk is on us.' },
    { icon: 'chatbubbles-outline', title: 'We Handle Everything', description: 'Finding leads, reaching out, answering questions, booking the meeting, sending reminders. All of it, done for you.' },
  ];

  /** How-it-works steps. */
  howItWorks = [
    { step: '1', title: 'Book Your Free Call', description: 'Pick a time below. It takes 30 seconds and there is nothing to pay. We\'ll show you exactly how we\'d fill your calendar.' },
    { step: '2', title: 'Tell Us Who Your Perfect Customer Is', description: 'On the call, we agree on exactly who you want to meet: their industry, size, budget, and what they need before you\'d want to talk to them.' },
    { step: '3', title: 'We Go Find Them', description: 'Our team starts reaching out to your ideal customers by email, LinkedIn, and phone — hundreds of conversations, all handled by us.' },
    { step: '4', title: 'We Test Every Lead', description: 'Before anyone gets near your calendar, we check they need what you sell, can afford it, and can make the decision. Time-wasters are filtered out.' },
    { step: '5', title: 'Buyers Land in Your Calendar', description: 'We book the serious ones straight in and send reminders so they show up. You walk in, present, and close.' },
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



