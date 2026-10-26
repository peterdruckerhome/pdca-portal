function switchShop(id, el) {
  document.querySelectorAll('.spanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  document.getElementById('spanel-' + id).classList.add('active');
  el.classList.add('active');
}
function openModal(name) {
  const msg = 'Olá, tenho interesse no ' + name + ' do PDCA!';
  document.getElementById('m-title').textContent = name;
  document.getElementById('m-preview').textContent = '"' + msg + '"';
  document.getElementById('m-link').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
  document.getElementById('modal-ov').classList.add('open');
}
function closeModal() { document.getElementById('modal-ov').classList.remove('open'); }
function closeOut(e) { if (e.target.id === 'modal-ov') closeModal(); }
