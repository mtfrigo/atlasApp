<?php
    header('Access-Control-Allow-Origin: *');
    $var    =   isset($_GET["var"])   ?   $_GET["var"]  :   0;
    $eixo   =   isset($_GET["eixo"])  ?   $_GET["eixo"] :   0;
    $uf     =   isset($_GET["uf"])    ?   $_GET["uf"]   :   0;
    $deg    =   isset($_GET["deg"])   ?   $_GET["deg"]  :   0;
    $cad    =   isset($_GET["cad"])   ?   $_GET["cad"]  :   0;

    $ocp    =   isset($_GET["ocp"])   ?   $_GET["ocp"]  :   0;

    if($deg != 0){
        $deg = $deg - 8;
    }

    $json = array();

    if($eixo == 0){
      require_once("EixoUm.php");
      $vars = array(1);

      if(in_array($var, $vars)){
          foreach(EixoUm::getTotalSumPrt($var, $uf) as $result){
              $json[$result->Ano] = $result->Valor;
          }
      }

  }

  if($eixo == 1){
    require_once("EixoDois.php");
    $vars = array(1, 7);

    if(in_array($var, $vars)){
        foreach(EixoDois::getTotalSumPrt($var, $uf, $cad, $ocp) as $result){
            $json[$result->Ano] = $result->Valor;
        }
    }

}

    echo json_encode($json);

?>
