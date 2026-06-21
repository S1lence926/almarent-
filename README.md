AlmaRent

Платформа для поиска и размещения жилья в аренду в Алматы. Сервис помогает арендаторам быстро найти подходящий вариант жилья по фильтрам, а арендодателям — разместить объявление и пообщаться с потенциальными жильцами напрямую через встроенный чат.

Стек технологий

Frontend: React 18, TypeScript, React Router
Backend: Go, Gin
База данных: PostgreSQL, Redis
Аутентификация: JWT (access token)
Хранение файлов: локальная файловая система (папка uploads)

Функционал


Регистрация и авторизация с разделением ролей (арендатор / арендодатель)
Личный кабинет с профилем пользователя
Создание, редактирование и удаление объявлений
Загрузка фотографий к объявлениям (до 10 штук)
Поиск с фильтрацией по району, цене, количеству комнат и удобствам
Сортировка объявлений по цене и дате публикации
Избранное
Чат между арендатором и арендодателем


Структура проекта

almarent/
├── backend/
│   └── cmd/
│       ├── internal/
│       │   ├── config/        конфигурация приложения
│       │   ├── db/            подключение к PostgreSQL
│       │   ├── redis/         подключение к Redis
│       │   ├── models/        модели данных
│       │   ├── repository/    слой работы с БД
│       │   ├── handlers/      HTTP-хендлеры
│       │   ├── middleware/    JWT-аутентификация
│       │   └── router/        маршрутизация
│       ├── migrations/        SQL-миграции
│       ├── uploads/           загруженные фотографии
│       └── main.go
│
└── frontend/
    └── almarent/
        └── src/
            ├── api/            запросы к backend API
            ├── components/     переиспользуемые компоненты
            ├── context/        React Context (авторизация)
            ├── pages/          страницы приложения
            └── types/          TypeScript-типы

Локальный запуск

Требования


Go 1.22+
Node.js 18+
PostgreSQL 15+
Redis (опционально для текущей версии)


1. База данных

Создайте базу данных PostgreSQL:

sqlCREATE DATABASE almarent;

Примените миграции — выполните содержимое файла backend/cmd/migrations/001_init.sql в созданной базе (через psql или pgAdmin).

2. Backend

bashcd backend/cmd

Создайте файл .env на основе .env.example:

envPORT=8080
DATABASE_URL=postgres://postgres:ваш_пароль@localhost:5432/almarent?sslmode=disable
REDIS_URL=redis://localhost:6379
JWT_SECRET=замените_на_случайную_строку

Установите зависимости и запустите сервер:

bashgo mod tidy
go run main.go

Backend будет доступен на http://localhost:8080.

3. Frontend

bashcd frontend/almarent

Создайте файл .env:

envVITE_API_URL=http://localhost:8080/api

Установите зависимости и запустите:

bashnpm install
npm run dev

Frontend будет доступен на http://localhost:5173.

API-эндпоинты

Аутентификация

МетодПутьОписаниеТребует токенPOST/api/auth/registerРегистрация пользователяНетPOST/api/auth/loginВход в системуНет

Объявления

МетодПутьОписаниеТребует токенGET/api/listingsСписок объявлений с фильтрамиНетGET/api/listings/:idДетали объявленияНетPOST/api/listingsСоздать объявлениеДаPUT/api/listings/:idРедактировать объявлениеДаDELETE/api/listings/:idУдалить объявлениеДаGET/api/listings/:id/photosФотографии объявленияНетPOST/api/listings/:id/photosПрикрепить фото к объявлениюДа

Фото

МетодПутьОписаниеТребует токенPOST/api/uploadЗагрузить файл фотоДа

Чат

МетодПутьОписаниеТребует токенPOST/api/chatsСоздать/получить чат по объявлениюДаGET/api/chatsСписок своих чатовДаGET/api/chats/:id/messagesИстория сообщенийДаPOST/api/chats/:id/messagesОтправить сообщениеДа

Параметры фильтрации GET /api/listings

ПараметрТипОписаниеdistrictstringРайон городаprice_minnumberМинимальная ценаprice_maxnumberМаксимальная ценаroomsnumberКоличество комнатsortstringnewest, price_asc, price_desc

Автор

Харитонов Владимир
