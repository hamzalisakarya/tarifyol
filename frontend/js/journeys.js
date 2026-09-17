const gasEstimatorConfig = {
    apartmentKwhPerSquareMeter: 130,
    houseKwhPerSquareMeter: 155,
    gasHotWaterPerPerson: 600,
    rangePercent: 15,
    roundingStep: 100
};

let gasEstimate = null;
let gasConsumptionEstimated = false;

function journeyLanguage() {
    return document.documentElement.lang === "tr" ? "tr" : "de";
}

function updateJourneyCopy(language = journeyLanguage()) {
    document.querySelectorAll("[data-de][data-tr]").forEach((element) => {
        element.textContent = element.dataset[language];
    });
    updateKfzSupportLink();
    if (gasEstimate) renderGasEstimate();
    renderGasCost();
}

document.addEventListener("tarifyol:languagechange", (event) => updateJourneyCopy(event.detail.language));

function localizedNumber(value, decimals = 0) {
    return new Intl.NumberFormat(journeyLanguage() === "tr" ? "tr-TR" : "de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function roundGas(value) {
    return Math.round(value / gasEstimatorConfig.roundingStep) * gasEstimatorConfig.roundingStep;
}

function buildMailto(subject, body) {
    return `mailto:info@tarifyol.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function showJourneyError(input, id, de, tr, valid) {
    let error = document.getElementById(id);
    if (!error) { error = document.createElement("p"); error.id = id; error.className = "field-error"; input.closest(".field")?.append(error); }
    error.textContent = journeyLanguage() === "tr" ? tr : de;
    error.classList.toggle("is-visible", !valid);
    input.setAttribute("aria-invalid", String(!valid));
    input.setCustomValidity(valid ? "" : error.textContent);
    return valid;
}

function openTarifYolWhatsApp(message) {
    const number = String(window.TARIFYOL_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
    if (!/^[1-9][0-9]{7,14}$/.test(number)) return false;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    return true;
}

window.openTarifYolWhatsAppMessage = openTarifYolWhatsApp;

function addGasProviderProgram() {
    const target = document.querySelector(".strom-hero-grid > div:first-child");
    if (!document.querySelector("#gas-form") || !target || document.querySelector("#gas-provider-program")) return;
    const section = document.createElement("section");
    section.id = "gas-provider-program";
    section.className = "provider-program provider-program-journey";
    section.setAttribute("aria-labelledby", "gas-provider-heading");
    section.innerHTML = '<div class="provider-program-copy"><p class="eyebrow">Anbieter &amp; Partnerprogramme</p><h2 id="gas-provider-heading">Anbieter &amp; Partnerprogramme</h2><p>TarifYol arbeitet mit ausgewählten Anbietern und Partnerprogrammen zusammen.</p></div><div class="provider-program-list"><a class="provider-creative" rel="sponsored" href="https://www.awin1.com/cread.php?s=2608676&amp;v=19047&amp;q=385861&amp;r=2991193"><img src="https://www.awin1.com/cshow.php?s=2608676&amp;v=19047&amp;q=385861&amp;r=2991193" border="0" alt="LichtBlick"></a></div>';
    target.append(section);
}

addGasProviderProgram();

const gasForm = document.querySelector("#gas-form");
const gasEstimator = document.querySelector("#gas-estimator");
const gasEstimatorForm = document.querySelector("#gas-estimator-form");
const gasConsumption = document.querySelector("#gas-consumption");
const gasPayment = document.querySelector("#gas-payment");

document.querySelector("[data-gas-toggle]")?.addEventListener("click", (event) => {
    gasEstimator.hidden = !gasEstimator.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!gasEstimator.hidden));
    if (!gasEstimator.hidden) gasEstimator.scrollIntoView({ behavior: "smooth" });
});

function calculateGasEstimate(data) {
    const area = Number(data.get("area"));
    const people = Number(data.get("people"));
    const rate = data.get("building") === "house"
        ? gasEstimatorConfig.houseKwhPerSquareMeter
        : gasEstimatorConfig.apartmentKwhPerSquareMeter;
    const hotWater = data.get("hotWater") === "yes"
        ? gasEstimatorConfig.gasHotWaterPerPerson * people
        : 0;
    const center = roundGas((area * rate) + hotWater);
    const margin = center * gasEstimatorConfig.rangePercent / 100;
    return { center, minimum: roundGas(center - margin), maximum: roundGas(center + margin) };
}

function renderGasEstimate() {
    const prefix = journeyLanguage() === "tr" ? "yaklaşık" : "ca.";
    const unit = journeyLanguage() === "tr" ? "kWh/yıl" : "kWh/Jahr";
    document.querySelector("[data-gas-range]").textContent =
        `${prefix} ${localizedNumber(gasEstimate.minimum)}–${localizedNumber(gasEstimate.maximum)} ${unit}`;
}

gasEstimatorForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!gasEstimatorForm.reportValidity()) return;
    const data = new FormData(gasEstimatorForm);
    const result = document.querySelector("[data-gas-result]");
    const warning = document.querySelector("[data-gas-warning]");
    if (data.get("heating") === "no") {
        gasEstimate = null;
        result.hidden = true;
        warning.hidden = false;
        warning.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }
    warning.hidden = true;
    gasEstimate = calculateGasEstimate(data);
    renderGasEstimate();
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("[data-gas-apply]")?.addEventListener("click", () => {
    if (!gasEstimate) return;
    gasConsumption.value = gasEstimate.center;
    gasConsumptionEstimated = true;
    document.querySelector("[data-gas-estimated]").hidden = false;
    gasEstimator.hidden = true;
    document.querySelector("[data-gas-toggle]").setAttribute("aria-expanded", "false");
    gasConsumption.focus({ preventScroll: true });
    gasForm.scrollIntoView({ behavior: "smooth", block: "center" });
    renderGasCost();
});

gasConsumption?.addEventListener("input", () => {
    gasConsumptionEstimated = false;
    document.querySelector("[data-gas-estimated]").hidden = true;
    renderGasCost();
});
gasPayment?.addEventListener("input", renderGasCost);
document.querySelector("#gas-postal")?.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));

function renderGasCost() {
    const costBox = document.querySelector("[data-gas-cost]");
    if (!costBox) return;
    const consumption = Number(gasConsumption.value);
    const payment = Number(gasPayment.value);
    if (!(consumption > 0 && payment > 0)) {
        costBox.hidden = true;
        return;
    }
    const annual = payment * 12;
    const centsPerKwh = annual / consumption * 100;
    const prefix = journeyLanguage() === "tr" ? "yaklaşık" : "ca.";
    document.querySelector("[data-gas-annual]").textContent = `${prefix} ${localizedNumber(annual, 2)} € / ${journeyLanguage() === "tr" ? "yıl" : "Jahr"}`;
    document.querySelector("[data-gas-kwh]").textContent = `${prefix} ${localizedNumber(centsPerKwh, 2)} ct/kWh`;
    costBox.hidden = false;
}

gasForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.querySelector("#gas-name");
    const postalInput = document.querySelector("#gas-postal");
    const consumptionInput = document.querySelector("#gas-consumption");
    const nameValid = showJourneyError(nameInput, "gas-name-error", "Bitte gib deinen Namen ein.", "Lütfen adını ve soyadını gir.", nameInput.value.trim() !== "");
    const postalValid = showJourneyError(postalInput, "gas-postal-error", "Bitte gib eine gültige 5-stellige PLZ ein.", "Lütfen 5 haneli geçerli bir posta kodu gir.", /^[0-9]{5}$/.test(postalInput.value.trim()));
    const consumptionValue = consumptionInput.value.trim();
    const consumption = Number(consumptionValue.replace(",", "."));
    const consumptionValid = consumptionValue === "" || (/^\d+(?:[.,]\d+)?$/.test(consumptionValue) && Number.isFinite(consumption) && consumption > 0 && consumption <= 200000);
    const consumptionOk = showJourneyError(consumptionInput, "gas-consumption-error", "Bitte gib deinen Jahresverbrauch in kWh ein.", "Lütfen yıllık tüketimini kWh cinsinden gir.", consumptionValid);
    const warning = document.querySelector("#gas-consumption-warning");
    if (warning) warning.hidden = !(consumptionValue !== "" && consumption > 0 && (consumption < 500 || consumption > 100000));
    if (!nameValid || !postalValid || !consumptionOk) {
        [nameInput, postalInput, consumptionInput].find((input) => input.getAttribute("aria-invalid") === "true")?.focus();
        return;
    }
    const data = new FormData(gasForm);
    const tr = journeyLanguage() === "tr";
    const lines = tr ? ["Merhaba TarifYol,", "", "doğal gaz tarifemin kontrol edilmesini istiyorum.", "", "MÜŞTERİ BİLGİLERİ", `Ad Soyad: ${nameInput.value.trim()}`, `Posta Kodu: ${data.get("postalCode")}`] : ["Hallo TarifYol,", "", "ich möchte meinen Gastarif prüfen lassen.", "", "KUNDENDATEN", `Name: ${nameInput.value.trim()}`, `PLZ: ${data.get("postalCode")}`];
    const tariffLines = tr ? ["TARİFE BİLGİLERİ", "Alan: Doğal gaz"] : ["TARIFDATEN", "Bereich: Gas"];
    if (consumptionValue) tariffLines.push(tr ? `Yıllık Tüketim: ${gasConsumptionEstimated ? "yaklaşık " : ""}${localizedNumber(consumption)} kWh` : `Jahresverbrauch: ${gasConsumptionEstimated ? "ca. " : ""}${localizedNumber(consumption)} kWh`);
    if (data.get("payment")) tariffLines.push(tr ? `Güncel Aylık Ödeme: ${data.get("payment")} EUR/ay` : `Aktueller Abschlag: ${data.get("payment")} EUR/Monat`);
    if (tariffLines.length > 2) lines.push("", ...tariffLines);
    lines.push("", tr ? "Teşekkür ederim." : "Vielen Dank.");
    window.openTarifYolWhatsAppMessage?.(lines.join("\n"));
});

const internetForm = document.querySelector("#internet-form");
const dataVolumeField = document.querySelector("[data-volume-field]");
document.querySelector("#internet-postal")?.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));

document.querySelectorAll('input[name="dataLimit"]').forEach((input) => {
    input.addEventListener("change", () => {
        const show = input.checked && input.value === "yes";
        dataVolumeField.hidden = !show;
        document.querySelector("#data-volume").disabled = !show;
    });
});

function internetLabel(value, type) {
    const tr = journeyLanguage() === "tr";
    const labels = {
        unknown: tr ? "Bilmiyorum" : "Weiß ich nicht",
        unlimited: tr ? "Sınırsız" : "unbegrenzt",
        unsure: tr ? "Emin değilim" : "Ich bin unsicher",
        Kabel: tr ? "Kablo" : "Kabel",
        Glasfaser: tr ? "Fiber" : "Glasfaser"
    };
    if (type === "payment" && value) return `${localizedNumber(Number(value), 2)} €/${tr ? "ay" : "Monat"}`;
    return labels[value] || value || "–";
}

internetForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#internet-name");
    const postal = document.querySelector("#internet-postal");
    const nameValid = showJourneyError(name, "internet-name-error", "Bitte gib deinen Namen ein.", "Lütfen adını ve soyadını gir.", name.value.trim() !== "");
    const postalValid = showJourneyError(postal, "internet-postal-error", "Bitte gib eine gültige 5-stellige PLZ ein.", "Lütfen 5 haneli geçerli bir posta kodu gir.", /^[0-9]{5}$/.test(postal.value.trim()));
    const payment = document.querySelector("#internet-payment");
    const paymentValue = payment.value.trim();
    const paymentValid = paymentValue === "" || (Number.isFinite(Number(paymentValue)) && Number(paymentValue) >= 0);
    const paymentOk = showJourneyError(payment, "internet-payment-error", "Bitte gib einen gültigen monatlichen Preis ein.", "Lütfen geçerli bir aylık ücret gir.", paymentValid);
    const dataVolume = document.querySelector("#data-volume");
    const dataVolumeValue = dataVolume.value.trim();
    const dataVolumeValid = dataVolumeValue === "" || (Number.isFinite(Number(dataVolumeValue)) && Number(dataVolumeValue) > 0);
    const dataVolumeOk = showJourneyError(dataVolume, "internet-data-volume-error", "Bitte gib ein gültiges Datenvolumen ein.", "Lütfen geçerli bir veri miktarı gir.", dataVolumeValid);
    if (!nameValid || !postalValid || !paymentOk || !dataVolumeOk) { [name, postal, payment, dataVolume].find((input) => input.getAttribute("aria-invalid") === "true")?.focus(); return; }
    const data = new FormData(internetForm);
    const tr = journeyLanguage() === "tr";
    const lines = tr ? ["Merhaba TarifYol,", "", "internet tarifemin kontrol edilmesini istiyorum.", "", "MÜŞTERİ BİLGİLERİ", `Ad Soyad: ${data.get("customerName")}`, `Posta Kodu: ${data.get("postalCode")}`] : ["Hallo TarifYol,", "", "ich möchte meinen Internettarif prüfen lassen.", "", "KUNDENDATEN", `Name: ${data.get("customerName")}`, `PLZ: ${data.get("postalCode")}`];
    const tariffLines = tr ? ["TARİFE BİLGİLERİ", "Alan: İnternet"] : ["TARIFDATEN", "Bereich: Internet"];
    if (data.get("provider")) tariffLines.push(`${tr ? "Mevcut Sağlayıcı" : "Aktueller Anbieter"}: ${data.get("provider")}`);
    if (data.get("currentSpeed")) tariffLines.push(`${tr ? "Şu Anki Hız" : "Aktuelle Geschwindigkeit"}: ${internetLabel(data.get("currentSpeed"))}`);
    if (data.get("connection")) tariffLines.push(`${tr ? "Bağlantı Türü" : "Anschlussart"}: ${internetLabel(data.get("connection"))}`);
    if (data.get("dataLimit")) tariffLines.push(`${tr ? "Kullanım Sınırı" : "Datenvolumen"}: ${data.get("dataLimit") === "yes" && data.get("dataVolume") ? `${data.get("dataVolume")} GB/${tr ? "ay" : "Monat"}` : internetLabel(data.get("dataLimit"))}`);
    if (data.get("payment")) tariffLines.push(`${tr ? "Güncel Aylık Fiyat" : "Aktueller monatlicher Preis"}: ${internetLabel(data.get("payment"), "payment")}`);
    if (data.get("desiredSpeed")) tariffLines.push(`${tr ? "İstenen Hız" : "Gewünschte Geschwindigkeit"}: ${internetLabel(data.get("desiredSpeed"))}`);
    if (tariffLines.length > 2) lines.push("", ...tariffLines);
    lines.push("", tr ? "Teşekkür ederim." : "Vielen Dank.");
    window.openTarifYolWhatsAppMessage?.(lines.join("\n"));
});

function updateKfzSupportLink() {
    const link = document.querySelector("[data-kfz-support]");
    if (!link) return;
    const tr = journeyLanguage() === "tr";
    link.href = buildMailto(
        tr ? "Araç sigortası karşılaştırması için teknik destek" : "Technische Unterstützung beim Kfz-Vergleich",
        tr
            ? "Merhaba TarifYol,\n\nharici araç sigortası karşılaştırmasının işleyişi hakkında genel veya teknik bir sorum var.\n\nSorum (lütfen hassas bilgiler veya belgeler eklemeyin):\n"
            : "Hallo TarifYol,\n\nich habe eine allgemeine oder technische Frage zum Ablauf des externen Kfz-Versicherungsvergleichs.\n\nMeine Frage (bitte keine sensiblen Angaben oder Unterlagen ergänzen):\n"
    );
}

updateJourneyCopy();
