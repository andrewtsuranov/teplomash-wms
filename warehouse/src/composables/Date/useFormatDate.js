import {ref, reactive} from 'vue';

export function useFormatDate() {
    const formattedDateTime = reactive({
        date: '',
        time: '',
    });

    /**
     * Форматирует Unix-время (timestamp) в объект с датой и временем.
     *
     * @param {number} timestamp - Unix-время в миллисекундах.
     * @returns {object} Объект с датой и временем в формате { date: 'гггг-мм-дд', time: 'чч:мм:сс' }.
     */
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        formattedDateTime.date = `${year}-${month}-${day}`;
        formattedDateTime.time = `${hours}:${minutes}:${seconds}`;
        return formattedDateTime;
    }

    return {formattedDateTime, formatTimestamp};
}