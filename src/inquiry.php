<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

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

if (field('company', 200) !== '') {
    echo json_encode(['ok' => true]);
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

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: info@leadersecurity.bg',
]);

$sent = mail($to, $subject, $body, $headers, '-f info@leadersecurity.bg');
if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

echo json_encode(['ok' => true]);
