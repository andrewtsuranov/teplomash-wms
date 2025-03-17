const baseUrls = {
    lab: 'http://lab:8080/',
    USA: 'http://38.180.192.229/',
    teplomash: 'http://192.168.1.144/',
}
export const requestUrls = new Proxy({
        auth: 'api/auth/',
        storage: 'api/manager/',
    }, {
        get: (target, property) => {
            const baseUrl = baseUrls.USA;
            return `${baseUrl}${target[property]}`;
        }
    }
)