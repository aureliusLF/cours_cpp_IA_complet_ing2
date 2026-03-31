(function initialiseCourseAppStrings(globalScope) {
  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const escapeAttribute = (value) => escapeHtml(value);

  const normalise = (value) => String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const slugify = (value) => normalise(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  globalScope.CourseAppStrings = {
    escapeAttribute,
    escapeHtml,
    normalise,
    slugify
  };
})(window);
