<?php

###	Classe que manipula as variáveis do Eixo 2 ###

require('config.db.php');

class EixoTres {

## Atributos ##

	protected static $table = 'Eixo_3';
	private static $conn;

 	//informações Eixo_3
	protected $id;
	public $Numero;
	public $idUF;
	public $idCadeia;
	public $idMecanismo;

	public $PessoaFisica;
	public $Modalidade;

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

	//informações Mecanismo
	public $MecanismoNome;


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



  public static function getter_most_recent_year(){
    $pdo 	= self::connect();

    $allObjects  = array();

    $query = "SELECT DISTINCT Ano, Numero FROM `Eixo_3` WHERE `idUF` = 0";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

	public static function getAnoDefault($var){
		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

		$query = "SELECT MAX(Ano) AS Ano FROM `Eixo_3` WHERE (idUF = 11 or idUF = 0) AND Numero = ? GROUP BY Numero";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

    $obj = $allObjects[0];
		$ano = $obj->Ano;

		return $ano;
	}

	public static function find($var, $ufs, $cad, $mec, $pf, $mod, $anos){

		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
               ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
               ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
               ." JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
               ." WHERE ex.Numero = ?"
               ." AND ex.Ano = ?";

    $params[] = $ufs;
    $params[] = $cad;
    $params[] = $mec;
    $params[] = $var;
    $params[] = $anos;

    if($pf != 99 && $pf != NULL)
    {
        $query .= " AND ex.PessoaFisica = ?";
        $params[] = $pf;
    }
    else {
        $query .= " AND ex.PessoaFisica IS NULL";
    }

    if($mod != 99 && $mod != NULL) {
        $query .= " AND ex.Modalidade = ?";
        $params[] = $mod;
    } else {
        $query .= " AND ex.Modalidade IS NULL";
    }


    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

    $obj = $allObjects[0];

    return ($obj == false) ? NULL : $obj;
	}

	public static function all(){
		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
          ." JOIN UF AS uf ON uf.idUF = ex.idUF"
          ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia"
          ." JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo"
          ." ORDER BY id";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

	public static function getter_mapa($var, $cad, $mec, $mod, $pf, $anos){

		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    $vars_com_cad_0 = array( 1, 3, 4, 6, 7, 8, 9,  11, 12, 13, 14, 15, 16, 17);

    if($var == 17 || $var == 18 || $var == 19)
    {
      $query = "SELECT * FROM " . self::$table . " AS ex"
              . " JOIN UF AS uf ON uf.idUF =  ex.idUF"
              . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?";

      $params[] = $mec;

      if ($anos > 0) {
          $query .= " AND ex.Ano = ?";
          $params[] = $anos;
      }

      if($var != 17) {
          $query .= " JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?";
          $params[] = $cad;
      }

      $query .=   " WHERE ex.Numero = ?";
      $params[] = $var;

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
    else if($mec == 0 || ($cad != 0 && $mec != 0) || in_array($var, $vars_com_cad_0))
    {
      $vars_com_cad_0 = array( 1, 3, 4, 6, 7, 8, 9,10,  11, 12, 13, 14, 15, 16);
      $cad = (is_null($cad)) ? '0' : $cad;
      $cad = ($cad == 'null') ? '0' : $cad;

      $query = "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF = ex.idUF"
              ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
              ." JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
              ." WHERE ex.Numero = ?"
              ." AND ex.Ano = ?";

      $params[] = $cad;
      $params[] = $mec;
      $params[] = $var;
      $params[] = $anos;

      if(!is_null($pf) && !is_null($mod))
      {
          $query .= " AND ex.PessoaFisica = ?";
          $query .= " AND ex.Modalidade = ?";

      $params[] = $pf;
      $params[] = $mod;

      }
      else if(is_null($pf) && !is_null($mod))
      {
        $query .= " AND ex.Modalidade = ?"
                . " AND ex.PessoaFisica IS NULL";

        $params[] = $mod;

      }
      else if(!is_null($pf) && is_null($mod))
      {
        $query .= " AND ex.PessoaFisica = ?";
        $query .= " AND ex.Modalidade IS NULL";

        $params[] = $pf;
      }
      else
      {
        $query .= " AND ex.PessoaFisica IS NULL";
        $query .= " AND ex.Modalidade IS NULL";
      }

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

    }
    else
    {
        $query = "SELECT * FROM " . self::$table . " AS ex"
                . " JOIN UF AS uf ON uf.idUF =  ex.idUF"
                ." JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
                . " WHERE ex.Numero = ?";

        $params[] = $mec;
        $params[] = $var;

        if ($anos > 0)
        {
            $params[] = $anos;
            $query .= " AND ex.Ano = ?";
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
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

		return $allObjects;
	}

	public static function getter_barras($var, $ufs, $cad, $mec, $pf, $mod, $ano = NULL, $uos){

    $vars_com_cad_0 = array( 1, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    if($var == 18 || $var == 19)
    {
        $query = "SELECT * FROM ".self::$table." AS ex"
                ." WHERE ex.Numero = ? AND idMecanismo = ? AND idUF = ?";
        $params[] = $var;
        $params[] = $mec;
        $params[] = $ufs;

        $query .=  " AND Ano > 0" ;
        $query .=  " AND idCadeia = ?";
        $params[] = $cad;

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }
    }
    else if($var == 17){

        $query = "SELECT * FROM ".self::$table." AS ex"
                ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
                ." JOIN Mecanismo AS mec ON mec.idMecanismo =  ex.idMecanismo AND mec.idMecanismo = ?"
                ." WHERE ex.Numero = ?";

        $params[] = $ufs;
        $params[] = $mec;
        $params[] = $var;

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }

        $result_aux = array();
        $value_aux = array();
        $percent_aux = array();

        foreach ($allObjects as $data)
        {
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
    else if($var == 10)
    {

      $query = "SELECT * FROM " . self::$table . " AS ex"
          . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
          . " WHERE ex.Numero = ?";

      $query .= " AND ex.PessoaFisica IS NULL"
          . " AND ex.Modalidade IS NULL";

      $params[] = $uos;
      $params[] = $var;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }

    }
    else if($mec == 0 || ($cad != 0 && $mec != 0) || $var == 3 || in_array($var, $vars_com_cad_0))
    {
      if(is_null($ano) || $var < 15)
      {
        $cad = (is_null($cad)) ? 0 : $cad;

        $query = "SELECT * FROM " . self::$table . " AS ex"
                . " JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
                . " JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
                . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
                . " WHERE ex.Numero = ?";

        if(!is_null($pf) && !is_null($mod))
        {
          $query .= " AND ex.PessoaFisica = ?"
                  . " AND ex.Modalidade = ?";

          $params[] = $ufs;
          $params[] = $cad;
          $params[] = $mec;
          $params[] = $var;
          $params[] = $pf;
          $params[] = $mod;


          $stmt = $pdo->prepare($query);
          $stmt->execute($params);
          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }
        }
        else if(is_null($pf) && !is_null($mod))
        {
          $query .= " AND ex.PessoaFisica IS NULL"
                  . " AND ex.Modalidade = ?";

          $params[] = $ufs;
          $params[] = $cad;
          $params[] = $mec;
          $params[] = $var;
          $params[] = $mod;

          $stmt = $pdo->prepare($query);
          $stmt->execute($params);
          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }
        }
        else if(!is_null($pf) && is_null($mod)) {

          $query .= " AND ex.PessoaFisica = ?"
                  . " AND ex.Modalidade IS NULL";

          $params[] = $ufs;
          $params[] = $cad;
          $params[] = $mec;
          $params[] = $var;
          $params[] = $pf;

          $stmt = $pdo->prepare($query);
          $stmt->execute($params);
          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }

        }
        else
        {
          $query .= " AND ex.PessoaFisica IS NULL"
                  . " AND ex.Modalidade IS NULL";

          $params[] = $ufs;
          $params[] = $cad;
          $params[] = $mec;
          $params[] = $var;

          $stmt = $pdo->prepare($query);
          $stmt->execute($params);
          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }
        }

      }
      else
      {
        $query = "SELECT * FROM ".self::$table." AS ex"
                ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = 0"
                ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
                . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
                ." WHERE ex.Numero = ?";

        $params[] = $uos;
        $params[] = $mec;
        $params[] = $var;

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }
      }

    }
    else
    {
      $query = "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ".$ufs
              ." JOIN Mecanismo AS mec ON mec.idMecanismo =  ex.idMecanismo AND mec.idMecanismo = ".$mec
              ." WHERE ex.Numero = ".$var;

      $params[] = $uos;
      $params[] = $mec;
      $params[] = $var;

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
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

		return $allObjects;
	}

	public static function getter_region($var, $cad, $mec, $pf, $mod, $anos, $regiao){

		$pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.UFRegiao LIKE ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
            ." JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
            ." WHERE ex.Numero = ?";

    $query .= ($anos > 0) ? " AND ex.Ano = ?" : "";

    if(!is_null($pf) && !is_null($mod))
    {
      $query .= " AND ex.PessoaFisica = ?";
      $query .= " AND ex.Modalidade = ?";

      $params[] =  $regiao;
      $params[] =  $cad;
      $params[] =  $mec;
      $params[] =  $var;
      $params[] =  $pf;
      $params[] =  $mod;


    }
    else if(is_null($pf) && !is_null($mod))
    {
      $query .= " AND ex.PessoaFisica IS NULL";
      $query .= " AND ex.Modalidade = ?";

      $params[] =  $regiao;
      $params[] =  $cad;
      $params[] =  $mec;
      $params[] =  $var;
      $params[] =  $mod;

    }
    else if(!is_null($pf) && is_null($mod))
    {
      $query .= " AND ex.PessoaFisica = ?";
      $query .= " AND ex.Modalidade IS NULL";

      $params[] =  $regiao;
      $params[] =  $cad;
      $params[] =  $mec;
      $params[] =  $var;
      $params[] =  $pf;

    }
    else
    {
      $query .= " AND ex.PessoaFisica IS NULL";
      $query .= " AND ex.Modalidade IS NULL";

      $params[] =  $regiao;
      $params[] =  $cad;
      $params[] =  $mec;
      $params[] =  $var;

    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

  public static function getter_donut($var, $ufs, $cad, $mec, $pf, $mod, $ano = NULL, $uos)
  {
    $pdo 	= self::connect();

    $allObjects  = array();
    $params  = array();

    $query = $query = "SELECT * FROM " . self::$table . " AS ex"
        . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ".$mec
        . " WHERE ex.Numero = " . $var;;


    if($var == 18 || $var == 19)
    {
      $query = "SELECT * FROM " . self::$table . " AS ex"
              . " WHERE ex.Numero = " . $var;
              $query .=  " AND idMecanismo = ".$mec ;
              $query .=  " AND Ano = 0" ;
              $query .=  " AND idUF = ".$ufs ;

      if(!($var == 19 && $mec == 1))
          $query .=  " AND idCadeia > 0" ;
    }
    else
      $query .= ($ano > 0) ? " AND Ano = ".$ano : "" ;

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

    return $allObjects;
  }

    public static function getter_linhas($var, $ufs, $cad, $mec, $pf, $mod, $ano = NULL, $uos)
    {

      $vars_com_cad_0 = array( 1, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
      $pdo 	= self::connect();

      $allObjects  = array();
      $params  = array();


      if($var == 18 || $var == 19)
      {
        $query = "SELECT * FROM ".self::$table." AS ex"
            ." WHERE ex.Numero = ? AND idMecanismo = ? AND idUF = ?";

        $params[] = $var;
        $params[] = $mec;
        $params[] = $ufs;

        if($uos == 0)
        {
            $query .=  " AND Ano > 0" ;
        }
        else
        {
            $query .=  " AND Ano = 0" ;
            $query .=  " AND idCadeia = ?";
            $params[] = $cad;
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
          $allObjects[] = $row;
        }

      }
      else if($var == 17)
      {
        $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ?"
            ." JOIN Mecanismo AS mec ON mec.idMecanismo =  ex.idMecanismo AND mec.idMecanismo = ?"
            ." WHERE ex.Numero = ?";

        $params[] = $ufs;
        $params[] = $mec;
        $params[] = $var;


        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
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
      else if($mec == 0 || ($cad != 0 && $mec != 0) || $var == 3 ||  in_array($var, $vars_com_cad_0))
      {
        if(is_null($ano) || $var < 15)
        {
          $cad = (is_null($cad)) ? 0 : $cad;
          $query = "SELECT * FROM " . self::$table . " AS ex"
              . " JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
              . " JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
              . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
              . " WHERE ex.Numero = ?";

          if(!is_null($pf) && !is_null($mod))
          {
            $query .= " AND ex.PessoaFisica = ?"
                . " AND ex.Modalidade = ?";

            $params[] = $ufs;
            $params[] = $cad;
            $params[] = $mec;
            $params[] = $var;
            $params[] = $pf;
            $params[] = $mod;

          }
          else if(is_null($pf) && !is_null($mod))
          {
            $query .= " AND ex.PessoaFisica IS NULL"
                . " AND ex.Modalidade = ?";

            $params[] = $ufs;
            $params[] = $cad;
            $params[] = $mec;
            $params[] = $var;
            $params[] = $mod;

          }
          else if(!is_null($pf) && is_null($mod))
          {
            $query .= " AND ex.PessoaFisica = ?"
                  . " AND ex.Modalidade IS NULL";

            $params[] = $ufs;
            $params[] = $cad;
            $params[] = $mec;
            $params[] = $var;
            $params[] = $pf;

          }
          else
          {
            $query .= " AND ex.PessoaFisica IS NULL"
                . " AND ex.Modalidade IS NULL";

            $params[] = $ufs;
            $params[] = $cad;
            $params[] = $mec;
            $params[] = $var;

          }

          $stmt = $pdo->prepare($query);
          $stmt->execute($params);

          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }

        }
        else
        {
          $query = "SELECT * FROM ".self::$table." AS ex"
              ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = 0"
              ." JOIN Cadeia AS cad ON cad.idCadeia =  ex.idCadeia AND cad.idCadeia = ?"
              . " JOIN Mecanismo AS mec ON mec.idMecanismo = ex.idMecanismo AND mec.idMecanismo = ?"
              ." WHERE ex.Numero = ?";

          $params[] = $uos;
          $params[] = $mec;
          $params[] = $var;

          $stmt = $pdo->prepare($query);
          $stmt->execute($params);
          while($row  = $stmt->fetch(PDO::FETCH_OBJ))
          {
            $allObjects[] = $row;
          }
        }
      }
      else
      {
        $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN UF AS uf ON uf.idUF =  ex.idUF AND uf.idUF = ".$ufs
            ." JOIN Mecanismo AS mec ON mec.idMecanismo =  ex.idMecanismo AND mec.idMecanismo = ".$mec
            ." WHERE ex.Numero = ".$var;

        $params[] = $uos;
        $params[] = $mec;
        $params[] = $var;


        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        while($row  = $stmt->fetch(PDO::FETCH_OBJ))
        {
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

      return $allObjects;
    }

}
