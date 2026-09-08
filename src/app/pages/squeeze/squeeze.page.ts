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
    { icon: 'shield-checkmark-outline', title: 'Zero Risk', description: 'No retainers, no long contracts. You only pay for appointments we deliver that match your criteria — the risk is on us, not you.' },
    { icon: 'people-outline', title: 'Pre-Vetted Decision Makers', description: 'Every prospect is verified through our multi-step vetting process — budget, authority, need, and timeline confirmed before we ever book them in.' },
    { icon: 'calendar-outline', title: 'A Steady Flow of Appointments', description: 'A consistent stream of pre-qualified appointments delivered straight to your calendar every month — no more cold calling or chasing dead leads.' },
    { icon: 'checkmark-circle-outline', title: 'BANT-Qualified Prospects', description: 'Budget, authority, need, and timeline are all confirmed before the booking. You only speak to people who are genuinely ready to buy.' },
    { icon: 'chatbubbles-outline', title: 'Done-For-You Outreach', description: 'We handle the prospecting, cold outreach, follow-ups, and objection handling. You just show up to the meetings and close.' },
    { icon: 'card-outline', title: 'No Credit Card Required', description: 'Book a free strategy call to see exactly how we would fill your calendar — no commitment, no card, no risk.' },
  ];

  /** How-it-works steps. */
  howItWorks = [
    { step: '1', title: 'Book Your Strategy Call', description: 'Pick a slot on our Cal.com calendar. The call is completely free and obligation-free — we map out exactly how we would fill your calendar.' },
    { step: '2', title: 'We Define Your Ideal Client', description: 'Together we lock in your offer, target market, and qualification criteria — budget, authority, need, and timeline.' },
    { step: '3', title: 'We Run the Outreach', description: 'Our team prospects and follows up with your ideal clients across email, LinkedIn, and phone. All done for you — you never lift a finger.' },
    { step: '4', title: 'Prospects Get Qualified', description: 'Every lead is vetted against your criteria. Only prospects with real buying intent and decision-making authority move forward.' },
    { step: '5', title: 'Appointments Land on Your Calendar', description: 'Qualified, pre-vetted meetings are booked straight into your calendar with confirmations and reminders. All you do is show up and close.' },
  ];

  /** FAQ accordion items. */
  faqs = [
    { question: 'What exactly does your appointment-setting service do?', answer: 'We book high-quality, pre-qualified sales appointments for your business. You tell us the type of client you want to speak to, and our team finds and qualifies prospects who are genuinely ready to talk, then schedules the calls on your calendar.', open: false },
    { question: 'What do you mean by “pre-qualified intent leads”?', answer: 'Before any appointment is booked, we vet each prospect on their need for your product or service, their budget, and their decision-making authority. Only prospects who show real buying intent reach your calendar — so your time is spent on meetings likely to close.', open: false },
    { question: 'Do I have to do any of the outreach or prospecting myself?', answer: 'No. We handle the entire outreach — identifying prospects, making contact, qualifying them, and booking the calls. All you do is show up to the pre-qualified appointments we schedule for you and focus on closing and growing your business.', open: false },
    { question: 'How many appointments can I expect?', answer: 'That depends on your target market and how much capacity you have to take meetings. We customise a monthly appointment target to your business so you get a steady, predictable flow of qualified calls without overwhelming your calendar.', open: false },
    { question: 'How are the appointments booked into my calendar?', answer: 'The moments we qualify are automatically scheduled into your booking calendar. You receive instant confirmations and reminders, so you always know exactly who you\'re meeting and when — no double-bookings, no missed calls.', open: false },
    { question: 'How fast will I start seeing booked appointments?', answer: 'Most clients begin receiving qualified appointments within the first two weeks. Once we understand your ideal client, we ramp up outreach quickly and keep your pipeline filled month after month so you can hit your sales targets.', open: false },
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



