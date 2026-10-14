const services = require("./services.json");

module.exports = function () {
  const urls = ["/", "/za-nas/", "/kontakti/", "/uslugi/"];

  for (const service of services) {
    if (service.href) continue;
    urls.push(`/uslugi/${service.slug}/`);
  }

  return [...new Set(urls)];
};
