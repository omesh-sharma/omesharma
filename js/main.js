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

    function toggleOptional(name, visible) {
        var node = $('[data-optional="' + name + '"]');
        if (node) {
            node.hidden = !visible;
        }
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

    function actionLinks(links) {
        if (!links) {
            return "";
        }
        var actions = [
            link("Request Trial", links.trial, "button button-primary"),
            link("Watch Demo", links.youtube, "button"),
            link("Demo", links.demo, "button"),
            link("GitHub", links.github, "button"),
            link("Case Study", links.caseStudy, "button")
        ].filter(Boolean);
        return actions.length ? '<div class="card-actions">' + actions.join("") + "</div>" : "";
    }

    function youtubeId(url) {
        if (!url) {
            return "";
        }
        var match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
        return match ? match[1] : "";
    }

    function mediaEmbeds(media) {
        var embeds = (media || []).map(function (item) {
            if (item.type !== "youtube") {
                return "";
            }
            var id = youtubeId(item.url);
            if (!id) {
                return "";
            }
            return [
                '<div class="video-embed">',
                '<iframe src="https://www.youtube.com/embed/' + escapeHtml(id) + '" title="' + escapeHtml(item.title || "Product demo") + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
                "</div>"
            ].join("");
        }).filter(Boolean);
        return embeds.length ? '<div class="media-stack">' + embeds.join("") + "</div>" : "";
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

        var galaxies = [
            {
                title: "AI / Agents",
                priority: "high",
                words: ["AI/ML", "MCP", "Agents", "RAG", "LLM", "Codex", "Cursor", "Cline", "OpenCode", "Prompting"]
            },
            {
                title: "Distributed Systems",
                priority: "high",
                words: ["HA", "Messaging", "Queues", "Failover", "RCA", "Scalability", "Reliability", "Transactions", "Timeouts"]
            },
            {
                title: "Backend",
                priority: "high",
                words: ["C/C++", "Python", "Java", "FastAPI", "Django", "REST", "SOAP", "Oracle BRM", "APIs"]
            },
            {
                title: "Cloud / DevOps",
                priority: "medium",
                words: ["Kubernetes", "Docker", "OCI", "Azure", "Jenkins", "CI/CD", "Helm", "Prometheus", "Grafana"]
            },
            {
                title: "Document AI",
                priority: "high",
                words: ["OCR", "PDF", "Excel", "DFA", "Vision", "Extraction", "Searchable PDF", "Tesseract", "OpenCV"]
            },
            {
                title: "Automation",
                priority: "medium",
                words: ["Web Scraping", "eCourts", "Audio", "Data Tools", "Power Query", "Pipelines", "Excel Automation"]
            },
            {
                title: "Architecture",
                priority: "medium",
                words: ["System Design", "SOLID", "Patterns", "Microservices", "Security", "Protocols", "API-first"]
            },
            {
                title: "Low-Level",
                priority: "medium",
                words: ["STL", "Pointers", "RAII", "Memory", "Threads", "GDB", "Valgrind", "Profiling"]
            },
            {
                title: "Data / Storage",
                priority: "medium",
                words: ["Oracle DB", "MySQL", "Cassandra", "Elasticsearch", "Kafka", "Blob", "NAS", "JSON"]
            },
            {
                title: "Security / Network",
                priority: "medium",
                words: ["SSL/TLS", "TLS 1.3", "FIPS", "TCP/IP", "SMTP", "DNS", "SPF/DKIM", "JWT", "IPv6"]
            },
            {
                title: "Product Delivery",
                priority: "low",
                words: ["Agile", "Scrum", "SDLC", "Mentoring", "Docs", "Customer Support", "Go-live"]
            },
            {
                title: "Quant / Research",
                priority: "low",
                words: ["Backtesting", "TA-Lib", "Binance", "Risk", "Genetic Algo", "Market Data"]
            },
            {
                title: "Frontend / UI",
                priority: "low",
                words: ["JavaScript", "HTML", "CSS", "Angular", "Qt", "Streamlit", "Dashboards"]
            },
            {
                title: "Business Tools",
                priority: "low",
                words: ["PO Templates", "Quotations", "Supply Chain", "PDF Merge", "Text to Excel"]
            },
            {
                title: "Domain Expertise",
                priority: "high",
                words: ["Telecom", "OSS/BSS",  "OpenGL(OSG)", "Vision Applications", "Graphics Engineer", "HFT (High Freq. Trading)", "Legal-Tech", "Document Ops", "Supply Chain", "BFSI", "Freelancing", "Enterprise"]
            }
        ];
        setHtml("[data-expertise-galaxies]", galaxies.map(function (galaxy, index) {
            return [
                '<div class="galaxy galaxy-' + (index + 1) + ' galaxy-' + escapeHtml(galaxy.priority) + '">',
                '<strong>' + escapeHtml(galaxy.title) + "</strong>",
                '<div>',
                galaxy.words.slice(0, 9).map(function (word) {
                    return '<span>' + escapeHtml(word) + "</span>";
                }).join(""),
                "</div>",
                "</div>"
            ].join("");
        }).join(""));

        var profileBadges = [
            "Entrepreneurial Builder",
            "Senior Software Engineer",
            "Product-Based MNC Experience",
            "Solution-Oriented Architect",
            "AI / LLM / MCP",
            "Telecom Systems",
            "Vision Apps",
            "Graphics Engineering",
            "Trading Applications",
            "Automation",
            "Orchestration",
            "Communication & Collaboration",
            "Problem Solving"
        ];
        setHtml("[data-profile-badges]", profileBadges.map(function (badge) {
            return '<span>' + escapeHtml(badge) + "</span>";
        }).join(""));

        setHtml("[data-hero-actions]", [
            link(profile.landing.primaryCta || "Start a Conversation", profile.contact.whatsappUrl || "mailto:" + profile.contact.email, "button button-primary"),
            link(profile.landing.secondaryCta || "View Resume", profile.identity.resumeUrl, "button"),
            link("GitHub", profile.openSource.profileUrl, "button"),
            link("LinkedIn", getSocial(profile, "LinkedIn"), "button")
        ].join(""));

        setText("[data-availability]", profile.landing.availability);
        setupHeroRotator(profile.landing.heroRotator || []);

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

    function setupHeroRotator(items) {
        var node = $("[data-hero-rotator]");
        if (!node || !items.length) {
            return;
        }
        var index = 0;
        node.textContent = items[index];
        if (items.length === 1) {
            return;
        }
        window.setInterval(function () {
            index = (index + 1) % items.length;
            node.classList.add("is-changing");
            window.setTimeout(function () {
                node.textContent = items[index];
                node.classList.remove("is-changing");
            }, 220);
        }, 2200);
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

    function renderTechnicalProfile(profile) {
        setHtml("[data-technical-profile]", (profile.technicalProfile || []).map(function (item) {
            return [
                '<article class="tech-card">',
                '<div class="tech-card-head">',
                '<span>' + escapeHtml(item.category) + "</span>",
                "</div>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                '<div class="mini-tags">' + tags((item.items || []).slice(0, 12)) + "</div>",
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
                '<ul class="feature-list">' + listItems((item.highlights || []).slice(0, 4)) + "</ul>",
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 10)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderProducts(profile) {
        var ownProducts = (profile.products || []).filter(function (item) {
            return item.ownership === "own-product";
        });
        var companyProducts = (profile.products || []).filter(function (item) {
            return item.ownership !== "own-product";
        });
        setHtml("[data-own-products]", ownProducts.map(renderProductCard).join(""));
        setHtml("[data-company-products]", companyProducts.map(renderProductCard).join(""));
    }

    function renderProductCard(item) {
        var ownershipLabel = item.ownership === "own-product" ? "Independent Build" : "Organization Work";
            return [
                '<article class="product-card">',
                '<div class="product-topline">',
                '<span>' + escapeHtml(item.type) + "</span>",
                '<span>' + escapeHtml(item.status) + "</span>",
                "</div>",
                '<div class="ownership-badge">' + escapeHtml(ownershipLabel) + "</div>",
                '<h3>' + escapeHtml(item.name) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                '<div class="product-meta-grid">',
                '<div class="product-section"><strong>Problem</strong><p>' + escapeHtml(item.problem) + "</p></div>",
                '<div class="product-section"><strong>My Role</strong><p>' + escapeHtml(item.yourRole) + "</p></div>",
                "</div>",
                '<div class="impact-row">' + (item.impact || item.features || []).slice(0, 3).map(function (impact) {
                    return '<span>' + escapeHtml(impact) + "</span>";
                }).join("") + "</div>",
                mediaEmbeds(item.media),
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 10)) + "</div>",
                actionLinks(item.links),
                "</article>"
            ].join("");
    }

    function renderServices(profile) {
        setHtml("[data-services]", (profile.services || []).map(function (item) {
            return [
                '<article class="service-card">',
                '<h3>' + escapeHtml(item.name) + "</h3>",
                '<p>' + escapeHtml(item.summary) + "</p>",
                '<div class="service-block"><strong>Deliverables</strong><ul>' + listItems((item.deliverables || []).slice(0, 4)) + "</ul></div>",
                '<div class="mini-tags">' + tags((item.techStack || []).slice(0, 8)) + "</div>",
                "</article>"
            ].join("");
        }).join(""));
    }

    function renderLab(profile) {
        var journey = profile.entrepreneurialJourney || {};
        setText("[data-entrepreneurial-summary]", journey.summary || "");
        setHtml("[data-entrepreneurial-journey]", [
            '<div class="panel">',
            "<h3>Freelancing and Entrepreneurial Journey</h3>",
            '<p class="panel-note">' + escapeHtml(journey.headline || "") + "</p>",
            '<div class="journey-metrics">' + ((journey.metrics || []).map(function (item) {
                return [
                    '<article>',
                    '<strong>' + escapeHtml(item.value) + "</strong>",
                    '<span>' + escapeHtml(item.label) + "</span>",
                    '<p>' + escapeHtml(item.description) + "</p>",
                    "</article>"
                ].join("");
            }).join("")) + "</div>",
            '<div class="mini-tags">' + tags(journey.themes || []) + "</div>",
            '<div class="domain-served"><h4>Customer Domains Served</h4>' + ((journey.customerDomainsServed || []).map(function (domain) {
                return [
                    '<article>',
                    '<strong>' + escapeHtml(domain.name) + "</strong>",
                    domain.fullName ? '<span>' + escapeHtml(domain.fullName) + "</span>" : "",
                    '<p>' + escapeHtml(domain.summary) + "</p>",
                    "</article>"
                ].join("");
            }).join("")) + "</div>",
            "</div>"
        ].join(""));

        setHtml("[data-ai-lab]", [
            '<div class="panel">',
            "<h3>AI Lab</h3>",
            (profile.aiLab || []).map(simplePanelItem).join(""),
            "</div>"
        ].join(""));

        setHtml("[data-side-hustles]", [
            '<div class="panel">',
            "<h3>Owned Products and Service Tools</h3>",
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
            actionLinks(item.links),
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

        var testimonials = (profile.testimonials || []).filter(function (item) {
            return item && item.status !== "placeholder";
        });
        toggleOptional("testimonials", testimonials.length > 0);
        setHtml("[data-testimonials]", testimonials.map(function (item) {
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.source || item.status || "") + "</span>",
                '<h4>' + escapeHtml(item.name) + "</h4>",
                '<p>' + escapeHtml(item.quote) + "</p>",
                "</article>"
            ].join("");
        }).join(""));

        var freelanceProfiles = (profile.landing.freelanceProfiles || []).filter(function (item) {
            return item && item.url;
        });
        toggleOptional("freelance", freelanceProfiles.length > 0);
        setHtml("[data-freelance]", freelanceProfiles.map(function (item) {
            return [
                '<article class="compact-item">',
                '<span>' + escapeHtml(item.status || "") + "</span>",
                '<h4>' + escapeHtml(item.platform) + "</h4>",
                link("Open " + item.platform, item.url, "text-link"),
                "</article>"
            ].join("");
        }).join(""));
    }

    function certificationCategory(item) {
        var text = [
            item.name,
            item.issuer,
            (item.skills || []).join(" ")
        ].join(" ").toLowerCase();
        if (text.indexOf("oracle") >= 0) {
            return "Oracle";
        }
        if (text.indexOf("linkedin") >= 0) {
            return "LinkedIn";
        }
        if (text.indexOf("ai") >= 0 || text.indexOf("artificial intelligence") >= 0 || text.indexOf("machine learning") >= 0 || text.indexOf("generative") >= 0 || text.indexOf("prompt") >= 0) {
            return "AI";
        }
        if (text.indexOf("cloud") >= 0 || text.indexOf("kubernetes") >= 0 || text.indexOf("docker") >= 0 || text.indexOf("terraform") >= 0 || text.indexOf("oci") >= 0 || text.indexOf("aws") >= 0) {
            return "Cloud";
        }
        if (text.indexOf("cybersecurity") >= 0 || text.indexOf("hacker") >= 0 || text.indexOf("security") >= 0) {
            return "Security";
        }
        return "Other";
    }

    function renderCertificationSection(profile) {
        var certifications = ((profile.certifications && profile.certifications.items) || []).filter(Boolean);
        setText("[data-certification-summary]", certifications.length + " certifications across Oracle BRM, OCI, AI/ML, cloud, Kubernetes, microservices, cybersecurity, data engineering, C/C++, and architecture.");
        setHtml("[data-certification-grid]", certifications.map(function (item) {
            var category = certificationCategory(item);
            return [
                '<article class="cert-card" data-cert-category="' + escapeHtml(category) + '">',
                '<div class="cert-meta">',
                '<span>' + escapeHtml(item.issuer || "Certification") + "</span>",
                '<span>' + escapeHtml(item.issued || "") + "</span>",
                "</div>",
                '<h3>' + escapeHtml(item.name || item.title || "") + "</h3>",
                item.summary ? '<p>' + escapeHtml(item.summary) + "</p>" : "",
                item.skills ? '<div class="mini-tags">' + tags(item.skills.slice(0, 5)) + "</div>" : "",
                item.url ? link("View credential", item.url, "text-link") : "",
                "</article>"
            ].join("");
        }).join(""));
        setupCertificationFilters();
    }

    function setupCertificationFilters() {
        var buttons = $all("[data-cert-filter]");
        var cards = $all("[data-cert-category]");
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var filter = button.getAttribute("data-cert-filter");
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                cards.forEach(function (card) {
                    var category = card.getAttribute("data-cert-category");
                    var text = card.textContent.toLowerCase();
                    var show = filter === "all" || category === filter || text.indexOf(filter.toLowerCase()) >= 0;
                    card.hidden = !show;
                });
            });
        });
    }

    function renderContent(profile) {
        var blogCount = (profile.content.blog.posts || []).length;
        var videoCount = (profile.content.youtube.videos || []).length;
        var cards = [];
        if (blogCount > 0) {
            cards.push(contentCard("Blog", profile.content.blog.summary, blogCount + " posts", ""));
        }
        if (profile.content.youtube.channelUrl) {
            cards.push(contentCard("YouTube", profile.content.youtube.summary, videoCount ? videoCount + " videos" : "Channel ready", profile.content.youtube.channelUrl));
        }
        if ((profile.caseStudies || []).length > 0) {
            cards.push(contentCard("Case Studies", "Long-form architecture and product breakdowns from major systems.", profile.caseStudies.length + " drafts", ""));
        }
        if ((profile.ratings.items || []).length > 0) {
            cards.push(contentCard("Ratings", profile.ratings.summary, profile.ratings.items.length + " reviews", ""));
        }
        toggleOptional("content", cards.length > 0);
        setHtml("[data-content]", cards.join(""));
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
        renderTechnicalProfile(profile);
        renderJourney(profile);
        renderExperience(profile);
        renderProducts(profile);
        renderServices(profile);
        renderLab(profile);
        renderProof(profile);
        renderCertificationSection(profile);
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
