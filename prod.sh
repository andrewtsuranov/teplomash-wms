#!/bin/bash

# Проверка, находимся ли мы в Git репозитории
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Ошибка: Вы не находитесь в Git репозитории"
    exit 1
fi

# Сохраняем текущую ветку
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Переключаемся на prod ветку
git checkout prod

# Мэрджим master в prod
git merge master

# Пушим изменения в удаленный репозиторий
git push origin prod

# Возвращаемся на исходную ветку (master)
git checkout master

echo "Деплой завершен: master смержен в prod и запушен"