const siteHeader = document.getElementById('siteHeader');
const brandHome = document.querySelector('.brand-group');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileAccordions = document.querySelectorAll('.mobile-accordion');
const mainNav = document.getElementById('mainNav');
const megaTriggers = document.querySelectorAll('[data-mega-target]');
const megaPanels = document.querySelectorAll('[data-mega-panel]');
const desktopMegaQuery = window.matchMedia('(min-width: 1081px)');

const setHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
};

const closeMegaMenus = () => {
    megaPanels.forEach((panel) => panel.classList.remove('is-open'));
    megaTriggers.forEach((trigger) => {
        trigger.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('mega-open');
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

const openMegaMenu = (trigger) => {
    const targetId = trigger.dataset.megaTarget;
    const targetPanel = document.getElementById(targetId);
    const isAlreadyOpen = targetPanel?.classList.contains('is-open');

    if (!targetPanel || isAlreadyOpen) return;

    closeMenu();
    closeMegaMenus();

    targetPanel.classList.add('is-open');
    trigger.classList.add('is-active');
    trigger.setAttribute('aria-expanded', 'true');

    if (!desktopMegaQuery.matches) {
        document.body.classList.add('mega-open');
    }
};

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        closeMegaMenus();

        if (mobileMenu?.classList.contains('is-open') || mainNav.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
            closeMegaMenus();
        });

        link.addEventListener('mouseenter', () => {
            if (desktopMegaQuery.matches) {
                closeMegaMenus();
            }
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
        closeMegaMenus();
    });
}

megaTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        event.stopPropagation();

        if (!desktopMegaQuery.matches) {
            openMegaMenu(trigger);
        }
    });

    trigger.addEventListener('mouseenter', () => {
        if (desktopMegaQuery.matches) {
            openMegaMenu(trigger);
        }
    });

    trigger.addEventListener('focus', () => {
        if (desktopMegaQuery.matches) {
            openMegaMenu(trigger);
        }
    });
});

megaPanels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMegaMenus);
    });
});

document.addEventListener('click', (event) => {
    if (!siteHeader?.contains(event.target)) {
        closeMegaMenus();
    }
});

if (siteHeader) {
    siteHeader.addEventListener('mouseleave', () => {
        if (desktopMegaQuery.matches) {
            closeMegaMenus();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
        closeMegaMenus();
    }
});

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();
