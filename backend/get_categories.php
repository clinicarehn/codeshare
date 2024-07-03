<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'db.php';

$sql = "SELECT * FROM categories";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit();
}

$categories = [];
while($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

echo json_encode($categories);
$conn->close();