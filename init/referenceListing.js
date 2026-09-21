// Reference data and assets observed in the user-provided website. Never seeded into the database.
const photos = require('./referencePhotos.json');
module.exports = {
  _id: 'design-reference',
  title: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
  propertyType: 'Entire serviced apartment',
  location: 'Candolim', country: 'India',
  summary: '3 guests · 1 bedroom · 1 bed · 1 bathroom',
  price: 5699.8,
  image: photos[0], images: photos.slice(1), heroOrder: [6,3,4,12,28],
  owner: {_id: 'reference-host', username: 'Mirashya Homes'},
  hostYears: 2, guestFavourite: true, displayRating: '4.95', reviewCount: 19,
  description: '🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi, Smart TV, pet-friendly comfort, and stylish interiors. Just minutes from Candolim Beach, popular cafés, restaurants, and nightlife — it’s your place to relax and recharge.',
  highlights: [
    {icon:'tub', title:'Outdoor entertainment', description:'The pool and alfresco dining are great for summer trips.'},
    {icon:'snow', title:'Designed for staying cool', description:'Beat the heat with the A/C and ceiling fan.'},
    {icon:'key', title:'Self check-in', description:'You can check in with the building staff.'}
  ],
  amenities: [
    {icon:'kitchen', label:'Kitchen'}, {icon:'wifi', label:'Wifi'},
    {icon:'work', label:'Dedicated workspace'}, {icon:'car', label:'Free parking on premises'},
    {icon:'pool', label:'Pool'}, {icon:'tub', label:'Hot tub'},
    {icon:'pet', label:'Pets allowed'}, {icon:'camera', label:'Exterior security cameras on property'},
    {icon:'shield', label:'Carbon monoxide alarm', unavailable:true},
    {icon:'shield', label:'Smoke alarm', unavailable:true}
  ],
  sleeping: [{title:'Bedroom',detail:'1 double bed',photo:12},{title:'Living room',detail:'1 sofa',photo:0}],
  neighborhood: 'Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.',
  rules: ['Check-in after 2:00 pm', 'Checkout before 11:00 am', '3 guests maximum'],
  safety: ['Carbon monoxide alarm not reported', 'Smoke alarm not reported', 'Exterior security cameras on property'],
  cancellation: 'Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.',
  reviews: [
    {_id:'r1',author:{username:'Amit'},rating:5,comment:'Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.'},
    {_id:'r2',author:{username:'Aheesh'},rating:5,comment:'We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.'},
    {_id:'r3',author:{username:'Samiksha'},rating:5,comment:'the host nitish was really great help'},
    {_id:'r4',author:{username:'Vedant'},rating:5,comment:'We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine.'},
    {_id:'r5',author:{username:'Vaibhav S'},rating:5,comment:'Great great experience living out there, can’t expect more, will always look for it in the future and will recommend my friends too.'},
    {_id:'r6',author:{username:'Mohd'},rating:5,comment:'Great place. Exactly as described in the listing.'}
  ],
};

module.exports.roomDetails = {
 'Living room 1':'Sofa · Air conditioning · Ceiling fan · TV',
 'Living room 2':'Ceiling fan · Hot tub',
 'Full kitchen':'Freezer · Fridge · Blender · Cooker · Cooking basics · Kettle · Microwave · Toaster · Wine glasses · Coffee · Crockery and cutlery',
 'Bedroom':'Double bed · Air conditioning · Bed linen · Ceiling fan · Clothes storage · Cot · Hangers · Iron · Room-darkening blinds · Cleaning available during stay · Cleaning products · Long-term stays allowed · Private entrance · Wifi',
 'Full bathroom':'Hairdryer · Hot water · Shampoo · Shower gel',
 'Gym':'Air conditioning · Gym · Exercise equipment · Ceiling fan',
 'Pool':'Pool'
};
module.exports.amenityCount = 50;
module.exports.allAmenities = [
 ['Bathroom','Hairdryer|Cleaning products|Shampoo|Hot water|Shower gel'],
 ['Bedroom and laundry','Washing machine|Hangers|Bed linen|Room-darkening blinds|Iron|Clothes storage|Cot'],
 ['Entertainment','TV'],['Heating and cooling','Air conditioning|Ceiling fan'],
 ['Home safety','Exterior security cameras on property|Carbon monoxide alarm|Smoke alarm'],
 ['Internet and office','Wifi|Dedicated workspace'],
 ['Kitchen and dining','Kitchen|Fridge|Freezer|Microwave|Cooking basics|Crockery and cutlery|Kettle|Coffee|Wine glasses|Toaster|Blender|Cooker'],
 ['Location features','Private entrance'],['Outdoor','Patio or balcony|Outdoor dining area'],
 ['Parking and facilities','Free parking on premises|Pool|Hot tub|Gym'],
 ['Services','Pets allowed|Cleaning available during stay|Long-term stays allowed|Self check-in']
].flatMap(([category,labels])=>labels.split('|').map(label=>({category,label,icon:'check',unavailable:label==='Smoke alarm'||label==='Carbon monoxide alarm'})));
['2 months on Airbnb','3 years on Airbnb','8 months on Airbnb','4 years on Airbnb','3 years on Airbnb','5 years on Airbnb'].forEach((tenure,i)=>{module.exports.reviews[i].tenure=tenure;});
[[1,'rev1.jpeg'],[2,'rev2.jpeg'],[4,'rev3.jpeg'],[5,'rev4.jpeg']].forEach(([i,avatar])=>{module.exports.reviews[i].avatar='/images/reference/'+avatar;});
