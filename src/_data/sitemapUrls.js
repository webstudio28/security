const services = require("./services.json");

module.exports = function () {
  const urls = ["/", "/za-nas/", "/kontakti/", "/uslugi/"];

  for (const service of services) {
    if (service.href) continue;
    urls.push(`/uslugi/${service.slug}/`);
    if (!Array.isArray(service.menuChildren)) continue;
    for (const child of service.menuChildren) {
      if (child.slug) urls.push(`/uslugi/${child.slug}/`);
    }
  }

  return [...new Set(urls)];
};
