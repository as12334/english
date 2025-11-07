export const scrollToSection = (sectionId: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const normalized = sectionId.startsWith("#")
    ? sectionId.slice(1)
    : sectionId;

  const tryScroll = () => {
    const target = document.getElementById(normalized);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return true;
    }
    return false;
  };

  if (tryScroll()) return;

  window.requestAnimationFrame(() => {
    if (tryScroll()) return;
    window.location.hash = `#${normalized}`;
  });
};
