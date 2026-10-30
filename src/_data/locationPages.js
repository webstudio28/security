const fs = require("fs");
const path = require("path");

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), "utf8"));
}

module.exports = function () {
  const locations = loadJson("locations.json");
  const services = [...loadJson("services.json"), ...loadJson("terrainServices.json")];
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

  return locations.map((location) => {
    const locationServices = (location.serviceSlugs || [])
      .map((slug) => {
        const service = servicesBySlug.get(slug);
        if (!service) return null;
        return {
          slug: service.slug,
          title: service.title,
          url: service.href || `/uslugi/${service.slug}/`,
          image: service.image,
          imageAlt: service.imageAlt,
          imageWidth: service.imageWidth,
          imageHeight: service.imageHeight,
          imageAspect: service.imageAspect,
          shortDescription: service.cardText || service.shortDescription,
        };
      })
      .filter(Boolean);

    const otherLocations = locations
      .filter((item) => item.slug !== location.slug)
      .map((item) => ({
        slug: item.slug,
        name: item.name,
        url: `/gradove/${item.slug}/`,
        h1: item.h1,
        shortDescription: item.shortDescription,
        image: item.image,
        imageAlt: item.imageAlt,
        imageWidth: item.imageWidth,
        imageHeight: item.imageHeight,
      }));

    return {
      ...location,
      locationServices,
      otherLocations,
    };
  });
};
