<?php
include 'db.php';

$sql = "SELECT codes.*, categories.name AS category_name FROM codes LEFT JOIN categories ON codes.category_id = categories.id";
$result = $conn->query($sql);

$codes = [];
while($row = $result->fetch_assoc()) {
    $codes[] = $row;
}

echo json_encode($codes);
$conn->close();