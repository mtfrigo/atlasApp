<?php
header('Access-Control-Allow-Origin: *');

/*-----------------------------------------------------------------------------
Função: Barras
    função para gerar um JSON para o Gráfico Barras
Entrada:
    $_GET = Parâmetros para consulta EixoUm::getter_barras
Saída:
    Dados formatados para o JSON barras
-----------------------------------------------------------------------------*/

header('charset=utf-8');


function sigla_cadeia($cadeia) {
    switch($cadeia) {
        case "Arquitetura e Design":
            return "Arq e D";
        case "Publicidade":
            return "Publ.";
        case "Patrimônio":
            return $cadeia;
        case "Música":
            return $cadeia;
        case "Entretenimento":
            return "Entret.";
        case "Educação e Criação em Artes":
            return "Edu. Art.";
        case "Editorial":
            return "Edit.";
        case "Cultura Digital":
            return "Cult. Dig.";
        case "Audiovisual":
            return "Audio";
        case "Artes Cênicas e Espetáculos":
            return "Artes";
        case "Outros":
            return $cadeia;
    }
}

function getNameCadeia($id){
    switch($id){
        case 0: return "Todos";
        case 1: return "Arquitetura e Design";
        case 2: return "Artes Cênicas e Espetáculos";
        case 3: return "Audiovisual";
        case 4: return "Cultura Digital";
        case 5: return "Editorial";
        case 6: return "Educação e Criação em Artes";
        case 7: return "Entretenimento";
        case 8: return "Música";
        case 9: return "Patrimônio";
        case 10: return "Publicidade";
    }
}

if (!empty($_GET["var"])) {

    $var = $_GET["var"];
    $uf = $_GET["uf"];
    $cad = $_GET["cad"];
    $deg = $_GET["deg"];
    $ocp    =   isset($_GET["ocp"])   ?   $_GET["ocp"]  :   0;	   /*== ocupação ==*/
    $mec    =   isset($_GET["mec"])   ?   $_GET["mec"]  :   0;	   /*== mecanismo ==*/
    $mod    =   isset($_GET["mod"])   ?   $_GET["mod"]  :   0;	   /*== modalidade ==*/
    $pfj    =   isset($_GET["pfj"])   ?   $_GET["pfj"]  :   0;	   /*== pessoa fisica/juridica ==*/
    $uos    =   isset($_GET["uos"])   ?   $_GET["uos"]  :   0;	   /*== UF ou Setores ==*/
    $prc    =   isset($_GET["prc"])   ?   $_GET["prc"]  :   0;	   /*== Parceiro ==*/
    $slc    =   isset($_GET["slc"])   ?   $_GET["slc"]  :   0;	   /*== Parceiro ==*/
    $typ    =   isset($_GET["typ"])   ?   $_GET["typ"]  :   0;	   /*== Tipo de atividade ==*/
    $desag    =   isset($_GET["deg"])   ?   $_GET["deg"]  :   0;	   /*== Desagregação ==*/
    $subdeg    =   isset($_GET["subdeg"])   ?   $_GET["subdeg"]  :   0;	   /*== Subdesagregação ==*/
    $ano    =   isset($_GET["ano"])   ?   $_GET["ano"]  :NULL;	   /*== Ano ==*/

    $eixo = $_GET['eixo'];
}
else{
    $var = 1;
    $uf = 0;
    $cad = 0;
    $ocp = 0;
    $slc = 0;
    $mec = 0;
    $mod = 0;
    $pjj = 0;
    $uos = 0;
    $typ = 0;
    $prc = 0;
    $ano = NULL;
    $desag = 0;
    $subdeg = 0;
    $eixo = 0;
}

//Trata o sexo
if($desag == 2){
    switch($subdeg) {
        case "0":
            $subdeg = NULL;
            break;
        case "1":
            $subdeg = 1;
            break;
        case "2":
            $subdeg = 0;
            break;
        default:
            $subdeg = NULL;
    }
}


//Trata a modalidade
switch($mod) {
    case "0":
        $mod = NULL;
        break;
    case "1":
        $mod = 1;
        break;
    case "2":
        $mod = 0;
        break;
    default:
        $mod = NULL;
}

//Trata a pessoa fisica/juridica
switch($pfj) {
    case "0":
        $pfj = NULL;
        break;
    case "1":
        $pfj = 1;
        break;
    case "2":
        $pfj = 0;
        break;
    default:
        $pfj = NULL;
}

function getName($uos) {
    switch ($uos) {
        case 0:
            return "UF";
        case 1:
            return "Setor";
    }
}

