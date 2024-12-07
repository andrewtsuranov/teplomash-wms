export const useGroupByKey = (array, key) => {
    const map = new Map();
    array.forEach(item => {
        const groupKey = item[key];
        if (!map.has(groupKey)) {
            map.set(groupKey, []);
        }
        map.get(groupKey).push(item);
    });
    return Object.fromEntries(map);
};