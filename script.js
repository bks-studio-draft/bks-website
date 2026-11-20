(function(){
var H=document.documentElement;
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
/* header */
var hdr=$('.hdr'),hero=$('.hero:not(.cover)'),lastY=0,tick=false;
function onScroll(){tick=false;var y=window.scrollY||0,hh=hero?hero.offsetHeight-80:0;
 if(hdr){hdr.classList.toggle('over',!!hero&&y<hh);hdr.classList.toggle('solid',hero?y>=hh:y>30);
  if(y>600&&y>lastY+6&&!document.body.classList.contains('menu-open'))hdr.classList.add('hide');else if(y<lastY-6||y<600)hdr.classList.remove('hide')}
 lastY=y}
window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
/* menu */
var menu=$('.menu');
$$('[data-menu]').forEach(function(b){b.addEventListener('click',function(){var o=!menu.classList.contains('open');menu.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);
 $$('ul a',menu).forEach(function(a,k){a.style.transitionDelay=o?(0.18+k*0.05)+'s':'0s'});b.setAttribute('aria-expanded',o)})});
document.addEventListener('keydown',function(e){if(e.key=='Escape'&&menu&&menu.classList.contains('open'))$('[data-menu]').click()});
/* text rise (images never wait) */
var rs=$$('.rise');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
 rs.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in');else io.observe(el)})}else rs.forEach(function(el){el.classList.add('in')});
/* reels */
$$('.reel').forEach(function(rl){var t=$('.track',rl),bar=$('.bar i',rl);
 function upd(){var m=t.scrollWidth-t.clientWidth;var w=Math.max(.08,t.clientWidth/t.scrollWidth);if(bar){bar.style.width=(w*100)+'%';bar.style.transform='translateX('+(m>0?(t.scrollLeft/m)*(1/w-1)*100:0)+'%)'}}
 t.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});window.addEventListener('resize',upd);upd();
 $$('[data-dir]',rl).forEach(function(b){b.addEventListener('click',function(){t.scrollBy({left:(+b.dataset.dir)*t.clientWidth*.8,behavior:'smooth'})})});
 var down=false,sx=0,sl=0,moved=0;
 t.addEventListener('pointerdown',function(e){if(e.pointerType!='mouse')return;down=true;moved=0;sx=e.clientX;sl=t.scrollLeft});
 window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=1;t.classList.add('drag')}t.scrollLeft=sl-dx});
 window.addEventListener('pointerup',function(){if(!down)return;down=false;setTimeout(function(){t.classList.remove('drag')},0)});
 t.addEventListener('click',function(e){if(moved){e.preventDefault();moved=0}},true)});
/* stories filter */
var fl=$('.filters[data-filter]');if(fl){var cards=$$('.grid .card');
 $$('button',fl).forEach(function(b){b.addEventListener('click',function(){$$('button',fl).forEach(function(x){x.setAttribute('aria-pressed',x==b)});var c=b.dataset.c;
  cards.forEach(function(k){k.hidden=!(c=='all'||k.dataset.c==c)});if(history.replaceState)history.replaceState(null,'',c=='all'?location.pathname:'#'+c)})});
 var MAP={weddings:'W',mitzvahs:'M',engagements:'E',portraits:'P',all:'all'};function applyHash(){var h=location.hash.slice(1);h=MAP[h]||h;var b=h?$('button[data-c="'+h+'"]',fl):$('button[data-c="all"]',fl);if(b)b.click()}applyHash();window.addEventListener('hashchange',applyHash)}