function getName2($mec) {
    switch ($mec) {
        case 0:
            return "Despesa Minc / Receita executivo";
        case 1:
            return "Financiamento Estatal / Receita executivo";
    }
}

function getTyp($type) {
    switch ($type) {
        case 1:
            return "Exportação";
        case 2:
            return "Importação";
        case 3:
            return "SaldoComercial";
        case 4:
            return "ValorTransicionado";
    }
}

function getNameSLC($slc) {
    switch ($slc) {
        case 0:
            return "Relacionadas";
        case 1:
            return "Culturais";
    }
}


function getNameOCP($slc) {
    switch ($slc) {
        case 1:
            return "Relacionadas";
        case 2:
            return "Culturais";
    }
}

function getNamePorte($id) {
    switch ($id) {
        case 1:
            return "Micro";
        case 2:
            return "Pequeno";
        case 3:
            return "Médio";
        case 4:
            return "Grande";
    }
}

function getNameSexo($id) {
    switch ($id) {
        case 0:
            return "Feminino";
        case 1:
            return "Masculino";
    }
}

function getNameIdade($id) {
    switch ($id) {
        case 1:
            return "10 a 17";
        case 2:
            return "18 a 29";
        case 3:
            return "30 a 49";
        case 4:
            return "50 a 64";
        case 5:
            return "65 ou mais";
        case 6:
            return "Não classificado";
    }
}

function getNameEscolaridade($id) {
    switch ($id) {
        case 1:
            return "Sem instrução";
        case 2:
            return "Fundamental incompleto";
        case 3:
            return "Fundamental completo";
        case 4:
            return "Médio completo";
        case 5:
            return "Superior incompleto";
        case 6:
            return "Superior completo";
        case 7:
            return "Não determinado";
    }
}

function getNameEtinia($id) {
    switch ($id) {
        case 1:
            return "Indígena";
        case 2:
            return "Branca";
        case 3:
            return "Preta";
        case 4:
            return "Amarela";
        case 5:
            return "Parda";
    }
}

function getNameFormalidade($id) {
    switch ($id) {
        case 1:
            return "Formal";
        case 2:
            return "Informal";

    }
}

function getNamePrev($id) {
    switch ($id) {
        case 1:
            return "Contribuinte";
        case 2:
            return "Não contribuinte";

    }
}

function getNameSindical($id) {
    switch ($id) {
        case 1:
            return "Membro";
        case 2:
            return "Não membro";

    }
}

