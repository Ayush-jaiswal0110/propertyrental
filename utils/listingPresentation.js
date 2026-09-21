// Presentation defaults never invent amenities or ratings for real listings.
function listingPresentation(listing) {
  const source = [listing.image, ...(listing.images || [])].filter(Boolean);
  const seen = new Set();
  const photos = source.filter(photo => {
    const key = photo.url + JSON.stringify(photo.crop || null);
    if (!photo.url || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((photo, index) => ({
    url: photo.url, crop: photo.crop,
    room: photo.room || 'Property photos',
    alt: photo.caption || `${listing.title} — photo ${index + 1}`,
  }));
  const groups = [];
  photos.forEach((photo, index) => {
    let group = groups.find(item => item.name === photo.room);
    if (!group) { group = {name: photo.room, photos: []}; groups.push(group); }
    group.photos.push({...photo, index});
  });
  const reviews = listing.reviews || [];
  const ratings = reviews.map(review => Number(review.rating)).filter(Number.isFinite);
  return {photos, groups, reviews, rating: ratings.length ? (ratings.reduce((a,b) => a+b, 0) / ratings.length).toFixed(2) : null};
}
module.exports = listingPresentation;
