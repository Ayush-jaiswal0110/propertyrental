const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=require('../scripts/preview');
const present=require('../utils/listingPresentation');
const reference=require('../init/referenceListing');
const {listingSchema}=require('../schema');
const {validateBookingDates}=require('../utils/bookingValidation');
const root=path.join(__dirname,'..');
let server,base;
before(async()=>{
  server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
  base='http://127.0.0.1:'+server.address().port;
});
after(()=>new Promise(resolve=>server.close(resolve)));
const render=(listing,currUser=null)=>new Promise((resolve,reject)=>app.render('listings/show',{
  listing,presentation:present(listing),currUser,success:[],error:[],mapToken:'',nearbyListings:[],
},(error,html)=>error?reject(error):resolve(html)));
test('all 43 reference photos are local files in nine ordered room groups',()=>{
  const view=present(reference);
  assert.equal(view.photos.length,43);
  assert.deepEqual(view.groups.map(g=>g.photos.length),[3,7,2,6,1,5,6,3,10]);
  for(const photo of view.photos)assert.ok(fs.statSync(path.join(root,'public',photo.url)).size>1000,photo.url);
});
test('legacy single-photo and missing-photo properties remain valid',()=>{
  assert.equal(present({title:'Legacy',image:{url:'/old.jpg'}}).photos.length,1);
  assert.equal(present({title:'Empty'}).photos.length,0);
  assert.equal(present({image:{url:'/a.jpg'},images:[{url:'/a.jpg'},{url:'/b.jpg'}]}).photos.length,2);
  assert.equal(present({reviews:[{rating:5},{rating:4}]}).rating,'4.50');
  assert.equal(present({reviews:[]}).rating,null);
});
test('render reference, browse, search, forms and legacy listing routes',async()=>{
  for(const url of ['/','/design-reference','/listings','/listings?location=Malibu','/listings?location=%5B','/listings/1','/listings/new','/login','/signup','/home']){
    const response=await fetch(base+url);
    assert.equal(response.status,200,url);
    const html=await response.text();
    assert.match(html,/<!DOCTYPE html>/i,url);
    assert.match(html,/id="main-content"/,url);
  }
  const missing=await fetch(base+'/listings/unknown');
  assert.equal(missing.status,404);
});
test('reference page exposes tour, lightbox, category anchors and 43 gallery controls',async()=>{
  const html=await (await fetch(base+'/')).text();
  assert.match(html,/id="photo-tour"/);
  assert.match(html,/id="photo-lightbox"/);
  assert.equal((html.match(/data-lightbox-open="/g)||[]).length,43);
  assert.equal((html.match(/data-room-target="/g)||[]).length,9);
  assert.match(html,/id="checkIn"/);
  assert.match(html,/id="checkOut"/);
});
test('real listings do not acquire fabricated reference ratings or amenities',async()=>{
  const listing={_id:'123',title:'Real stay',description:'A real property',price:1000,location:'Indore',country:'India',image:{url:'/test.jpg'},reviews:[],roomsAcAvailable:2,roomsNonAcAvailable:1};
  const html=await render(listing);
  assert.doesNotMatch(html,/Guest favourite|4\.95|Free cancellation before/);
  assert.match(html,/name="roomType"/);
  assert.match(html,/action="\/bookings\/123\/book"/);
});
test('owner and review-delete controls are only rendered for the right user',async()=>{
  const listing={_id:'123',title:'Owned',owner:{_id:'owner',username:'Host'},price:1,reviews:[{_id:'r1',author:{_id:'guest',username:'Guest'},rating:5,comment:'Nice'}]};
  const owner=await render(listing,{_id:'owner'});
  assert.match(owner,/Edit listing/);assert.doesNotMatch(owner,/Delete your review/);
  const guest=await render(listing,{_id:'guest'});
  assert.doesNotMatch(guest,/Edit listing/);assert.match(guest,/Delete your review/);
});
test('user-provided text is HTML escaped and gallery JSON cannot terminate its script tag',async()=>{
  const attack='</script><script>alert("unsafe")</script>';
  const html=await render({_id:'123',title:attack,description:attack,image:{url:'/a.jpg',caption:attack},reviews:[]});
  assert.ok(!html.includes(attack));
  const json=html.match(/<script id="photo-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(json)[0].alt,attack);
});
test('gallery room input is allowed but oversized names and injected fields are rejected',()=>{
  const valid={listing:{title:'Title',description:'Description',location:'Indore',country:'India',price:1000},galleryRoom:'Bedroom'};
  assert.equal(listingSchema.validate(valid).error,undefined);
  assert.ok(listingSchema.validate({...valid,galleryRoom:'x'.repeat(81)}).error);
  assert.ok(listingSchema.validate({...valid,listing:{...valid.listing,owner:'injected'}}).error);
});
test('booking validation rejects impossible, reversed, same-day and past dates',()=>{
  const now=new Date(2026,8,21);
  assert.equal(validateBookingDates('2026-10-18','2026-10-23',now),true);
  for(const dates of [['2026-09-20','2026-09-24'],['2026-10-23','2026-10-18'],['2026-10-18','2026-10-18'],['2026-02-30','2026-10-18'],['bad','bad'],[null,[]]]){
    assert.equal(validateBookingDates(...dates,now),false,JSON.stringify(dates));
  }
});
test('all EJS templates compile',()=>{
  const ejs=require('ejs');
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
  for(const file of walk(path.join(root,'views')).filter(file=>file.endsWith('.ejs')))ejs.compile(fs.readFileSync(file,'utf8'),{filename:file});
});
