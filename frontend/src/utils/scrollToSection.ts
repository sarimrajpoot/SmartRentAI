export const scrollToSection = (sectionId: string) => {
  // Remove the '#' if present
  const id = sectionId.startsWith("#") ? sectionId.substring(1) : sectionId;
  const element = document.getElementById(id);

  if (element) {
    // The sticky navbar is typically ~80px height. We'll add a little extra padding.
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};
