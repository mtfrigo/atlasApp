# Components

Components são os blocos básicos de uma aplicação Ionic/Angular. Eles são facilmente instanciáveis em diferentes páginas. 

Assim, para a aplicação desenvolvida, foram feitos components para cada gráfico e também para algumas estruturas específicas, como o container dos dados selecionados e dos menu das opções.

Cada component tem três estruturas básicas:

* **html**: onde fica a estrutura do DOM do component. É importante que seja simples e deixe que o TypeScript implemente a lógica.
* **scss**: arquivo que contém os estilos (css) das classes e ID's do DOM (html)
* **ts**: arquivo que implementa toda a lógica do component

## Module

O arquivo *components.module.ts* cuida das dependencias. Ele contém todos imports e exports necessários para a aplicação rodar.

## Atlas

Cada component teu sua respectiva documentação em seu diretório.

Para os atlas foram implementados, até o momento, os seguintes components:

* [barras](https://github.com/mtfrigo/atlasApp/tree/master/src/components/barras)  
* [dados](https://github.com/mtfrigo/atlasApp/tree/master/src/components/dados)  
* [donut](https://github.com/mtfrigo/atlasApp/tree/master/src/components/donut)  
* [empilhadas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/empilhadas)  
* [linhas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/linhas)  
* [mapa](https://github.com/mtfrigo/atlasApp/tree/master/src/components/mapa)  
* [mapa-mundi](https://github.com/mtfrigo/atlasApp/tree/master/src/components/mapa-mundi)  
* [select-atlas](https://github.com/mtfrigo/atlasApp/tree/master/src/components/select-atlas)  
* [treemap](https://github.com/mtfrigo/atlasApp/tree/master/src/components/treemap)  
* [treemap-region](https://github.com/mtfrigo/atlasApp/tree/master/src/components/treemap-region)  
