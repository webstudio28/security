const fs = require("fs");
const path = require("path");

function loadServices() {
  const services = JSON.parse(fs.readFileSync(path.join(__dirname, "services.json"), "utf8"));
  const terrainServices = JSON.parse(fs.readFileSync(path.join(__dirname, "terrainServices.json"), "utf8"));
  return [...services, ...terrainServices];
}

function relatedSlug(url) {
  const match = String(url || "").match(/\/uslugi\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

/** Services that still get a `/uslugi/{slug}/` detail page (not an external href). */
module.exports = function () {
  const services = loadServices();
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
  return services
    .filter((service) => !service.href && (!service.menuGroup || service.detailPage))
    .map((service) => ({
      ...service,
      subcategoryCards: (service.menuChildren || [])
        .map((child) => servicesBySlug.get(child.slug))
        .filter(Boolean),
      relatedServices: (service.relatedServices || [])
        .map((related) => {
          const full = servicesBySlug.get(relatedSlug(related.url));
          if (!full) return related;
          return {
            title: related.title || full.title,
            url: related.url,
            image: full.image,
            imageAlt: full.imageAlt,
            imageWidth: full.imageWidth,
            imageHeight: full.imageHeight,
            imageAspect: full.imageAspect,
            shortDescription: full.shortDescription,
          };
        })
        .filter((related) => related && related.url),
    }));
};
