import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const code=readFileSync(new URL('../public/contact-form.js',import.meta.url),'utf8');
function fixture({accepted=true,consent='granted',formPresent=true,valid=true}={}) {
  const events=[],requests=[],listeners={};
  const form={querySelector:selector=>selector.includes('bot-field')?{value:''}:selector.includes('note')?{style:{}}:null,checkValidity:()=>valid,reportValidity:()=>{},addEventListener:(name,fn)=>listeners[name]=fn,reset:()=>{}};
  const context={window:{addEventListener:()=>{},gtag:(...args)=>events.push({type:'ga',args}),dapemMeasurement:{setConsent:()=>{},track:(event,args)=>events.push({type:'dapem',event,args})}},document:{querySelector:()=>formPresent?form:null},location:{pathname:'/contact/',hash:''},localStorage:{getItem:()=>consent},crypto:{randomUUID:()=> '00000000-0000-4000-a000-000000000001'},URLSearchParams,FormData:class { *[Symbol.iterator](){yield ['name','Visitor'];yield ['email','visitor@example.test'];}},fetch:async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>({accepted,eventId:'00000000-0000-4000-a000-000000000001'})}}};
  runInNewContext(code,context);
  return {events,requests,submit:async()=>{listeners.submit?.({preventDefault(){}});await new Promise(r=>setImmediate(r));},context};
}
test('HTTP 200 without positive acceptance cannot create conversions',async()=>{const f=fixture({accepted:false});await f.submit();assert.equal(f.events.length,0);});
test('confirmed enquiries create observations without forwarding form contents',async()=>{const f=fixture();await f.submit();assert.equal(f.requests[0].url,'/contact-submit.php');assert.equal(f.events.length,2);assert.equal(f.events[1].event,'enquiry_submitted');assert.equal(JSON.stringify(f.events).includes('visitor@example.test'),false);});
test('consent denied still submits the enquiry without analytics',async()=>{const f=fixture({consent:'denied'});await f.submit();assert.equal(f.requests.length,1);assert.equal(f.events.length,0);});
test('invalid forms and direct thank-you visits cannot count as enquiries',async()=>{const invalid=fixture({valid:false});await invalid.submit();assert.equal(invalid.requests.length,0);assert.equal(invalid.events.length,0);const thankyou=fixture({formPresent:false});assert.equal(thankyou.events.length,0);});
