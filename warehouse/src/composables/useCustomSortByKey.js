export const useCustomSortByKey = (grouped, orderKeys) => {
    // Создаем новый объект для отсортированного результата
    const sortedResult = {};

    // Сначала добавляем ключи в порядке, указанном в orderKeys
    orderKeys.forEach(key => {
        if (grouped[key]) {
            sortedResult[key] = grouped[key];
        }
    });
    return sortedResult;
};
