module.exports = (req) => {
  const stringableRequest = {
    baseUrl: `${req.baseUrl}`,
    body: `${JSON.stringify(req.body)}`,
    cookies: `${JSON.stringify(req.cookies)}`,
    fresh: `${req.fresh}`,
    hostname: `${req.hostname}`,
    ip: `${req.ip}`,
    ips: `${JSON.stringify(req.ips)}`,
    method: `${req.method}`,
    originalUrl: `${req.originalUrl}`,
    params: `${JSON.stringify(req.params)}`,
    path: `${req.path}`,
    protocol: `${req.protocol}`,
    query: `${JSON.stringify(req.query)}`,
    route: `${JSON.stringify(req.route)}`,
    secure: `${req.secure}`,
    signedCookies: `${JSON.stringify(req.signedCookies)}`,
    stale: `${req.stale}`,
    subdomains: `${req.subdomains}`,
    xhr: `${req.xhr}`,
  };

  return JSON.stringify(stringableRequest);
};
