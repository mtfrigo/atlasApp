# Providers

Responsável por implementar a lógica de serviços da aplicação.

Cada component de visualização desenvolvido tem seu provider correspondente cujo tem as responsabilidade de receber os dados dos jsons e mandar para a lógica de implementação do component.

Ou seja, a responsabilidade do provider é basicamente buscar e mandar dados do servidor para o component específico.

Não haverá documentação separada de cada um dos provider, pois, além de muito simples, basicamente o que muda de um provider pro outro (com exceção do provider *dados*) é uma linha de código, que indica de qual json o provider deve buscar os dados.

A exceção é o provider *dados* que vale atenção especial:

Esse provider tem a responsabilidade de buscar a descrição da variável em questão e modificá-la de acordo com as opções selecionadas (uf, setor, desagregação etc.). 

Além disso, ela também tem a responsabilidade de buscar qual valor a ser mostrado nos container de dados. Essa lógica é implementada a partir de uma variável global alimentada principalmente pelo gráfico de barras (e poucos casos com o treemap também). Depois de coletar o dado correspondente, ele é formatado para decimal, percentagem, real etc..

