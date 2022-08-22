# Автоматическое тестирование

### Описание:

Тестирование двух приложений:

#### Тестирование [Игры в пары](https://github.com/hysoyam/Find-The-Pair-Card-Game])
Сквозное тестирование проводится при помощи фреймворка Сypress.

Имитируется полный проигрыш всей игры, отдельных сценариев игры, тестируется функциональность элементов управления.

#### Тестирование [Валидации Карты](https://github.com/hysoyam/Credit-Card-validation])
Модульное тестирование проводится при помощи фреймворка Jest.

Тестирование функций валидации на правильное и неправильное поведение. Функций создания DOM элементовв на корректное поведение.

### Запуск
Тестирование Валидации Карты - `npm test:validation`
Тестирование Игры в пары - `npm test:cards`
