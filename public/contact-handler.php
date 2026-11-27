<?php
/* Server-side accepted enquiries only. Personal form contents go to the site owner, never Dapem. */
/* Allowed answers for the enquiry qualifiers: submitted value => label used in the email. */
function aikxBudgetOptions(): array { return ['under-1500' => 'Under $1,500', '1500-3000' => '$1,500–$3,000', '3000-6000' => '$3,000–$6,000', '6000-plus' => '$6,000+']; }
function aikxTermOptions(): array { return ['yes' => 'Yes', 'maybe' => 'Maybe', 'no' => 'No']; }
/* Single-line, trimmed and length-capped text for the labelled email lines. */
function aikxLine($value, int $max = 300): string {
    if (!is_scalar($value)) return '';
    $text = trim((string)preg_replace('/[\x00-\x1F\x7F]+/', ' ', (string)$value));
    return function_exists('mb_substr') ? mb_substr($text, 0, $max, 'UTF-8') : substr($text, 0, $max);
}
function aikxContact(array $post, array $server, array $config, callable $sendMail, callable $track, string $storage): array {
    $id = (string)($post['dapem_event_id'] ?? '');
    if (!empty($post['bot-field'])) return [200, ['accepted' => false, 'ignored' => true]];
    $name = trim((string)($post['name'] ?? ''));
    $email = trim((string)($post['email'] ?? ''));
    $company = trim((string)($post['company'] ?? ''));
    $message = trim((string)($post['message'] ?? ''));
    $budgetOptions = aikxBudgetOptions(); $termOptions = aikxTermOptions();
    $budget = is_scalar($post['budget_band'] ?? '') ? trim((string)($post['budget_band'] ?? '')) : '?';
    $term = is_scalar($post['term_openness'] ?? '') ? trim((string)($post['term_openness'] ?? '')) : '?';
    if (($budget !== '' && !isset($budgetOptions[$budget])) || ($term !== '' && !isset($termOptions[$term])))
        return [422, ['accepted' => false, 'error' => 'Please check your budget and engagement answers.']];
    $landing = aikxLine($post['landing_page'] ?? '');
    $referrer = aikxLine($post['referrer_page'] ?? '');
    $branch = aikxLine($post['branch'] ?? '');
    if (!$name || strlen($name) > 200 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || preg_match('/[\r\n]/', $email) || strlen($company) > 300 || strlen($message) > 5000)
        return [422, ['accepted' => false, 'error' => 'Please check your name, email and message.']];
    if (!$id) { $hex = bin2hex(random_bytes(16)); $id = substr($hex,0,8).'-'.substr($hex,8,4).'-4'.substr($hex,13,3).'-a'.substr($hex,17,3).'-'.substr($hex,20); }
    if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i', $id)) return [400, ['accepted' => false, 'error' => 'Invalid submission identifier.']];
    if (!is_dir($storage) && !mkdir($storage, 0700, true)) return [503, ['accepted' => false, 'error' => 'The enquiry service is temporarily unavailable.']];
    $lock = fopen($storage . '/' . $id . '.json', 'c+');
    if (!$lock || !flock($lock, LOCK_EX)) return [503, ['accepted' => false]];
    try {
        $existing = json_decode(stream_get_contents($lock), true);
        if (!empty($existing['accepted'])) {
            if (($post['dapem_analytics_consent'] ?? '') === 'granted' && empty($existing['trackingRecorded']) && !empty($existing['trackingEvent'])) {
                $existing['trackingRecorded'] = (bool)$track($existing['trackingEvent']);
                ftruncate($lock,0); rewind($lock); fwrite($lock,json_encode($existing)); fflush($lock);
            }
            unset($existing['trackingEvent']);
            return [200, $existing];
        }
        $testId = (string)($post['dapem_test_id'] ?? '');
        if ($testId && !preg_match('/^[a-f0-9-]{36}$/i', $testId)) return [400, ['accepted' => false, 'error' => 'Invalid tracking test identifier.']];
        $subject = ($testId ? '[Dapem tracking test] ' : '') . 'Website enquiry';
        $body = "Name: " . $name . "\nEmail: " . $email . "\nCompany: " . $company
            . "\nMonthly budget: " . ($budget !== '' ? $budgetOptions[$budget] : 'Not provided')
            . "\nOpen to 12 months: " . ($term !== '' ? $termOptions[$term] : 'Not provided')
            . "\nLanding page: " . $landing . "\nReferrer: " . $referrer . "\nBranch: " . $branch
            . "\n\n" . $message;
        if (!$sendMail($email, $subject, $body)) return [502, ['accepted' => false, 'error' => 'Your enquiry could not be accepted. Please email hello@aikonx.com.au.']];
        $path = (string)($post['dapem_path'] ?? '/contact/');
        if (!in_array($path, ['/', '/contact', '/contact/'], true)) $path = '/contact/';
        $event = ['eventId' => $id, 'event' => 'enquiry_received', 'path' => $path, 'formId' => 'contact', 'channel' => 'unknown', 'occurredAt' => gmdate('Y-m-d\TH:i:s\Z')];
        if ($testId) $event['testId'] = $testId;
        $recorded = false;
        if (($post['dapem_analytics_consent'] ?? '') === 'granted') $recorded = (bool)$track($event);
        $result = ['accepted' => true, 'eventId' => $id, 'trackingRecorded' => $recorded];
        $stored = $result;
        if (($post['dapem_analytics_consent'] ?? '') === 'granted' && !$recorded) $stored['trackingEvent'] = $event;
        ftruncate($lock, 0); rewind($lock); fwrite($lock, json_encode($stored)); fflush($lock);
        return [200, $result];
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}
