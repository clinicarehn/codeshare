<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];

// Asegúrate de escapar los valores para evitar SQL Injection
$name = $conn->real_escape_string($name);

// Verificar si ya existe una categoría con el mismo nombre
$checkSql = "SELECT * FROM categories WHERE name = '$name'";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    echo "Error: Ya existe una categoría con este nombre.";
} else {
    // Insertar la nueva categoría
    $sql = "INSERT INTO categories (name) VALUES ('$name')";

    if ($conn->query($sql) === TRUE) {
        echo "New category created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
