<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://jdjmv.edu.np');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Simple router
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove '/be' from the beginning of the request
$request = preg_replace('/^\/be/', '', $request);

// Basic routing
switch($request) {
    case '/':
        echo json_encode(['message' => 'JDJMV API Server']);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}