/* shared-element morph into a story (View Transitions) */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-vt]');if(!a)return;var p=$('.ph',a);if(p)p.style.viewTransitionName='lead'});
window.addEventListener('pageshow',function(){$$('a[data-vt] .ph').forEach(function(p){p.style.viewTransitionName=''})});
/* lightbox */
var items=$$('[data-lb]');if(items.length){var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Photo viewer');
 lb.innerHTML='<div class="bar"><span class="c"></span><button type="button" class="x">Close</button></div><img alt=""><button type="button" class="pv" aria-label="Previous">&#8592;</button><button type="button" class="nx" aria-label="Next">&#8594;</button>';
 document.body.appendChild(lb);var im=$('img',lb),cn=$('.c',lb),cur=0,open=false;
 function show(i){cur=(i+items.length)%items.length;var a=items[cur];im.style.opacity=.15;var n=new Image();n.onload=function(){im.src=n.src;im.style.opacity=1};n.src=a.getAttribute('href');cn.textContent='';
  var nx=new Image();nx.src=items[(cur+1)%items.length].getAttribute('href')}
 function openAt(i){open=true;lb.classList.add('open');document.body.style.overflow='hidden';show(i);try{history.pushState({lb:1},'')}catch(e){}}
 function close(fromPop){if(!open)return;open=false;lb.classList.remove('open');document.body.style.overflow='';if(!fromPop)try{history.back()}catch(e){}}
 items.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();openAt(i)})});
 $('.x',lb).onclick=function(){close()};$('.pv',lb).onclick=function(){show(cur-1)};$('.nx',lb).onclick=function(){show(cur+1)};
 lb.addEventListener('click',function(e){if(e.target==lb)close()});
 window.addEventListener('popstate',function(){if(open)close(true)});
 document.addEventListener('keydown',function(e){if(!open)return;if(e.key=='Escape')close();if(e.key=='ArrowRight')show(cur+1);if(e.key=='ArrowLeft')show(cur-1)});
 var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))})}
/* inquiry -> email */
var f=$('#inquiry');if(f)f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f),miss=['name','email','date','msg'].filter(function(k){return !String(d.get(k)||'').trim()});
 var note=$('.note',f);if(miss.length){note.textContent='Please add your name, email, date and a short message.';return}
 var body=['Name: '+d.get('name'),'Email: '+d.get('email'),'Phone: '+(d.get('phone')||''),'Event date: '+d.get('date'),'Venue: '+(d.get('venue')||''),'Event type: '+(d.get('type')||''),'Event size: '+(d.get('size')||''),'Anticipated budget: '+(d.get('budget')||''),'Working with a planner: '+(d.get('planner')||''),'How did you hear about us: '+(d.get('ref')||''),'',d.get('msg')].join('\n');
 location.href='mailto:info@benjaminkornstudio.com?subject='+encodeURIComponent('Inquiry: '+(d.get('type')||'Event')+' on '+d.get('date'))+'&body='+encodeURIComponent(body);note.textContent='Your email app is opening with everything filled in.'});

/* v9 chapters carousel */
$$('[data-cx]').forEach(function(cx){var tr=$('.cx-track',cx),sl=$$('.cx-slide',cx),tb=$$('.cx-tab',cx),pv=$('.cx-arrow.prev',cx),nx=$('.cx-arrow.next',cx),bar=$('.cx-bar i',cx),cur=0;
 function idx(){return Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth))}
 function mark(i){cur=Math.max(0,Math.min(sl.length-1,i));tb.forEach(function(t,k){t.setAttribute('aria-selected',k==cur?'true':'false')});
  if(pv)pv.disabled=cur==0;if(nx)nx.disabled=cur==sl.length-1;if(bar){bar.style.width=(100/sl.length)+'%';bar.style.transform='translateX('+(cur*100)+'%)'}
  var a=tb[cur];if(a&&a.parentNode.scrollWidth>a.parentNode.clientWidth)a.parentNode.scrollTo({left:a.offsetLeft-24,behavior:'smooth'})}
 function go(i){i=Math.max(0,Math.min(sl.length-1,i));tr.scrollTo({left:i*tr.clientWidth,behavior:'smooth'});mark(i)}
 var st;tr.addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(function(){mark(idx())},60)},{passive:true});
 window.addEventListener('resize',function(){tr.scrollLeft=cur*tr.clientWidth});
 if(pv)pv.addEventListener('click',function(){go(cur-1)});if(nx)nx.addEventListener('click',function(){go(cur+1)});
 tb.forEach(function(t,k){t.addEventListener('click',function(){go(k)})});
 cx.addEventListener('keydown',function(e){if(e.key=='ArrowRight'){e.preventDefault();go(cur+1)}else if(e.key=='ArrowLeft'){e.preventDefault();go(cur-1)}});
 var down=false,sx=0,sl0=0,moved=false;
 tr.addEventListener('pointerdown',function(e){if(e.pointerType!='mouse')return;down=true;moved=false;sx=e.clientX;sl0=tr.scrollLeft;tr.classList.add('drag')});
 window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;tr.scrollLeft=sl0-dx});
 window.addEventListener('pointerup',function(e){if(!down)return;down=false;tr.classList.remove('drag');var dx=e.clientX-sx;go(Math.abs(dx)>50?cur+(dx<0?1:-1):cur)});
 tr.addEventListener('click',function(e){if(moved){e.preventDefault();moved=false}},true);
 mark(0)});
})();

