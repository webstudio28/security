<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function inquiry_log(string $line): void
{
    $dir = __DIR__ . '/private';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $file = $dir . '/inquiry-log.txt';
    $stamp = date('Y-m-d H:i:s');
    @file_put_contents($file, '[' . $stamp . '] ' . $line . "\n", FILE_APPEND | LOCK_EX);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

function field(string $key, int $max): string
{
    $value = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    $value = str_replace(["\r", "\n", "\0"], ' ', $value);
    $value = trim($value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

// Honeypot — avoid names like "company" (browsers autofill them).
if (field('website_url_hp', 200) !== '') {
    inquiry_log('honeypot blocked ip=' . ($_SERVER['REMOTE_ADDR'] ?? '-'));
    echo json_encode(['ok' => true, 'redirect' => '/blagodarim/']);
    exit;
}

$name = field('name', 120);
$phone = field('phone', 40);
$interest = field('interest', 160);
$message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';
$message = str_replace("\0", '', $message);
if (function_exists('mb_substr')) {
    $message = mb_substr($message, 0, 2000, 'UTF-8');
} else {
    $message = substr($message, 0, 2000);
}

if ($name === '' || $phone === '') {
    inquiry_log('validation failed name/phone ip=' . ($_SERVER['REMOTE_ADDR'] ?? '-'));
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$to = 'info@leadersecurity.bg';
$subject = '=?UTF-8?B?' . base64_encode('Запитване от leadersecurity.bg') . '?=';
$body = "Име: {$name}\nТелефон: {$phone}\n";
if ($interest !== '') {
    $body .= "Услуга: {$interest}\n";
}
if ($message !== '') {
    $body .= "\n{$message}\n";
}
$body .= "\nИзпратено от формата на сайта.\n";
$body .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";
$body .= 'Дата: ' . date('Y-m-d H:i:s') . "\n";

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: info@leadersecurity.bg',
]);

$sent = @mail($to, $subject, $body, $headers, '-f info@leadersecurity.bg');

inquiry_log(
    ($sent ? 'mail() OK' : 'mail() FAIL')
    . ' to=' . $to
    . ' name=' . $name
    . ' phone=' . $phone
    . ' interest=' . ($interest !== '' ? $interest : '-')
    . ' ip=' . ($_SERVER['REMOTE_ADDR'] ?? '-')
);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

echo json_encode(['ok' => true, 'redirect' => '/blagodarim/']);
