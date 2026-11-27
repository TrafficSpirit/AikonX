import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const code=readFileSync(new URL('../public/contact-form.js',import.meta.url),'utf8');
const BRANCH='AI Search & SEO';
function fixture({accepted=true,consent='granted',formPresent=true,valid=true,budget='1500-3000',term='yes',path='/contact/',session={},sessionBroken=false,referrer=''}={}) {
  const events=[],requests=[],listeners={},store={...session},hidden={};
  const mkSelect=(name,value)=>{const err={current:null};const box={querySelector:s=>s==='.field__error'?err.current:null,appendChild:e=>{err.current=e;}};
    const attrs={};return {name,id:'cf-'+name,required:true,value,parentNode:box,focused:false,focus(){this.focused=true;},setAttribute:(k,v)=>attrs[k]=v,getAttribute:k=>attrs[k],removeAttribute:k=>{delete attrs[k];},attrs,err};};
  const selects={budget_band:mkSelect('budget_band',budget),term_openness:mkSelect('term_openness',term)};
  const form={
    querySelector:selector=>{
      if(selector.includes('bot-field'))return {value:''};
      if(selector.includes('note'))return {style:{}};
      const m=selector.match(/\[name="([a-z_]+)"\]/);
      if(m&&selects[m[1]])return selects[m[1]];
      if(m&&hidden[m[1]])return hidden[m[1]];
      return null;},
    appendChild:el=>{hidden[el.name]=el;},
    checkValidity:()=>valid,reportValidity:()=>{},addEventListener:(name,fn)=>listeners[name]=fn,reset:()=>{for(const k in hidden)hidden[k].value='';}};
  const context={window:{addEventListener:()=>{},gtag:(...args)=>events.push({type:'ga',args}),dapemMeasurement:{setConsent:()=>{},track:(event,args)=>events.push({type:'dapem',event,args})}},
    document:{referrer,querySelector:()=>formPresent?form:null,createElement:tag=>({tagName:tag,setAttribute(k,v){this[k]=v;}})},
    location:{pathname:path,hash:''},localStorage:{getItem:()=>consent},
    crypto:{randomUUID:()=> '00000000-0000-4000-a000-000000000001'},URLSearchParams,URL,
    FormData:class { *[Symbol.iterator](){yield ['name','Visitor'];yield ['email','visitor@example.test'];yield ['company','Acme Co'];yield ['message','Secret message text'];yield ['budget_band',selects.budget_band.value];yield ['term_openness',selects.term_openness.value];for(const k in hidden)yield [k,hidden[k].value];}},
    fetch:async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>({accepted,eventId:'00000000-0000-4000-a000-000000000001'})}}};
  if(!sessionBroken)context.sessionStorage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v;}};
  runInNewContext(code,context);
  return {events,requests,store,hidden,selects,submit:async()=>{listeners.submit?.({preventDefault(){}});await new Promise(r=>setImmediate(r));},context};
}
const params=f=>new URLSearchParams(f.requests[0].options.body);
test('HTTP 200 without positive acceptance cannot create conversions',async()=>{const f=fixture({accepted:false});await f.submit();assert.equal(f.events.length,0);});
test('confirmed enquiries create observations without forwarding form contents',async()=>{const f=fixture();await f.submit();assert.equal(f.requests[0].url,'/contact-submit.php');assert.equal(f.events.length,2);assert.equal(f.events[1].event,'enquiry_submitted');assert.equal(JSON.stringify(f.events).includes('visitor@example.test'),false);});
test('consent denied still submits the enquiry without analytics',async()=>{const f=fixture({consent:'denied'});await f.submit();assert.equal(f.requests.length,1);assert.equal(f.events.length,0);});
test('invalid forms and direct thank-you visits cannot count as enquiries',async()=>{const invalid=fixture({valid:false});await invalid.submit();assert.equal(invalid.requests.length,0);assert.equal(invalid.events.length,0);const thankyou=fixture({formPresent:false});assert.equal(thankyou.events.length,0);});