/* ===== v10: logo-draw intro, reveals, chapter index ===== */
(function(){
var H=document.documentElement,B=document.body;
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
var intro=document.getElementById('intro'),pending=[];
function reveal(el){el.classList.add('in')}
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px 10% 0px'}):null;
var live=intro&&getComputedStyle(intro).display!='none';
$$('.rv-i,.rv-l,.stag').forEach(function(el){
 if(!io){reveal(el);return}
 var r=el.getBoundingClientRect();
 if(r.top<innerHeight*1.02){ if(live&&el.closest('.cv'))pending.push(el); else reveal(el)} else io.observe(el)});
if(live){
 B.classList.add('intro-on');
 var lab=intro.querySelector('.in-lab'),t0=performance.now(),dur=3400,done=false;
 (function step(t){if(done)return;var p=Math.min(1,(t-t0)/dur);p=1-Math.pow(1-p,2);if(lab)lab.textContent='Loading '+Math.round(p*100)+'%';if(p<1)requestAnimationFrame(step)})(t0);
 function finish(skip){if(done)return;done=true;if(lab)lab.textContent='Loading 100%';
  if(skip)intro.classList.add('out');
  setTimeout(function(){B.classList.remove('intro-on');pending.forEach(reveal)},skip?250:150);
  setTimeout(function(){intro.style.display='none'},skip?750:1000)}
 var auto=setTimeout(function(){finish(false)},2750);
 intro.addEventListener('click',function(){clearTimeout(auto);finish(true)});
 document.addEventListener('keydown',function k(e){if(e.key=='Escape'||e.key=='Enter'||e.key==' '){clearTimeout(auto);finish(true);document.removeEventListener('keydown',k)}});
} else pending.forEach(reveal);
/* chapter index: highlight the chapter in view */
var toc=document.querySelector('.toc');if(toc&&io){var links=$$('a',toc),map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
 var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a){a.classList.add('on');if(a.scrollIntoView&&toc.querySelector('.wrap').scrollWidth>toc.clientWidth)toc.querySelector('.wrap').scrollTo({left:a.offsetLeft-20,behavior:'smooth'})}}})},{rootMargin:'-45% 0px -50% 0px'});
 $$('.achap[id]').forEach(function(s){cio.observe(s)});
 var first=document.querySelector('.achap[id]'),w=toc.querySelector('.wrap');addEventListener('scroll',function(){if(first&&first.getBoundingClientRect().top>innerHeight*.5){links.forEach(function(a){a.classList.remove('on')});if(w&&w.scrollLeft)w.scrollLeft=0}},{passive:true})}
})();

