// Local visual review server: same EJS views, no credentials or database writes.
const express = require('express');
const path = require('path');
const app = express();
const reference = require('../init/referenceListing');
const presentation = require('../utils/listingPresentation');
const fixtures = require('../init/data').data.map((item,i)=>({
  ...item, _id: String(i+1), owner:{_id:'preview-host',username:'Preview Host'},
  roomsAcAvailable:5, roomsNonAcAvailable:5, reviews:[],
}));
app.set('views',path.join(__dirname,'../views'));
app.set('view engine','ejs');
app.engine('ejs',require('ejs-mate'));
app.use(express.static(path.join(__dirname,'../public')));
app.use((req,res,next)=>{Object.assign(res.locals,{currUser:null,success:[],error:[]});next();});
app.get(['/','/design-reference'],(req,res)=>res.render('listings/show',{
  listing:reference,presentation:presentation(reference),isReference:true,nearbyListings:fixtures.slice(0,8),
}));
app.get('/listings',(req,res)=>{
  const location=String(req.query.location||'');
  res.render('listings/index',{allListings:fixtures.filter(item=>item.location.toLowerCase().includes(location.toLowerCase())),location});
});
app.get('/listings/new',(req,res)=>res.render('listings/new'));
app.get('/listings/:id',(req,res)=>{
  const listing=fixtures.find(item=>item._id===req.params.id);
  if(!listing)return res.status(404).render('error',{message:'Property not found',statusCode:404});
  res.render('listings/show',{listing,presentation:presentation(listing),nearbyListings:[],mapToken:''});
});
app.get('/login',(req,res)=>res.render('users/login'));
app.get('/signup',(req,res)=>res.render('users/signup'));
app.get('/home',(req,res)=>res.render('home'));
app.use((req,res)=>res.status(404).render('error',{message:'This action requires the main application. Start it with npm start.',statusCode:404}));
const port=Number(process.env.PREVIEW_PORT||8081);
if (require.main === module) app.listen(port,'127.0.0.1',()=>console.log('Design preview: http://localhost:'+port));
module.exports = app;
