# Projeto Web - Agenda de vacinação

Gabriel Cardoso de Castro

João Victor Rosa Couto e Silva

## Descrição do Projeto:
Este projeto consiste em um sistema web para facilitar o agendamento de vacinas. Com o aumento da importância da imunização e a necessidade de organizar a distribuição de vacinas, esta aplicação oferece uma solução simples e eficiente para usuários agendarem suas vacinações.

Tecnologias utilizadas: JavaScript, Node.js, MySQL, Express.js, EJS, HTML.

## Funcionalidades:

O sistema tem opção para CRUD de: vacinas, alergias, usuários e agendas (opções de inclusão, exclusão, atualização e consulta)
- Listagens completas para todas as tabelas: Alergias, Vacinas, Usuários e Agendas (escolha as coluna a exibir)
- Listagem (ou opção de filtro) das agendas "Canceladas" e "Realizadas"
- Lista das agenda do dia corrente (ou opção de filtro). Exibir as agendadas primeiro, em seguida as realizadas e canceladas
- Opção para "dar baixa" em uma agenda (indicar a agenda como Realizada ou Cancelada) com a data do dia informada
- Opção para visualizar os agendamentos do usuário (data, situação, vacina e dose).

## Experiência do Usuário:
**Algumas das telas do front end (restante pode ser conferido no vídeo explicativo)**

#### Menu principal:
![Captura de Tela (11)](https://github.com/JvRosa/AgendaDeVacinacao/assets/94145163/aca1d3dc-f8b0-4268-b1b3-1911697acaf9)

#### Cadastro de Usuários:
![Captura de Tela (12)](https://github.com/JvRosa/AgendaDeVacinacao/assets/94145163/b2dae280-06b3-4aff-85a6-4b30ab33c029)

#### Agendamento da Vacinação:
![Captura de Tela (13)](https://github.com/JvRosa/AgendaDeVacinacao/assets/94145163/af08c6e6-453d-48d3-bec2-ddc3ced0839b)

#### Listagem de Usuários:
![Captura de Tela (14)](https://github.com/JvRosa/AgendaDeVacinacao/assets/94145163/6c9f811a-cfaf-4ee8-a55e-40b2b326a1c2)

#### Listagem de Vacinas:
![Captura de Tela (10)](https://github.com/JvRosa/AgendaDeVacinacao/assets/94145163/cc2e417e-ab44-418f-b5a9-f2e461c36f4c)


## Estrutura do Banco de Dados:

Tabela Vacinas:
- doses: quantidade de doses a ser aplicada para a vacina ser efetiva. Campo obrigatório e inteiro.
- periodicidade: campo inteiro. Indica se o intervalo é medido em dias, semanas, meses ou anos.
- intervalo: intervalo de tempo entre as doses.

Tabela Agendas: representa os agendamentos realizados para aplicação das vacinas.
- data: data que a aplicação da vacina foi agendada.
- situacao: Agendado, Cancelado e Realizado.
- data_situacao: Nulo, quando a agenda estiver com a situação "Agendado". Se o campo for "Cancelado" ou "Realizado", então está data refere-se a data do cancelamento ou aplicação da vacina.

Tabela Usuários: são as pessoas que serão vacinadas (pacientes, clientes... )
- Campo sexo: Masculino ou Feminino. Na tela deverá ser um combobox ou um rádio button.
- Campo UF: armazena um das siglas dos vinte e seis estados e do distrito federal. Na tela deverá ser um combobox.
        
Tabela Alergias: cadastro simples de alergias.

## Para executar o projeto:
Instalar o banco de dados MySQL e criar banco de dados e tabelas de acordo com o arquivo Comandos Database.txt com instruções.

Instalar o Node

Instalar framework Express

Instalar EJS

Abrir terminal e executar o comando: node index.js