test('overlapping submits cannot double count',async()=>{const f=fixture();await Promise.all([f.submit(),f.submit()]);assert.equal(f.requests.length,1);assert.equal(f.events.length,2);});
test('missing budget blocks the submit, shows an error and moves focus to it',async()=>{const f=fixture({budget:''});await f.submit();assert.equal(f.requests.length,0);assert.equal(f.events.length,0);const s=f.selects.budget_band;assert.equal(s.focused,true);assert.equal(s.attrs['aria-invalid'],'true');assert.equal(s.err.current.role,'alert');assert.match(s.err.current.textContent,/monthly marketing budget/);assert.equal(s.attrs['aria-describedby'],s.err.current.id);assert.equal(f.selects.term_openness.focused,false);});
test('missing 12-month answer is also required and focused',async()=>{const f=fixture({term:''});await f.submit();assert.equal(f.requests.length,0);assert.equal(f.selects.term_openness.focused,true);});
test('hidden fields: first page of the session, path only, referrer without query',async()=>{const f=fixture({path:'/blog/other/',session:{aikx_landing_page:'/services/seo/'},referrer:'https://www.google.com/search?q=secret#x'});await f.submit();const p=params(f);assert.equal(p.get('landing_page'),'/services/seo/');assert.equal(p.get('referrer_page'),'https://www.google.com/search');assert.equal(p.get('branch'),BRANCH);assert.equal(p.get('budget_band'),'1500-3000');assert.equal(p.get('term_openness'),'yes');});
test('landing page is stored once per session as a path only',()=>{const f=fixture({path:'/contact/'});assert.equal(f.store.aikx_landing_page,'/contact/');const g=fixture({path:'/x/',session:{aikx_landing_page:'/first/'}});assert.equal(g.store.aikx_landing_page,'/first/');});
test('branch is set for every listed prefix and empty otherwise',()=>{
  const listed=['/services/ai-search-optimization/','/services/ai-search-optimisation/','/services/generative-engine-optimisation/','/services/answer-engine-optimisation/','/services/chatgpt-seo/','/pricing/seo-packages/','/ai-visibility-audit/','/services/seo/','/services/local-seo/','/blog/generative-engine-optimisation/','/blog/get-cited-in-google-ai-overviews/','/blog/ai-visibility-reports-explained/','/blog/brand-ai-overviews-right-column/','/blog/deepseek-search-api-authority-tiers/','/blog/ai-visibility-audit/'];
  for(const p of listed)assert.equal(fixture({session:{aikx_landing_page:p}}).hidden.branch.value,BRANCH,p);
  assert.equal(fixture({session:{aikx_landing_page:'/services/seo/audit/'}}).hidden.branch.value,BRANCH);
  for(const p of ['/','/contact/','/services/google-ads/','/blog/other-post/','/services/seo-tools/'])assert.equal(fixture({session:{aikx_landing_page:p}}).hidden.branch.value,'',p);});
test('blocked sessionStorage falls back safely and the form still works',async()=>{const f=fixture({sessionBroken:true,path:'/contact/'});await f.submit();assert.equal(f.requests.length,1);assert.equal(params(f).get('landing_page'),'/contact/');});
test('generate_lead carries budget_band, branch and landing_page and no personal data',async()=>{const f=fixture({session:{aikx_landing_page:'/pricing/seo-packages/'}});await f.submit();const ga=f.events.find(e=>e.type==='ga');assert.deepEqual(JSON.parse(JSON.stringify(ga.args)),['event','generate_lead',{form_name:'contact',form_page:'/contact/',budget_band:'1500-3000',branch:BRANCH,landing_page:'/pricing/seo-packages/'}]);const all=JSON.stringify(f.events);for(const s of ['visitor@example.test','Visitor','Acme Co','Secret message text'])assert.equal(all.includes(s),false,s);
  console.log('generate_lead payload:',JSON.stringify(ga.args));});
test('generate_lead uses empty strings when there is no branch',async()=>{const f=fixture({session:{aikx_landing_page:'/'}});await f.submit();assert.equal(f.events.find(e=>e.type==='ga').args[2].branch,'');});
test('Dapem enquiry_submitted event carries no budget, landing or branch data',async()=>{const f=fixture({session:{aikx_landing_page:'/services/seo/'}});await f.submit();const d=f.events.find(e=>e.type==='dapem');assert.equal(/budget|landing|branch|referrer/.test(JSON.stringify(d)),false);});
test('consent gating of generate_lead is unchanged',async()=>{const f=fixture({consent:'denied'});await f.submit();assert.equal(f.events.some(e=>e.type==='ga'),false);});
