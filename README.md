# Atlas App

Atlas App é a aplicação mobile do projeto Atlas.

O aplicativo conta com suporte tanto à iOS quanto Android e estará disponível nas respectivas lojas de aplicativo.

O objetivo do aplicativo é adaptar a plataforma do Atlas já existente para uma aplicação mobile.

A tecnologia utilizada para seu desenvolvimento é a tecnologia híbrida, onde a aplicação é contruída nas linguagens padrões WEB, e integra as funcionalidades que os dispositivos oferecem.

## Atlas 

O Atlas Econômico da Cultura Brasileira é uma solução para a pesquisa e visualização de dados da Cultura na economia Brasileira.

Mais informações em http://atlas.base-wp.cultura.gov.br/sobre/

## Plataforma WEB

O projeto Atlas conta com uma plataforma WEB disponível em http://atlas.base-wp.cultura.gov.br/

## Banco de Dados

O servidor e os arquivos que se comunicam com o servidor e retornam os dados estão *hosteados* no servidor da UFRGS.

## Diretórios

A documentação de cada diretório está em seu respectivo link. 


   
>└─── [resources](https://github.com/mtfrigo/atlasApp/tree/master/resources)   
>└─── [src](https://github.com/mtfrigo/atlasApp/tree/master/src)  
>>    [API](https://github.com/mtfrigo/atlasApp/tree/master/src/api)  
>>[Assets](https://github.com/mtfrigo/atlasApp/tree/master/src/assets)  
  
>>└─── [components](https://github.com/mtfrigo/atlasApp/tree/master/src/components)  
>>> [barras](https://github.com/mtfrigo/atlasApp/tree/master/src/components/barras)  
>>> [dados](https://github.com/mtfrigo/atlasApp/tree/master/src/components/dados)  
>>> [donut](https://github.com/mtfrigo/atlasApp/tree/master/src/components/donut)  
>>> [empilhadas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/empilhadas)  
>>> [linhas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/linhas)  
>>> [mapa](https://github.com/mtfrigo/atlasApp/tree/master/src/components/mapa)  
>>> [mapa-mundi](https://github.com/mtfrigo/atlasApp/tree/master/src/components/mapa-mundi)  
>>> [select-atlas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/select-atlas)  
>>> [treemap](https://github.com/mtfrigo/atlasApp/tree/master/src/components/treemap)  
>>> [treemap-region](https://github.com/mtfrigo/atlasApp/tree/master/src/components/treemap-region)  


>>└─── [interfaces](https://github.com/mtfrigo/atlasApp/tree/master/src/interfaces)  
>>>[donut](https://github.com/mtfrigo/atlasApp/tree/master/src/interfaces/donut)  
>>>[treemap](https://github.com/mtfrigo/atlasApp/tree/master/src/interfaces/treemap)  


>└─── [pages](https://github.com/mtfrigo/atlasApp/tree/master/src/pages)  
>>>[home](https://github.com/mtfrigo/atlasApp/tree/master/src/pages/home)  
>>>[index](https://github.com/mtfrigo/atlasApp/tree/master/src/pages/index)  
>>>[modal-select](https://github.com/mtfrigo/atlasApp/tree/master/src/pages/modal-select)  
>>>[sobre](https://github.com/mtfrigo/atlasApp/tree/master/src/pages/sobre)  


>└─── [providers](https://github.com/mtfrigo/atlasApp/tree/master/src/providers)  
>>>[barras](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/barras)  
>>>[dados](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/dados)  
>>>[donut](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/donut)  
>>>[empilhadas](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/empilhadas)  
>>>[jsons](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/jsons)  
>>>[linhas](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/linhas)  
>>>[mapa](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/mapa)  
>>>[mapa-mundi](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/mapa-mundi)  
>>>[treemap](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/treemap)  
>>>[treemap-region](https://github.com/mtfrigo/atlasApp/tree/master/src/providers/treemap-region)  


>└─── [theme](https://github.com/mtfrigo/atlasApp/tree/master/src/theme)  


## Setup

As ferramentas necessárias para o desenvolvimento e para fazer uma APK são:

* node
* d3.js
* topojson-client
* npm
* Ionic
* Cordova (*para dar build no aplicativo*)
* Git
* Android Studio

### Linux

Vamos começar atualizando o sistema para garantir que tudo corra bem
```
  sudo apt-get update
```
Em seguida, instalamos as dependências. Utilizamos um instalador chamado *nvm* a fim de facilitar a instalação e configuração do *node*.
Para a instalação do *nvm* é preciso ter instalado o *curl* no seu sistema. Você pode checar se ele já está instalado usando o comando
```
  curl --version
```
Caso ele não esteja instalado, utilize o comando 
```
  sudo apt install curl
```
Agora, podemos instalar o *nvm* com o comando
```
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
e então fechar o terminal e abrir um novo para carregar o *nvm* e então instalar o *node*
```
  nvm install node
```
Agora que temos o *node*, instalamos o *Ionic* e o *Cordova*
```
  npm install -g ionic cordova
```
Clone o repositório em algum diretório (usaremos o ~/ como exemplo) e navegue para o repositório clonado
```
  cd ~/
  git clone git@github.com:mtfrigo/atlasApp.git
  cd atlasApp/
```
Certifique-se de que o *npm* foi instalado e então execute
```
  npm install
```
Esse comando instalará todas as dependências contidas no arquivo *package.json*.

Agora execute o servidor
```
   ionic serve 
```
A plataforma deve estar rodando no seu navegador após esse passo.

### Windows


### MacOS


## Build


