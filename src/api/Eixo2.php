<?php

###	Classe que manipula as variáveis do Eixo 2 ###

require('config.db.php');

class EixoDois {

## Atributos ##

    protected static $table = 'Eixo_2';
    private static $conn;

    //informações Eixo_2
    protected $id;
    public $Numero;
    public $idUF;
    public $idCadeia;
    public $idPorte;
    public $idOcupacao;
    public $idEscolaridade;
    public $idEtinia;
    public $idIdade;

    public $Formalidade;
    public $Previdencia;
    public $Sindical;
    public $Sexo;

    public $Ano;
    public $Valor;
    public $Percentual;
    public $Taxa;

    //informações UF
    public $UFNome;
    public $UFRegiao;
    public $UFSigla;

    //informações Cadeia
    public $CadeiaNome;

    //informações Porte
    public $PorteNome;

    //informações Ocupação
    public $OcupacaoNome;

    //informações Escolaridade
    public $EscolaridadeNome;

    //informações Etinia
    public $EtiniaNome;

    //informações Idade
    public $IdadeNome;

## Metodos ##

    public static function connect(){

      $hn      = DB_HOST;
      $un      = DB_USUARIO;
      $pwd     = DB_SENHA;
      $db      = DB_NOME;
      $cs      = DB_CS;

      // Set up the PDO parameters
      $dsn 	= "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
      $opt 	= array(
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                  );
      // Create a PDO instance (connect to the database)
      $pdo = new PDO($dsn, $un, $pwd, $opt);
      $pdo->exec("set names utf8");
      return $pdo;
    }

    public static function getter_most_recent_year(){

        $pdo 	= self::connect();

        $allObjects  = array();

        try {

          $stmt = $pdo->prepare(
            "SELECT DISTINCT Ano, Numero, idOcupacao FROM `Eixo_2` WHERE `idUF` = 0 and (idOcupacao = 0 OR idOcupacao = 1)");

          $stmt->execute();

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }

        }
        catch(PDOException $e)
        {
          echo $e->getMessage();
        }

