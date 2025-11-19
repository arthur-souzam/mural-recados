<?php


require_once __DIR__ . '/../database/credentials.php';

class Database {
    private $host = 'localhost:3306';
    private $db_name = 'trabalho_web';      
    private $username = 'root';
    private $password = 'ifsc';
    public $conn;

    public function getConnection() {
       
        $this->conn = null;
        try {
         
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
           $dsn = "mysql:host=" . $this->host . ";port=3307;dbname=" . $this->db_name;
$this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Erro de conexão: " . $exception->getMessage();
        }
       
        return $this->conn;
    }
   
}
?>