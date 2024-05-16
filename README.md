# Servidor REST simples

Este projeto utiliza as bibliotecas [json-server](https://github.com/typicode/json-server#readme) e [json-server-auth](https://github.com/jeremyben/json-server-auth#readme) para criar um servidor REST simples ideal para testes em projetos Front-end e para APIs de Mockup.

## Funcionalidades

Todas as funcionalidades disponíveis podem ser encontradas nas documentações das referidas bibliotecas.

## Permissões

As configurações de permissão são feitas no arquivo `routes.json`. É necessário reiniciar o servidor para que alterações tenham efeito.

A tabela abaixo tem um referência das permissões como especificado em [Rotas protegidas - JSON Server Auth](https://github.com/jeremyben/json-server-auth?tab=readme-ov-file#guarded-routes-).

*Public* - Cliente logado ou deslogado

*Logged* - Cliente logado

*Owner* - Cliente logado e proprietário do recurso

*None* - Nenhum cliente

|  | Write | Read |
| --- | --- | --- |
| 664 | Logged | Public |
| 660 | Logged | Logged |
| 644 | Owner | Public |
| 640 | Owner | Public |
| 600 | Owner | Owner |
| 444 | None | Public |
| 440 | None | Logged |
| 400 | None | Owner |
