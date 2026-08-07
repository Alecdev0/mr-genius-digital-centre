const currentYear = document.querySelector("#current-year");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const navigationLinks = document.querySelectorAll("#navigation a");


// ==========================================
// CURRENT YEAR
// ==========================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const menuIsOpen = navigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            menuIsOpen.toString()
        );

        menuButton.textContent = menuIsOpen ? "✕" : "☰";

        document.body.classList.toggle(
            "menu-open",
            menuIsOpen
        );
    });
}


// Close the navigation after clicking a link

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        document.body.classList.remove("menu-open");

        if (menuButton) {
            menuButton.textContent = "☰";
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });
});


// ==========================================
// ANIMATED STATISTICS COUNTERS
// ==========================================

const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector("#stats");

let countersStarted = false;

function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(
            elapsedTime / duration,
            1
        );

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        const currentValue = Math.floor(
            target * easedProgress
        );

        counter.textContent =
            currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent =
                target.toLocaleString();
        }
    }

    requestAnimationFrame(updateCounter);
}

function startCounters() {
    counters.forEach((counter) => {
        counter.textContent = "0";
        animateCounter(counter);
    });
}

if (statsSection && counters.length > 0) {
    const statsObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    !countersStarted
                ) {
                    countersStarted = true;
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    statsObserver.observe(statsSection);
}


// ==========================================
// GALLERY FILTERS
// ==========================================

const filterButtons =
    document.querySelectorAll(".filter-button");

const galleryCards =
    document.querySelectorAll(".gallery-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory =
            button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        galleryCards.forEach((card) => {
            const cardCategory =
                card.dataset.category;

            const shouldShow =
                selectedCategory === "all" ||
                cardCategory === selectedCategory;

            card.classList.toggle(
                "hide",
                !shouldShow
            );
        });
    });
});


// ==========================================
// LIGHTBOX
// ==========================================

function getVisibleGalleryItems() {
    return Array.from(
        document.querySelectorAll(
            ".gallery-card:not(.hide)"
        )
    );
}

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightbox-image");

const lightboxTitle =
    document.getElementById("lightbox-title");

const lightboxDescription =
    document.getElementById(
        "lightbox-description"
    );

const lightboxClose =
    document.getElementById("lightbox-close");

const lightboxPrevious =
    document.getElementById("lightbox-prev");

const lightboxNext =
    document.getElementById("lightbox-next");

let currentGalleryIndex = 0;

function showLightboxImage(index) {
    const visibleItems =
        getVisibleGalleryItems();

    const selectedCard =
        visibleItems[index];

    if (!selectedCard) {
        return;
    }

    const image =
        selectedCard.querySelector("img");

    const title =
        selectedCard.querySelector(
            ".gallery-overlay h3"
        );

    const description =
        selectedCard.querySelector(
            ".gallery-overlay p"
        );

    if (!image) {
        return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent =
        title ? title.textContent : "";

    lightboxDescription.textContent =
        description
            ? description.textContent
            : "";

    currentGalleryIndex = index;
}

function openLightbox(index) {
    if (!lightbox) {
        return;
    }

    showLightboxImage(index);

    lightbox.classList.add("open");
    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "lightbox-open"
    );
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("open");
    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "lightbox-open"
    );
}

function showNextImage() {
    const visibleItems =
        getVisibleGalleryItems();

    if (visibleItems.length === 0) {
        return;
    }

    currentGalleryIndex =
        (currentGalleryIndex + 1) %
        visibleItems.length;

    showLightboxImage(
        currentGalleryIndex
    );
}

function showPreviousImage() {
    const visibleItems =
        getVisibleGalleryItems();

    if (visibleItems.length === 0) {
        return;
    }

    currentGalleryIndex =
        (
            currentGalleryIndex -
            1 +
            visibleItems.length
        ) % visibleItems.length;

    showLightboxImage(
        currentGalleryIndex
    );
}

galleryCards.forEach((card) => {
    card.addEventListener("click", () => {
        const visibleItems =
            getVisibleGalleryItems();

        const clickedIndex =
            visibleItems.indexOf(card);

        if (clickedIndex !== -1) {
            openLightbox(clickedIndex);
        }
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );
}

if (lightboxNext) {
    lightboxNext.addEventListener(
        "click",
        showNextImage
    );
}

if (lightboxPrevious) {
    lightboxPrevious.addEventListener(
        "click",
        showPreviousImage
    );
}

if (lightbox) {
    lightbox.addEventListener(
        "click",
        (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        }
    );
}

document.addEventListener(
    "keydown",
    (event) => {
        if (
            !lightbox ||
            !lightbox.classList.contains("open")
        ) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNextImage();
        }

        if (event.key === "ArrowLeft") {
            showPreviousImage();
        }
    }
);


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealSections =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -50px 0px"
            }
        );

    revealSections.forEach((section) => {
        revealObserver.observe(section);
    });
} else {
    revealSections.forEach((section) => {
        section.classList.add(
            "reveal-visible"
        );
    });
}

// ==========================================
// ACTIVE NAVIGATION WHILE SCROLLING
// ==========================================

const pageSections = document.querySelectorAll(
    "#home, #services, #why-us, #gallery, #about, #find-us, #contact"
);

const navLinks = document.querySelectorAll(
    "#navigation a"
);

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach((link) => {
                link.classList.remove(
                    "active-link"
                );
            });

            const activeLink =
                document.querySelector(
                    `#navigation a[href="#${entry.target.id}"]`
                );

            if (activeLink) {
                activeLink.classList.add(
                    "active-link"
                );
            }

        });
    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

pageSections.forEach((section) => {
    navObserver.observe(section);
});

// ==========================================
// CONTACT FORM TO WHATSAPP
// ==========================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();

    const whatsappNumber = "27731147568";

    const whatsappMessage =
      "Hello Mr Genius,%0A%0A" +
      "My name is " + encodeURIComponent(name) + ".%0A%0A" +
      "Phone: " + encodeURIComponent(phone) + "%0A" +
      "Service needed: " + encodeURIComponent(service) + "%0A%0A" +
      "Message:%0A" +
      encodeURIComponent(message);

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      whatsappMessage;

    window.open(whatsappURL, "_blank");
  });
}