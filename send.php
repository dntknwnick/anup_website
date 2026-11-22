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
$learnerType = trim((string)($_POST['learner_type'] ?? ''));
$interest = trim((string)($_POST['interest'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$allowedLearnerTypes = ['Student', 'Working professional', 'Diploma holder', 'Career switcher'];
$allowedInterests = [
  'Full 3-month programme',
  'PLC & HMI',
  'Electrical & Automation',
  'Industrial Robotics',
  'AI & Machine Vision',
];
if (
  $name === '' ||
  !preg_match('/^(?:\+?91[\s-]?)?[6-9][0-9]{9}$/', $phone) ||
  !in_array($learnerType, $allowedLearnerTypes, true) ||
  !in_array($interest, $allowedInterests, true) ||
  ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))
) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Check the required admissions details and try again']);
  exit;
}

$config = json_decode((string)file_get_contents(__DIR__ . '/site-config.json'), true);
if (!is_array($config) || empty($config['email'])) {
  error_log('Site configuration is missing the admissions email.');
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Admissions enquiry configuration is missing']);
  exit;
}

$to = $config['email'];
$subject = 'New academy enquiry';
$body = "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nI am a: {$learnerType}\nInterested in: {$interest}\nMessage:\n{$message}\n";
$from = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : $to;
$headers = 'From: ' . $from . "\r\n" . 'Reply-To: ' . $from . "\r\n";

$sent = mail($to, $subject, $body, $headers);

if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail not sent']);
  exit;
}

echo json_encode(['ok' => true]);
