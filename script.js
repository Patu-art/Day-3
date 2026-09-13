const header = document.querySelector('.header');
const progressBar = document.getElementById('progressBar');
const menuButton = document.getElementById('menuButton');
const nav = document.getElementById('nav');

function updateScrollUI(){
  const y=window.scrollY;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progressBar.style.width=`${max>0?(y/max)*100:0}%`;
  header.classList.toggle('scrolled',y>16);
}
window.addEventListener('scroll',updateScrollUI,{passive:true});
updateScrollUI();

function setMenu(open){
  menuButton.setAttribute('aria-expanded',String(open));
  nav.classList.toggle('open',open);
  document.body.classList.toggle('nav-open',open);
}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const drinkData={
  dirty:{kicker:'JAPAN-INSPIRED · COLD · NO ICE',name:'THE DIRTY',description:'Cold milk sits beneath fresh espresso, so temperature and texture change as you drink.',character:'Layered · soft',reason:"A simple introduction to the shop's point of view"},
  blackcinno:{kicker:'HONG KONG-BORN · ICED · STEAMED',name:'ICED BLACKCINNO',description:'Iced black espresso is gently steamed to create a smooth cascading texture — an unusual technique with Hong Kong roots.',character:'Dark · silky',reason:'The order for something genuinely different'},
  single:{kicker:'ROTATING COFFEE · ESPRESSO / POUR OVER',name:'SINGLE ORIGIN',description:'A coffee-first option where origin, aroma and brewing method are allowed to stay visible.',character:'Clear · expressive',reason:'For people who want to taste the coffee itself'}
};
const tabs=[...document.querySelectorAll('.drink-tab')];
const panel=document.getElementById('drink-panel');
const els={kicker:document.getElementById('drinkKicker'),name:document.getElementById('drinkName'),description:document.getElementById('drinkDescription'),character:document.getElementById('drinkCharacter'),reason:document.getElementById('drinkReason')};

function activateTab(tab,moveFocus=false){
  tabs.forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
  const d=drinkData[tab.dataset.drink];
  els.kicker.textContent=d.kicker;els.name.textContent=d.name;els.description.textContent=d.description;els.character.textContent=d.character;els.reason.textContent=d.reason;
  panel.setAttribute('aria-labelledby',tab.id);
  if(moveFocus)tab.focus();
}
tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>activateTab(tab));
  tab.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();let next=i;
    if(e.key==='ArrowRight')next=(i+1)%tabs.length;
    if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;
    if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;
    activateTab(tabs[next],true);
  });
});

const carousel=document.getElementById('carousel');
const track=document.getElementById('carouselTrack');
const slides=[...track.children];
const prev=document.getElementById('prevSlide');
const next=document.getElementById('nextSlide');
const current=document.getElementById('currentSlide');
let slideIndex=0,timer,touchX=0,userPaused=false;
function renderCarousel(){track.style.transform=`translateX(-${slideIndex*100}%)`;current.textContent=String(slideIndex+1).padStart(2,'0');slides.forEach((s,i)=>s.setAttribute('aria-hidden',String(i!==slideIndex)))}
function move(step){slideIndex=(slideIndex+step+slides.length)%slides.length;renderCarousel()}
function startAuto(){clearInterval(timer);if(!userPaused&&!document.hidden&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>move(1),6000)}
function pauseAuto(){userPaused=true;clearInterval(timer)}
function resumeAuto(){userPaused=false;startAuto()}
prev.addEventListener('click',()=>{move(-1);startAuto()});next.addEventListener('click',()=>{move(1);startAuto()});
carousel.addEventListener('mouseenter',pauseAuto);carousel.addEventListener('mouseleave',resumeAuto);carousel.addEventListener('focusin',pauseAuto);carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget))resumeAuto()});
track.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;pauseAuto()},{passive:true});
track.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)move(d<0?1:-1);resumeAuto()},{passive:true});
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(timer):startAuto());
renderCarousel();startAuto();






// Local image validation. Missing files get a designed placeholder.
document.querySelectorAll('img.local-media').forEach((img)=>{
  const shell=img.closest('figure, .social-photo') || img.parentElement;
  if(shell) shell.dataset.mediaLabel=img.dataset.label || 'REAL ARTISTA PERFETTO PHOTO';
  const missing=()=>{img.classList.add('media-missing');if(shell)shell.classList.add('media-shell')};
  const loaded=()=>{img.classList.remove('media-missing');if(shell)shell.classList.remove('media-shell')};
  img.addEventListener('error',missing);
  img.addEventListener('load',loaded);
  if(img.complete){img.naturalWidth?loaded():missing();}
});

// Real local video; graceful fallback until story.mp4 is added.
const storyVideo=document.getElementById('storyVideo');
const storyVideoSource=document.getElementById('storyVideoSource');
const videoMissing=document.getElementById('videoMissing');
if(storyVideo && storyVideoSource && videoMissing){
  let ready=false;
  const showVideo=()=>{ready=true;videoMissing.hidden=true;storyVideo.hidden=false};
  const showFallback=()=>{if(ready)return;storyVideo.hidden=true;videoMissing.hidden=false};
  storyVideo.addEventListener('loadedmetadata',showVideo,{once:true});
  storyVideo.addEventListener('canplay',showVideo,{once:true});
  storyVideo.addEventListener('error',showFallback);
  storyVideoSource.addEventListener('error',showFallback);
  setTimeout(()=>{if(!ready && storyVideo.readyState===0)showFallback()},1800);
}
