<?php
class AlexandraDatabase{
    // private $servername = "remotemysql.com";
    // private $username = "9Xh6WpXxVP";
    // private $password = "69Uni4xWyi";
    // private $dbname = "9Xh6WpXxVP";
    private $servername = "localhost";
    private $username = "chapar83_hotel";
    private $password = "Amoriamor1";
    private $dbname = "chapar83_hotel";
    private $conn = null;

    public function connect() {
        try {
            $this->conn = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch (PDOException $e) {
            echo "connection failed ". $e->getMessage(). "<br>";
        }
        return $this->conn;
    }
}
?>