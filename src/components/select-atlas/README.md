# select-atlas

Componente de seleção customizado para a plataforma com suporte a grupos. 

## Inputs

### current : number
Valor atual do select. 
### items : list
Lista de valores que estará contido no select. 
A lista deve ser de objetos que tenham os seguintes atributos:
```
{id: number, name: string}
```
### group : boolean
Um booleano indicando se o select terá grupos ou não.
### title : string
Label que indica o título do select. 
