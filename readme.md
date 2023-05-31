У даній лабораторній була доданий синхронний зв'язок між сервісами та забезпечено відмовостійкість завдяки патернам retry/timeout та circuit breaker.

retry/timeout працює наступним чином:

1. timeout встановлює максимальний час очікування відповіді від storage-api (у нашому випадку 10s), якщо відповідь не буде повертатися довше 10 секунд запит обривається і повертається помилка request timeout
2. retry встановлює кількість повторних запитів на сервіс storage-api. У нашому випадку, якщо storage-api буде повертати помилки 5хх, буде 3 повторних запита з таймаутом в 5 секунд.

Щоб пересвідчитись, що патерн circuit breaker працює коректно, потрібно:

1. Зареєструвати користувача за допомогою веб-клієнта за адресою http://localhost
2. За допомогою терміналу отримати userId користувача наступною командою

```shell
kubectl exec $(kubectl get pods | grep mongo | awk '{print $1}') -- mongosh --quiet --eval "db = db.getSiblingDB('auth-api'); db.users.findOne()" | grep id
```

3. Надіслати 3 запита з неіснуючим userId, які повернуть помилку 500 наступною командою:

```shell
curl -X POST -H "Content-Type: application/json" -d '{"userId":"unknown","name":"archive"}' http://localhost/api/storage/archives
```

4. Надіслати запит з userId, щоб пересвідчитись, що один з подів, на якому відбулось 3 помилки з кодом 500 було виключено з балансування.

```shell
curl -X POST -H "Content-Type: application/json" -d '{"userId":"$userId","name":"archive"}' http://localhost/api/storage/archives
```