/* ===== v11: clickable film screens, catalog viewer ===== */
(function(){
var vm=document.createElement('div');vm.className='vmodal';vm.setAttribute('role','dialog');vm.setAttribute('aria-modal','true');vm.hidden=false;
vm.innerHTML='<button class="vm-x" type="button">Close</button><div class="vm-in"></div>';document.body.appendChild(vm);
var inn=vm.querySelector('.vm-in'),last=null;
function close(){vm.classList.remove('on');inn.innerHTML='';if(last)last.focus()}
function open(el){last=el;var src=el.getAttribute('data-src'),img=el.querySelector('img'),t=el.getAttribute('data-title')||'Film';
 if(src){inn.innerHTML='<video controls autoplay playsinline src="'+src+'"></video>'}
 else{inn.innerHTML='<div class="vm-ph">'+(img?'<img alt="" src="'+img.src+'">':'')+'<div class="vm-msg"><b>'+t+'</b><span>Coming soon. The film is being finished and will play right here.</span></div></div>'}
 vm.classList.add('on');vm.querySelector('.vm-x').focus()}
document.addEventListener('click',function(e){var s=e.target.closest&&e.target.closest('[data-video]');if(s){e.preventDefault();open(s)}else if(e.target===vm||e.target.classList.contains('vm-x'))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&vm.classList.contains('on'))close();if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.hasAttribute('data-video')){e.preventDefault();open(document.activeElement)}});
var cat=document.querySelector('[data-catalog-old]');
if(cat){var tr=cat.querySelector('.cat-track'),pg=[].slice.call(cat.querySelectorAll('.cat-p')),cur=cat.querySelector('[data-cur]');
 function step(){return tr.clientWidth+16}
 function upd(){var i=Math.round(tr.scrollLeft/(pg[0].offsetWidth+16));cur.textContent=Math.min(pg.length,i+1)}
 cat.querySelector('[data-next]').addEventListener('click',function(){tr.scrollBy({left:step(),behavior:'smooth'})});
 cat.querySelector('[data-prev]').addEventListener('click',function(){tr.scrollBy({left:-step(),behavior:'smooth'})});
 tr.addEventListener('scroll',function(){window.requestAnimationFrame(upd)});
 tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();tr.scrollBy({left:step(),behavior:'smooth'})}if(e.key==='ArrowLeft'){e.preventDefault();tr.scrollBy({left:-step(),behavior:'smooth'})}})}
})();

/* v11.1 catalog: spreads */
(function(){var bk=document.querySelector('[data-spreads]');if(!bk)return;var S=JSON.parse(bk.getAttribute('data-spreads')),i=0,
sp=bk.querySelector('.bk-spread'),n=bk.querySelector('.bk-n'),st=bk.querySelector('.bk-stage');
function lab(k){if(k===0)return 'Cover';if(S[k].length>1)return 'Pages '+(k*2)+'–'+(k*2+1)+'  ·  Spread '+(k+1)+' of '+S.length;return 'Back cover  ·  Spread '+(k+1)+' of '+S.length}
function show(k,dir){i=Math.max(0,Math.min(S.length-1,k));
 sp.className='bk-spread'+(S[i].length===1?' one':'');void sp.offsetWidth;if(dir)sp.classList.add(dir>0?'turn-r':'turn-l');
 sp.innerHTML=S[i].map(function(u){return '<img alt="Catalog page" src="'+u+'" width="820" height="1061">'}).join('');
 n.textContent=lab(i);[i+1,i+2,i-1].forEach(function(q){if(S[q])S[q].forEach(function(u){var im=new Image();im.src=u})})}
function full(f){bk.classList.toggle('full',f);document.body.style.overflow=f?'hidden':''}
bk.querySelector('.prev').addEventListener('click',function(e){e.stopPropagation();show(i-1,-1)});bk.querySelector('.next').addEventListener('click',function(e){e.stopPropagation();show(i+1,1)});
sp.addEventListener('click',function(e){if(!bk.classList.contains('full')){full(true);return}var r=sp.getBoundingClientRect(),fw=e.clientX>r.left+r.width/2;show(fw?i+1:i-1,fw?1:-1)});
bk.querySelector('.bk-full').addEventListener('click',function(){full(!bk.classList.contains('full'))});
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(i+1,1);else if(e.key==='ArrowLeft')show(i-1,-1);else if(e.key==='Escape')full(false)});
var x0=null;st.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});st.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(dx<0?i+1:i-1,dx<0?1:-1);x0=null});
[].forEach.call(document.querySelectorAll('[data-go]'),function(b){b.addEventListener('click',function(){show(+b.getAttribute('data-go'),0);full(true)})});
var x=document.createElement('button');x.className='bk-x';x.type='button';x.textContent='Close';x.addEventListener('click',function(e){e.stopPropagation();full(false)});bk.appendChild(x);
if(location.hash==='#open')full(true)})();
/* v11.1 gif tiles: crossfade */
(function(){[].forEach.call(document.querySelectorAll('.gif'),function(g){var ims=g.querySelectorAll('img');if(ims.length<2)return;var k=0;ims[0].classList.add('on');setInterval(function(){ims[k].classList.remove('on');k=(k+1)%ims.length;ims[k].classList.add('on')},2400+Math.random()*1000)})})();
