
<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? intval($data["id"]) : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid visitor ID"
    ]);
    exit;
}

// Update visitor status
$sql = "UPDATE visitors
        SET status = 'Inside',
            check_in = NOW(),
            check_out = NULL
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "SQL preparation failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Visitor checked in successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Check-in failed: " . $stmt->error
    ]);

}

$stmt->close();
$conn->close();

?>
