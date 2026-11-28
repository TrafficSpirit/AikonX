<?php
require __DIR__ . '/../public/contact-handler.php';
function check($condition, $message) { if (!$condition) throw new Exception($message); }
$dir = sys_get_temp_dir().'/aikx-contact-'.bin2hex(random_bytes(8));
$mailCount = 0; $events = [];
$send = function($reply,$subject,$body) use (&$mailCount) { $mailCount++; return true; };
$track = function($event) use (&$events) { $events[]=$event; return true; };
$base = ['name'=>'Test Visitor','email'=>'test@example.test','message'=>'Labelled local test only','dapem_event_id'=>'00000000-0000-4000-a000-000000000001','dapem_analytics_consent'=>'granted','dapem_path'=>'/contact/'];
try {
  $bad=$base; $bad['email']="a@example.test\r\nBcc: other@example.test";
  check(aikxContact($bad,[],[],$send,$track,$dir)[0]===422,'Reject header injection');
  check($mailCount===0 && count($events)===0,'Invalid forms do not send or track');
  $trap=$base; $trap['bot-field']='bot';
  check(aikxContact($trap,[],[],$send,$track,$dir)[1]['accepted']===false,'Honeypots do not count');
  $failed=aikxContact($base,[],[],function(){return false;},$track,$dir);
  check($failed[0]===502 && count($events)===0,'A failed mail handoff cannot create an enquiry event');
  $ok=aikxContact($base,[],[],$send,$track,$dir);
  check($ok[1]['accepted'] && $ok[1]['trackingRecorded'],'Accepted mail creates a signed-event candidate');
  aikxContact($base,[],[],$send,$track,$dir);
  check($mailCount===1 && count($events)===1,'Retries cannot send duplicate mail or events');
  check(!isset($events[0]['email']) && !isset($events[0]['name']) && !isset($events[0]['message']),'Dapem event contains no personal form fields');
  $denied=$base; $denied['dapem_event_id']='00000000-0000-4000-a000-000000000002'; $denied['dapem_analytics_consent']='denied';
  aikxContact($denied,[],[],$send,$track,$dir);
  check($mailCount===2 && count($events)===1,'Consent denied still delivers enquiries but does not track');
  $retry=$base; $retry['dapem_event_id']='00000000-0000-4000-a000-000000000003'; $retry['dapem_test_id']='00000000-0000-4000-a000-000000000099';
  aikxContact($retry,[],[],$send,function(){return false;},$dir);
  $retried=aikxContact($retry,[],[],$send,$track,$dir);
  check($mailCount===3 && $retried[1]['trackingRecorded'],'Collector failures retry without resending the enquiry');
  check($events[1]['testId']===$retry['dapem_test_id'],'Labelled tests retain their collector challenge');
  // Qualifier fields: allowlist, email body labels, length caps, no leakage to tracking.
  $bodies = []; $sendBody = function($reply,$subject,$body) use (&$bodies) { $bodies[] = $body; return true; };
  $before = count($events);
  $q = $base; $q['dapem_event_id'] = '00000000-0000-4000-a000-000000000010';
  $q += ['budget_band'=>'1500-3000','term_openness'=>'maybe','landing_page'=>'/services/seo/','referrer_page'=>'https://www.google.com/search','branch'=>'AI Search & SEO'];
  $r = aikxContact($q,[],[],$sendBody,$track,$dir);
  check($r[0]===200 && $r[1]['accepted'],'Valid qualifier answers are accepted');
  $b = $bodies[0];
  check(strpos($b,"\nMonthly budget: \$1,500–\$3,000\n")!==false,'Email carries the budget label');
  check(strpos($b,"\nOpen to 12 months: Maybe\n")!==false,'Email carries the 12-month answer');
  check(strpos($b,"\nLanding page: /services/seo/\n")!==false,'Email carries the landing page');
  check(strpos($b,"\nReferrer: https://www.google.com/search\n")!==false,'Email carries the referrer');
  check(strpos($b,"\nBranch: AI Search & SEO\n")!==false,'Email carries the branch');
  echo "--- delivered email body ---\n" . $b . "\n--- end ---\n";
  check(count($events)===$before+1 && !preg_match('/budget|landing|branch|referrer/i', json_encode($events[count($events)-1])),'Tracking event carries no qualifier data');
  foreach ([['budget_band','free'],['budget_band','under-1500'."\n".'Bcc: x'],['budget_band',['x']],['term_openness','sometimes']] as $i => $case) {
    $u = $base; $u['dapem_event_id'] = sprintf('00000000-0000-4000-a000-0000000001%02d', $i); $u[$case[0]] = $case[1];
    $n = count($bodies); $res = aikxContact($u,[],[],$sendBody,$track,$dir);
    check($res[0]===422 && count($bodies)===$n,'Unknown '.$case[0].' is rejected with 422 and nothing is sent');
  }
  $long = $base; $long['dapem_event_id'] = '00000000-0000-4000-a000-000000000020';
  $long['landing_page'] = "/a\r\nBcc: x@example.test" . str_repeat('z', 500); $long['referrer_page'] = str_repeat('r', 500); $long['branch'] = "B\nC";
  aikxContact($long,[],[],$sendBody,$track,$dir);
  $lb = end($bodies); $lines = explode("\n", $lb);
  $lp = array_values(array_filter($lines, function($l){ return strpos($l,'Landing page: ')===0; }));
  check(count($lp)===1 && strlen($lp[0])<=300+strlen('Landing page: '),'Landing page is capped and single-line');
  check(strpos($lb,"\nBcc:")===false && strpos($lb,"\nReferrer: ".str_repeat('r',300)."\n")!==false && strpos($lb,"\nBranch: B C\n")!==false,'Newlines stripped and referrer capped at 300');
  check(strpos($lb,"\nMonthly budget: Not provided\n")!==false,'Missing answers are labelled Not provided');
  echo "Contact acceptance, consent, deduplication, collector retries and PII isolation pass.\n";
} finally {
  foreach(glob($dir.'/*.json')?:[] as $file) unlink($file);
  if(is_dir($dir)) rmdir($dir);
}
