Тест централізованої системи логування:
1. Запустити додаток за допомогою helm:
   ```shell
   helm install archive-cloud helm
   ```
2. Виконати порт форвард сервісу Kibana:
   ```shell
   kubectl port-forward svc/archive-cloud-kibana 5601:5601 & 
   ```
3. У вкладці браузера відкрити http://localhost:5601 та дочекатися готовності Kibana
4. Змусити додаток згенерувати логи, наприклад видалити один з подів мікросервісів auth-api, storage-api або upload-api
5. У Kibana: Analytics -> Discover -> Create data view. У формі вказати ім'я, наприклад "demo", та index pattern "logs", натиснути Save data view to Kibana, потім Discover.

Тест системи моніторингу:
1. Встановити Prometheus та Grafana за допомогою Helm:
   ```shell
   kubectl create namespace monitoring
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install --namespace monitoring prometheus prometheus-community/kube-prometheus-stack
   ```
2. Виконати порт форфард сервісу Grafana:
   ```shell
   kubectl -n monitoring port-forward svc/prometheus-grafana 8080:80 &
   ```
3. У вкладці браузера відкрити http://localhost:8080
4. Авторизуватися у Grafana (username: admine, password: prom-operator)
5. Натиснути на бокове меню та обрати Dashoboards -> New -> Import. Імпортувати grafana-dashobard.json.