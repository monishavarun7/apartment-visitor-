
<?php
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$action = $_GET["action"] ?? "";

if ($action === "visitors") {

    $sql = "SELECT id, visitor_name, phone, flat_no, purpose,
                   check_in, check_out, status, created_at
            FROM visitors
            ORDER BY id DESC";

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode([
            "success" => false,
            "message" => "Database query failed: " . $conn->error,
            "data" => []
        ]);
        exit;
    }

    $visitors = [];

    while ($row = $result->fetch_assoc()) {
        $visitors[] = $row;
    }

    echo json_encode([
        "success" => true,
        "message" => "Visitors loaded successfully",
        "data" => $visitors
    ]);

    exit;
}

if ($action === "stats") {

    $sql = "SELECT
                COUNT(*) AS totalVisitors,
                SUM(CASE WHEN DATE(created_at) = CURDATE()
                    THEN 1 ELSE 0 END) AS todayVisitors,
                SUM(CASE WHEN status = 'Inside'
                    THEN 1 ELSE 0 END) AS insideVisitors,
                SUM(CASE WHEN status = 'Checked Out'
                    THEN 1 ELSE 0 END) AS checkedOut
            FROM visitors";

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode([
            "success" => false,
            "message" => "Statistics query failed: " . $conn->error,
            "data" => []
        ]);
        exit;
    }

    $stats = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "message" => "Statistics loaded successfully",
        "data" => [
            "totalVisitors" => (int)($stats["totalVisitors"] ?? 0),
            "todayVisitors" => (int)($stats["todayVisitors"] ?? 0),
            "insideVisitors" => (int)($stats["insideVisitors"] ?? 0),
            "checkedOut" => (int)($stats["checkedOut"] ?? 0)
        ]
    ]);

    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Invalid action",
    "data" => []
]);

$conn->close();
?>
