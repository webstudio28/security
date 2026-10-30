const services = require("./services.json");
const locations = require("./locations.json");

module.exports = function () {
  const urls = ["/", "/za-nas/", "/kontakti/", "/uslugi/", "/gradove/"];

  for (const service of services) {
    if (service.href) continue;
    urls.push(`/uslugi/${service.slug}/`);
    if (!Array.isArray(service.menuChildren)) continue;
    for (const child of service.menuChildren) {
      if (child.slug) urls.push(`/uslugi/${child.slug}/`);
    }
  }

  for (const location of locations) {
    if (location.slug) urls.push(`/gradove/${location.slug}/`);
  }

  return [...new Set(urls)];
};
