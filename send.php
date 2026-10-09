<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

if (!empty($_POST['company_website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$interest = trim((string)($_POST['interest'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Name and phone are required']);
  exit;
}

$to = 'hello@qusaraengg.com'; /* UPDATE after client review */
$subject = 'New Qusaraengg website enquiry';
$body = "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nInterest: {$interest}\nMessage:\n{$message}\n";
$from = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : $to;
$headers = 'From: ' . $from . "\r\n" . 'Reply-To: ' . $from . "\r\n";

$sent = @mail($to, $subject, $body, $headers);

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail not sent']);
  exit;
}

echo json_encode(['ok' => true]);
