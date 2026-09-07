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
    { icon: 'shield-checkmark-outline', title: 'Zero Risk', description: 'No upfront costs, no retainers. You only engage when we deliver qualified opportunities that match your criteria.' },
    { icon: 'people-outline', title: 'Pre-Vetted Decision Makers', description: 'Every prospect is verified through our multi-step lead vetting process — budget, authority, need, and timeline confirmed before you ever speak to them.' },
    { icon: 'cash-outline', title: 'Recurring Commissions', description: 'Sell proven SaaS and digital products. Earn 20% recurring commission every month your customers stay active — your effort compounds over time.' },
    { icon: 'rocket-outline', title: 'Sell Proven Products', description: 'Skip building from scratch. We partner with high-quality SaaS and digital product providers that already convert.' },
    { icon: 'analytics-outline', title: 'Full AI + CRM Toolkit', description: 'AI outreach, contact management, meeting scheduling, and KPI tracking — everything you need to convert in one integrated platform.' },
    { icon: 'card-outline', title: 'No Credit Card Required', description: 'Getting started is free. You only activate your earning workspace with credits when you\'re ready to sell — costs only once you close.' },
  ];

  /** How-it-works steps. */
  howItWorks = [
    { step: '1', title: 'Book Your Strategy Call', description: 'Fill in your details and pick a slot on our Cal.com calendar. The call is completely free and obligation-free.' },
    { step: '2', title: 'Lead Vetting & Needs Assessment', description: 'We assess your market, ideal client profile, and product fit. Only qualified strategies move forward.' },
    { step: '3', title: 'Warm Opportunities Delivered', description: 'Qualified prospects enter your dashboard — pre-vetted, with contact info, company insights, and buying intent.' },
    { step: '4', title: 'Close with Proven Products', description: 'Present from our curated SaaS catalogue and close deals with confidence — we provide scripts, demos, and support.' },
    { step: '5', title: 'Earn Recurring Commission', description: 'Get paid 20% recurring commission every month your customer stays active. No caps, no ceilings.' },
  ];

  /** FAQ accordion items. */
  faqs = [
    { question: 'Is the appointment really free?', answer: 'Yes — booking is completely free with zero obligation. You simply pick a time that suits you on the calendar and our team takes it from there.', open: false },
    { question: 'What happens during the appointment?', answer: 'We take a focused look at your business and explain how our risk-free client acquisition and lead vetting service brings you qualified, decision-ready appointments. You leave with a clear next step.', open: false },
    { question: 'How does booking work?', answer: 'Choose an open time on the calendar below, add your contact details, and the appointment is confirmed instantly. You will receive a confirmation and a reminder by email.', open: false },
    { question: 'What do I need to prepare beforehand?', answer: 'Nothing is required upfront. If you already know which types of clients or industries you want to target, bring that along and we can make the session far more specific to you.', open: false },
    { question: 'Can I reschedule or cancel my appointment?', answer: 'Absolutely. You can reschedule or cancel at any time from your confirmation email or calendar link — no penalties and no questions asked.', open: false },
    { question: 'Is the appointment online or in person?', answer: 'Appointments are held online via video call, so you can join from anywhere. If you prefer a face-to-face meeting, mention it when booking and we will arrange it.', open: false },
  ];

  /** Social proof / trust stats. */
  trustStats = [
    { value: '500+', label: 'Active Sales Reps' },
    { value: 'R284K+', label: 'Monthly Commission Payouts' },
    { value: '30+', label: 'Vetted Digital Products' },
    { value: '4.9/5', label: 'Rep Satisfaction Score' },
  ];

  private observer: IntersectionObserver | null = null;
  private calCleanupFn: (() => void) | null = null;

  @ViewChild('calEmbedContainer', { static: false }) calEmbedContainer!: ElementRef;

  
  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
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



