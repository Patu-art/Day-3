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

/* ==========================================
   DAY-3 SIGNATURE DRINK VISUAL UPGRADE
========================================== */

(() => {

  const drinkPanel = document.getElementById("drink-panel");
  const drinkMain = drinkPanel?.querySelector(".drink-main");
  const drinkFacts = drinkPanel?.querySelector(".drink-facts");
  const drinkTabs = [...document.querySelectorAll(".drink-tab")];

  if (!drinkPanel || !drinkMain || !drinkFacts || !drinkTabs.length) return;


  /* ---------------------------
     DRINK IMAGE DATA
  --------------------------- */

  const mediaData = {

    dirty: {
      src: "assets/images/coffee-1.jpeg",
      number: "01",
      caption: "The Dirty"
    },

    blackcinno: {
      src: "assets/images/coffee-2.jpeg",
      number: "02",
      caption: "Iced Blackcinno"
    },

    single: {
      src: "assets/images/shop.jpeg",
      number: "03",
      caption: "Single Origin"
    }

  };


  /* ---------------------------
     CREATE IMAGE PANEL
  --------------------------- */

  const media = document.createElement("figure");

  media.className = "drink-media";

  media.innerHTML = `

    <div class="drink-image-wrap">

      <img
        id="drinkImage"
        src="assets/images/coffee-1.jpeg"
        alt="The Dirty at Artista Perfetto"
      >

      <div class="drink-media-shade"></div>

      <div class="drink-media-meta">

        <span id="drinkMediaNumber">
          01
        </span>

        <p id="drinkMediaCaption">
          The Dirty
        </p>

      </div>

    </div>

  `;

  drinkMain.insertAdjacentElement("afterend", media);


  const drinkImage =
    media.querySelector("#drinkImage");

  const imageWrap =
    media.querySelector(".drink-image-wrap");

  const mediaNumber =
    media.querySelector("#drinkMediaNumber");

  const mediaCaption =
    media.querySelector("#drinkMediaCaption");


  /* ---------------------------
     STYLES
  --------------------------- */

  const style = document.createElement("style");

  style.textContent = `


  /* FIX SKIP LINK */

  .skip-link{

    top:-120px !important;

    transform:none !important;

    transition:
      top .18s ease;

  }

  .skip-link:focus{

    top:8px !important;

  }


  /* SIGNATURE PANEL */

  .drink-panel{

    grid-template-columns:

      minmax(0,1.05fr)

      minmax(260px,.72fr)

      minmax(240px,.58fr)

      !important;

    gap:
      clamp(28px,4vw,64px)
      !important;

    padding:
      clamp(42px,5vw,72px)
      !important;

    min-height:
      520px !important;

    align-items:center;

  }


  .drink-main,
  .drink-media,
  .drink-facts{

    position:relative;

    z-index:3;

    min-width:0;

  }


  .drink-main h3{

    font-size:
      clamp(
        3.1rem,
        5.8vw,
        6.4rem
      )
      !important;

    overflow-wrap:normal !important;

    word-break:normal !important;

  }


  /* IMAGE */

  .drink-media{

    margin:0;

    width:100%;

    height:390px;

    position:relative;

    transform:
      perspective(1000px)
      rotateY(-2deg)
      rotateX(1deg);

    transition:
      transform .45s
      cubic-bezier(.2,.7,.2,1);

    will-change:transform;

  }


  .drink-image-wrap{

    width:100%;

    height:100%;

    position:relative;

    overflow:hidden;

    border:
      1px solid
      rgba(255,255,255,.18);

    background:#201916;

  }


  .drink-image-wrap img{

    width:100%;

    height:100%;

    object-fit:cover;

    filter:

      saturate(.78)

      contrast(1.06)

      brightness(.88);

    transform:
      scale(1.045);

    transition:

      opacity .28s ease,

      transform .85s
      cubic-bezier(.2,.7,.2,1),

      filter .45s ease;

  }


  .drink-image-wrap.switching img{

    opacity:0;

    transform:
      scale(1.12);

  }


  .drink-media:hover img{

    transform:
      scale(1.085);

    filter:

      saturate(.9)

      contrast(1.08)

      brightness(.94);

  }


  /* IMAGE DARK FADE */

  .drink-media-shade{

    position:absolute;

    inset:0;

    background:

      linear-gradient(

        to top,

        rgba(10,8,7,.84),

        transparent 52%

      );

    pointer-events:none;

  }


  /* IMAGE TEXT */

  .drink-media-meta{

    position:absolute;

    left:17px;

    right:17px;

    bottom:16px;

    display:flex;

    justify-content:
      space-between;

    align-items:
      flex-end;

    gap:18px;

    color:white;

  }


  .drink-media-meta span,
  .drink-media-meta p{

    font-family:
      "DM Mono",
      monospace;

    text-transform:
      uppercase;

    letter-spacing:
      .08em;

  }


  .drink-media-meta span{

    color:var(--tan);

    font-size:.56rem;

  }


  .drink-media-meta p{

    margin:0;

    font-size:.59rem;

    text-align:right;

  }


  /* HOVER FRAME */

  .drink-media::after{

    content:"";

    position:absolute;

    inset:-1px;

    border:

      1px solid

      rgba(195,162,126,0);

    pointer-events:none;

    transition:
      border-color .3s ease;

  }


  .drink-media:hover::after{

    border-color:

      rgba(
        195,
        162,
        126,
        .48
      );

  }


  /* BREW LINE ANIMATION */

  .brew-lines{

    opacity:.10 !important;

  }


  .brew-lines span{

    transform-origin:
      bottom;

    animation:
      brewPulse
      5s
      ease-in-out
      infinite;

  }


  .brew-lines span:nth-child(2){

    animation-delay:.35s;

  }

  .brew-lines span:nth-child(3){

    animation-delay:.7s;

  }

  .brew-lines span:nth-child(4){

    animation-delay:1.05s;

  }

  .brew-lines span:nth-child(5){

    animation-delay:1.4s;

  }


  @keyframes brewPulse{

    0%,
    100%{

      opacity:.25;

      transform:
        scaleY(.66);

    }

    50%{

      opacity:.9;

      transform:
        scaleY(1);

    }

  }


  /* TABLET */

  @media(max-width:1050px){

    .drink-panel{

      grid-template-columns:

        minmax(0,1fr)

        minmax(230px,.65fr)

        !important;

    }


    .drink-media{

      grid-column:2;

      grid-row:1;

      height:330px;

    }


    .drink-facts{

      grid-column:
        1 / -1;

      display:grid;

      grid-template-columns:
        1fr 1fr;

      gap:18px;

    }

  }


  /* MOBILE */

  @media(max-width:820px){

    .drink-panel{

      grid-template-columns:
        1fr !important;

      padding:
        32px 24px
        !important;

      gap:
        28px !important;

    }


    .drink-media{

      grid-column:auto;

      grid-row:auto;

      height:
        min(
          105vw,
          450px
        );

      transform:
        none !important;

    }


    .drink-facts{

      grid-column:auto;

      display:block;

    }


    .drink-main h3{

      font-size:

        clamp(
          3rem,
          14vw,
          5rem
        )

        !important;

    }


    .brew-lines{

      opacity:.07 !important;

    }

  }


  @media(max-width:520px){

    .drink-panel{

      padding:
        26px 18px
        !important;

    }


    .drink-media{

      height:
        min(
          112vw,
          420px
        );

    }


    .drink-main h3{

      font-size:

        clamp(
          2.7rem,
          12vw,
          4rem
        )

        !important;

    }

  }


  @media(
    prefers-reduced-motion:
    reduce
  ){

    .drink-media{

      transform:none
      !important;

    }

    .brew-lines span{

      animation:none
      !important;

    }

  }

  `;


  document.head.appendChild(style);


  /* ---------------------------
     IMAGE SWITCH
  --------------------------- */

  function updateDrinkMedia(key){

    const data =
      mediaData[key];

    if (!data) return;


    imageWrap.classList.add(
      "switching"
    );


    setTimeout(() => {

      drinkImage.src =
        data.src;

      drinkImage.alt =
        `${data.caption} at Artista Perfetto`;

      mediaNumber.textContent =
        data.number;

      mediaCaption.textContent =
        data.caption;


      requestAnimationFrame(() => {

        imageWrap.classList.remove(
          "switching"
        );

      });

    },160);

  }


  /* ---------------------------
     CONNECT TO TABS
  --------------------------- */

  drinkTabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        updateDrinkMedia(
          tab.dataset.drink
        );

      }
    );

  });


  /* KEYBOARD SUPPORT */

  drinkTabs.forEach(tab => {

    tab.addEventListener(
      "keydown",
      e => {

        if (

          ![
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End"
          ].includes(e.key)

        ) return;


        requestAnimationFrame(() => {

          const active =
            document.querySelector(
              ".drink-tab.active"
            );

          if (active) {

            updateDrinkMedia(
              active.dataset.drink
            );

          }

        });

      }

    );

  });


  /* ---------------------------
     DESKTOP PARALLAX
  --------------------------- */

  const finePointer =
    window.matchMedia(
      "(pointer:fine)"
    ).matches;


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    finePointer &&
    !reducedMotion
  ){

    media.addEventListener(
      "mousemove",
      e => {

        const rect =
          media.getBoundingClientRect();


        const x =

          (
            e.clientX -
            rect.left
          )

          / rect.width

          - .5;


        const y =

          (
            e.clientY -
            rect.top
          )

          / rect.height

          - .5;


        media.style.transform = `

          perspective(1000px)

          rotateY(
            ${x * 4}deg
          )

          rotateX(
            ${y * -4}deg
          )

          translateY(-3px)

        `;

      }

    );


    media.addEventListener(
      "mouseleave",
      () => {

        media.style.transform = `

          perspective(1000px)

          rotateY(-2deg)

          rotateX(1deg)

        `;

      }

    );

  }

})();
