<?php
    header('Access-Control-Allow-Origin: *');
    $var    =   isset($_GET["var"])   ?   $_GET["var"]  :   0;
    $eixo   =   isset($_GET["eixo"])  ?   $_GET["eixo"] :   0;
    $cad    =   isset($_GET["cad"])   ?   $_GET["cad"]  :   0;
    $deg    =   isset($_GET["deg"])   ?   $_GET["deg"]  :   0;
    $subdeg    =   isset($_GET["subdeg"])   ?   $_GET["subdeg"]  :   0;

    if($eixo == 0)
    {
      if($deg != 0){
        $deg = $deg - 8;
      }
    }


    $json = array();
    if($eixo == 0){
      require_once("Eixo1.php");
      $vars = array(1,4,5,6,7,8);

      if(in_array($var, $vars)){
          foreach(EixoUm::getMaxValueSetor($var, $cad, $deg) as $result){
              $json[$result->Ano] = $result->Valor;
          }
      }
  }
  else if($eixo == 1){
    require_once("Eixo2.php");
    $vars = array(1);

    if(in_array($var, $vars)){
        foreach(EixoDois::getMaxValueSetor($var, $cad) as $result){
            $json[$result->Ano] = $result->Valor;
        }
    }
}

    echo json_encode($json);

?>
