const fs = require("fs");
const path = require("path");

function loadServices() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "services.json"), "utf8"));
}

module.exports = function () {
  const services = loadServices();
  const parent = services.find((service) => Array.isArray(service.menuChildren));
  if (!parent) return [];

  const fullServiceSlugs = new Set(
    services.filter((service) => (!service.menuGroup || service.detailPage) && !service.href).map((service) => service.slug)
  );

  for (const service of require("./servicePages")()) fullServiceSlugs.add(service.slug);

  const pages = [
    {
      title: parent.title,
      slug: parent.slug,
    },
    ...parent.menuChildren
      .filter((child) => child.slug && !fullServiceSlugs.has(child.slug))
      .map((child) => ({
        title: child.title,
        slug: child.slug,
        parentTitle: parent.title,
        parentUrl: `/uslugi/${parent.slug}/`,
      })),
  ];
  return pages.filter((page) => !fullServiceSlugs.has(page.slug));
};
