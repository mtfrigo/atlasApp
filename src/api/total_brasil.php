<?php
    header('Access-Control-Allow-Origin: *');
    $var    =   isset($_GET["var"])   ?   $_GET["var"]  :   0;
    $eixo   =   isset($_GET["eixo"])  ?   $_GET["eixo"] :   0;

    $json = array();

    if($eixo == 1){
      require_once("Eixo2.php");
      $vars = array(1, 7);

      if(in_array($var, $vars)){
          foreach(EixoDois::getTotalBrasil($var) as $result){
              $json[$result->Ano] = $result->Valor;
          }
      }

}

    echo json_encode($json);

?>
