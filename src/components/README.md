# Components

Components são os blocos básicos de uma aplicação Ionic/Angular. Eles são facilmente instanciáveis em diferentes páginas. 

Assim, para a aplicação desenvolvida, foram feitos components para cada gráfico e também para algumas estruturas específicas, como o container dos dados selecionados e dos menu das opções.

Cada component tem três estruturas básicas:

* **html**: onde fica a estrutura do DOM do component. É importante que seja simples e deixe que o TypeScript implemente a lógica.
* **scss**: arquivo que contém os estilos (css) das classes e ID's do DOM (html)
* **ts**: arquivo que implementa toda a lógica do component

## Module

O arquivo *components.module.ts* cuida das dependencias. Ele contém todos imports e exports necessários para a aplicação rodar.

## Implementação

Como muito dos módulos se repetem em diferentes components, alguns serão explicados logo abaixo:


**ngOnInit**: Função que é chamada logo no início, após carregamento do DOM (é chamada depois do constructor). Sua função é declarar alguns valores iniciais e fundamentais para o component, como margem, altura e largura do SVG e, pros gráficos com escala, define a quantidade de ticks e também inicializa alguns JSON, como o JSON de cores.

**getData**: Função chamada logo depois do Init. Ela é responsável em pedir para o provider do component os dados correspondentes. Tem como *callback* a função *afterGetData*

**ngOnChanges**: Função que é chamada sempre que há uma mudança num Input do component. Todos components tem como Input a variável *parameters*, por exemplo, e por isso, sempre que uma das opções do menu é mudada, é chamada essa função em cada component, assim, é chamada a função *updateData*.

**updateData**: Tem a mesma responsabilidade que a função getData, o que muda é que ela é chamada sempre que há uma mudança no menu e seu *callback*, que pode chamar a função de animação ou não.

**afterGetData**: Essa função é reponsável por controlar o fluxo da aplicação depois das funções iniciais (*ngOnInit* e *getData*, e em alguns casos *updateData*). Basicamente ela acontece sempre depois que o component já coletou os dados e chama as funções que formatam os dados, iniciam o gráfico e etc..

**parseData**: Função responsável por formatar os dados recebidos do provider para o formato específico da visualização em questão. Cada component teu seu formato, então sua implementação varia de visualização pra visualização.

**initAxis**: Já com os dados formatados, essa função inicializa as escalas do component e, quando necessário, os ticks das escalas do gráfico.

Cada component teu sua respectiva documentação mais detalhada em seu diretório.

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
