(function () {
    "use strict";

    var state = {
        profile: null
    };

    function $(selector) {
        return document.querySelector(selector);
    }

    function $all(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function listItems(items, className) {
        return (items || []).map(function (item) {
            return '<li class="' + (className || "") + '">' + escapeHtml(item) + "</li>";
        }).join("");
    }

    function tags(items) {
        return (items || []).map(function (item) {
            return '<span class="tag">' + escapeHtml(item) + "</span>";
        }).join("");
    }

    function setText(selector, value) {
        var node = $(selector);
        if (node) {
            node.textContent = value || "";
        }
    }

    function setHtml(selector, value) {
        var node = $(selector);
        if (node) {
            node.innerHTML = value || "";
        }
    }

    function link(label, href, className) {
        if (!href) {
            return "";
        }
        return '<a class="' + className + '" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' + escapeHtml(label) + "</a>";
    }

    function renderNavigation(profile) {
        var nav = $("[data-nav]");
        if (!nav) {
            return;
        }
        nav.innerHTML = (profile.site.navigation || []).map(function (item) {
            return '<a href="#' + escapeHtml(item.target) + '">' + escapeHtml(item.label) + "</a>";
        }).join("");
    }

    function renderHero(profile) {
        setText('[data-field="primaryRole"]', profile.positioning.primaryRole);
        setText('[data-field="headline"]', profile.identity.headline);
        setText('[data-field="tagline"]', profile.identity.tagline);
        setText('[data-field="name"]', profile.identity.name);
        setText('[data-field="location"]', [
            profile.identity.location.city,
            profile.identity.location.state,
            profile.identity.location.country
        ].filter(Boolean).join(", "));

        var image = $("[data-profile-image]");
        if (image) {
            image.src = profile.identity.avatar;
            image.alt = profile.identity.name;
        }

        setHtml("[data-hero-actions]", [
            link(profile.landing.primaryCta || "Start a Conversation", profile.contact.whatsappUrl || "mailto:" + profile.contact.email, "button button-primary"),
            link(profile.landing.secondaryCta || "View Resume", profile.identity.resumeUrl, "button"),
            link("GitHub", profile.openSource.profileUrl, "button"),
            link("LinkedIn", getSocial(profile, "LinkedIn"), "button")
        ].join(""));

        setText("[data-availability]", profile.landing.availability);

        setHtml("[data-stats]", (profile.quickStats || []).map(function (stat) {
            return [
                '<article class="stat-card">',
                '<strong>' + escapeHtml(stat.value) + "</strong>",
                '<span>' + escapeHtml(stat.label) + "</span>",
                '<p>' + escapeHtml(stat.description) + "</p>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderLanding(profile) {
        setText("[data-trust-line]", profile.landing.trustLine);
        setHtml("[data-offer-highlights]", (profile.landing.offerHighlights || []).map(function (item) {
            return '<span>' + escapeHtml(item) + "</span>";
        }).join(""));

        setHtml("[data-audiences]", (profile.landing.audiences || []).map(function (item) {
            return [
                '<article class="audience-card">',
                '<span>For</span>',
                '<h3>' + escapeHtml(item.name) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function getSocial(profile, platform) {
        var item = (profile.socials || []).find(function (social) {
            return social.platform === platform;
        });
        return item ? item.url : "";
    }

    function renderFocus(profile) {
        var focus = (profile.positioning.focusAreas || []).slice(0, 8);
        var groups = profile.skillGroups || [];
        setHtml("[data-focus-areas]", focus.map(function (area, index) {
            var group = groups[index % groups.length] || {};
            return [
                '<article class="bento-card">',
                '<span class="card-index">0' + (index + 1) + "</span>",
                '<h3>' + escapeHtml(area) + "</h3>",
                '<p>' + escapeHtml(group.summary || profile.identity.shortBio) + "</p>",
                '<div class="mini-tags">' + tags((group.skills || []).slice(0, 5)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderJourney(profile) {
        setHtml("[data-journey]", (profile.journey || []).map(function (item) {
            return [
                '<article class="timeline-item">',
                '<span>' + escapeHtml(item.period) + "</span>",
                '<h3>' + escapeHtml(item.title) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderExperience(profile) {
        setHtml("[data-experience]", (profile.experience || []).map(function (item) {
            return [
                '<article class="experience-card">',
                '<div class="experience-head">',
                '<div>',
                '<p class="eyebrow">' + escapeHtml(item.period) + "</p>",
                '<h3>' + escapeHtml(item.role) + "</h3>",
                '<p>' + escapeHtml(item.company) + " / " + escapeHtml(item.location) + "</p>",
                "</div>",
                "</div>",
                '<p class="card-summary">' + escapeHtml(item.summary) + "</p>",
                '<ul class="feature-list">' + listItems((item.highlights || []).slice(0, 5)) + "</ul>",
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 12)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderProducts(profile) {
        setHtml("[data-products]", (profile.products || []).map(function (item) {
            return [
                '<article class="product-card">',
                '<div class="product-topline">',
                '<span>' + escapeHtml(item.type) + "</span>",
                '<span>' + escapeHtml(item.status) + "</span>",
                "</div>",
                '<h3>' + escapeHtml(item.name) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                '<div class="product-section"><strong>Problem</strong><p>' + escapeHtml(item.problem) + "</p></div>",
                '<div class="product-section"><strong>Role</strong><p>' + escapeHtml(item.yourRole) + "</p></div>",
                '<ul class="feature-list">' + listItems((item.impact || item.features || []).slice(0, 4)) + "</ul>",
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 10)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderServices(profile) {
        setHtml("[data-services]", (profile.services || []).map(function (item) {
            return [
                '<article class="service-card">',
                '<h3>' + escapeHtml(item.name) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                '<div class="service-block"><strong>Deliverables</strong><ul>' + listItems((item.deliverables || []).slice(0, 5)) + "</ul></div>",
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 8)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderLab(profile) {
        setHtml("[data-ai-lab]", [
            '<div class="panel">',
            "<h3>AI Lab</h3>",
            (profile.aiLab || []).map(simplePanelItem).join(""),
            "</div>"
        ].join(""));

        setHtml("[data-side-hustles]", [
            '<div class="panel">',
            "<h3>Side Hustles</h3>",
            (profile.sideHustles || []).map(simplePanelItem).join(""),
            "</div>"
        ].join(""));
    }

    function simplePanelItem(item) {
        return [
            '<article class="compact-item">',
            '<span>' + escapeHtml(item.status || item.category || "") + "</span>",
            '<h4>' + escapeHtml(item.name) + "</h4>",
            '<p>' + escapeHtml(item.summary) + "</p>",
            '<div class="mini-tags">' + tags((item.topics || item.techStack || []).slice(0, 6)) + "</div>",
            "</article>"
        ].join("");
    }

    function renderProof(profile) {
        setHtml("[data-achievements]", (profile.achievements || []).map(function (item) {
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.category) + "</span>",
                '<h4>' + escapeHtml(item.title) + "</h4>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                "</article>"
            ].join("");
        }).join(""));

        setHtml("[data-skills]", (profile.skillGroups || []).map(function (group) {
            return '<span class="skill-pill">' + escapeHtml(group.name) + "</span>";
        }).join(""));

        setHtml("[data-education]", (profile.education || []).map(function (item) {
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.period) + "</span>",
                '<h4>' + escapeHtml(item.degree) + " - " + escapeHtml(item.field) + "</h4>",
                '<p>' + escapeHtml(item.institution) + ", " + escapeHtml(item.location) + "</p>",
                "</article>"
            ].join("");
        }).join(""));

        setHtml("[data-testimonials]", (profile.testimonials || []).map(function (item) {
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.source || item.status || "") + "</span>",
                '<h4>' + escapeHtml(item.name) + "</h4>",
                '<p>' + escapeHtml(item.quote) + "</p>",
                "</article>"
            ].join("");
        }).join(""));

        setHtml("[data-freelance]", (profile.landing.freelanceProfiles || []).map(function (item) {
            var body = item.url
                ? link("Open " + item.platform, item.url, "text-link")
                : '<p>' + escapeHtml(item.status || "Planned") + "</p>";
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.status || "") + "</span>",
                '<h4>' + escapeHtml(item.platform) + "</h4>",
                body,
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderContent(profile) {
        var blogCount = (profile.content.blog.posts || []).length;
        var videoCount = (profile.content.youtube.videos || []).length;
        setHtml("[data-content]", [
            contentCard("Blog", profile.content.blog.summary, blogCount + " posts ready", ""),
            contentCard("YouTube", profile.content.youtube.summary, videoCount + " videos mapped", profile.content.youtube.channelUrl),
            contentCard("Case Studies", "Long-form architecture and product breakdowns from major systems.", (profile.caseStudies || []).length + " drafts", ""),
            contentCard("Ratings", profile.ratings.summary, (profile.ratings.items || []).length + " reviews", "")
        ].join(""));
    }

    function contentCard(title, summary, meta, href) {
        return [
            '<article class="content-card">',
            '<span>' + escapeHtml(meta) + "</span>",
            '<h3>' + escapeHtml(title) + "</h3>",
            '<p>' + escapeHtml(summary) + "</p>",
            href ? link("Open", href, "text-link") : "",
            "</article>"
        ].join("");
    }

    function renderContact(profile) {
        setText("[data-contact-summary]", profile.contact.callToAction);
        setHtml("[data-contact-actions]", [
            link("Email", "mailto:" + profile.contact.email, "button button-primary"),
            link("WhatsApp", profile.contact.whatsappUrl, "button"),
            link("LinkedIn", getSocial(profile, "LinkedIn"), "button"),
            link("GitHub", profile.openSource.profileUrl, "button")
        ].join(""));

        setText("[data-footer-name]", profile.identity.name + " / " + profile.identity.headline);
        setHtml("[data-footer-socials]", (profile.socials || []).map(function (social) {
            return link(social.platform, social.url, "footer-link");
        }).join(""));
    }

    function setupNavigation() {
        var button = $(".nav-toggle");
        var nav = $(".site-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(open));
        });
        nav.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                nav.classList.remove("is-open");
                button.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setupActiveSections() {
        var sections = $all("main section[id]");
        var links = $all(".site-nav a");
        if (!("IntersectionObserver" in window)) {
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                links.forEach(function (linkItem) {
                    linkItem.classList.toggle("is-active", linkItem.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px" });
        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function render(profile) {
        state.profile = profile;
        document.title = profile.site.title;
        renderNavigation(profile);
        renderHero(profile);
        renderLanding(profile);
        renderFocus(profile);
        renderJourney(profile);
        renderExperience(profile);
        renderProducts(profile);
        renderServices(profile);
        renderLab(profile);
        renderProof(profile);
        renderContent(profile);
        renderContact(profile);
        setupNavigation();
        setupActiveSections();
        document.body.classList.add("is-loaded");
        var loading = $("[data-loading]");
        if (loading) {
            loading.remove();
        }
    }

    fetch("data/profile.json", { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load profile.json");
            }
            return response.json();
        })
        .then(render)
        .catch(function (error) {
            var loading = $("[data-loading]");
            if (loading) {
                loading.textContent = "Could not load portfolio data. Run the site from a local server or GitHub Pages.";
            }
            console.error(error);
        });
})();
