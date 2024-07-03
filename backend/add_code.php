<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'];
$code = $data['code'];
$example = $data['example'];
$category_id = $data['category_id'];

// Asegúrate de escapar los valores para evitar SQL Injection
$title = $conn->real_escape_string($title);
$code = $conn->real_escape_string($code);
$example = $conn->real_escape_string($example);
$category_id = (int)$category_id;

// Verificar si ya existe un código con el mismo título en la misma categoría
$checkSql = "SELECT * FROM codes WHERE title = '$title' AND category_id = $category_id";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    echo "Error: Ya existe un código con el mismo título en esta categoría.";
} else {
    // Insertar el nuevo código
    $sql = "INSERT INTO codes (title, code, example, category_id) VALUES ('$title', '$code', '$example', $category_id)";

    if ($conn->query($sql) === TRUE) {
        echo "New code created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();