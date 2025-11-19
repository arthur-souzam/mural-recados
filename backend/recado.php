<?php
class Recado {
    private $id;
    private $mensagem;
    private $status;
    private $data_criacao;

    public function getId() { 
        return $this->id; 
    }
    public function getMensagem() { 
        return $this->mensagem; 
    }
    public function getStatus() { 
        return $this->status; 
    }
    public function getDataCriacao() { 
        return $this->data_criacao; 
    }

    public function setId($id) { 
        $this->id = $id;
    }
    public function setMensagem($mensagem) { 
        $this->mensagem = htmlspecialchars(strip_tags($mensagem)); 
    }
    public function setStatus($status) { 
        $this->status = $status;
    }
    public function setDataCriacao($data_criacao) { 
        $this->data_criacao = $data_criacao;
    }
}
?>