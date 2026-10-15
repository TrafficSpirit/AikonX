document.write('<script src="/site-nav.js"><\/script>');
(function(){

var cf=document.querySelector('.contact-form');if(cf){cf.addEventListener('submit',function(e){e.preventDefault();var n=cf.querySelector('.contact-form__note');if(n)n.hidden=false;cf.reset();});}})();
