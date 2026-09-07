# Process Zero Squeeze Landing Page

A dedicated **squeeze landing page** for the Cal.com booking event **"Risk-Free Client Acquisition and Lead Vetting"** by Xhanti Mzozoyana.

This is a **separate Angular + Ionic web application** that shares the **exact same CSS, styling, and theme** as the main `process-zero-ionic` app.

## What It Does

1. **Hero section** — Prominently features the "Risk-Free Client Acquisition and Lead Vetting" event name with the same Process Zero branding.
2. **Lead capture form** — Users enter their name, email, phone, company, and role. This is the "squeeze" — qualifying leads before revealing the calendar.
3. **Cal.com inline embed** — After form submission, the [Cal.com inline embed](https://cal.com/xhanti-mzozoyana-50g1ck/process-zero-risk-free-client-acquisition-and-lead-vetting) is dynamically loaded, letting the user pick a time slot directly on the page.
4. **Benefits grid** — Highlights the key value propositions: Zero Risk, Pre-Vetted Decision Makers, Recurring Commissions, etc.
5. **How-it-works** — 5-step process from call to first sale.
6. **FAQ accordion** — Common questions about the strategy call.
7. **Final CTA** — Another path to launch the Cal.com booking.
8. **Shared nav & footer** — Same navigation bar and footer as the main app.

## Design System

Uses the identical design tokens from the main Process Zero app:

| Token  | Value      | Usage               |
|--------|------------|---------------------|
| `$sand`| `#f6f1e8`  | Light backgrounds   |
| `$paper`| `#fffdf9` | Card backgrounds    |
| `$ink` | `#172121`  | Primary text        |
| `$muted`| `#607078` | Secondary text      |
| `$gold`| `#d7a449`  | Accent / highlights |
| `$teal`| `#1d7874`  | Primary accent       |
| `$blue`| `#335c67`  | Gradient secondary   |
| `$coral`| `#c06c52` | Urgency highlights   |

## Scripts

```bash
npm install          # install dependencies
npm start            # serve on http://localhost:4201
npm run build        # production build → www/
npm run lint         # ESLint
npm test             # Karma unit tests
```

## Cal.com Integration

The Cal.com inline embed is loaded **dynamically** after the user submits the lead form. This ensures the heavy third-party script only loads for qualified leads.

The embed link configured in `src/environments/environment.ts`:
```
xhanti-mzozoyana-50g1ck/process-zero-risk-free-client-acquisition-and-lead-vetting
```

## Deployment

Deploys to Vercel with the included `vercel.json`:
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "www"
}
```
