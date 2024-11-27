const baseUrls = {
    lab: 'http://lab:8080/',
    USA: 'http://38.180.192.229/',
    // wsLab: 'ws://lab:8081/',
    // wsUSA: 'ws://38.180.192.229/',
}
export const requestUrls = new Proxy({
        auth: 'api/auth/',
        storage: 'api/manager/',
    }, {
        get: (target, property) => {
            const baseUrl = baseUrls.lab;
            return `${baseUrl}${target[property]}`;
        }
    }
)