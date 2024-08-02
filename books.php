<?php
include 'db.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT books.*, categories.name as category_name FROM books LEFT JOIN categories ON books.category_id = categories.id");
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($books);
        break;

    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO books (title, author, publication_date, publisher, pages, category_id) VALUES (:title, :author, :publication_date, :publisher, :pages, :category_id)");
        $stmt->execute([
            'title' => $data['title'],
            'author' => $data['author'],
            'publication_date' => $data['publication_date'],
            'publisher' => $data['publisher'],
            'pages' => $data['pages'],
            'category_id' => $data['category_id']
        ]);
        echo json_encode(['status' => 'success']);
        break;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM books WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'success']);
        break;

    case 'search':
        $text = $_GET['text'] ?? '';
        $date = $_GET['date'] ?? '';
        $query = "SELECT books.*, categories.name as category_name FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE 1";

        if ($text) {
            $query .= " AND (books.title LIKE :text OR books.author LIKE :text OR books.publisher LIKE :text)";
        }

        if ($date) {
            $query .= " AND books.publication_date = :date";
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute(['text' => "%$text%", 'date' => $date]);
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($books);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>
