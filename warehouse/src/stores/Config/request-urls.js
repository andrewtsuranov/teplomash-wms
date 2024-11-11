const baseUrls = {
    lab: 'http://lab:8080/',
    USA: 'http://38.180.192.229/',
}
export const requestUrls = new Proxy({
    auth: 'api/auth/',
    storage: 'api/manager/',
}, {
    get: (target, property, receiver) => {
        const baseUrl = baseUrls.lab; // или baseUrls.production, в зависимости от режима
        return `${baseUrl}${target[property]}`;
    }
    }
)