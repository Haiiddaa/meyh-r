// Cookie Banner Tool - cookie-banner.js
// Diese Datei in alle HTML-Seiten vor dem schließenden </body> Tag einbinden

class CookieBanner {
    constructor() {
        this.cookieName = 'meyller-cookie-consent';
        this.cookieExpireDays = 365;
        this.init();
    }

    init() {
        // Prüfen ob bereits Zustimmung erteilt wurde
        if (!this.getCookie(this.cookieName)) {
            this.createBanner();
        }
    }

    createBanner() {
        // Cookie Banner HTML erstellen
        const bannerHTML = `
            <div id="cookie-banner" class="cookie-banner">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-text">
                        <h3><i class="fas fa-cookie-bite"></i> Cookies & Datenschutz</h3>
                        <p>Wir verwenden Cookies, um Ihnen die bestmögliche Nutzung unserer Website zu ermöglichen. Durch die weitere Nutzung stimmen Sie der Verwendung von Cookies zu. Weitere Informationen finden Sie in unserer <a href="datenschutz.html" target="_blank">Datenschutzerklärung</a>.</p>
                    </div>
                    <div class="cookie-banner-buttons">
                        <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">
                            <i class="fas fa-check"></i> Alle akzeptieren
                        </button>
                        <button id="cookie-accept-necessary" class="cookie-btn cookie-btn-secondary">
                            Nur notwendige
                        </button>
                        <button id="cookie-settings" class="cookie-btn cookie-btn-link">
                            <i class="fas fa-cog"></i> Einstellungen
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Cookie Settings Modal -->
            <div id="cookie-modal" class="cookie-modal" style="display: none;">
                <div class="cookie-modal-overlay"></div>
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h3>Cookie-Einstellungen</h3>
                        <button id="cookie-modal-close" class="cookie-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cookie-modal-body">
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>Notwendige Cookies</h4>
                                <label class="cookie-switch">
                                    <input type="checkbox" id="necessary-cookies" checked disabled>
                                    <span class="cookie-slider"></span>
                                </label>
                            </div>
                            <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>Funktionale Cookies</h4>
                                <label class="cookie-switch">
                                    <input type="checkbox" id="functional-cookies">
                                    <span class="cookie-slider"></span>
                                </label>
                            </div>
                            <p>Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>Analyse Cookies</h4>
                                <label class="cookie-switch">
                                    <input type="checkbox" id="analytics-cookies">
                                    <span class="cookie-slider"></span>
                                </label>
                            </div>
                            <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.</p>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>Marketing Cookies</h4>
                                <label class="cookie-switch">
                                    <input type="checkbox" id="marketing-cookies">
                                    <span class="cookie-slider"></span>
                                </label>
                            </div>
                            <p>Diese Cookies werden verwendet, um Ihnen relevante Werbung zu zeigen.</p>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="cookie-save-settings" class="cookie-btn cookie-btn-primary">
                            Einstellungen speichern
                        </button>
                        <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary">
                            Alle akzeptieren
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Banner zum Body hinzufügen
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Event Listener hinzufügen
        this.addEventListeners();
        
        // Banner mit Animation einblenden
        setTimeout(() => {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.add('cookie-banner-show');
            }
        }, 500);
    }

    addEventListeners() {
        // Alle akzeptieren Button
        document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
            this.acceptAllCookies();
        });

        // Nur notwendige Button
        document.getElementById('cookie-accept-necessary')?.addEventListener('click', () => {
            this.acceptNecessaryCookies();
        });

        // Einstellungen Button
        document.getElementById('cookie-settings')?.addEventListener('click', () => {
            this.openModal();
        });

        // Modal schließen
        document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal Overlay klick
        document.querySelector('.cookie-modal-overlay')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Einstellungen speichern
        document.getElementById('cookie-save-settings')?.addEventListener('click', () => {
            this.saveCustomSettings();
        });

        // Alle akzeptieren (aus Modal)
        document.getElementById('cookie-accept-all-modal')?.addEventListener('click', () => {
            this.acceptAllCookies();
        });
    }

    acceptAllCookies() {
        const consent = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().getTime()
        };
        this.setCookie(this.cookieName, JSON.stringify(consent));
        this.hideBanner();
        this.loadScripts(consent);
    }

    acceptNecessaryCookies() {
        const consent = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
            timestamp: new Date().getTime()
        };
        this.setCookie(this.cookieName, JSON.stringify(consent));
        this.hideBanner();
        this.loadScripts(consent);
    }

    saveCustomSettings() {
        const consent = {
            necessary: true, // Immer true
            functional: document.getElementById('functional-cookies').checked,
            analytics: document.getElementById('analytics-cookies').checked,
            marketing: document.getElementById('marketing-cookies').checked,
            timestamp: new Date().getTime()
        };
        this.setCookie(this.cookieName, JSON.stringify(consent));
        this.hideBanner();
        this.closeModal();
        this.loadScripts(consent);
    }

    openModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Modal mit Animation einblenden
            setTimeout(() => {
                modal.classList.add('cookie-modal-show');
            }, 10);
        }
    }

    closeModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('cookie-modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('cookie-banner-hide');
            setTimeout(() => {
                banner.remove();
            }, 500);
        }
    }

    loadScripts(consent) {
        // Hier können Sie spezifische Scripts basierend auf der Zustimmung laden
        
        if (consent.analytics) {
            // Google Analytics oder andere Analyse-Tools laden
            console.log('Analytics cookies accepted - loading tracking scripts');
            // this.loadGoogleAnalytics();
        }

        if (consent.marketing) {
            // Marketing/Werbe-Scripts laden
            console.log('Marketing cookies accepted - loading marketing scripts');
            // this.loadMarketingScripts();
        }

        if (consent.functional) {
            // Funktionale Scripts laden
            console.log('Functional cookies accepted - loading functional scripts');
            // this.loadFunctionalScripts();
        }
    }

    // Beispiel für Google Analytics (ersetzen Sie GA_TRACKING_ID mit Ihrer ID)
    loadGoogleAnalytics() {
        /*
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_TRACKING_ID');
        `;
        document.head.appendChild(script2);
        */
    }

    // Cookie-Hilfsfunktionen
    setCookie(name, value) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (this.cookieExpireDays * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Öffentliche Methode um Cookie-Einstellungen zu öffnen (für Footer-Link)
    static openSettings() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('cookie-modal-show');
            }, 10);
        }
    }

    // Öffentliche Methode um aktuelle Zustimmung zu überprüfen
    static getConsent() {
        const banner = new CookieBanner();
        const consent = banner.getCookie(banner.cookieName);
        return consent ? JSON.parse(consent) : null;
    }
}

// Cookie Banner initialisieren wenn DOM geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CookieBanner();
    });
} else {
    new CookieBanner();
}

// Globale Funktionen für externe Verwendung
window.CookieBanner = CookieBanner;