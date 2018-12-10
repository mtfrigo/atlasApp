# API

A API é responsável por solicitar e receber os dados pertinentes à aplicação.

Para isso é usado a linguagem PHP, que se comunica com o servidor e manda para a aplicação em formato JSON.

Cada elemento que precisa de dados específicos, como é a casa dos gráficos da aplicação, tem seu respectivo arquivo PHP.

Além disso, foram feitos alguns outros arquivos a fim de auxiliar ou fazer o setup da conexão da base de dados.

## Arquivos de Setup

**config.db.php**: Contém as informações de conexão com o servidor.

**Eixo1.php**, **Eixo2.php**, **Eixo3.php**, **Eixo4.php**: Arquivos responsáveis por receber os dados e formatá-los, contém todas implementações para receber os dados do servidor.

## Arquivos auxiliares

**api_anos_defaults**: Recebe um JSON que contém o ano default (ano que estará selecionado ao entrar na variável) para cada variável da aplicação.

**total_brasil**: Responsável por coletar o valor referente ao Brasil na variável selecionada.

**total_desag**: Responsável por coletar o valor total das desagregações da variável selecionada levando em consideração o setor/ocupação e UF.

**total_estado**: Reponsável por coletar o valor total do estado da variável selecionada.

**total_setor**: Reponsável por coletar o valor total do setor da variável selecionada.

## Arquivos das visualizações

**json_xxxx**: Arquivo que irá solicitar ao servidor 