        return $allObjects;
    }

  	public static function getAnoDefault($var){
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

		    $query = "SELECT MAX(Ano) AS Ano FROM `Eixo_2` WHERE
        (idUF = 11 or idUF = 0) AND
        Numero = ?
        GROUP BY Numero";

        $stmt = $pdo->prepare($query);

        $params = array($var);

        $stmt->execute($params);

        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
            // Assign each row of data to associative array
            $allObjects[] = $row;
        }
        $obj = $allObjects[0];
      }
      catch(PDOException $e)
      {
        echo $e->getMessage();
      }

      return $obj->Ano;
	  }


    public static function all(){

		  $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $query = "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF = ex.idUF"
              ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia"
              ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte"
              ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao"
              ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade"
              ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia"
              ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade"
              ." ORDER BY id";

        $stmt->execute();

        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
            // Assign each row of data to associative array
            $allObjects[] = $row;
        }
      }
      catch(PDOException $e)
      {
        echo $e->getMessage();
      }

		  return $allObjects;
	  }

    public static function find($var, $uf, $ocp, $desag, $anos){

      $pdo 	= self::connect();

      $allObjects  = array();

      $query = "SELECT * FROM ".self::$table." WHERE Numero =? AND idUF = ?";

      try {
        $params = array($var, $uf);

        if($ocp == 0){
            $query .= " AND idCadeia > 0";
            $query .= " AND idOcupacao = 0";
        } else {
            $query .= " AND (idOcupacao = 1 OR idOcupacao = 2)";
        }
        if($desag == 2){
            $query .= " AND Sexo IS NOT NULL";
        } else {
            $query .= " AND Sexo IS NULL";
        }

        $query .= self::concatDeg($desag, 1, "idPorte");
        $query .= self::concatDeg($desag, 3, "idIdade");
        $query .= self::concatDeg($desag, 4, "idEscolaridade");
        $query .= self::concatDeg($desag, 5, "idEtinia");
        $query .= self::concatDeg($desag, 6, "Formalidade");
        $query .= self::concatDeg($desag, 7, "Previdencia");
        $query .= self::concatDeg($desag, 8, "Sindical");

        if ($anos > 0) {
            $query .= " AND Ano = ?";
            $params[] = $anos;
        }

        if($ocp == 0) {
            $query .= " ORDER BY `Eixo_2`.`idCadeia` ASC";
        } else {
            $query .= " ORDER BY `Eixo_2`.`idOcupacao` ASC";
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }

        $obj = $allObjects[0];

      }
      catch(PDOException $e)
      {
        echo $e->getMessage();
      }

      return $allObjects;
    }

    public static function getter_mapa($var, $cad, $ocp, $anos){

      $pdo 	= self::connect();

      $allObjects  = array();
      $params = array();

      if($ocp == 3)
      {
        $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN UF AS uf ON uf.idUF = ex.idUF"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
            ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = 0"
            ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao != 0"
            ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = 0"
            ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = 0"
            ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = 0"
            ." WHERE ex.Numero = ?"
            ." AND Sindical = 0"
            ." AND Previdencia = 0"
            ." AND Formalidade = 0"
            ." AND ex.Sexo IS NULL";

          $params[] = $cad;
          $params[] = $var;


        }
        else
        {
          $query = "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF = ex.idUF"
              ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
              ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = 0"
              ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao = ?"
              ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = 0"
              ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = 0"
              ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = 0"
              ." WHERE ex.Numero = ?"
              ." AND Sindical = 0"
              ." AND Previdencia = 0"
              ." AND Formalidade = 0"
              ." AND ex.Sexo IS NULL";

          $params[] = $cad;
          $params[] = $ocp;
          $params[] = $var;


        };



        if ($anos > 0) {
            $query .= " AND ex.Ano = ?";
            $params[] = $anos;
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }

        if($ocp == 3)
        {
          $params2 = array();
          $allObjects2 = array();
          $allObjects3 = array();
          $query_max_ocp1 = "SELECT MAX(Valor) as Valor FROM ".self::$table
                          ." WHERE idOcupacao=1"
                          ." AND Numero =?"
                          ." AND Ano=?"
                          ." AND idUF = 0"
                          ." GROUP BY Ano";

          $params2[] = $var;
          $params2[] = $anos;

          $stmt2 = $pdo->prepare($query_max_ocp1);
          $stmt2->execute($params2);

          while($row  = $stmt2->fetch(PDO::FETCH_OBJ))
          {
              $allObjects2[] = $row;
          }
          $obj1 = $allObjects2[0];


          $query_max_ocp2 = "SELECT MAX(Valor) as Valor FROM ".self::$table
                          ." WHERE idOcupacao=2"
                          ." AND Numero =?"
                          ." AND Ano=?"
                          ." AND idUF = 0"
                          ." GROUP BY Ano";

          $stmt3 = $pdo->prepare($query_max_ocp2);
          $stmt3->execute($params2);

          while($row  = $stmt3->fetch(PDO::FETCH_OBJ))
          {
              $allObjects3[] = $row;
          }
          $obj2 = $allObjects3[0];

          $brasil_total = $obj1->Valor + $obj2->Valor;

          $result_aux = array();
          $value_aux = array();
          $percent_aux = array();
          foreach ($allObjects as $data) {
              if(!isset($value_aux[$data->idUF])) $value_aux[$data->idUF] = 0;
              if(!isset($percent_aux[$data->idUF])) $percent_aux[$data->idUF] = 0;
              $value_aux[$data->idUF] += $data->Valor;
              $percent_aux[$data->idUF] += $data->Valor/$brasil_total;
              $result_aux[$data->idUF] = $data;
              $result_aux[$data->idUF]->Valor = $value_aux[$data->idUF];
              $result_aux[$data->idUF]->Percentual = $percent_aux[$data->idUF];
          }
          $allObjects = $result_aux;
        }

        return $allObjects;
    }

    public static function getter_barras($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg, $ano)
    {
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT * FROM ".self::$table." WHERE Numero =? AND idUF = ?";

      $params[] = $var;
      $params[] = $uf;

      if($ocp == 0){
          if($var > 11) {
              $query .= " AND idCadeia = ?";
              $params[] = $uos;
          }  else if($desag != 0 && $cad == 0) {
              $query .= " AND idCadeia != 0";
          } else {
              if($uos == 1 && $var == 6 && $desag == 0) {
                  $query .= " AND idCadeia != 0";
              } else {
                  $query .= " AND idCadeia = ?";
                  $params[] = $cad;
              }
          }
          $query .= " AND idOcupacao = 0";
      }
      else if($var == 6 && $ocp != 0) {
          $query .= " AND (idOcupacao = 1 OR idOcupacao = 2)";
      } else if($ocp == 1){
          $query .= " AND idOcupacao = 1";
      } else if($ocp == 2){
          $query .= " AND idOcupacao = 2";
      } else if($ocp == 3){
          //Os índices IHH e C4 da ocupação são definidos pelo uos
          if($var > 11){
              if($uos == 0){
                  $query .= " AND idOcupacao = 1";
              } else {
                  $query .= " AND idOcupacao = 2";
              }

          } else {
              $query .= " AND (idOcupacao = 1 OR idOcupacao = 2)";
          }
      }

      $var_single_deg = array(4, 5);

      if(in_array($var, $var_single_deg) || ($var == 6 && $uos == 0)){
          if($desag == 2 && $subdeg >= 0) {
              $query .= " AND Sexo = ?";
              $params[] = $subdeg;
          } else {
              $query .= " AND Sexo is NULL";
          }

          $query .= " AND idPorte = ?";
          $query .= " AND idIdade = ?";
          $query .= " AND idEscolaridade = ?";
          $query .= " AND idEtinia = ?";
          $query .= " AND Formalidade = ?";
          $query .= " AND Previdencia = ?";
          $query .= " AND Sindical = ?";

          $params[] = self::concatValueDeg($desag, 1, $subdeg);
          $params[] = self::concatValueDeg($desag, 3, $subdeg);
          $params[] = self::concatValueDeg($desag, 4, $subdeg);
          $params[] = self::concatValueDeg($desag, 5, $subdeg);
          $params[] = self::concatValueDeg($desag, 6, $subdeg);
          $params[] = self::concatValueDeg($desag, 7, $subdeg);
          $params[] = self::concatValueDeg($desag, 8, $subdeg);

      }
      else {
          if($desag == 2) {
              $query .= " AND (Sexo = 1 OR Sexo = 0)";
          } else {
              $query .= " AND Sexo IS NULL";
          }

          $query .= self::concatDeg($desag, 1, "idPorte");
          $query .= self::concatDeg($desag, 3, "idIdade");
          $query .= self::concatDeg($desag, 4, "idEscolaridade");
          $query .= self::concatDeg($desag, 5, "idEtinia");
          $query .= self::concatDeg($desag, 6, "Formalidade");
          $query .= self::concatDeg($desag, 7, "Previdencia");
          $query .= self::concatDeg($desag, 8, "Sindical");
      }

      if($uos == 1 && $var == 6){
          $query .= " AND Ano = ?";
          $params[] = $ano;
      }

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      if($ocp == 3 && $desag == 0 && !(($var == 4 || $var == 5) && $uos == 1)
          || ($ocp == 0 && $desag == 0 && $cad == 0 && $uos != 1)
          || (($var == 4 || $var == 5) && $ocp == 3 && $desag != 0)){

          $result_aux = array();
          $value_aux = array();
          $percent_aux = array();
          foreach ($allObjects as $data) {
              if(!isset($value_aux[$data->Ano])) $value_aux[$data->Ano] = 0;
              if(!isset($percent_aux[$data->Ano])) $percent_aux[$data->Ano] = 0;
              $value_aux[$data->Ano] += $data->Valor;
              $percent_aux[$data->Ano] += $data->Percentual;
              $result_aux[$data->Ano] = $data;
              $result_aux[$data->Ano]->Valor = $value_aux[$data->Ano];
              $result_aux[$data->Ano]->Percentual = $percent_aux[$data->Ano];
          }
          $allObjects = $result_aux;
      }

      return $allObjects;
    }

    public static function getTotalSumPrt($var, $uf, $cad, $ocp){
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT Valor, Ano FROM `Eixo_2` WHERE
                Numero = ? and
                idUF = ? and
                idPorte = 0 and
                idCadeia = ? and
                idOcupacao = ? and
                idEscolaridade = 0 and
                idEtinia = 0 and
                idIdade = 0 and
                `Sexo` IS NULL ";

      $params[] = $var;
      $params[] = $uf;
      $params[] = $cad;
      $params[] = $ocp;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
          $allObjects[] = $row;
      }

  return $allObjects;

  }


    public static function getter_region($var, $cad, $ocp, $anos, $deg, $subdeg, $regiao){

      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      if(is_null($subdeg)) {
          if($ocp != 0) {
              $query = "SELECT * FROM ".self::$table." AS ex"
                  ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.UFRegiao LIKE '?'"
                  ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = ?"
                  ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao = ?"
                  ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = ?"
                  ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = ?"
                  ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = ?"
                  ." WHERE ex.Numero = ?"
                  ." AND ex.Formalidade = ?"
                  ." AND ex.Previdencia = ?"
                  ." AND ex.Sindical = ?"
                  ." AND ex.Sexo IS NULL";

              $params[] = $regiao;
              $params[] = self::concatValueDeg($deg, 1, $subdeg);
              $params[] = $ocp;
              $params[] = self::concatValueDeg($deg, 3, $subdeg);
              $params[] = self::concatValueDeg($deg, 4, $subdeg);
              $params[] = self::concatValueDeg($deg, 5, $subdeg);
              $params[] = $var;
              $params[] = self::concatValueDeg($deg, 6, $subdeg);
              $params[] = self::concatValueDeg($deg, 7, $subdeg);
              $params[] = self::concatValueDeg($deg, 8, $subdeg);

          }
          else {
              $query = "SELECT * FROM ".self::$table." AS ex"
                      ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.UFRegiao LIKE '?'"
                      ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
                      ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = ?"
                      ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao = ?"
                      ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = ?"
                      ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = ?"
                      ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = ?"
                      ." WHERE ex.Numero = ?"
                      ." AND ex.Formalidade = ?"
                      ." AND ex.Previdencia = ?"
                      ." AND ex.Sindical = ?"
                      ." AND ex.Sexo IS NULL";

              $params[] = $regiao;
              $params[] = $cad;
              $params[] = self::concatValueDeg($deg, 1, $subdeg);
              $params[] = $ocp;
              $params[] = self::concatValueDeg($deg, 3, $subdeg);
              $params[] = self::concatValueDeg($deg, 4, $subdeg);
              $params[] = self::concatValueDeg($deg, 5, $subdeg);
              $params[] = $var;
              $params[] = self::concatValueDeg($deg, 6, $subdeg);
              $params[] = self::concatValueDeg($deg, 7, $subdeg);
              $params[] = self::concatValueDeg($deg, 8, $subdeg);
          }
      }
      else {
          if($ocp != 0) {
              $query = "SELECT * FROM ".self::$table." AS ex"
                      ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.UFRegiao LIKE '?'"
                      ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = ?"
                      ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao = ?"
                      ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = ?"
                      ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = ?"
                      ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = ?"
                      ." WHERE ex.Numero = ?"
                      ." AND ex.Formalidade = ?"
                      ." AND ex.Previdencia = ?"
                      ." AND ex.Sindical = ?"
                      ." AND ex.Sexo = ?";

              $params[] = $regiao;
              $params[] = $prt;
              $params[] = $ocp;
              $params[] = $esc;
              $params[] = $etn;
              $params[] = $idd;
              $params[] = $var;
              $params[] = $form;
              $params[] = $prev;
              $params[] = $sind;
              $params[] = $sexos;
          }
          else {

              $query = "SELECT * FROM ".self::$table." AS ex"
                      ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.UFRegiao LIKE ?"
                      ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
                      ." JOIN Porte AS prt ON prt.idPorte = ex.idPorte AND prt.idPorte = ?"
                      ." JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao AND ocp.idOcupacao = ?"
                      ." JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade AND esc.idEscolaridade = ?"
                      ." JOIN Etinia AS etn ON etn.idEtinia = ex.idEtinia AND etn.idEtinia = ?"
                      ." JOIN Idade AS idd ON idd.idIdade = ex.idIdade AND idd.idIdade = ?"
                      ." WHERE ex.Numero = ?"
                      ." AND ex.Formalidade = ?"
                      ." AND ex.Previdencia = ?"
                      ." AND ex.Sindical = ?";


              if(self::concatValueDegSexo($deg, 2, $subdeg) == "IS NULL"){
                  $query .= " AND ex.Sexo IS NULL";
              }
              else{
                  $query .= " AND ex.Sexo = ?";
              };


              $params[] = $regiao;
              $params[] = $cad;
              $params[] = self::concatValueDeg($deg, 1, $subdeg);
              $params[] = $ocp;
              $params[] = self::concatValueDeg($deg, 3, $subdeg);
              $params[] = self::concatValueDeg($deg, 4, $subdeg);
              $params[] = self::concatValueDeg($deg, 5, $subdeg);
              $params[] = $var;
              $params[] = self::concatValueDeg($deg, 6, $subdeg);
              $params[] = self::concatValueDeg($deg, 7, $subdeg);
              $params[] = self::concatValueDeg($deg, 8, $subdeg);
              if(self::concatValueDegSexo($deg, 2, $subdeg) != "IS NULL"){
                  $params[] = self::concatValueDegSexo($deg, 2, $subdeg);
              };

          }
      }

      if($anos > 0){
        $query .= " AND ex.Ano = ?";
        $params[] = $anos;
      }

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
          $allObjects[] = $row;
      }

      return $allObjects;
    }


    public static function getter_linhas($var, $uf, $cad, $ocp, $uos, $slc, $desag, $subdeg){

      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();


      $query = "SELECT * FROM ".self::$table." WHERE Numero = ? AND idUF = ?";
      $params[] = $var;
      $params[] = $uf;

      if($ocp == 0){

          if($desag != 0 && $cad == 0) {
              $query .= " AND idCadeia != 0";
          }
          else {
              if($uos == 1 && $var == 6) {
                  $query .= " AND idCadeia != 0";
              }
              else if ($var == 4 || $var == 5){
                  $query .= " AND idCadeia != 0";
              }
              else {
                  $query .= " AND idCadeia = ?";
                  $params[] = $cad;
              }
          }
          $query .= " AND idOcupacao = 0";
      }
      else if($ocp == 1){
          $query .= " AND idOcupacao = 1";
      }
      else if($ocp == 2){
          $query .= " AND idOcupacao = 2";
      }
      else if($ocp == 3){
          $query .= " AND (idOcupacao = 1 OR idOcupacao = 2)";
      }

      $query .= self::concatDeg($desag, 1, "idPorte");
      $query .= self::concatDeg($desag, 3, "idIdade");
      $query .= self::concatDeg($desag, 4, "idEscolaridade");
      $query .= self::concatDeg($desag, 5, "idEtinia");
      $query .= self::concatDeg($desag, 6, "Formalidade");
      $query .= self::concatDeg($desag, 7, "Previdencia");
      $query .= self::concatDeg($desag, 8, "Sindical");

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      return $allObjects;

    }

    private static function concatDeg($deg, $idDeg, $texto){
        if($deg == $idDeg){
            return " AND ".$texto." > 0";
        } else{
            return " AND ".$texto." = 0";
        }
    }

    private static function concatValueDeg($deg, $idDeg, $subdeg){
        if($deg == $idDeg){
            return $subdeg;
        } else{
            return 0;
        }
    }

    private static function concatValueDegSexo($deg, $idDeg, $subdeg){
        if($deg == $idDeg){
            return $subdeg;
        } else{
            return "IS NULL";
        }
    }

    public static function getMaxValueSetor($var, $cad){
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT MAX(Valor) as Valor, Ano FROM ".self::$table
              ." WHERE Numero = ?"
              ." AND idCadeia = ?"
              ." AND idUF = 0 GROUP BY Ano";

      $params[] = $var;
      $params[] = $cad;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      return $allObjects;
    }

    public static function getTotalBrasil($var){
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT MAX(Valor) as Valor, Ano FROM ".self::$table
              ." WHERE Numero = ?"
              ." AND idCadeia = 0"
              ." AND idUF = 0 GROUP BY Ano";

      $params[] = $var;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      return $allObjects;
    }

    public static function getTotalEstado($var, $uf, $ocp){
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT MAX(Valor) as Valor, Ano FROM ".self::$table
              ." WHERE Numero = ?"
              ." AND idCadeia = 0"
              ." AND idOcupacao = ?"
              ." AND idUF = ? GROUP BY Ano";

      $params[] = $var;
      $params[] = $ocp;
      $params[] = $uf;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      return $allObjects;
    }


}



