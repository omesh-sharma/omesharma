# Portfolio Data Model

This folder is the single source of truth for the next version of the portfolio.

`profile.json` is designed to power the site UI without hardcoding personal content inside HTML. The site can render sections from this data and grow over time as new products, services, articles, videos, case studies, testimonials, and side hustles are added.

## Main Sections

- `identity`: Name, headline, bio, location, images, and resume link.
- `positioning`: How Omesh should be positioned professionally and commercially.
- `quickStats`: Small proof points for the hero or dashboard.
- `journey`: High-level story timeline.
- `experience`: Career history and role-level details.
- `skillGroups`: Domain-based skills, replacing old percentage bars.
- `products`: Delivered systems, product prototypes, and marketable builds.
- `projects`: GitHub, personal, and public projects.
- `services`: Services offered to clients, founders, and teams.
- `sideHustles`: Experiments, product ideas, and entrepreneurial work.
- `aiLab`: AI, OCR, computer vision, agents, and automation experiments.
- `openSource`: GitHub profile, featured repos, and contribution proof.
- `content`: Blog, YouTube, talks, and notes.
- `caseStudies`: Long-form technical breakdowns.
- `testimonials` and `ratings`: Reviews, recommendations, and social proof.
- `achievements`, `certifications`, `education`: Credibility blocks.
- `socials` and `contact`: Contact and external presence.
- `site`: SEO, theme, navigation, and site-level settings.

## Editing Rule

Future content updates should happen here first. UI files should only decide how to display this data.

## Suggested UI Mapping

- Hero: `identity`, `positioning`, `quickStats`, `socials`
- What I Do: `positioning.focusAreas`, `skillGroups`
- Journey: `journey`, `experience`
- Products: `products`, `caseStudies`
- Services: `services`
- Lab: `sideHustles`, `aiLab`
- Proof: `openSource`, `achievements`, `ratings`, `testimonials`
- Content: `content.blog`, `content.youtube`, `content.talks`
- Contact: `contact`, `socials`
