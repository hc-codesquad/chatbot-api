# CodeSquad Chatbot API

## Execução em modo local

O projeto está configurado para utilizar o plugin serverless offline e serverless dynamodb local.

A API será inicializada na porta *3000* e as chamadas lambdas diretas na porta *3002*

### Primeiro passo

Instalar as dependencias:

```bash
yarn install
```

### Configurando e rodando o dynamodb local

Para o primeiro uso, será necessário instalar o dynamodb local:

```bash
yarn ddb-install
```

Com o dynamodb local instalado no repositório do projeto e pronto para executar, já podemos fazer o migrate e seed das tabelas: 

```bash
yarn ddb-seed
```

O banco de dados será inicializado na porta *8000* com as tabelas e índices.


## Debug pelo VS Code
O debug já está configurado para inicalizar o serverless offline, então basta iniciar o debug no VS Code no menu *Run -> Start Debug* ou simplesmente pressionando *F5*

Para rodar pelo shell diretamente pode ser executado o comando:

```bash
yarn debug
```