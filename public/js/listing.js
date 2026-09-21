document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const {openDialog, syncScroll, toast} = window.SiteUI;
  const page = document.querySelector('.property-page');
  if (!page) return;
  const jumpbar=document.querySelector('.property-jumpbar');
  const hero=document.querySelector('.hero-gallery');
  if(jumpbar && hero) new IntersectionObserver(entries=>{
    jumpbar.hidden=entries[0].isIntersecting || hero.getBoundingClientRect().top>0;
  }).observe(hero);
  const photos = JSON.parse(document.getElementById('photo-data').textContent);
  const tour = document.getElementById('photo-tour');
  const lightbox = document.getElementById('photo-lightbox');
  let photoIndex = 0;
  let returnFocus = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const galleryUrl = (index) => {
    const url = new URL(window.location.href);
    url.searchParams.set('modal','PHOTO_TOUR_SCROLLABLE');
    if (Number.isInteger(index)) url.searchParams.set('modalItem', String(1000 + index));
    else url.searchParams.delete('modalItem');
    return url;
  };
  function renderPhoto(index) {
    photoIndex = Math.max(0, Math.min(photos.length - 1, index));
    const photo = photos[photoIndex];
    if (!photo) return;
    const image = document.createElement('img');
    image.className = 'property-photo';
    image.src = photo.url; image.alt = photo.alt;
    const container = document.getElementById('lightbox-image');
    container.replaceChildren(image);
    document.getElementById('lightbox-title').textContent = photo.room;
    document.getElementById('photo-counter').textContent = (photoIndex + 1) + ' of ' + photos.length;
    document.getElementById('photo-prev').disabled = photoIndex === 0;
    document.getElementById('photo-next').disabled = photoIndex === photos.length - 1;
    if (!reducedMotion) image.animate([{opacity:.35},{opacity:1}], {duration:180});
    for (const adjacent of [photos[photoIndex-1], photos[photoIndex+1]]) {
      if (adjacent) {const preload = new Image();preload.src = adjacent.url;}
    }
  }
  function readGalleryState() {
    const params = new URL(window.location.href).searchParams;
    const isTour = params.get('modal') === 'PHOTO_TOUR_SCROLLABLE' && photos.length;
    if (!isTour) {
      lightbox.close(); tour.close(); syncScroll();
      if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
      return;
    }
    openDialog(tour);
    const rawIndex = params.get('modalItem');
    const index = Number(rawIndex) - 1000;
    if (rawIndex !== null && Number.isInteger(index) && index >= 0 && index < photos.length) {
      renderPhoto(index); openDialog(lightbox);
    } else {
      lightbox.close(); syncScroll();
    }
  }
  function showTour(trigger) {
    returnFocus = trigger;
    history.pushState({rentalGallery:'tour'},'',galleryUrl());
    readGalleryState();
    tour.scrollTop = 0;
  }
  function showPhoto(index) {
    history.pushState({rentalGallery:'photo'},'',galleryUrl(index));
    readGalleryState();
  }
  function closeGalleryLayer(layer) {
    if (history.state?.rentalGallery === (layer === lightbox ? 'photo' : 'tour')) {
      history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('modalItem');
      if (layer === tour) url.searchParams.delete('modal');
      history.replaceState(null,'',url);
      readGalleryState();
    }
  }
  document.querySelectorAll('[data-tour-open]').forEach(button => button.addEventListener('click', () => showTour(button)));
  document.querySelectorAll('[data-lightbox-open]').forEach(button => button.addEventListener('click', () => showPhoto(Number(button.dataset.lightboxOpen))));
  document.querySelectorAll('[data-room-target]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const section = document.getElementById(link.dataset.roomTarget);
    section.scrollIntoView({behavior:reducedMotion ? 'instant':'smooth',block:'start'});
    const firstPhoto = section.querySelector('button');
    firstPhoto?.focus({preventScroll:true});
  }));
  for (const dialog of [tour,lightbox]) dialog.addEventListener('ui:beforeclose', event => {event.preventDefault();closeGalleryLayer(dialog);});
  document.getElementById('back-to-tour').addEventListener('click',()=>closeGalleryLayer(lightbox));
  function stepPhoto(step) {
    const index = photoIndex + step;
    if (index < 0 || index >= photos.length) return;
    history.replaceState(history.state,'',galleryUrl(index));
    renderPhoto(index);
  }
  document.getElementById('photo-prev').addEventListener('click',()=>stepPhoto(-1));
  document.getElementById('photo-next').addEventListener('click',()=>stepPhoto(1));
  lightbox.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();stepPhoto(event.key==='ArrowRight'?1:-1);}
  });
  window.addEventListener('popstate',readGalleryState);
  readGalleryState();

  document.querySelectorAll('[data-stay-step]').forEach(button=>button.addEventListener('click',()=>{
    const row=document.querySelector('.nearby-grid');
    row.scrollBy({left:Number(button.dataset.stayStep)*row.clientWidth*.8,behavior:reducedMotion?'instant':'smooth'});
  }));
  const savedKey = 'rental:saved:' + page.dataset.listingId;
  let saved = false;
  try {saved = localStorage.getItem(savedKey) === 'true';} catch {}
  function updateSave() {
    document.querySelectorAll('.save-button').forEach(button=>{
      button.setAttribute('aria-pressed',String(saved));
      const label=button.querySelector('span');
      if(label) label.textContent = saved ? 'Saved' : 'Save';
      else button.setAttribute('aria-label',saved ? 'Unsave listing' : 'Save listing');
    });
  }
  document.querySelectorAll('.save-button').forEach(button=>button.addEventListener('click',()=>{
    saved=!saved;updateSave();
    try{localStorage.setItem(savedKey,String(saved));toast(saved?'Saved to your wishlist':'Removed from your wishlist');}
    catch{toast('Wishlist updated for this visit. Browser storage is unavailable.');}
  }));
  updateSave();
  const shareUrl = new URL(window.location.href);shareUrl.search='';shareUrl.hash='';
  document.getElementById('share-url').value=shareUrl.href;
  document.getElementById('copy-link').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(shareUrl.href);toast('Link copied');}
    catch{document.getElementById('share-url').select();toast('Select and copy the listing link');}
  });
  document.querySelectorAll('[data-expand-review]').forEach(button=>button.addEventListener('click',()=>{
    const expanded=button.previousElementSibling.classList.toggle('expanded');
    button.textContent=expanded?'Show less':'Show more';
    button.setAttribute('aria-expanded',String(expanded));
  }));

  const form=document.getElementById('reservation-form');
  const checkIn=document.getElementById('checkIn'),checkOut=document.getElementById('checkOut');
  const iso=date=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  const parse=value=>new Date(value+'T12:00:00');
  const today=new Date();today.setHours(0,0,0,0);
  const demo=form.dataset.demo==='true';
  let displayedMonth=new Date(today.getFullYear(),today.getMonth(),1);
  let discount=1;
  checkIn.min=iso(today);checkOut.min=iso(today);
  if(demo){
    checkIn.value='2026-10-18';checkOut.value='2026-10-23';
    if(checkIn.value < iso(today)){const start=new Date(today);start.setDate(start.getDate()+7);checkIn.value=iso(start);start.setDate(start.getDate()+5);checkOut.value=iso(start);}
    displayedMonth=new Date(parse(checkIn.value).getFullYear(),parse(checkIn.value).getMonth(),1);
    try{const selection=JSON.parse(sessionStorage.getItem('rental:reference-dates'));if(selection && selection.checkIn >= iso(today) && selection.checkOut > selection.checkIn){checkIn.value=selection.checkIn;checkOut.value=selection.checkOut;document.getElementById('guests').value=selection.guests;displayedMonth=new Date(parse(checkIn.value).getFullYear(),parse(checkIn.value).getMonth(),1);}}catch{}
  }
  const dateFormat=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'});
  function renderCalendar(){
    const container=document.getElementById('calendar-months');container.replaceChildren();
    for(let offset=0;offset<2;offset++){
      const month=new Date(displayedMonth.getFullYear(),displayedMonth.getMonth()+offset,1);
      const section=document.createElement('section');section.className='calendar-month';
      const heading=document.createElement('h3');heading.textContent=month.toLocaleDateString('en-GB',{month:'long',year:'numeric'});section.append(heading);
      const grid=document.createElement('div');grid.className='calendar-grid';
      ['S','M','T','W','T','F','S'].forEach(day=>{const label=document.createElement('span');label.className='weekday';label.textContent=day;grid.append(label);});
      for(let n=0;n<month.getDay();n++)grid.append(document.createElement('span'));
      const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
      for(let day=1;day<=count;day++){
        const date=new Date(month.getFullYear(),month.getMonth(),day),value=iso(date);
        const button=document.createElement('button');button.type='button';button.className='calendar-day';button.textContent=day;button.dataset.date=value;
        button.setAttribute('aria-label',date.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
        button.disabled=date<today;
        const selected=value===checkIn.value||value===checkOut.value;
        button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
        button.classList.toggle('in-range',!!checkIn.value&&!!checkOut.value&&value>checkIn.value&&value<checkOut.value);
        button.addEventListener('click',()=>{
          if(!checkIn.value||checkOut.value||value<=checkIn.value){checkIn.value=value;checkOut.value='';}
          else checkOut.value=value;
          updateDates();document.querySelector('[data-date="'+value+'"]')?.focus({preventScroll:true});
        });
        button.addEventListener('keydown',event=>{
          const move={ArrowRight:1,ArrowLeft:-1,ArrowDown:7,ArrowUp:-7}[event.key];
          if(move){event.preventDefault();const next=new Date(date);next.setDate(next.getDate()+move);document.querySelector('[data-date="'+iso(next)+'"]')?.focus();}
        });
        grid.append(button);
      }
      section.append(grid);container.append(section);
    }
    document.getElementById('month-prev').disabled=displayedMonth.getFullYear()===today.getFullYear()&&displayedMonth.getMonth()===today.getMonth();
  }
  function updateDates(){
    const valid=checkIn.value&&checkOut.value&&checkOut.value>checkIn.value;
    const nights=valid?Math.round((Date.parse(checkOut.value)-Date.parse(checkIn.value))/86400000):0;
    const minimum=checkIn.value?parse(checkIn.value):new Date(today);if(checkIn.value)minimum.setDate(minimum.getDate()+1);
    checkOut.min=iso(minimum);
    checkOut.setCustomValidity(checkOut.value&&checkIn.value&&checkOut.value<=checkIn.value?'Checkout must be after check-in.':'');
    document.getElementById('booking-total').textContent='₹'+(Number(form.dataset.nightlyPrice)*(nights||1)*discount).toLocaleString('en-IN',{maximumFractionDigits:0});
    document.getElementById('booking-nights').textContent=nights?'for '+nights+(nights===1?' night':' nights'):'per night';
    document.getElementById('calendar-heading').textContent=nights?nights+' nights in '+form.dataset.location:checkIn.value?'Select checkout date':'Select your dates';
    document.getElementById('calendar-summary').textContent=valid?dateFormat.format(parse(checkIn.value))+' – '+dateFormat.format(parse(checkOut.value)):checkIn.value?'Check-in: '+dateFormat.format(parse(checkIn.value)):'Add your travel dates for pricing';
    document.getElementById('booking-error').hidden=true;
    const cancellation=document.querySelector('.cancellation-note');
    if(cancellation && checkIn.value) {
      const dayBefore=parse(checkIn.value);dayBefore.setDate(dayBefore.getDate()-1);
      cancellation.querySelector('strong').textContent=dayBefore.toLocaleDateString('en-GB',{day:'numeric',month:'long'});
    }
    if(demo){try{sessionStorage.setItem('rental:reference-dates',JSON.stringify({checkIn:checkIn.value,checkOut:checkOut.value,guests:document.getElementById('guests').value}));}catch{}}
    renderCalendar();
  }
  [checkIn,checkOut].forEach(input=>input.addEventListener('change',updateDates));
  document.getElementById('guests')?.addEventListener('change',updateDates);
  document.getElementById('month-prev').addEventListener('click',()=>{displayedMonth.setMonth(displayedMonth.getMonth()-1);renderCalendar();});
  document.getElementById('month-next').addEventListener('click',()=>{displayedMonth.setMonth(displayedMonth.getMonth()+1);renderCalendar();});
  document.getElementById('clear-dates').addEventListener('click',()=>{checkIn.value='';checkOut.value='';updateDates();});
  document.getElementById('claim-offer')?.addEventListener('click',event=>{discount=.9;event.currentTarget.textContent='Claimed';event.currentTarget.disabled=true;updateDates();toast('10% preview discount applied');});
  form.addEventListener('submit',event=>{
    if(!form.checkValidity()||!checkIn.value||checkIn.value<iso(today)||checkOut.value<=checkIn.value){
      event.preventDefault();const error=document.getElementById('booking-error');error.textContent='Choose a valid check-in and a later checkout date.';error.hidden=false;return;
    }
    if(demo){event.preventDefault();updateDates();openDialog(document.getElementById('reservation-dialog'));}
    else if(form.dataset.authenticated!=='true'){event.preventDefault();window.location.href='/login';}
  });
  updateDates();
  const mapData=document.getElementById('map-data');
  if(mapData && window.mapboxgl){
    try{
      const info=JSON.parse(mapData.textContent);mapboxgl.accessToken=info.token;
      const map=new mapboxgl.Map({container:'map',style:'mapbox://styles/mapbox/streets-v12',center:info.coordinates,zoom:10});
      map.addControl(new mapboxgl.NavigationControl());
      new mapboxgl.Marker({color:'#ff385c'}).setLngLat(info.coordinates).setPopup(new mapboxgl.Popup().setText(info.location)).addTo(map);
    }catch{document.getElementById('map').textContent='Map unavailable. See the property location above.';}
  }
});
