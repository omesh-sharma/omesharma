# DevFolio Transformation Plan

## Positioning

The new portfolio should present Omesh Sharma as a senior engineer and builder, not just a resume page.

Primary message:

> Senior Software Engineer building distributed systems, backend platforms, AI/OCR products, automation workflows, and enterprise-grade software.

The site should show four signals quickly:

- Enterprise depth: Oracle BRM, messaging systems, high availability, secure communication, production support.
- Product ownership: Document AI platform, quant/backtesting platform, VR/graphics systems, automation tools.
- Builder energy: services, side hustles, AI lab, content, experiments, entrepreneurial work.
- Trust: experience, achievements, case studies, GitHub, resume, contact, ratings/testimonials when available.

## Information Architecture

1. Hero
   - Name, senior positioning, current focus, location, resume, contact, GitHub, LinkedIn.
   - Quick stats from `data/profile.json`.

2. What I Build
   - Bento grid from `positioning.focusAreas`, `skillGroups`, and top services.
   - Categories: Distributed Systems, Backend APIs, Document AI, DevOps, AI Agents, Quant Systems, Product Engineering.

3. Journey
   - Timeline from `journey` and `experience`.
   - Should feel like LinkedIn profile plus engineering story.

4. Featured Systems
   - Cards from `products`.
   - Oracle platform, Document AI platform, Quant engine, Graphics/VR framework.

5. Services
   - Marketable services from `services`.
   - Designed for founders, enterprise teams, product teams, and automation-heavy businesses.

6. Lab and Side Hustles
   - AI lab, trading research, personal portfolio platform, future experiments.
   - Shows entrepreneurial spirit and continuous building.

7. Proof and Credibility
   - Achievements, ratings/testimonials, GitHub, open-source, certifications, education.

8. Content
   - Blog, YouTube, notes, talks.
   - Can start empty but should have a strong visual placeholder.

9. Contact
   - Email, WhatsApp, LinkedIn, GitHub.
   - Clear call to action for roles, projects, MVPs, automation, or collaboration.

## Visual Direction

- Dark technical interface with premium contrast.
- Bento dashboard layout instead of old template sections.
- Subtle motion and scroll reveals, not heavy animation.
- Strong typography and concise copy.
- No old percentage skill bars.
- Cards should show impact, stack, role, and product status.
- Mobile-first and fast on GitHub Pages.

## Technical Direction

Phase 1 can keep the current static setup:

- `index.html`
- `css/style.css`
- `js/main.js`
- `data/profile.json`

JavaScript will load `data/profile.json` and render sections dynamically. This avoids a build tool and keeps GitHub Pages deployment simple.

Later, if the site grows into blogs/case-study pages, we can migrate to Vite/React or Astro.

## Immediate Implementation Path

1. Keep `data/profile.json` as source of truth.
2. Replace old `index.html` body with a modern section skeleton.
3. Add renderer functions in `js/main.js`.
4. Replace old red template CSS with a dark bento-style system.
5. Render profile, journey, products, services, lab, content, and contact from JSON.
6. Validate mobile layout.
7. Open locally and review before deployment.
