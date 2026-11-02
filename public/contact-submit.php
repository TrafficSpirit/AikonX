<?php
ini_set('display_errors', '0');
umask(0077);
require_once __DIR__ . '/contact-handler.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Content-Type: application/json; charset=utf-8');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); header('Allow: POST'); echo '{"accepted":false}'; exit; }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) { http_response_code(413); echo '{"accepted":false}'; exit; }
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && !in_array($origin, ['https://aikonx.com.au', 'https://www.aikonx.com.au'], true)) { http_response_code(403); echo '{"accepted":false}'; exit; }
$private = dirname(__DIR__) . '/.dapem';
$config = is_file($private . '/measurement.json') ? json_decode(file_get_contents($private . '/measurement.json'), true) : null;
if (!is_array($config) || !preg_match('/^[a-f0-9]{64}$/', $config['secret'] ?? '') || !preg_match('#^https://dapem\.toolsforscale\.com/api/measurement/server/[a-f0-9]{48}$#', $config['endpoint'] ?? '') || !function_exists('mail') || !function_exists('curl_init')) {
    http_response_code(503); echo '{"accepted":false,"error":"The enquiry service is temporarily unavailable."}'; exit;
}
// Limit public submissions without storing raw IP addresses or personal form contents.
$rateDir = $private . '/rate';
if (!is_dir($rateDir)) mkdir($rateDir, 0700, true);
$rate = fopen($rateDir . '/' . hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $config['secret']) . '.json', 'c+');
if (!$rate || !flock($rate, LOCK_EX)) { http_response_code(503); echo '{"accepted":false}'; exit; }
$window = json_decode(stream_get_contents($rate), true);
if (!$window || ($window['since'] ?? 0) < time() - 900) $window = ['since' => time(), 'count' => 0];
$window['count']++;
ftruncate($rate, 0); rewind($rate); fwrite($rate, json_encode($window)); flock($rate, LOCK_UN); fclose($rate);
if ($window['count'] > 10) { http_response_code(429); header('Retry-After: 900'); echo '{"accepted":false,"error":"Please wait before trying again."}'; exit; }
$send = function ($replyTo, $subject, $body) {
    return mail('hello@aikonx.com.au', $subject, $body, ['From' => 'hello@aikonx.com.au', 'Reply-To' => $replyTo, 'Content-Type' => 'text/plain; charset=UTF-8']);
};
$track = function ($event) use ($config) {
    $json = json_encode($event, JSON_UNESCAPED_SLASHES);
    $timestamp = (string)round(microtime(true) * 1000);
    $curl = curl_init($config['endpoint']);
    curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $json, CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 3, CURLOPT_TIMEOUT => 8, CURLOPT_FOLLOWLOCATION => false, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Dapem-Timestamp: ' . $timestamp, 'X-Dapem-Signature: ' . hash_hmac('sha256', $timestamp . '.' . $json, $config['secret'])]]);
    $body = curl_exec($curl); $status = curl_getinfo($curl, CURLINFO_HTTP_CODE); curl_close($curl);
    $result = is_string($body) ? json_decode($body, true) : null;
    return $status === 200 && !empty($result['accepted']);
};
try { list($status, $response) = aikxContact($_POST, $_SERVER, $config, $send, $track, $private . '/submissions'); }
catch (Throwable $error) { $status = 503; $response = ['accepted' => false, 'error' => 'The enquiry service is temporarily unavailable.']; }
http_response_code($status);
if ($status === 200 && !empty($response['accepted']) && strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') === false) { header('Location: /thank-you/', true, 303); exit; }
echo json_encode($response);
