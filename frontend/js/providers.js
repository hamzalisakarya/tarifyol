(() => {
    "use strict";

    // cshow source URLs document the original creatives; rendered images use the local, byte-identical copies.
    const providers = [
        {
            id: "lichtblick",
            name: { de: "LichtBlick", tr: "LichtBlick" },
            categories: ["electricity", "gas"],
            logoCreative: { id: "2608676", imageUrl: "/assets/images/providers/lichtblick-awin-creative.png", sourceUrl: "https://www.awin1.com/cshow.php?s=2608676&v=19047&q=385861&r=2991193" },
            products: {
                electricity: {
                    active: true,
                    affiliateUrl: "https://www.awin1.com/cread.php?s=2608676&v=19047&q=385861&r=2991193"
                },
                gas: {
                    active: true,
                    affiliateUrl: "https://www.awin1.com/cread.php?s=2608676&v=19047&q=385861&r=2991193"
                }
            }
        },
        {
            id: "tibber",
            name: { de: "Tibber", tr: "Tibber" },
            categories: ["electricity"],
            products: {
                electricity: {
                    active: true,
                    logoCreative: { id: "3423817", imageUrl: "/assets/images/providers/tibber-awin-creative.jpg", sourceUrl: "https://www.awin1.com/cshow.php?s=3423817&v=57405&q=468551&r=2991193" },
                    affiliateUrl: "https://www.awin1.com/cread.php?s=3423817&v=57405&q=468551&r=2991193",
                    description: {
                        de: "Dynamischer Stromtarif mit Börsenpreisen und App-Steuerung.",
                        tr: "Borsa fiyatlarına ve uygulama kontrolüne dayalı dinamik elektrik tarifesi."
                    }
                }
            }
        },
        {
            id: "plan-b-net-zero-energy",
            name: { de: "PLAN-B NET ZERO ENERGY", tr: "PLAN-B NET ZERO ENERGY" },
            categories: ["electricity"],
            products: {
                electricity: {
                    active: true,
                    homepageAffiliateUrl: "https://www.awin1.com/cread.php?s=4828292&v=115491&q=607448&r=2991193",
                    homepageLinkLabel: { de: "PLAN-B NET ZERO ENERGY – Partnerangebot öffnen", tr: "PLAN-B NET ZERO ENERGY – iş ortağı teklifini aç" },
                    homepageTitle: { de: "PLAN-B NET ZERO ENERGY", tr: "PLAN-B NET ZERO ENERGY" },
                    homepageCreative: {
                        id: "4828292",
                        imageUrl: "https://www.awin1.com/cshow.php?s=4828292&v=115491&q=607448&r=2991193",
                        width: 336,
                        height: 56,
                        alt: "PLAN-B NET ZERO ENERGY Werbebanner"
                    },
                    bannerCreative: { id: "4793120", imageUrl: "/assets/images/providers/plan-b-awin-banner.jpg", sourceUrl: "https://www.awin1.com/cshow.php?s=4793120&v=115491&q=607448&r=2991193", width: 300, height: 600 },
                    affiliateUrl: "https://www.awin1.com/cread.php?s=4793120&v=115491&q=607448&r=2991193"
                }
            }
        },
        {
            id: "eins-energie",
            name: { de: "eins energie", tr: "eins energie" },
            categories: ["electricity", "gas"],
            logoCreative: { id: "2888656", imageUrl: "/assets/images/providers/eins-energy-awin-logo.png", sourceUrl: "https://www.awin1.com/cshow.php?s=2888656&v=23289&q=412934&r=2991193", width: 150, height: 50 },
            products: {
                electricity: {
                    active: true,
                    affiliateCreativeId: "2904598",
                    affiliateUrl: "https://www.awin1.com/awclick.php?gid=415336&mid=23289&awinaffid=2991193&linkid=2904598&clickref=",
                    bannerCreative: { id: "3345384", width: 300, height: 250, imageUrl: null }
                },
                gas: {
                    active: true,
                    affiliateCreativeId: "3333661",
                    affiliateUrl: "https://www.awin1.com/awclick.php?gid=415336&mid=23289&awinaffid=2991193&linkid=3333661&clickref=",
                    bannerCreative: { id: "3345383", width: 300, height: 250, imageUrl: null }
                }
            }
        },
        {
            id: "mvv-energie",
            name: { de: "MVV Energie", tr: "MVV Energie" },
            categories: ["electricity"],
            products: {
                electricity: {
                    active: true,
                    affiliateCreativeId: "4856783",
                    affiliateUrl: "https://www.awin1.com/cread.php?s=4856783&v=77970&q=509396&r=2991193",
                    homepageAffiliateUrl: "https://www.awin1.com/cread.php?s=4856786&v=77970&q=509396&r=2991193",
                    homepageLinkLabel: { de: "MVV Energie – Partnerangebot öffnen", tr: "MVV Energie – iş ortağı teklifini aç" },
                    homepageTitle: { de: "MVV Energie", tr: "MVV Energie" },
                    homepageCreative: {
                        id: "4856786",
                        imageUrl: "https://www.awin1.com/cshow.php?s=4856786&v=77970&q=509396&r=2991193",
                        width: 936,
                        height: 120,
                        alt: "MVV Energie – offizielles Werbebanner"
                    },
                    bannerCreative: {
                        id: "4856783",
                        imageUrl: "/assets/images/providers/mvv-direkt-awin-banner.jpg",
                        sourceUrl: "https://www.awin1.com/cshow.php?s=4856783&v=77970&q=509396&r=2991193",
                        width: 600,
                        height: 500
                    },
                    regionalNote: {
                        de: "Der MVV DIREKT Ökostrom Tarif ist regional begrenzt. Die Verfügbarkeit hängt von der Lieferadresse ab.",
                        tr: "MVV DIREKT yeşil elektrik tarifesi bölgesel olarak sınırlıdır. Kullanılabilirlik teslimat adresine bağlıdır."
                    }
                }
            }
        },
        {
            id: "vodafone-de",
            name: { de: "Vodafone", tr: "Vodafone" },
            categories: ["internet"],
            products: {
                internet: {
                    active: true,
                    logoCreative: { id: "2365510", imageUrl: "https://www.awin1.com/cshow.php?s=2365510&v=11331&q=360901&r=2991193" },
                    affiliateUrl: "https://www.awin1.com/awclick.php?gid=437813&mid=11331&awinaffid=2991193&linkid=3148727&clickref=",
                    compactLabel: {
                        de: "Verfügbarkeit prüfen",
                        tr: "Adresinde uygunluğu kontrol et"
                    }
                }
            }
        },
        {
            id: "check24-dsl",
            name: { de: "CHECK24 DSL", tr: "CHECK24 DSL" },
            categories: ["internet"],
            products: {
                internet: {
                    active: true,
                    logoCreative: { imageUrl: "https://a.check24.net/misc/view.php?pid=1172472&aid=76&cat=4", width: 468, height: 60 },
                    affiliateUrl: "https://a.check24.net/misc/click.php?pid=1172472&aid=76&deep=dsl-anbieterwechsel&cat=4"
                }
            }
        }
    ];

    function setTranslatedText(element, text) {
        element.textContent = text;
        element.dataset.de = text;
        element.dataset.tr = text;
    }

    function providerName(provider) {
        if (provider.name && typeof provider.name === "object") return provider.name;
        const fallback = String(provider.name || provider.id || "Anbieter");
        return { de: fallback, tr: fallback };
    }

    function currentLanguage() {
        return document.documentElement.lang === "tr" ? "tr" : "de";
    }

    function appendMedia(parent, creative, isBanner, altText = "") {
        const imageUrl = creative && creative.imageUrl;
        if (!imageUrl) return false;
        const image = document.createElement("img");
        image.className = isBanner
            ? "provider-card-banner"
            : (parent.classList.contains("home-provider-mini-card") ? "home-provider-mini-logo" : "provider-card-logo");
        image.src = imageUrl;
        image.alt = creative.alt || altText;
        if (creative.width) image.width = creative.width;
        if (creative.height) image.height = creative.height;
        image.loading = "lazy";
        parent.append(image);
        return true;
    }

    function appendName(parent, name) {
        const label = document.createElement("span");
        label.className = "provider-card-name";
        setTranslatedText(label, name[currentLanguage()] || name.de || name.tr || "Anbieter");
        label.dataset.de = name.de || name.tr || "Anbieter";
        label.dataset.tr = name.tr || name.de || "Anbieter";
        parent.append(label);
    }

    function appendOptionalCopy(parent, copy, className) {
        if (!copy || (!copy.de && !copy.tr)) return;
        const text = document.createElement("p");
        if (className) text.className = className;
        setTranslatedText(text, copy.de || copy.tr);
        text.dataset.de = copy.de || copy.tr;
        text.dataset.tr = copy.tr || copy.de;
        parent.append(text);
    }

    function renderCompactCard(provider, product, name) {
        const affiliateUrl = product.homepageAffiliateUrl || product.affiliateUrl;
        const clickable = product.active === true && Boolean(affiliateUrl);
        const card = document.createElement(clickable ? "a" : "span");
        card.className = "home-provider-name home-provider-mini-card";
        if (clickable) {
            card.href = affiliateUrl;
            card.target = "_blank";
            card.rel = "sponsored noopener noreferrer";
            if (product.homepageLinkLabel) {
                if (typeof product.homepageLinkLabel === "object") {
                    card.dataset.ariaLabelDe = product.homepageLinkLabel.de || product.homepageLinkLabel.tr || "";
                    card.dataset.ariaLabelTr = product.homepageLinkLabel.tr || product.homepageLinkLabel.de || "";
                    card.setAttribute("aria-label", product.homepageLinkLabel[currentLanguage()] || product.homepageLinkLabel.de || "");
                } else {
                    card.setAttribute("aria-label", product.homepageLinkLabel);
                }
            }
        }
        const creative = product.homepageCreative || provider.logoCreative || product.logoCreative;
        const isBanner = Number(creative && creative.width) >= 300;
        if (product.homepageTitle) {
            const title = document.createElement("span");
            title.className = "provider-card-home-title";
            if (typeof product.homepageTitle === "object") {
                title.dataset.de = product.homepageTitle.de || product.homepageTitle.tr || "";
                title.dataset.tr = product.homepageTitle.tr || product.homepageTitle.de || "";
                title.textContent = product.homepageTitle[currentLanguage()] || product.homepageTitle.de || "";
            } else {
                title.textContent = product.homepageTitle;
            }
            card.classList.add("has-homepage-title");
            card.append(title);
        }
        const hasLogo = appendMedia(card, creative, isBanner, name.de || name.tr);
        if (!hasLogo) appendName(card, name);
        if (product.compactLabel) {
            card.classList.add("has-caption");
            const caption = document.createElement("span");
            caption.className = "provider-card-caption";
            caption.textContent = product.compactLabel[currentLanguage()] || product.compactLabel.de || product.compactLabel.tr || "";
            caption.dataset.de = product.compactLabel.de || product.compactLabel.tr || "";
            caption.dataset.tr = product.compactLabel.tr || product.compactLabel.de || "";
            card.append(caption);
        }
        return card;
    }

    function renderDetailCard(provider, product, name, category) {
        const article = document.createElement("article");
        article.className = "provider-partner-tile provider-card";

        const clickable = product.active === true && Boolean(product.affiliateUrl);
        const content = document.createElement(clickable ? "a" : "div");
        content.className = "provider-card-content";
        if (clickable) {
            content.href = product.affiliateUrl;
            content.target = "_blank";
            content.rel = "sponsored noopener noreferrer";
        }

        const media = document.createElement("span");
        media.className = "provider-card-media";
        const hasLogo = appendMedia(media, provider.logoCreative || product.logoCreative, false, name.de || name.tr);
        const hasBanner = !hasLogo && appendMedia(media, product.bannerCreative, true);
        if (hasLogo || hasBanner) content.append(media);

        if (!hasLogo || category !== "electricity") {
            const heading = document.createElement("h3");
            appendName(heading, name);
            content.append(heading);
        }
        appendOptionalCopy(content, product.description, "provider-card-description");
        article.append(content);
        if (product.regionalNote) {
            const disclosure = document.createElement("details");
            disclosure.className = "provider-region-disclosure";
            const summary = document.createElement("summary");
            setTranslatedText(summary, "Regionale Verfügbarkeit");
            summary.dataset.de = "Regionale Verfügbarkeit";
            summary.dataset.tr = "Bölgesel kullanılabilirlik";
            disclosure.append(summary);
            appendOptionalCopy(disclosure, product.regionalNote, "provider-card-region-note");
            article.append(disclosure);
        }
        return article;
    }

    function renderList(target, category, variant) {
        const cards = [];
        const electricityStack = [];
        const seen = new Set();
        const useElectricityStack = category === "electricity" && target.dataset.providerLayout === "electricity-stack";

        for (const provider of providers) {
            if (!provider || !provider.id || seen.has(provider.id) || !provider.categories?.includes(category)) continue;
            seen.add(provider.id);
            const product = (provider.products && provider.products[category]) || {};
            const name = providerName(provider);
            const card = variant === "compact"
                ? renderCompactCard(provider, product, name)
                : renderDetailCard(provider, product, name, category);
            if (useElectricityStack && (provider.id === "lichtblick" || provider.id === "eins-energie")) {
                electricityStack.push(card);
            } else {
                cards.push(card);
            }
        }

        if (electricityStack.length > 0) {
            const stack = document.createElement("div");
            stack.className = "strom-provider-stack";
            stack.append(...electricityStack);
            cards.unshift(stack);
        }

        target.replaceChildren(...cards);
    }

    function renderAll() {
        document.querySelectorAll("[data-provider-list]").forEach((target) => {
            renderList(target, target.dataset.providerList, target.dataset.providerVariant);
        });
    }

    window.tarifyolProviders = Object.freeze({
        providers,
        renderAll,
        renderCompactProvider(provider, category) {
            const product = (provider.products && provider.products[category]) || {};
            return renderCompactCard(provider, product, providerName(provider));
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAll, { once: true });
    } else {
        renderAll();
    }
})();
