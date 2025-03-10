<?php
// Ensure the CSV file exists
$file = 'analytics.csv';
if (!file_exists($file)) {
    $header = "timestamp,page,ip\n";
    file_put_contents($file, $header);
}

// Get visit data
$timestamp = date('Y-m-d H:i:s');
$page = $_POST['page'] ?? 'unknown';
$ip = $_SERVER['REMOTE_ADDR'];

// Append visit data to CSV
$visit_data = "$timestamp,$page,$ip\n";
file_put_contents($file, $visit_data, FILE_APPEND);

echo json_encode(['status' => 'success']);

