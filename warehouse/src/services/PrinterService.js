// src/services/PrinterService.js
import ky from 'ky';

export class PrinterService {
    constructor(credentials = {username: '', password: ''}) {
        this.printerUrl = '/printer';
        this.dotsPerMm = 11.811;
        // Создаем Basic Auth токен
        this.authToken = btoa(`${credentials.username}:${credentials.password}`);
    }

    async printQRCode(data, options = {}) {
        const {
            position = {x: 50, y: 50},
            size = 5,
            errorCorrection = 'Q',
            labelWidth = 50,
            labelHeight = 30
        } = options;
        const widthDots = Math.round(labelWidth * this.dotsPerMm);
        const heightDots = Math.round(labelHeight * this.dotsPerMm);
        const xDots = Math.round(position.x * this.dotsPerMm);
        const yDots = Math.round(position.y * this.dotsPerMm);
        const zplCommand = `
^XA
^PW${widthDots}
^LL${heightDots}
^FO${xDots},${yDots}
^BQN,${size},${errorCorrection}
^FD${data}^FS
^XZ`.trim();
        try {
            const response = await ky.post(this.printerUrl, {
                body: zplCommand,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${this.authToken}`
                },
                timeout: 5000
            });
            return true;
        } catch (error) {
            console.error('Ошибка печати:', error);
            throw new Error(`Ошибка печати: ${error.message}`);
        }
    }
}

// Создаем экземпляр сервиса с учетными данными
export const printerService = new PrinterService({
    username: 'TPL310H',
    password: '0130'
});