### Passos para instalar:

```sh
npm install
```

### Passos para rodar a aplicação:
```sh
npm run dev
```

### Passos para buildar a aplicação:
```sh
npm run build
```

### Passos para configurar a aplicação do cambista com a central e o loki:

1 - Central:

Rodar o ngrok na porta que o projeto central esta rodando, normalmente é a porta 80;
```sh
ngrok http 80
```

2 - Aplicação cambista:

Alterar a constante production em src>stores>configClient.store.ts de true para false;

Rodar nova aplicação do cambista, 
```sh
npm run dev 
```

Acessar seguinte url: http://localhost:[porta da aplicação]?host=[url https gerado no ngrok]&slug=[seu slug]&name=[qualquer nome]

3 - Loki:

Configurar os arquivos: app/Http/Middleware>MultiSystemWithFile.php e storage>app>services.json

MultiSystemWithFile:

Alterar a constante APP_CAMBISTA_ORIGIN de 'app.weebet.tech' para  a porta que a aplicação do cambista esta sendo executada, normalmente é a 'localhost:7000';

services.json : 

"url https gerada pelo ngrok": {
    "database": {
        "hostname": "mesmo host da central",
        "schema": "mesmo schema da central",
        "username": "mesmo user name da central",
        "password": "mesmo password da central",
        "port": "3306"
    }
}

Por fim executar:
```sh
php artisan cache:clear & php artisan config:clear & php artisan route:clear
```







