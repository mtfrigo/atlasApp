<?php

   // Define database connection parameters

   require('config.db.php');

   class EixoUm {

    ## Atributos ##

    protected static $table = 'Eixo_1';
    private static $conn;

    //informações Eixo_1
    protected $id;
    public $Numero;
    public $idUF;
    public $idCadeia;
    public $idPorte;
    public $Ano;
    public $Valor;
    public $Percentual;
    public $percentual_scc;
    public $percentual_region;
    public $Taxa;

    //informações UF
    public $UFNome;
    public $UFRegiao;
    public $UFSigla;

    //informações Atuação
    public $AtuacaoNome;

    //informações Cadeia
    public $CadeiaNome;

    //informações Porte
    public $PorteNome;

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
      return new PDO($dsn, $un, $pwd, $opt);

    }

    public static function getter_barras($var, $ufs, $cad, $deg, $uos){

      $pdo 	= self::connect();

      $allObjects  = array();

	    if($deg > 0) $deg = $deg - 8;

      if(($deg == 0 || $cad != 0) || $var == 1 || $var == 3 || $var == 2)
      {
        $idCadeia = ($uos == 0) ? $cad : 1;

        try {

          $stmt = $pdo->prepare(
            "SELECT * FROM ".self::$table." AS ex"
                   ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
                   ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ".$idCadeia
                   ." JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
                   ." WHERE ex.Numero = ?");

          $params = array($ufs, $deg, $var);

          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }

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
        catch(PDOException $e)
        {
          echo $e->getMessage();
        }
        return $allObjects;
      }

    }

    public static function getter_most_recent_year()
    {

      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $stmt = $pdo->prepare(
          "SELECT DISTINCT Ano, Numero FROM `Eixo_1` WHERE `idUF` = 0");

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

    public static function getMaxValueSetor($var, $cad, $deg)
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $stmt = $pdo->prepare(
          "SELECT MAX(Valor) as Valor, Ano FROM ".self::$table
          ." WHERE Numero = ?"
          ." AND idCadeia = ?"
          ." AND idPorte = ?"
          ." AND idUF = 0 GROUP BY Ano");

        $params = array($var, $cad, $deg);

        $stmt->execute($params);

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

    public static function getTotalBrasil($var, $deg){
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();

      $query = "SELECT MAX(Valor) as Valor, Ano FROM ".self::$table
              ." WHERE Numero = ?"
              ." AND idCadeia = 0"
              ." AND idPorte = ?"
              ." AND idUF = 0 GROUP BY Ano";

      $params[] = $var;
      $params[] = $deg;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);

      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

      return $allObjects;
    }

    public static function getTotalSumPrt($var, $uf, $deg, $cad)
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $stmt = $pdo->prepare(
          "SELECT Valor, Ano FROM `Eixo_1`
            WHERE Numero = ? and
            idUF = ? and
            idPorte = 0 and
            idCadeia = 0");

        $params = array($var, $uf);

        $stmt->execute($params);

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

    public static function getAnoDefault($var)
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $stmt = $pdo->prepare(
          "SELECT MAX(Ano) AS Ano FROM `Eixo_1` WHERE
            `idUF` = 0 AND
            Numero = ?
            GROUP BY Numero");

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

    public static function find($var, $ufs, $cad, $deg, $anos)
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        if($deg > 0)  $deg = $deg - 8;

        $stmt = $pdo->prepare(
          "SELECT * FROM ".self::$table." AS ex"
          ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
          ." JOIN Atuacao AS atc ON atc.idAtuacao =  ex.idAtuacao AND atc.idAtuacao = 0"
          ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
          ." JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
          ." WHERE ex.Numero = ?"
          ." AND ex.Ano = ?");

        $params = array($ufs, $cad, $deg, $var, $anos);

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

      return ($obj == false) ? NULL : $obj;
    }

    public static function all()
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        $stmt = $pdo->prepare(
          "SELECT * FROM ".self::$table." AS ex"
          ." JOIN UF AS uf ON uf.idUF =  ex.idUF"
          ." JOIN Atuacao AS atc ON atc.idAtuacao =  ex.idAtuacao"
          ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia"
          ." JOIN Porte AS prt ON prt.idPorte =  ex.idPorte"
          ." ORDER BY id");

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

    public static function getter_mapa($var, $cad, $deg, $anos)
    {
      $pdo 	= self::connect();

      $allObjects  = array();

      try {

        if($deg > 0) $deg = $deg - 8;

        if($deg == 0 || $cad != 0 || $var == 1 || $var == 3 || $var == 2) {


          $query = "SELECT * FROM " . self::$table . " AS ex"
                   . " JOIN UF AS uf ON uf.idUF =  ex.idUF"
                   . " JOIN Atuacao AS atc ON atc.idAtuacao =  ex.idAtuacao AND atc.idAtuacao = 0"
                   . " JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
                   . " JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
                   . " WHERE ex.Numero = ?";

          $query .= ($anos > 0) ? " AND ex.Ano = ?" : "";

          $stmt = $pdo->prepare($query);



          if ($anos > 0)
            $params = array($cad,$deg, $var, $anos);
          else
            $params = array($cad,$deg, $var);

          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }
        }
        else
        {
          $query = "SELECT * FROM " . self::$table . " AS ex"
          . " JOIN UF AS uf ON uf.idUF =  ex.idUF"
          . " JOIN Atuacao AS atc ON atc.idAtuacao =  ex.idAtuacao AND atc.idAtuacao = 0"
          . " JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
          . " WHERE ex.Numero = ?";

          $query .= ($anos > 0) ? " AND ex.Ano = ?" : "";

          $stmt = $pdo->prepare($query);

          if ($anos > 0)
            $params = array($deg,$var, $anos);
          else
            $params = array($deg, $var);

          $stmt->execute($params);


          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }

          $result_aux = array();
          $value_aux = array();
          $percent_aux = array();

          foreach ($allObjects as $data) {

            if(!isset($value_aux[$data->idUF])) $value_aux[$data->idUF] = 0;
            if(!isset($percent_aux[$data->idUF])) $percent_aux[$data->idUF] = 0;

            $value_aux[$data->idUF] += $data->Valor;
            $percent_aux[$data->idUF] += $data->Percentual;
            $result_aux[$data->idUF] = $data;
            $result_aux[$data->idUF]->Valor = $value_aux[$data->idUF];
            $result_aux[$data->idUF]->Percentual = $percent_aux[$data->idUF];

          }

          $allObjects = $result_aux;

        }
      }
      catch(PDOException $e)
      {
        echo $e->getMessage();
      }

      return $allObjects;
    }

    public static function getter_linhas($var, $ufs, $cad, $deg, $uos){

      $pdo 	= self::connect();

      $allObjects  = array();

	    if($deg > 0) $deg = $deg - 8;


        try {

          if($var == 3 || $var == 9)
          {

            $stmt = $pdo->prepare(
              "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
              ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia > 0"
              ." JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
              ." WHERE ex.Numero = ?");

            $params = array($ufs, $deg, $var);

            $stmt->execute($params);

            while($row  = $stmt->fetch(PDO::FETCH_OBJ))
            {
                // Assign each row of data to associative array
                $allObjects[] = $row;
            }
        }
        else if($var >= 10)
        {
          $stmt = $pdo->prepare(
            "SELECT * FROM ".self::$table." AS ex"
            ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
            ." WHERE ex.Numero = ?");

          $params = array($ufs, $uos, $var);

          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }

        }

      }
      catch(PDOException $e)
      {
        echo $e->getMessage();

      }

      return $allObjects;


    }

    public static function getter_region($var, $cad, $deg, $anos, $regiao)
    {

      $pdo 	= self::connect();

      $allObjects  = array();

	    if($deg > 0) $deg = $deg - 8;


      try {

        if($deg == 0 || $cad != 0 || $var == 1 || $var == 3|| $var == 2)
        {

          $query = "SELECT * FROM " . self::$table . " AS ex"
          . " JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.UFRegiao LIKE ?"
          . " JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
           ." JOIN Atuacao AS atc ON atc.idAtuacao =  ex.idAtuacao AND atc.idAtuacao = 0"
           . " JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
          . " WHERE ex.Numero = ?";

          $query .= ($anos > 0) ? " AND ex.Ano = ?" : "";

          $stmt = $pdo->prepare($query);


          if($anos > 0)
            $params = array($regiao, $cad, $deg, $var, $anos);
          else
            $params = array($regiao, $cad, $deg, $var);

          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }
        }
        else
        {

          $query = "SELECT * FROM " . self::$table . " AS ex"
                   . " JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.UFRegiao LIKE ?"
                   . " JOIN Porte AS prt ON prt.idPorte =  ex.idPorte AND prt.idPorte = ?"
                   . " WHERE ex.Numero = ?";

          $query .= ($anos > 0) ? " AND ex.Ano = ?" : "";

          $stmt = $pdo->prepare($query);

          $params = array($regiao, $deg, $var, $anos);

          if($anos > 0)
            $params = array($regiao, $deg, $var, $anos);
          else
            $params = array($regiao, $deg, $var);


          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
              // Assign each row of data to associative array
              $allObjects[] = $row;
          }

        }

      }
      catch(PDOException $e)
      {
        echo $e->getMessage();

      }

      return $allObjects;


    }


  }


   // Attempt to query database table and retrieve data



?>
