document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('listing-grid');
  const cards=Array.from(grid.children);
  let filter='';
  const apply=()=>{
    const matcher=filter ? new RegExp(filter,'i') : null;
    cards.forEach(card=>{card.hidden=!!matcher&&!matcher.test(card.dataset.keywords);});
    const sort=document.getElementById('listing-sort').value;
    const ordered=[...cards];
    if(sort!=='recommended')ordered.sort((a,b)=>(Number(a.dataset.price)-Number(b.dataset.price))*(sort==='price-low'?1:-1));
    ordered.forEach(card=>grid.append(card));
    const count=cards.filter(card=>!card.hidden).length;
    document.getElementById('listing-count').textContent=count+(count===1?' home':' homes')+' to explore';
    document.getElementById('no-listings').hidden=count>0;
  };
  document.querySelectorAll('[data-listing-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.listingFilter;
    document.querySelectorAll('[data-listing-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    apply();
  }));
  document.getElementById('listing-sort').addEventListener('change',apply);
});