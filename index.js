// Загрузка модулей Node.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Получение токена бота из файла конфигурации
const token = '6195300943:AAFmeoLwGJoqmqGmDmqh9N223Pzh_rlsxfs';
// Создание нового экземпляра TelegramBot с использованием полученного токена и настройками опроса
const bot = new TelegramBot(token, { polling: true });

// Массив с путями к изображениям
const imagePaths = [
    'to/2.jpg',
    'to/3.jpg',
    'to/4.jpg',
    'to/5.jpg',
    'to/6.jpg',
    'to/7.jpg',
    'to/8.jpg',
    'to/9.jpg',
    'to/10.jpg',
    'to/11.jpg',
];


// Массив для хранения ответов пользователя на вопросы
const answers = [];

// Обработчик события, срабатывающий при получении сообщения от пользователя
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Если сообщение от пользователя содержит команду "/start", то отправляем ему приветственное сообщение с клавиатурой
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Привет! Ты готов начать?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Да', callback_data: 'yes' }
                    ]
                ]
            }
        });
    }
});

// Обработчик события, срабатывающий при получении запроса от пользователя, вызванного нажатием на кнопку на клавиатуре
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // Если пользователь нажал кнопку "Да" и в массиве путей к изображениям еще есть элементы, то отправляем ему первое изображение из массива и сохраняем вопрос в массиве ответов
    if (data === 'yes' && imagePaths.length > 0) {
        const currentImagePath = imagePaths[0];
        fs.readFile(currentImagePath, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            bot.sendPhoto(chatId, data);
        });
        answers.push({
            question: currentImagePath,
            answer: null
        });

        // Удаляем первый элемент из массива путей к изображениям
        imagePaths.splice(0, 1);

        // Ожидаем сообщение от пользователя в ответ на отправленное изображение
        bot.once('message', (msg) => {
            const currentAnswer = answers[answers.length - 1];
            // Сохраняем ответ пользователя в массиве ответов
            currentAnswer.answer = msg.text;
            // Отправляем сообщение с предложением продолжить игру
            bot.sendMessage(chatId, 'Замечательно! Ты готов к продолжению поиска?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Да', callback_data: 'yes' }
                        ]
                    ]
                }
            });
        });
    }
});