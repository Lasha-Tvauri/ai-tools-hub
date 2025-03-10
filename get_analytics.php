<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$file = 'analytics.csv';
if (!file_exists($file)) {
    http_response_code(500);
    echo json_encode(['error' => 'Analytics file not found']);
    exit;
}

$data = array_map('str_getcsv', file($file));
$header = array_shift($data);

if (empty($data)) {
    http_response_code(500);
    echo json_encode(['error' => 'No data found in analytics file']);
    exit;
}

$total_visits = count($data);
$unique_visitors = count(array_unique(array_column($data, 2)));

$visits_per_page = [];
$visits_per_day = [];

foreach ($data as $row) {
    $page = $row[1];
    $date = date('Y-m-d', strtotime($row[0]));

    if (!isset($visits_per_page[$page])) {
        $visits_per_page[$page] = 0;
    }
    $visits_per_page[$page]++;

    if (!isset($visits_per_day[$date])) {
        $visits_per_day[$date] = 0;
    }
    $visits_per_day[$date]++;
}

// Sort and limit to last 30 days
krsort($visits_per_day);
$visits_per_day = array_slice($visits_per_day, 0, 30, true);
ksort($visits_per_day);

echo json_encode([
    'totalVisits' => $total_visits,
    'uniqueVisitors' => $unique_visitors,
    'visitsPerPage' => $visits_per_page,
    'visitsPerDay' => $visits_per_day
]);

