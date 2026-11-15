"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const targets = new Set<HTMLElement>();
    const reveal = (element: HTMLElement) => {
      if (targets.has(element)) return;
      targets.add(element);
      element.dataset.scrollReveal = "";
      if (observer) observer.observe(element);
      else element.classList.add("is-visible");
    };

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    const scan = (root: ParentNode) => {
      const selector = "[data-scroll-reveal], main section, main article";
      if (root instanceof HTMLElement && root.matches(selector)) reveal(root);
      root.querySelectorAll<HTMLElement>(selector).forEach(reveal);
    };

    document.documentElement.classList.add("scroll-reveal-ready");
    scan(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) scan(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      document.documentElement.classList.remove("scroll-reveal-ready");
    };
  }, []);

  return null;
}
