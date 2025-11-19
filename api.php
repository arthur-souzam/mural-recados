<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'backend/Database.php';
require_once 'backend/Recado.php';
require_once 'backend/RecadoRepository.php';

$database = new Database();
$db = $database->getConnection();

$recadoRepo = new RecadoRepository($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$data = json_decode(file_get_contents('php://input'));

switch ($action) {
    case 'create':
        if ($method == 'POST') {
            $recado = new Recado();
            $recado->setMensagem($data->mensagem);

            if ($recadoRepo->create($recado)) {
                echo json_encode(['message' => 'Recado criado com sucesso.']);
            } else {
                echo json_encode(['message' => 'Erro ao criar recado.']);
            }
        }
        break;

    case 'readAll':
        if ($method == 'GET') {
            $recados = $recadoRepo->readAll();
            echo json_encode($recados);
        }
        break;

     case 'readOne':
        if ($method == 'GET' && isset($_GET['id'])) {
            $recado = $recadoRepo->readOne($_GET['id']);
            if($recado) {
                echo json_encode($recado);
            } else {
                 http_response_code(404);
                 echo json_encode(['message' => 'Recado não encontrado.']);
            }
        }
        break;

    case 'update':
         if ($method == 'POST') { 
            $recado = new Recado();
            $recado->setId($data->id);
            $recado->setMensagem($data->mensagem);

            if ($recadoRepo->update($recado)) {
                echo json_encode(['message' => 'Recado atualizado com sucesso.']);
            } else {
                echo json_encode(['message' => 'Erro ao atualizar recado.']);
            }
        }
        break;

    case 'delete':
         if ($method == 'POST') {
            $id = $data->id;
            if ($recadoRepo->delete($id)) {
                echo json_encode(['message' => 'Recado deletado com sucesso.']);
            } else {
                echo json_encode(['message' => 'Erro ao deletar recado.']);
            }
        }
        break;

    case 'favoritar':
        if ($method == 'POST') {
            $id = $data->id;
            $statusAtual = $data->statusAtual;
            
            $novoStatus = $recadoRepo->toggleFavorito($id, $statusAtual);
            
            if ($novoStatus !== false) {
                echo json_encode(['message' => 'Status atualizado.', 'novoStatus' => $novoStatus]);
            } else {
                echo json_encode(['message' => 'Erro ao favoritar.']);
            }
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['message' => 'Ação inválida.']);
        break;
}
?>