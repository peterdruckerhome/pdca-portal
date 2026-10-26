function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item, .mob-nav-item').forEach(b => b.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  document.querySelectorAll('[data-page="' + id + '"]').forEach(b => b.classList.add('active'));
  window.scrollTo({top: 0, behavior: 'smooth'});
  // Auto-scroll active mob-nav item into view
  const mobBtn = document.querySelector('.mob-nav-item[data-page="' + id + '"]');
  if (mobBtn) mobBtn.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
}