$linhas = array();
$anos = array();
$ids = (object) array();
if($eixo == 0 && ($var == 3 || $var == 9)) {
    require_once("Eixo1.php");


    foreach (EixoUm::getter_linhas($var, $uf, $cad, $deg, $uos) as $tupla) {

      //array_push($barras, $values);

        $id = $tupla->CadeiaNome;
        $ano = (int)$tupla->Ano;
        $valor = (double)$tupla->Valor;

        $obj = (object) array(
          'id' => $id,
          'valor' => $valor,
          'ano' => $ano
        );

        $anos['valores'][] = $valor;

        if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
          $anos['ids'][] = $id;
        }

        if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
          $anos['anos'][] = $ano;
        }

        $anos[$id][] =  $obj;
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }
}
else if($eixo == 0 && $var > 9 ) {
    require_once("Eixo1.php");
    for ($uos = 0; $uos <= 1; $uos++) {

        foreach (EixoUm::getter_linhas($var, $uf, $cad, $deg, $uos) as $tupla) {

            $ano = (int)$tupla->Ano;
            $valor = (double)$tupla->Valor;
            $id  = getName($uos);

            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            $anos['valores'][] = $valor;

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            $anos[$id][] =  $obj;

        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }
}
else if($eixo == 1 && ($var > 11)) {
    require_once("Eixo2.php");

    if($ocp == 0){

        for ($uos = 0; $uos <= 1; $uos++) {

            foreach (EixoDois::getter_linhas($var, $uf, $uos, $ocp, $uos, $slc, $desag, $subdeg) as $tupla) {
                if($subdeg == 0 || $subdeg == NULL) {

                  $ano = (int)$tupla->Ano;
                  $valor = (double)$tupla->Valor;
                  $id  = getName($uos);

                  $obj = (object) array(
                    'id' => $id,
                    'valor' => $valor,
                    'ano' => $ano
                  );

                  $anos['valores'][] = $valor;

                  if(!isset($anos['ids'])){
                    $anos['ids'][] = $id;
                  }
                  else{
                    if(!in_array($id, $anos['ids'])){
                      $anos['ids'][] = $id;
                    }
                  }

                  if(!isset($anos['anos'])){
                    $anos['anos'][] = $ano;
                  }
                  else{
                    if(!in_array($ano, $anos['anos'])){
                      $anos['anos'][] = $ano;
                    }
                  }

                  $anos[$id][] =  $obj;

                }
            }
        }


    }
    else{
        for ($ocp = 1; $ocp <= 2; $ocp++) {

            foreach (EixoDois::getter_linhas($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg) as $tupla) {


                $ano = (int)$tupla->Ano;

                if($slc == 1 && $ano >= 2011 && $ano <= 2015)
                  $ano = $ano - 1;

                $valor = (double)$tupla->Valor;
                $id  = getNameSLC($ocp-1);

                $obj = (object) array(
                  'id' => $id,
                  'valor' => $valor,
                  'ano' => $ano
                );

                $anos['valores'][] = $valor;

                if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
                  $anos['ids'][] = $id;
                }

                if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
                  $anos['anos'][] = $ano;
                }

                $anos[$id][] =  $obj;

            }

        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

}
else if($eixo == 1 && ($var == 4 || $var == 5 || $var == 6) && $desag != 0) {
    require_once("Eixo2.php");
    foreach(EixoDois::getter_linhas($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg) as $tupla){

          $ano = $tupla->Ano;
          $valor = (double)$tupla->Valor;

          switch ($desag){
              case 1: $id = getNamePorte($tupla->idPorte);
                  break;
              case 2: $id = getNameSexo($tupla->Sexo);
                  break;
              case 3: $id = getNameIdade($tupla->idIdade);
                  break;
              case 4: $id = getNameEscolaridade($tupla->idEscolaridade);
                  break;
              case 5: $id = getNameEtinia($tupla->idEtinia);
                  break;
              case 6: $id = getNameFormalidade($tupla->Formalidade);
                  break;
              case 7: $id = getNamePrev($tupla->Previdencia);
                  break;
              case 8: $id = getNameSindical($tupla->Sindical);
                  break;
          }

          $anos['valores'][] = $valor;

          $obj = (object) array(
            'id' => $id,
            'valor' => $valor,
            'ano' => $ano
          );

          if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
            $anos['ids'][] = $id;
          }

          if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
            $anos['anos'][] = $ano;
          }

          if(!isset($aux[$id][$id][$ano])){
            $aux[$id][$id][$ano]['id'] = $id;
            $aux[$id][$id][$ano]['valor'] = $valor;
            $anos['valores'][] = $valor;
            $aux[$id][$id][$ano]['ano'] = $ano;
          }
          else
          {
            $anos['valores'][] = $aux[$id][$id][$ano]['valor'] + $valor;
            $aux[$id][$id][$ano]['valor'] = $aux[$id][$id][$ano]['valor'] + $valor;
          }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

    foreach ($aux as $id){
      $child = array();
      foreach ($id as $ano){
        foreach ($ano as $obj){
          $child[] = $obj;
        }
      }
      $linhas[] = $child;
    }
}
else if($eixo == 1 && ($var == 4 || $var == 5) && $desag == 0 && $ocp == 0)  {
    require_once("Eixo2.php");

    foreach (EixoDois::getter_linhas($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg) as $tupla) {

      $ano = (int)$tupla->Ano;
      $valor = (double)$tupla->Valor;
      $id = getNameCadeia($tupla->idCadeia);

      $anos['valores'][] = $valor;

      $obj = (object) array(
        'id' => $id,
        'valor' => $valor,
        'ano' => $ano
      );

      if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
        $anos['ids'][] = $id;
      }

      if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
        $anos['anos'][] = $ano;
      }

      if(!isset($aux[$id][$id][$ano])){
        $aux[$id][$id][$ano]['id'] = $id;
        $aux[$id][$id][$ano]['valor'] = $valor;
        $aux[$id][$id][$ano]['ano'] = $ano;
        $anos['valores'][] = $valor;
      }
      else
      {
        $anos['valores'][] = $aux[$id][$id][$ano]['valor'] + $valor;

        $aux[$id][$id][$ano]['valor'] = $aux[$id][$id][$ano]['valor'] + $valor;
      }
  }

  foreach ($anos as $ano){
      $linhas[] = $ano;
  }

  foreach ($aux as $id){
    $child = array();
    foreach ($id as $ano){
      foreach ($ano as $obj){
        $child[] = $obj;
      }
    }
    $linhas[] = $child;
  }
}
else if($eixo == 1 && ($var == 11 || $var == 10 || $var == 9 || $var == 8 || ($var == 6 && $desag == 0 && $ocp == 0))) {
    require_once("Eixo2.php");
    for ($cad = 1; $cad <= 10; $cad++) {

        foreach (EixoDois::getter_linhas($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg) as $tupla) {

            $ano = (int)$tupla->Ano;
            $id = getNameCadeia($tupla->idCadeia);
            $valor = (double)$tupla->Valor;

            $anos['valores'][] = $valor;

            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            if(!isset($aux[$id][$id][$ano])){
              $aux[$id][$id][$ano]['id'] = $id;
              $aux[$id][$id][$ano]['valor'] = $valor;
              $aux[$id][$id][$ano]['ano'] = $ano;
            }
            else
              $aux[$id][$id][$ano]['valor'] = $aux[$id][$id][$ano]['valor'] + $valor;

        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

    foreach ($aux as $id){
      $child = array();
      foreach ($id as $ano){
        foreach ($ano as $obj){
          $child[] = $obj;
        }
      }
      $linhas[] = $child;
    }

}
else if($eixo == 1 && ($var == 4 || $var == 5 || $var == 6) && $desag == 0 && $ocp != 0) {
    require_once("Eixo2.php");

    foreach (EixoDois::getter_linhas($var, $uf, $cad, 3, $uos, $slc, $desag, $subdeg) as $tupla) {

        $ano = (int)$tupla->Ano;
        $id = getNameOCP($tupla->idOcupacao);
        $valor = (double)$tupla->Valor;

        $anos['valores'][] = $valor;

        $obj = (object) array(
          'id' => $id,
          'valor' => $valor,
          'ano' => $ano
        );

        if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
          $anos['ids'][] = $id;
        }

        if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
          $anos['anos'][] = $ano;
        }

        if(!isset($aux[$id][$id][$ano])){
          $aux[$id][$id][$ano]['id'] = $id;
          $aux[$id][$id][$ano]['valor'] = $valor;
          $aux[$id][$id][$ano]['ano'] = $ano;
        }
        else
          $aux[$id][$id][$ano]['valor'] = $aux[$id][$id][$ano]['valor'] + $valor;
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

    foreach ($aux as $id){

      $child = array();
      foreach ($id as $ano){
        foreach ($ano as $obj){
          $child[] = $obj;
        }
      }
      $linhas[] = $child;
    }

}
else if($eixo == 2 && $var > 14) {
    require_once("Eixo3.php");
    for ($uos = 0; $uos <= 1; $uos++) {

        foreach (EixoTres::getter_barras($var, $uf, $cad, $mec, $pfj, $mod, $ano, $uos) as $tupla) {
            $ano = (int)$tupla->Ano;
            $valor = (double)$tupla->Valor;
            $id = getName($uos);

            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            $anos['valores'][] = $valor;

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            $anos[$id][] =  $obj;


        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

}
else if($eixo == 2 && $var == 10) {
    require_once("Eixo3.php");
    for ($mec = 0; $mec <= 1; $mec++) {

        foreach (EixoTres::getter_linhas($var, $uf, $cad, $mec, $pfj, $mod, $ano, $uos) as $tupla) {
            $id = getName2($mec);
            $ano = (int)$tupla->Ano;
            $valor = (double)$tupla->Valor;

            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            $anos['valores'][] = $valor;

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            $anos[$id][] =  $obj;

        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

}
else if($eixo == 2 && $var < 15){

    require_once("Eixo3.php");
    for ($cad = 1; $cad <= 10; $cad++) {


        foreach (EixoTres::getter_barras($var, $uf, $cad, $mec, $pfj, $mod, $ano, $uos) as $tupla) {

            $ano = (int)$tupla->Ano;
            $id = getNameCadeia($tupla->idCadeia);
            $valor = (double)$tupla->Valor;


            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            $anos['valores'][] = $valor;

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            $anos[$id][] =  $obj;

        }
    }

    foreach ($anos as $ano){
        $linhas[] = $ano;
    }

}
else if($eixo == 3 && ($var >= 5 && $var <= 10)){
    require_once("Eixo4.php");
    for($i = 1; $i <= 4 ; $i++){
        foreach (EixoQuatro::getter_barras($var, 0, 0, $i, 0, 0, $slc) as $tupla) {
            $ano = (int)$tupla->Ano;
            $id = getTyp($i);
            $valor = (double)$tupla->Valor;

            $obj = (object) array(
              'id' => $id,
              'valor' => $valor,
              'ano' => $ano
            );

            $anos['valores'][] = $valor;

            if(isset($anos['ids']) && !in_array($id, $anos['ids']) || !isset($anos['ids'])){
              $anos['ids'][] = $id;
            }

            if(isset($anos['anos']) && !in_array($ano, $anos['anos']) || !isset($anos['anos'])){
              $anos['anos'][] = $ano;
            }

            $anos[$id][] =  $obj;

        }
    }
}


echo json_encode($linhas);

?>
