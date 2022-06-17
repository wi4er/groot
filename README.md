# Groot

## Endpoints 

* **/content/**
* **/description/**
* **/directory/**
* **/image/**
* **/lang/**
* **/permission/**x
* **/property/**
* **/section/**
* **/status/**
* **/value/**

## Entities

* **Content**
* **Description**
* **Directory**
* **Image**
* **Lang**
* **Permission**
* **Property**
* **Section**
* **Flag**
* **Value**

## Environment variables

* **PORT** - порт, на котором будет запущено приложение
  * по умолчанию = 8080
* **DB_USER** - имя пользователя для базы данных DB_NAME
  * по умолчанию = content
  * имя пользователя рута не подходит
* **DB_PASSWORD** - пароль для пользователя DB_USER
  * по умолчанию = example
* **DB_HOST** - хост, где расположена база данных DB_NAME
    * по умолчанию = localhost
    * внутри docker-compose необходимо указывать внутренний хост, например: mongo
* **DB_PORT** - порт на котором находится база данных DB_NAME на хосте DB_HOST
    * по умолчанию = 27017
* **DB_NAME** - имя базы данных
    * по умолчанию = content
* **DB_URL** - url подключения к базе данных
    * исключает использования переменных DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
    * формат: mongodb://root:example@localhost:27017/admin
* USE_SSL - в случае если база данных требует SSL подключение, содержит абсолютный адрес к файлу с сертификатом 
* CACHE_HOST - 
