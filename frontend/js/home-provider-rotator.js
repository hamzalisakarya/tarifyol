(() => {
    "use strict";

    const ROTATION_MS = 5000;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const categoryNames = {
        electricity: { de: "Strom", tr: "Elektrik" },
        gas: { de: "Gas", tr: "Gaz" },
        internet: { de: "Internet", tr: "İnternet" }
    };
    const groups = [];
    let timerId = null;

    function language() {
        return document.documentElement.lang === "tr" ? "tr" : "de";
    }

    function eligible(group) {
        return !group.hovered && !group.focused;
    }

    function shouldRunSharedTimer() {
        return !document.hidden && !reducedMotion.matches && groups.length > 0;
    }

    function syncSharedTimer() {
        if (shouldRunSharedTimer()) {
            if (timerId === null) {
                timerId = window.setInterval(() => {
                    groups.forEach((group) => {
                        if (eligible(group)) advance(group, 1, false);
                    });
                }, ROTATION_MS);
            }
        } else if (timerId !== null) {
            window.clearInterval(timerId);
            timerId = null;
        }
    }

    function setLanguageOnCard(card) {
        const current = language();
        card.querySelectorAll("[data-de][data-tr]").forEach((element) => {
            element.textContent = element.dataset[current];
        });
        const accessibleName = card.dataset[current === "tr" ? "ariaLabelTr" : "ariaLabelDe"];
        if (accessibleName) card.setAttribute("aria-label", accessibleName);
    }

    function updateProgress(group) {
        const segments = group.providers.map((provider, index) => {
            const segment = document.createElement("span");
            segment.className = index === group.index ? "is-active" : "";
            segment.dataset.providerSegment = provider.id;
            return segment;
        });
        group.progress.replaceChildren(...segments);
    }

    function cardFor(group, index) {
        if (!group.cardCache[index]) {
            const provider = group.providers[index];
            const card = window.tarifyolProviders.renderCompactProvider(provider, group.category);
            card.dataset.providerId = provider.id;
            if (provider.id === "vodafone-de") {
                const caption = card.querySelector(".provider-card-caption");
                if (caption) caption.remove();
                card.classList.remove("has-caption");
                setVodafoneAccessibleName(card);
            }
            group.cardCache[index] = card;
        }
        setLanguageOnCard(group.cardCache[index]);
        return group.cardCache[index];
    }

    function setVodafoneAccessibleName(card) {
        card.setAttribute("aria-label", language() === "tr"
            ? "Vodafone, internet sağlayıcısı"
            : "Vodafone, Internetanbieter");
    }

    function announce(group) {
        if (!group.announcement) return;
        const current = language();
        const provider = group.providers[group.index];
        const name = provider.name[current] || provider.name.de || provider.name.tr || provider.id;
        const position = group.index + 1;
        group.announcement.textContent = current === "tr"
            ? `${name}, ${group.providers.length} sağlayıcıdan ${position}. sırada`
            : `${name}, Anbieter ${position} von ${group.providers.length}`;
    }

    function advance(group, direction, manual) {
        group.index = (group.index + direction + group.providers.length) % group.providers.length;
        group.count.textContent = `${group.index + 1} / ${group.providers.length}`;
        updateProgress(group);

        if (!reducedMotion.matches) group.stage.classList.add("is-fading");
        group.stage.replaceChildren(cardFor(group, group.index));
        if (reducedMotion.matches) {
            group.stage.classList.remove("is-fading");
        } else {
            void group.stage.offsetWidth;
            window.requestAnimationFrame(() => group.stage.classList.remove("is-fading"));
        }
        if (manual) announce(group);
    }

    function initialize(root) {
        const category = root.dataset.providerRotator;
        const providers = window.tarifyolProviders && window.tarifyolProviders.providers
            .filter((provider) => provider.categories.includes(category));
        if (!providers || providers.length === 0) return;

        const group = {
            category,
            providers,
            index: 0,
            cardCache: [],
            root,
            stage: root.querySelector("[data-provider-stage]"),
            count: root.querySelector("[data-provider-count]"),
            announcement: root.querySelector("[data-provider-announcement]"),
            prev: root.querySelector("[data-provider-prev]"),
            next: root.querySelector("[data-provider-next]"),
            progress: root.querySelector("[data-provider-progress]"),
            hovered: false,
            focused: false
        };
        if (!group.stage || !group.count || !group.prev || !group.next || !group.progress) return;
        groups.push(group);
        group.count.textContent = `1 / ${providers.length}`;
        updateProgress(group);
        group.stage.replaceChildren(cardFor(group, 0));

        group.prev.setAttribute("aria-label", language() === "tr"
            ? `${categoryNames[category].tr}: önceki sağlayıcı`
            : `${categoryNames[category].de}: vorheriger Anbieter`);
        group.next.setAttribute("aria-label", language() === "tr"
            ? `${categoryNames[category].tr}: sonraki sağlayıcı`
            : `${categoryNames[category].de}: nächster Anbieter`);

        group.prev.addEventListener("click", () => advance(group, -1, true));
        group.next.addEventListener("click", () => advance(group, 1, true));
        root.addEventListener("pointerenter", () => {
            group.hovered = true;
            syncSharedTimer();
        });
        root.addEventListener("pointerleave", () => {
            group.hovered = false;
            syncSharedTimer();
        });
        root.addEventListener("focusin", (event) => {
            if (!event.target.matches(":focus-visible")) return;
            group.focused = true;
            syncSharedTimer();
        });
        root.addEventListener("focusout", () => {
            window.setTimeout(() => {
                group.focused = Boolean(root.querySelector(":focus-visible"));
                syncSharedTimer();
            }, 0);
        });
    }

    function refreshLanguage() {
        groups.forEach((group) => {
            group.prev.setAttribute("aria-label", language() === "tr"
                ? `${categoryNames[group.category].tr}: önceki sağlayıcı`
                : `${categoryNames[group.category].de}: vorheriger Anbieter`);
            group.next.setAttribute("aria-label", language() === "tr"
                ? `${categoryNames[group.category].tr}: sonraki sağlayıcı`
                : `${categoryNames[group.category].de}: nächster Anbieter`);
            group.cardCache.forEach((card) => { if (card) setLanguageOnCard(card); });
            const currentCard = group.cardCache[group.index];
            if (currentCard && currentCard.dataset.providerId === "vodafone-de") setVodafoneAccessibleName(currentCard);
        });
    }

    function start() {
        if (window.__tarifyolHomeProviderRotatorStarted || !window.tarifyolProviders) return;
        window.__tarifyolHomeProviderRotatorStarted = true;
        document.querySelectorAll("[data-provider-rotator]").forEach(initialize);
        document.addEventListener("tarifyol:languagechange", refreshLanguage);
        document.addEventListener("visibilitychange", syncSharedTimer);
        if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", syncSharedTimer);
        else if (typeof reducedMotion.addListener === "function") reducedMotion.addListener(syncSharedTimer);
        syncSharedTimer();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
})();
