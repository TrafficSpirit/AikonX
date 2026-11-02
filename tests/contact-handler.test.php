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
  echo "Contact acceptance, consent, deduplication, collector retries and PII isolation pass.\n";
} finally {
  foreach(glob($dir.'/*.json')?:[] as $file) unlink($file);
  if(is_dir($dir)) rmdir($dir);
}
