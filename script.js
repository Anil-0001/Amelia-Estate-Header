const siteHeader = document.getElementById('siteHeader');
const brandHome = document.querySelector('.brand-group');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileAccordions = document.querySelectorAll('.mobile-accordion');
const mainNav = document.getElementById('mainNav');
const desktopMegaQuery = window.matchMedia('(min-width: 1081px)');
const priceTabs = document.querySelectorAll('.price-tab');
const priceUnlockForm = document.getElementById('priceUnlockForm');
const downloadUnlockForm = document.getElementById('downloadUnlockForm');
const contactVisitForm = document.getElementById('contactVisitForm');
const leadStorageKey = 'ameliaPriceLead';
const downloadStorageKey = 'ameliaDownloadLead';
const visitStorageKey = 'ameliaVisitLead';

const setHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
};

const closeMobileAccordions = (exceptAccordion = null) => {
    mobileAccordions.forEach((accordion) => {
        if (accordion === exceptAccordion) return;

        accordion.classList.remove('is-open');
        accordion.querySelector('.mobile-accordion-trigger')?.setAttribute('aria-expanded', 'false');
    });
};

const closeMenu = () => {
    if (!menuToggle) return;
    mainNav?.classList.remove('is-open');
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    closeMobileAccordions();
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
};

const openMenu = () => {
    if (!menuToggle) return;
    mainNav?.classList.add('is-open');
    mobileMenu?.classList.add('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
};

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        if (desktopMegaQuery.matches) return;

        if (mobileMenu?.classList.contains('is-open') || mainNav.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1080) {
            closeMenu();
        }
    });
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMenu);
}

if (mobileMenu) {
    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

mobileAccordions.forEach((accordion) => {
    const trigger = accordion.querySelector('.mobile-accordion-trigger');

    trigger?.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('is-open');

        closeMobileAccordions(accordion);
        accordion.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
    });
});

if (brandHome) {
    brandHome.addEventListener('click', () => {
        closeMenu();
    });
}

priceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        priceTabs.forEach((item) => item.classList.remove('is-active'));
        tab.classList.add('is-active');

        const variantInput = priceUnlockForm?.querySelector('input[name="variant"]');
        if (variantInput) {
            variantInput.value = tab.dataset.priceSize || tab.textContent.trim();
        }
    });
});

if (priceUnlockForm) {
    let savedLead = null;

    try {
        savedLead = JSON.parse(localStorage.getItem(leadStorageKey) || 'null');
    } catch (error) {
        savedLead = null;
    }

    if (savedLead) {
        priceUnlockForm.elements.name.value = savedLead.name || '';
        priceUnlockForm.elements.phone.value = savedLead.phone || '';
        priceUnlockForm.elements.variant.value = savedLead.variant || priceUnlockForm.elements.variant.value;
    }

    priceUnlockForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(priceUnlockForm);
        const name = String(formData.get('name') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const variant = String(formData.get('variant') || '230 - Premium').trim();
        const cleanPhone = phone.replace(/[^\d+]/g, '');

        if (!name || cleanPhone.length < 10) {
            priceUnlockForm.classList.add('has-error');
            return;
        }

        priceUnlockForm.classList.remove('has-error');

        const lead = {
            name,
            phone: cleanPhone,
            variant,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(leadStorageKey, JSON.stringify(lead));

        const message = `Hi, I am ${name}. Please unlock the best price for Amelia Estate ${variant}. My phone number is ${cleanPhone}.`;
        window.open(`https://wa.me/919350489533?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
}

if (downloadUnlockForm) {
    let savedDownloadLead = null;

    try {
        savedDownloadLead = JSON.parse(localStorage.getItem(downloadStorageKey) || 'null');
    } catch (error) {
        savedDownloadLead = null;
    }

    if (savedDownloadLead) {
        downloadUnlockForm.elements.name.value = savedDownloadLead.name || '';
        downloadUnlockForm.elements.phone.value = savedDownloadLead.phone || '';
    }

    downloadUnlockForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(downloadUnlockForm);
        const name = String(formData.get('name') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const cleanPhone = phone.replace(/[^\d+]/g, '');

        if (!name || cleanPhone.length < 10) {
            downloadUnlockForm.classList.add('has-error');
            return;
        }

        downloadUnlockForm.classList.remove('has-error');

        const lead = {
            name,
            phone: cleanPhone,
            request: 'Private Vault Downloads',
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(downloadStorageKey, JSON.stringify(lead));

        const message = `Hi, I am ${name}. Please send Amelia Estate brochure, floor plans, prices and approvals. My phone number is ${cleanPhone}.`;
        window.open(`https://wa.me/919350489533?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
}

if (contactVisitForm) {
    let savedVisitLead = null;

    try {
        savedVisitLead = JSON.parse(localStorage.getItem(visitStorageKey) || 'null');
    } catch (error) {
        savedVisitLead = null;
    }

    if (savedVisitLead) {
        contactVisitForm.elements.name.value = savedVisitLead.name || '';
        contactVisitForm.elements.phone.value = savedVisitLead.phone || '';
        contactVisitForm.elements.unit.value = savedVisitLead.unit || contactVisitForm.elements.unit.value;
    }

    contactVisitForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactVisitForm);
        const name = String(formData.get('name') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const unit = String(formData.get('unit') || '3 BHK - 219').trim();
        const cleanPhone = phone.replace(/[^\d+]/g, '');

        if (!name || cleanPhone.length < 10) {
            contactVisitForm.classList.add('has-error');
            setTimeout(() => contactVisitForm.classList.remove('has-error'), 320);
            return;
        }

        const lead = {
            name,
            phone: cleanPhone,
            unit,
            request: 'Private Site Visit',
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(visitStorageKey, JSON.stringify(lead));

        const message = `Hi, I am ${name}. I want to book a private site visit for Amelia Estate. Preferred unit: ${unit}. My phone number is ${cleanPhone}.`;
        window.open(`https://wa.me/917009247378?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();
