<?php

###	Classe que manipula as variáveis do Eixo 2 ###

require('config.db.php');

class EixoQuatro {

## Atributos ##

	protected static $table = 'Eixo_4';
	private static $conn;

 	//informações Eixo_4
	protected $id;
	public $Numero;
	public $idCadeia;
	public $idParceiro;
  public $idUF;
	public $idTipo;

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

	//informações Parceiro
	public $ParceiroNome;

	//informações Tipo
	public $TipoNome;


## Metodos ##

	public static function connect()
  {
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

  public static function getter_most_recent_year()
  {

    $pdo 	= self::connect();

    $allObjects  = array();

		$query = "SELECT DISTINCT Ano, Numero, Consumo FROM `Eixo_4` WHERE `idUF` = 0 and (Consumo = 0 OR Consumo = 1)";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}


  public static function getAnoDefault($var)
  {
		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();

		$query = "SELECT MAX(Ano) AS Ano FROM `Eixo_4` WHERE `idUF` = 0 AND Numero = ? GROUP BY Numero";

    $params[] = $var;

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

	public static function find($var, $parc, $uf, $tipo, $anos, $slc){

		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();


    $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro AND parc.idParceiro = ?"
            ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia"
            ." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo AND tipo.idTipo = ?"
            ." WHERE ex.Numero = ?"
            ." AND ex.Ano = ?";

		$params[] = $parc;
    $params[] = $uf;
    $params[] = $tipo;
    $params[] = $var;
    $params[] = $anos;

    if($slc == 0)
        $query .= " AND ex.Consumo = 1";
    else
        $query .= " AND ex.Consumo = 0";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

    return $allObjects;
	}

  public static function all()
  {
		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
          ." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro"
          ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia"
          ." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo"
          ." ORDER BY id";

    $query .= " AND ex.Consumo = 1";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

  public static function getter_mapa($var, $cad, $tipo, $anos, $parceiro, $uf, $mundo, $slc)
  {
		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();

    if($mundo == 0)
    {
			$query = "SELECT * FROM ".self::$table." AS ex"
				." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro"
        ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
        ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
				." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo AND tipo.idTipo = ?"
				." WHERE ex.Numero = ?";

      $params[] = $uf;
      $params[] = $cad;
      $params[] = $tipo;
      $params[] = $var;

      if ($anos > 0)
      {
        $query .= " AND ex.Ano = ?";
        $params[] = $anos;
      }

      if ($slc == 0)
        $query .= " AND ex.Consumo = 0";
      else
        $query .= " AND ex.Consumo = 1";


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
				." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro AND parc.idParceiro = ?"
				." JOIN UF AS uf ON uf.idUF = ex.idUF"
                ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
				." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo AND tipo.idTipo = ?"
				." WHERE ex.Numero = ?";

      $params[] = $parceiro;
      $params[] = $cad;
      $params[] = $tipo;
      $params[] = $var;

      if ($anos > 0)
      {
          $query .= " AND ex.Ano = ?";
          $params[] = $anos;
      }

      if ($slc == 0)
        $query .= " AND ex.Consumo = 0";
      else
        $query .= " AND ex.Consumo = 1";

      $stmt = $pdo->prepare($query);
      $stmt->execute($params);
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $allObjects[] = $row;
      }
    }

    return $allObjects;
	}

  public static function getter_barras($var, $parc, $cad, $tipo, $uf, $mundo, $slc, $uos)
  {

		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro AND parc.idParceiro = ?"
            ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
            ." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo AND tipo.idTipo = ?"
            ." WHERE ex.Numero = ?";

    $params[] = $parc;
    $params[] = $uf;

    //variáveis de IHH e C4
    if($var == 5 || $var == 8)
        $params[] = $uos;
    else
        $params[] = $cad;

    $params[] = $tipo;
    $params[] = $var;

    if($slc == 0)
			$query .= " AND ex.Consumo = 0";
    else
			$query .= " AND ex.Consumo = 1";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

  public static function getter_region($var, $cad, $tipo, $anos, $parc)
  {

		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();

    $query = "SELECT * FROM ".self::$table." AS ex"
            ." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro AND parc.ParceiroNome LIKE ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
            ." JOIN Tipo AS tipo ON tipo.idTipo = ex.idTipo AND tipo.idTipo = ?"
            ." WHERE ex.Numero = ?";

    $query .= ($anos > 0) ? " AND ex.Ano = ?" : "" ;

    if ($anos > 0) {
      $params[] = $parc;
      $params[] = $cad;
      $params[] = $tipo;
      $params[] = $var;
      $params[] = $anos;
    }
    else
    {
      $params[] = $parc;
      $params[] = $cad;
      $params[] = $tipo;
      $params[] = $var;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }

		return $allObjects;
	}

  public static function getter_donut($var, $cad, $ano, $cons, $uf, $parc)
  {
		$pdo 	= self::connect();

    $allObjects  = array();
    $params = array();


    $query = "SELECT ex.Valor, ex.idTipo FROM ".self::$table." AS ex"
            ." JOIN Parceiro AS parc ON parc.idParceiro = ex.idParceiro AND parc.idParceiro = ?"
            ." JOIN UF AS uf ON uf.idUF = ex.idUF AND uf.idUF = ?"
            ." JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia AND cad.idCadeia = ?"
            ." WHERE ex.Numero = ".$var." AND (ex.idTipo = 2 OR ex.idTipo = 1) AND ex.Consumo = ?";

    $query .= ($ano > 0) ? " AND ex.Ano = ?" : "" ;

    if ($ano > 0) {
      $params[] = $parc;
      $params[] = $uf;
      $params[] = $cad;
      $params[] = $cons;
      $params[] = $ano;
    }
    else
    {
      $params[] = $parc;
      $params[] = $uf;
      $params[] = $cad;
      $params[] = $cons;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    while($row  = $stmt->fetch(PDO::FETCH_OBJ))
    {
      $allObjects[] = $row;
    }
		return $allObjects;
	}

}
