
<?php

header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data["id"]) ? intval($data["id"]) : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid visitor ID."
    ]);
    exit;
}

$sql = "UPDATE visitors
        SET status = 'Checked Out',
            check_out = NOW()
        WHERE id = ?
        AND status = 'Inside'";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Visitor checked out successfully!"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Visitor is not currently inside."
        ]);

    }

} else {

    echo json_encode([
        "success" => false,
        "message" => "Check-out failed."
    ]);

}

$stmt->close();
$conn->close();

?>

