(() => {
  'use strict';
  const syncScroll = () => document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    syncScroll();
  }
  function closeDialog(dialog) {
    if (!dialog) return;
    if (!dialog.dispatchEvent(new CustomEvent('ui:beforeclose', {cancelable:true}))) return;
    dialog.close();
    syncScroll();
  }
  let toastTimer;
  function toast(message) {
    const target = document.getElementById('site-toast');
    if (!target) return;
    target.textContent = message; target.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => {target.hidden = true;}, 3200);
  }
  window.SiteUI = {openDialog,closeDialog,syncScroll,toast};
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-dialog-open]');
    if (opener) openDialog(document.getElementById(opener.dataset.dialogOpen));
    const closer = event.target.closest('[data-dialog-close]');
    if (closer) closeDialog(closer.closest('dialog'));
    const menu = document.querySelector('.account-menu');
    if (menu && !menu.contains(event.target)) menu.open = false;
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', event => {event.preventDefault();closeDialog(dialog);});
    dialog.addEventListener('close', syncScroll);
    dialog.addEventListener('click', event => {
      if (!dialog.classList.contains('fullscreen-dialog') && event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog);
      }
    });
  });
  document.querySelectorAll('.needs-validation').forEach(form => form.addEventListener('submit', event => {
    if (!form.checkValidity()) {event.preventDefault();event.stopPropagation();}
    form.classList.add('was-validated');
  }));
})();
