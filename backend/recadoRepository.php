<?php
class RecadoRepository {
    private $conn;
    private $table_name = "recados";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create(Recado $recado) {
        $query = "INSERT INTO " . $this->table_name . " (mensagem) VALUES (:mensagem)";
        $stmt = $this->conn->prepare($query);

       
        $msg = $recado->getMensagem();
        $stmt->bindParam(":mensagem", $msg);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT id, mensagem, status, data_criacao 
                  FROM " . $this->table_name . " 
                  ORDER BY status DESC, data_criacao DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function readOne($id) {
        $query = "SELECT id, mensagem, status, data_criacao 
                  FROM " . $this->table_name . " 
                  WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update(Recado $recado) {
        $query = "UPDATE " . $this->table_name . "
                  SET mensagem = :mensagem
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        
        $msg = $recado->getMensagem();
        $id = $recado->getId();
        
        $stmt->bindParam(":mensagem", $msg);
        $stmt->bindParam(":id", $id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function toggleFavorito($id, $statusAtual) {
        $novoStatus = ($statusAtual == 1) ? 0 : 1;
        
        $query = "UPDATE " . $this->table_name . "
                  SET status = :status
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $novoStatus);
        $stmt->bindParam(":id", $id);

        if($stmt->execute()) {
            return $novoStatus;
        }
        return false;
    }
}
?>