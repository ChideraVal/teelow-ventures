(function () {
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdaqpjr';
    const WHATSAPP_NUMBER = '2347038334577';

    const menuBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function setMenuOpen(isOpen) {
        if (!mobileMenu || !menuBtn) return;
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.textContent = isOpen ? '✕' : '☰';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('open');
            setMenuOpen(isOpen);
        });
    }

    if (mobileMenu) {
        const mobileLinks = Array.from(mobileMenu.querySelectorAll('a[href^="#"], a'));
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                setMenuOpen(false);
            });
        });
    }

    const BREAKPOINT = 900;
    function onResizeCloseMenu() {
        if (window.innerWidth > BREAKPOINT && mobileMenu.classList.contains('open')) {
            setMenuOpen(false);
        }
    }
    window.addEventListener('resize', onResizeCloseMenu);
    window.addEventListener('orientationchange', onResizeCloseMenu);
    document.addEventListener('DOMContentLoaded', onResizeCloseMenu);

    (function initPortfolioPaging() {
        const VISIBLE = 8;
        const grid = document.querySelector('.portfolio-grid');
        const controls = document.getElementById('portfolioControls');
        if (!grid || !controls) return;

        const allProjects = Array.from(grid.querySelectorAll('.project'));
        if (allProjects.length <= VISIBLE) {
            controls.setAttribute('aria-hidden', 'true');
            return;
        }

        const extras = allProjects.slice(VISIBLE);
        extras.forEach(el => {
            el.classList.add('extra');
            el.setAttribute('aria-hidden', 'true');
            el.setAttribute('data-hidden-by-toggle', 'true');
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'showAllProjects';
        btn.className = 'tags-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'portfolio');
        btn.textContent = `Show more (${extras.length})`;
        btn.style.fontWeight = '700';
        btn.style.padding = '8px 12px';
        controls.appendChild(btn);
        controls.setAttribute('aria-hidden', 'false');

        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            btn.setAttribute('aria-expanded', String(expanded));
            if (expanded) {
                extras.forEach(e => {
                    e.classList.remove('extra');
                    e.removeAttribute('aria-hidden');
                    e.removeAttribute('data-hidden-by-toggle');
                });
                btn.textContent = 'Show less';
                extras[0] && extras[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                extras.forEach(e => {
                    e.classList.add('extra');
                    e.setAttribute('aria-hidden', 'true');
                    e.setAttribute('data-hidden-by-toggle', 'true');
                });
                btn.textContent = `Show more (${extras.length})`;
                btn.focus();
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    })();

    let projects = Array.from(document.querySelectorAll('.project'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbTitle = document.getElementById('lb-title');
    let currentIndex = 0;

    function refreshProjects() {
        projects = Array.from(document.querySelectorAll('.project'));
    }

    function openLightbox(idx) {
        refreshProjects();
        const el = projects[idx];
        if (!el) return;
        const title = el.getAttribute('data-title') || 'Project';
        const img = el.getAttribute('data-img') || "url('')";
        lbTitle.textContent = title;
        lbImg.style.backgroundImage = img;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        currentIndex = idx;
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const projectEl = e.target.closest && e.target.closest('.project');
        if (projectEl) {
            refreshProjects();
            const idx = projects.indexOf(projectEl);
            if (idx >= 0) openLightbox(idx);
        }
    });

    const lbClose = document.getElementById('lb-close');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            refreshProjects();
            currentIndex = (currentIndex - 1 + projects.length) % projects.length;
            openLightbox(currentIndex);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            refreshProjects();
            currentIndex = (currentIndex + 1) % projects.length;
            openLightbox(currentIndex);
        });
    }
    document.addEventListener('keydown', (e) => {
        if (lb.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
        }
    });

    const slider = document.getElementById('test-slider');
    const btnNext = document.getElementById('test-next');
    const btnPrev = document.getElementById('test-prev');
    let slidePos = 0;
    function updateSlideWidth() {
        const child = slider && slider.children[0];
        if (!child) return 0;
        const rect = child.getBoundingClientRect();
        return Math.round(rect.width) + 12;
    }
    function scrollToSlide(pos) {
        const width = updateSlideWidth();
        slider && slider.scrollTo({ left: width * pos, behavior: 'smooth' });
    }
    if (btnNext) btnNext.addEventListener('click', () => { const count = slider.children.length; slidePos = (slidePos + 1) % count; scrollToSlide(slidePos); });
    if (btnPrev) btnPrev.addEventListener('click', () => { const count = slider.children.length; slidePos = (slidePos - 1 + count) % count; scrollToSlide(slidePos); });
    let scrollTimeout;
    slider && slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const width = updateSlideWidth();
            if (width === 0) return;
            const approx = Math.round(slider.scrollLeft / width);
            slidePos = Math.max(0, Math.min(slider.children.length - 1, approx));
        }, 80);
    });

    const lazyFrames = Array.from(document.querySelectorAll('iframe[data-src]'));
    if ('IntersectionObserver' in window && lazyFrames.length) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    el.src = el.dataset.src;
                    obs.unobserve(el);
                }
            });
        }, { rootMargin: '300px' });
        lazyFrames.forEach(f => io.observe(f));
    } else {
        lazyFrames.forEach(f => f.src = f.dataset.src);
    }

    function serializeForm(form) {
        return new FormData(form);
    }
    async function submitToFormspree(form) {
        const data = serializeForm(form);
        try {
            const resp = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (resp.ok) return { success: true };
            const json = await resp.json().catch(() => null);
            return { success: false, data: json };
        } catch (err) {
            return { success: false, error: err };
        }
    }
    function openMailtoFallback(name, email, message) {
        const subject = encodeURIComponent('Service request from ' + name);
        const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
        window.location.href = 'mailto:sales@iyke-tech.ng?subject=' + subject + '&body=' + body;
    }

    async function handleFormSubmission(e, form, msgEl) {
        e.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();
        if (!name || !email || !message) {
            msgEl.style.color = '';
            msgEl.textContent = 'Please fill name, email and message.';
            return;
        }
        msgEl.style.color = '';
        msgEl.textContent = 'Sending...';

        if (FORMSPREE_ENDPOINT.includes('yourFormId') || FORMSPREE_ENDPOINT.trim() === '') {
            openMailtoFallback(name, email, message);
            msgEl.textContent = 'Opening your mail client to send request...';
            return;
        }

        const result = await submitToFormspree(form);
        if (result.success) {
            msgEl.style.color = 'green';
            msgEl.textContent = 'Thanks — your message has been sent. We will reply soon.';
            form.reset();
        } else {
            msgEl.style.color = '#a33';
            msgEl.textContent = 'There was an error sending your message. Opening mail client as fallback.';
            openMailtoFallback(name, email, message);
        }
    }

    const contactForm = document.getElementById('contactForm');
    const sendMsg = document.getElementById('sendMsg');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmission(e, contactForm, sendMsg));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('show-focus-styles'); });

    (function initTagsToggle() {
        const MAX_VISIBLE = 11;
        const tagsContainer = document.getElementById('serviceTagsList');
        const toggleWrapper = document.getElementById('tagsToggleWrapper');
        if (!tagsContainer || !toggleWrapper) return;
        const tags = Array.from(tagsContainer.querySelectorAll('.tag'));
        if (tags.length <= MAX_VISIBLE) {
            toggleWrapper.setAttribute('aria-hidden', 'true');
            return;
        }

        const hiddenTags = tags.slice(MAX_VISIBLE);
        hiddenTags.forEach(t => {
            t.classList.add('hidden');
            t.setAttribute('aria-hidden', 'true');
            t.setAttribute('data-hidden-by-toggle', 'true');
            t.setAttribute('tabindex', '-1');
        });

        const hiddenCount = hiddenTags.length;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tags-toggle';
        btn.id = 'toggleTagsBtn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'serviceTagsList');
        btn.textContent = `Show more (${hiddenCount})`;

        toggleWrapper.appendChild(btn);
        toggleWrapper.setAttribute('aria-hidden', 'false');

        let expanded = false;
        btn.addEventListener('click', () => {
            expanded = !expanded;
            btn.setAttribute('aria-expanded', String(expanded));
            if (expanded) {
                hiddenTags.forEach(t => {
                    t.classList.remove('hidden');
                    t.removeAttribute('aria-hidden');
                    t.setAttribute('tabindex', '0');
                });
                btn.textContent = 'Show less';
            } else {
                hiddenTags.forEach(t => {
                    t.classList.add('hidden');
                    t.setAttribute('aria-hidden', 'true');
                    t.setAttribute('tabindex', '-1');
                });
                btn.textContent = `Show more (${hiddenCount})`;
                btn.focus();
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                btn.click();
            }
        });
    })();

    // (function initProducts() {
    //     const productCards = Array.from(document.querySelectorAll('.product-card'));
    //     const modal = document.getElementById('productModal');
    //     const pmTitle = document.getElementById('pm-title');
    //     const pmPrice = document.getElementById('pm-price');
    //     const pmImg = document.getElementById('pmImg');
    //     const pmDesc = document.getElementById('pm-desc');
    //     const pmDetails = document.getElementById('pm-details');
    //     const pmClose = document.getElementById('pmClose');
    //     const pmGetLink = document.getElementById('pmGetLink');

    //     if (!modal) return;

    //     function whatsappHref(message) {
    //         const text = encodeURIComponent(message || '');
    //         return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    //     }

    //     productCards.forEach(card => {
    //         const title = card.getAttribute('data-title') || '';
    //         const getAnchor = card.querySelector('.get-link');
    //         const defaultMessage = `Hi, I'm interested in ${title}`;
    //         if (getAnchor) {
    //             getAnchor.href = whatsappHref(defaultMessage);
    //             getAnchor.setAttribute('target', '_blank');
    //             getAnchor.setAttribute('rel', 'noopener noreferrer');
    //         } else {
    //             const actions = card.querySelector('.product-actions');
    //             if (actions) {
    //                 const a = document.createElement('a');
    //                 a.className = 'btn-outline get-link';
    //                 a.href = whatsappHref(defaultMessage);
    //                 a.setAttribute('target', '_blank');
    //                 a.setAttribute('rel', 'noopener noreferrer');
    //                 a.textContent = 'Get';
    //                 actions.appendChild(a);
    //             }
    //         }
    //     });

    //     function buildDetailsHtml(card) {
    //         const summary = card.getAttribute('data-summary') || '';
    //         const unnamedRaw = card.getAttribute('data-unnamed') || '';
    //         const unnamed = unnamedRaw ? unnamedRaw.split('||').map(s => s.trim()).filter(Boolean) : [];

    //         const namedRaw = card.getAttribute('data-named') || '';
    //         const named = [];
    //         if (namedRaw) {
    //             namedRaw.split('||').forEach(pair => {
    //                 const idx = pair.indexOf(':');
    //                 if (idx > -1) {
    //                     const key = pair.slice(0, idx).trim();
    //                     const val = pair.slice(idx + 1).trim();
    //                     if (key) named.push({ key, val });
    //                 }
    //             });
    //         }

    //         let html = '';
    //         if (summary) {
    //             html += `<p>${summary}</p>`;
    //         }

    //         if (unnamed.length) {
    //             html += `<ul class="pm-unnamed-list">`;
    //             unnamed.forEach(it => {
    //                 html += `<li>${it}</li>`;
    //             });
    //             html += `</ul>`;
    //         }

    //         if (named.length) {
    //             html += `<table class="pm-spec-table" aria-hidden="false">`;
    //             named.forEach(row => {
    //                 html += `<tr><th style="width:36%">${row.key}</th><td>${row.val}</td></tr>`;
    //             });
    //             html += `</table>`;
    //         }

    //         return { html, namedCount: named.length, unnamedCount: unnamed.length };
    //     }

    //     function openModalFromCard(card) {
    //         const title = card.getAttribute('data-title') || '';
    //         const price = card.getAttribute('data-price') || '';
    //         const img = card.getAttribute('data-img') || '';
    //         const details = buildDetailsHtml(card);

    //         pmTitle.textContent = title;
    //         // pmPrice.textContent = price ? `₦${Number(parseFloat(price).toFixed(2)).toLocaleString()}` : '';
    //         pmImg.style.backgroundImage = img ? `url('${img}')` : '';
    //         pmDesc.innerHTML = '';
    //         pmDetails.innerHTML = details.html || '';

    //         const msg = `Hi, I'm interested in ${title}. Please send availability and pricing.`;
    //         if (pmGetLink) {
    //             pmGetLink.href = whatsappHref(msg);
    //             pmGetLink.setAttribute('target', '_blank');
    //             pmGetLink.setAttribute('rel', 'noopener noreferrer');
    //         }

    //         modal.classList.add('open');
    //         modal.setAttribute('aria-hidden', 'false');
    //         document.body.style.overflow = 'hidden';
    //         pmClose.focus();
    //     }

    //     productCards.forEach(card => {
    //         const viewBtn = card.querySelector('.view-details');
    //         if (viewBtn) {
    //             viewBtn.addEventListener('click', (e) => {
    //                 const c = e.target.closest('.product-card');
    //                 if (!c) return;
    //                 openModalFromCard(c);
    //             });
    //         } else {
    //             card.addEventListener('click', (e) => {
    //                 if (e.target.closest('.get-link')) return;
    //                 openModalFromCard(card);
    //             });
    //         }
    //     });

    //     function closeModal() {
    //         modal.classList.remove('open');
    //         modal.setAttribute('aria-hidden', 'true');
    //         document.body.style.overflow = '';
    //     }

    //     pmClose.addEventListener('click', closeModal);
    //     modal.addEventListener('click', (e) => {
    //         if (e.target === modal) closeModal();
    //     });

    //     document.addEventListener('keydown', (e) => {
    //         if (e.key === 'Escape' && modal.classList.contains('open')) {
    //             closeModal();
    //         }
    //     });

    // })();

    (function initProducts() {
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        const modal = document.getElementById('productModal');

        // This script is shared across multiple pages.
        // Exit safely if this page has no product section or modal.
        if (!productCards.length || !modal) return;

        const pmTitle = document.getElementById('pm-title');
        const pmPrice = document.getElementById('pm-price');
        const pmImg = document.getElementById('pmImg');
        const pmDesc = document.getElementById('pm-desc');
        const pmDetails = document.getElementById('pm-details');
        const pmClose = document.getElementById('pmClose');
        const pmGetLink = document.getElementById('pmGetLink');

        const pmPrev = document.getElementById('pmPrev');
        const pmNext = document.getElementById('pmNext');
        const pmCounter = document.getElementById('pmCounter');

        // Currently selected product and image in the modal.
        let activeCard = null;
        let modalImageIndex = 0;
        let lastFocusedElement = null;

        /*
         * Read a product's images.
         *
         * data-images supports multiple images separated by "|".
         * data-img remains supported for existing single-image products.
         */
        function getProductImages(card) {
            const imagesAttribute = card.dataset.images || '';

            const images = imagesAttribute
                .split('|')
                .map(url => url.trim())
                .filter(Boolean);

            if (images.length) {
                return [...new Set(images)];
            }

            const fallbackImage = card.dataset.img || '';

            if (fallbackImage.trim()) {
                return [fallbackImage.trim()];
            }

            // Backward compatibility with cards containing an ordinary image.
            const existingImage = card.querySelector(
                '.product-carousel-image, img'
            );

            if (existingImage && existingImage.getAttribute('src')) {
                return [existingImage.getAttribute('src')];
            }

            return [];
        }

        /*
         * Safely format image URLs for CSS background-image.
         */
        function setBackgroundImage(element, url) {
            if (!element) return;

            if (!url) {
                element.style.backgroundImage = 'none';
                return;
            }

            const escapedUrl = url
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/[\n\r\f]/g, '');

            element.style.backgroundImage = `url("${escapedUrl}")`;
        }

        /*
         * Escape text before inserting it into generated HTML.
         */
        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        /*
         * Initialize the image state for each product card.
         */
        productCards.forEach(card => {
            const images = getProductImages(card);

            card._productImages = images;
            card._productImageIndex = 0;

            const carousel = card.querySelector('.product-carousel');
            const imageElement = card.querySelector('.product-carousel-image');
            const previousButton = card.querySelector('.product-carousel-prev');
            const nextButton = card.querySelector('.product-carousel-next');
            const counter = card.querySelector('.product-carousel-counter');

            // Preserve support for older cards without carousel markup.
            if (!carousel || !imageElement) return;

            function updateCardCarousel() {
                const total = images.length;
                const index = card._productImageIndex;

                if (total) {
                    imageElement.src = images[index];
                    imageElement.alt =
                        `${card.dataset.title || 'Product'} — image ${index + 1}`;
                } else {
                    imageElement.removeAttribute('src');
                    imageElement.alt = 'No product image available';
                }

                if (counter) {
                    counter.textContent = total
                        ? `${index + 1} / ${total}`
                        : '0 / 0';
                }

                const showControls = total > 1;

                if (previousButton) {
                    previousButton.hidden = !showControls;
                }

                if (nextButton) {
                    nextButton.hidden = !showControls;
                }

                if (counter) {
                    counter.hidden = !showControls;
                }
            }

            function changeCardImage(direction) {
                const total = images.length;

                if (total <= 1) return;

                card._productImageIndex =
                    (card._productImageIndex + direction + total) % total;

                updateCardCarousel();
            }

            if (previousButton) {
                previousButton.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();

                    changeCardImage(-1);
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();

                    changeCardImage(1);
                });
            }

            updateCardCarousel();
        });

        /*
         * Generate a WhatsApp link for the selected product.
         */
        function whatsappHref(message) {
            const text = encodeURIComponent(message || '');
            return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
        }

        /*
         * Update the WhatsApp links on the product cards.
         */
        productCards.forEach(card => {
            const title = card.dataset.title || 'this product';
            const getLink = card.querySelector('.get-link');

            if (getLink) {
                getLink.href = whatsappHref(
                    `Hi, I'm interested in ${title}. Please send availability and pricing.`
                );

                getLink.target = '_blank';
                getLink.rel = 'noopener noreferrer';
            }
        });

        /*
         * Preserve the existing summary, unnamed details, and named details
         * data attributes used by the product cards.
         */
        function buildDetailsHtml(card) {
            const summary = card.getAttribute('data-summary') || '';

            const unnamedRaw = card.getAttribute('data-unnamed') || '';
            const unnamed = unnamedRaw
                ? unnamedRaw.split('||').map(s => s.trim()).filter(Boolean)
                : [];

            const namedRaw = card.getAttribute('data-named') || '';
            const named = [];

            if (namedRaw) {
                namedRaw.split('||').forEach(pair => {
                    const idx = pair.indexOf(':');

                    if (idx > -1) {
                        const key = pair.slice(0, idx).trim();
                        const val = pair.slice(idx + 1).trim();

                        if (key) {
                            named.push({ key, val });
                        }
                    }
                });
            }

            let html = '';

            if (summary) {
                html += `<p>${escapeHtml(summary)}</p>`;
            }

            if (unnamed.length) {
                html += `<ul class="pm-unnamed-list">`;

                unnamed.forEach(it => {
                    html += `<li>${escapeHtml(it)}</li>`;
                });

                html += `</ul>`;
            }

            if (named.length) {
                html += `<table class="pm-spec-table" aria-hidden="false">`;

                named.forEach(row => {
                    html += `
                <tr>
                    <th style="width:36%">${escapeHtml(row.key)}</th>
                    <td>${escapeHtml(row.val)}</td>
                </tr>
            `;
                });

                html += `</table>`;
            }

            return {
                html,
                namedCount: named.length,
                unnamedCount: unnamed.length
            };
        }

        /*
         * Update the modal's image and counter.
         */
        function updateModalCarousel() {
            if (!activeCard) return;

            const images = activeCard._productImages || [];
            const total = images.length;

            if (total) {
                modalImageIndex = Math.max(
                    0,
                    Math.min(modalImageIndex, total - 1)
                );

                setBackgroundImage(pmImg, images[modalImageIndex]);
            } else {
                setBackgroundImage(pmImg, '');
            }

            if (pmCounter) {
                pmCounter.textContent = total
                    ? `${modalImageIndex + 1} / ${total}`
                    : '0 / 0';

                pmCounter.hidden = total <= 1;
            }

            if (pmPrev) {
                pmPrev.hidden = total <= 1;
            }

            if (pmNext) {
                pmNext.hidden = total <= 1;
            }
        }

        /*
         * Navigate through the images in the modal.
         */
        function changeModalImage(direction) {
            if (!activeCard) return;

            const images = activeCard._productImages || [];
            const total = images.length;

            if (total <= 1) return;

            modalImageIndex =
                (modalImageIndex + direction + total) % total;

            updateModalCarousel();

            // Keep the card and modal image selections synchronized.
            activeCard._productImageIndex = modalImageIndex;

            const cardImage = activeCard.querySelector(
                '.product-carousel-image'
            );

            if (cardImage) {
                cardImage.src = images[modalImageIndex];

                cardImage.alt =
                    `${activeCard.dataset.title || 'Product'} — image ${modalImageIndex + 1}`;
            }

            const cardCounter = activeCard.querySelector(
                '.product-carousel-counter'
            );

            if (cardCounter) {
                cardCounter.textContent =
                    `${modalImageIndex + 1} / ${total}`;
            }
        }

        if (pmPrev) {
            pmPrev.addEventListener('click', () => {
                changeModalImage(-1);
            });
        }

        if (pmNext) {
            pmNext.addEventListener('click', () => {
                changeModalImage(1);
            });
        }

        /*
         * Open the modal for a selected product.
         */
        function openModalFromCard(card) {
            activeCard = card;
            lastFocusedElement = document.activeElement;

            const title = card.dataset.title || '';
            const price = card.dataset.price || '';

            const images = card._productImages || getProductImages(card);

            // Open at the image currently selected on the card.
            modalImageIndex = card._productImageIndex || 0;

            if (modalImageIndex >= images.length) {
                modalImageIndex = 0;
            }

            if (pmTitle) {
                pmTitle.textContent = title;
            }

            if (pmPrice) {
                pmPrice.textContent = price ? `$${price}` : '';
                pmPrice.hidden = !price;
            }

            if (pmDesc) {
                pmDesc.textContent = '';
            }

            if (pmDetails) {
                const details = buildDetailsHtml(card);
                pmDetails.innerHTML = details.html;
            }

            if (pmGetLink) {
                pmGetLink.href = whatsappHref(
                    `Hi, I'm interested in ${title}. Please send availability and pricing.`
                );

                pmGetLink.target = '_blank';
                pmGetLink.rel = 'noopener noreferrer';
            }

            updateModalCarousel();

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');

            document.body.style.overflow = 'hidden';

            if (pmClose) {
                pmClose.focus();
            }
        }

        /*
         * Bind product details buttons.
         */
        productCards.forEach(card => {
            const viewButton = card.querySelector('.view-details');

            if (viewButton) {
                viewButton.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();

                    openModalFromCard(card);
                });
            } else {
                // Preserve the fallback for cards without a View Details button.
                card.addEventListener('click', event => {
                    if (
                        event.target.closest('a, button') ||
                        event.target.closest('.product-carousel')
                    ) {
                        return;
                    }

                    openModalFromCard(card);
                });
            }
        });

        /*
         * Close the modal and restore page scrolling.
         */
        function closeModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');

            document.body.style.overflow = '';

            activeCard = null;

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus === 'function'
            ) {
                lastFocusedElement.focus();
            }

            lastFocusedElement = null;
        }

        if (pmClose) {
            pmClose.addEventListener('click', closeModal);
        }

        // Close when clicking the dark backdrop, not the modal content.
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Close with Escape and navigate images with keyboard arrows.
        document.addEventListener('keydown', event => {
            if (!modal.classList.contains('open')) return;

            if (event.key === 'Escape') {
                closeModal();
                return;
            }

            // Don't hijack arrow keys when the user is typing.
            const tagName = event.target.tagName;

            if (
                tagName === 'INPUT' ||
                tagName === 'TEXTAREA' ||
                event.target.isContentEditable
            ) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                changeModalImage(-1);
            } else if (event.key === 'ArrowRight') {
                changeModalImage(1);
            }
        });

    })();

})();