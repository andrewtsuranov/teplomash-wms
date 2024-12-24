export const useGroupByKey = (array, key) => {
    if (!array || !Array.isArray(array)) return {};

    // Создаем Map с существующими группами
    const map = new Map();

    // Сначала добавляем все уникальные ключи
    array.forEach(item => {
        const groupKey = item[key];
        if (!map.has(groupKey)) {
            map.set(groupKey, []);
        }
    });

    // Теперь распределяем элементы по группам
    array.forEach(item => {
        const groupKey = item[key];
        const group = map.get(groupKey);

        // Проверяем, нет ли уже такого элемента в группе
        const exists = group.some(existingItem => existingItem.id === item.id);
        if (!exists) {
            group.push(item);
        }
    });

    return Object.fromEntries(map);
};