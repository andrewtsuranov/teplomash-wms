const baseUrls = {
  lab: "http://lab:8080/",
  teplomash: "http://192.168.1.144/",
};
export const requestUrls = new Proxy(
  {
    auth: "api/auth/",
    storage: "api/manager/",
  },
  {
    get: (target, property) => {
      const baseUrl = baseUrls.lab;
      return `${baseUrl}${target[property]}`;
    },
  },
);
