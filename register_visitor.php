<?php

header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);

    exit;

}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$name = trim($data["visitor_name"] ?? "");

$phone = trim($data["phone"] ?? "");

$flat = trim($data["flat_no"] ?? "");

$purpose = trim($data["purpose"] ?? "");


if (
    $name === "" ||
    $phone === "" ||
    $flat === "" ||
    $purpose === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "Please fill all required fields"
    ]);

    exit;

}


if (!preg_match("/^[0-9]{10}$/", $phone)) {

    echo json_encode([
        "success" => false,
        "message" => "Enter a valid 10-digit phone number"
    ]);

    exit;

}


$sql = "INSERT INTO visitors
        (visitor_name, phone, flat_no, purpose, status)
        VALUES (?, ?, ?, ?, 'Registered')";


$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssss",
    $name,
    $phone,
    $flat,
    $purpose
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Visitor registered successfully"
    ]);

}

else {

    echo json_encode([
        "success" => false,
        "message" => "Visitor registration failed"
    ]);

}


$stmt->close();

$conn->close();

?>