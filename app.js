const listing = 'https://www.airbnb.com/rooms/1227386357733713880';
const photos = [
 ['assets/hero.jpg','Złota godzina na prywatnym tarasie'],
 ['assets/bedroom.jpg','Sypialnia z łóżkiem king-size i widokiem na góry'],
 ['assets/view.jpg','Salon, kominek i góry za oknem'],
 ['assets/spa.jpg','Prywatne spa pod otwartym niebem'],
 ['assets/terrace.jpg','Zimowa panorama z domu'],
 ['assets/living.jpg','Przestrzeń do wspólnego odpoczynku']
];
const dialog = document.querySelector('#gallery-dialog');
let photoIndex = 0;
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const [src,alt]=photos[photoIndex];const img=document.querySelector('#gallery-image');img.src=src;img.alt=alt;document.querySelector('#photo-caption').textContent=alt;document.querySelector('#photo-counter').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.gallery));dialog.showModal();}));
document.querySelector('.close-gallery').addEventListener('click',()=>dialog.close());
document.querySelector('#prev-photo').addEventListener('click',()=>showPhoto(photoIndex-1));
document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1)}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1)}});
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Otwórz menu');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
const checkIn=document.querySelector('#check-in'),checkOut=document.querySelector('#check-out'),guests=document.querySelector('#guests'),pets=document.querySelector('#pets');
function localDate(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function nextDay(value){const date=new Date(`${value}T12:00:00`);date.setDate(date.getDate()+1);return localDate(date);}
checkIn.min=localDate(new Date());checkOut.min=nextDay(checkIn.min);
function updateBooking(){checkIn.setCustomValidity('');checkOut.setCustomValidity('');if(checkIn.value&&checkIn.value<checkIn.min)checkIn.setCustomValidity('Wybierz dzisiejszą lub późniejszą datę.');checkOut.min=nextDay(checkIn.value||checkIn.min);if(checkOut.value&&checkOut.value<checkOut.min)checkOut.setCustomValidity('Wyjazd musi przypadać po dniu przyjazdu.');const summary=document.querySelector('#booking-summary');if(checkIn.value&&checkOut.value&&checkOut.value>checkIn.value){const nights=Math.round((Date.parse(checkOut.value)-Date.parse(checkIn.value))/86400000);summary.textContent=`${nights} ${nights===1?'noc':nights%10>=2&&nights%10<=4&&!(nights%100>=12&&nights%100<=14)?'noce':'nocy'} · ${guests.value} ${guests.value==='1'?'gość':'gości'}${pets.checked?' · ze zwierzęciem':''} · cały dom`;}else summary.textContent='Cały dom na wyłączność · do 5 gości';}
[checkIn,checkOut,guests,pets].forEach(input=>input.addEventListener('change',updateBooking));
document.querySelector('#booking-form').addEventListener('submit',event=>{event.preventDefault();updateBooking();if(!event.currentTarget.reportValidity())return;const url=new URL(listing);url.searchParams.set('check_in',checkIn.value);url.searchParams.set('check_out',checkOut.value);url.searchParams.set('adults',guests.value);url.searchParams.set('pets',pets.checked?'1':'0');window.location.assign(url.href);});
const bookingObserver=new IntersectionObserver(entries=>document.querySelector('.mobile-book').classList.toggle('hidden',entries[0].isIntersecting),{threshold:0.15});bookingObserver.observe(document.querySelector('#rezerwacja'));
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');reveal.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.section-heading,.stats,.rooms,.spa-copy,.gallery-heading,.activity-list').forEach(el=>reveal.observe(el));}
const reviewToggle=document.querySelector('#toggle-reviews');
reviewToggle.addEventListener('click',()=>{const expanded=reviewToggle.getAttribute('aria-expanded')!=='true';reviewToggle.setAttribute('aria-expanded',String(expanded));document.querySelectorAll('.review-card').forEach((card,index)=>{if(index>2)card.hidden=!expanded});document.querySelector('#review-cards').classList.toggle('expanded',expanded);reviewToggle.innerHTML=expanded?'Pokaż mniej <span>−</span>':'Więcej wspomnień <span>＋</span>';if(!expanded)document.querySelector('#opinie').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
