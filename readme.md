У даній лабораторній була доданий синхронний зв'язок між сервісами та забезпечено відмовостійкість завдяки патернам retry/timeout та circuit breaker. Щоб пересвідчитись, що патерн circuit breaker працює коректно, потрібно:

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
