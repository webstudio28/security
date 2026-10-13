(function () {
  const header = document.getElementById("header");
  const mobileMenu = document.getElementById("mobileMenu");
  const modal = document.getElementById("inquiryModal");
  const panel = mobileMenu?.querySelector(".absolute.inset-y-0");
  const backdrop = mobileMenu?.children[0];
  const modalCard = modal?.querySelector('[role="dialog"]');
  const modalBackdrop = modal?.children[0];

  function setHeader() {
    if (!header || !header.classList.contains("js-transparent")) return;
    const scrolled = window.scrollY > 32;
    header.classList.toggle("bg-brand-deeper/95", scrolled);
    header.classList.toggle("text-ink", scrolled);
    header.classList.toggle("shadow-[0_5px_22px_rgba(0,0,0,0.35)]", scrolled);
    header.classList.toggle("backdrop-blur-md", scrolled);
    header.classList.toggle("text-white", !scrolled);
    header.querySelectorAll("[data-nav-link]").forEach(() => {});
    const logo = header.querySelector("a");
    if (logo) {
      logo.classList.toggle("text-white", !scrolled);
      logo.classList.toggle("text-ink", scrolled);
    }
    const toggle = document.getElementById("menuOpen");
    if (toggle) {
      toggle.classList.toggle("text-white", !scrolled);
      toggle.classList.toggle("text-ink", scrolled);
    }
    header.querySelectorAll("nav a").forEach((el) => {
      if (el.closest(".group > div")) return;
      el.classList.toggle("text-white/85", !scrolled);
      el.classList.toggle("hover:text-white", !scrolled);
      el.classList.toggle("group-hover:text-white", !scrolled);
      el.classList.toggle("text-ink", scrolled);
      el.classList.toggle("hover:text-ink-muted", scrolled);
      el.classList.toggle("group-hover:text-ink-muted", scrolled);
    });
  }

  if (header && document.body.dataset.transparentHeader === "true") {
    header.classList.add("js-transparent");
    setHeader();
    window.addEventListener("scroll", setHeader, { passive: true });
  }

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("invisible", "pointer-events-none");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    backdrop?.classList.remove("opacity-0");
    backdrop?.classList.add("opacity-100");
    panel?.classList.remove("translate-x-full");
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("invisible", "pointer-events-none");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    backdrop?.classList.add("opacity-0");
    backdrop?.classList.remove("opacity-100");
    panel?.classList.add("translate-x-full");
  }

  document.getElementById("menuOpen")?.addEventListener("click", openMenu);
  document.querySelectorAll("[data-close-menu]").forEach((el) => el.addEventListener("click", closeMenu));
  mobileMenu?.querySelectorAll("a").forEach((el) => el.addEventListener("click", closeMenu));

  function openModal() {
    closeMenu();
    if (!modal) return;
    modal.classList.remove("invisible", "pointer-events-none");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalBackdrop?.classList.remove("opacity-0");
    modalBackdrop?.classList.add("opacity-100");
    modalCard?.classList.remove("opacity-0", "translate-y-4");
    setTimeout(() => document.getElementById("name")?.focus(), 200);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("invisible", "pointer-events-none");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalBackdrop?.classList.add("opacity-0");
    modalBackdrop?.classList.remove("opacity-100");
    modalCard?.classList.add("opacity-0", "translate-y-4");
  }

  document.querySelectorAll(".open-inquiry").forEach((el) => el.addEventListener("click", openModal));
  document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeModal();
    }
  });

  document.getElementById("inquiryForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = document.getElementById("formContent");
    const success = document.getElementById("formSuccess");
    if (content) content.classList.add("hidden");
    if (success) success.classList.remove("hidden");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  document.querySelectorAll("[data-video-embed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-video-embed");
      if (!src) return;
      const host = btn.parentElement;
      if (!host) return;
      const iframe = document.createElement("iframe");
      iframe.className = "h-full w-full";
      iframe.src = src;
      iframe.title = btn.getAttribute("data-video-title") || "Видео";
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      );
      iframe.allowFullscreen = true;
      host.replaceChildren(iframe);
    });
  });

  document.querySelectorAll("[data-drag-scroll]").forEach((el) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    });

    el.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) <= 3) return;
      if (!moved) {
        moved = true;
        el.setPointerCapture?.(e.pointerId);
        el.classList.add("is-dragging");
      }
      el.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("is-dragging");
      try {
        el.releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerleave", () => {
      if (!moved) isDown = false;
    });
    el.addEventListener("lostpointercapture", () => {
      isDown = false;
      el.classList.remove("is-dragging");
    });

    el.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );
  });

  const photoViewer = document.getElementById("companyPhotoViewer");
  if (photoViewer && typeof photoViewer.showModal === "function") {
    const image = document.getElementById("companyPhotoImage");
    const caption = document.getElementById("companyPhotoCaption");
    const count = document.getElementById("companyPhotoCount");
    let photos = [];
    let photoIndex = 0;
    function showPhoto(index) {
      photoIndex = (index + photos.length) % photos.length;
      const link = photos[photoIndex];
      image.src = link.href;
      image.alt = link.querySelector("img").alt;
      image.style.transform = `rotate(${link.dataset.rotation || 0}deg)`;
      caption.textContent = link.dataset.caption;
      count.textContent = `${photoIndex + 1} / ${photos.length}`;
    }
    document.querySelectorAll("[data-gallery-photo]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        photos = [...link.closest("[data-company-gallery]").querySelectorAll("[data-gallery-photo]")];
        showPhoto(photos.indexOf(link));
        photoViewer.showModal();
        document.body.classList.add("gallery-open");
      });
    });
    photoViewer.querySelector("[data-gallery-close]").addEventListener("click", () => photoViewer.close());
    photoViewer.querySelector("[data-gallery-previous]").addEventListener("click", () => showPhoto(photoIndex - 1));
    photoViewer.querySelector("[data-gallery-next]").addEventListener("click", () => showPhoto(photoIndex + 1));
    photoViewer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showPhoto(photoIndex + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
    photoViewer.addEventListener("click", (event) => {
      if (event.target === photoViewer) {
        const rect = photoViewer.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) photoViewer.close();
      }
    });
    photoViewer.addEventListener("close", () => document.body.classList.remove("gallery-open"));
  }
})();
