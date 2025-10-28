/* recursos.js
   - Carga `paginas/recursos-data.json`
   - Renderiza tarjetas con miniatura y botones por formato
   - Permite descarga al hacer clic en cada botón
*/

// Small helper: create element from html
function createEl(html){
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstChild;
}

async function loadIndex(){
  const idx = await fetch('/paginas/recursos-index.json').then(r=>r.json());
  const container = document.getElementById('grid-recursos');
  const filters = document.createElement('div');
  filters.className = 'recursos-filters';

  // search input
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Buscar recursos...';
  search.id = 'recursos-search';
  search.style.marginRight = '12px';
  filters.appendChild(search);

  const catButtons = {};
  idx.categories.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat.title;
    btn.dataset.file = cat.file;
    btn.dataset.cat = cat.id;
    btn.addEventListener('click', ()=> loadCategory(cat.file, cat.id));
    filters.appendChild(btn);
    catButtons[cat.id] = btn;
  });

  container.parentNode.insertBefore(filters, container);

  // simple debounce search
  let timeout;
  search.addEventListener('input', (e)=>{
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      const q = e.target.value.trim().toLowerCase();
      // apply simple in-memory filter if category already loaded
      applySearchFilter(q);
    },300);
  });

  // helper to mark active
  function setActiveCat(catId){
    Object.keys(catButtons).forEach(k=>catButtons[k].classList.remove('active'));
    if(catButtons[catId]){
      catButtons[catId].classList.add('active');
      // set CSS var for active color based on known mapping
      const colorMap = {
        'espoch':'#0057B8','gobierno':'#007A33','ciudad':'#B85A00','marcas_comerciales':'#C70039','marcas_tecnologicas':'#0F62FE','marcas_herramientas':'#6F42C1','plantillas':'#2E7D32'
      };
      const color = colorMap[catId] || '#0078d4';
      document.documentElement.style.setProperty('--cat-active-bg', color);
    }
  }

  // load first category by default
  if(idx.categories.length) loadCategory(idx.categories[0].file, idx.categories[0].id);

  // expose setter for use by loadCategory
  window.__setActiveCategory = setActiveCat;
}

let currentResources = [];

function applySearchFilter(query){
  const container = document.getElementById('grid-recursos');
  if(!query){
    // show all
    container.querySelectorAll('.recurso-card').forEach(el=>el.style.display='');
    return;
  }
  container.querySelectorAll('.recurso-card').forEach(el=>{
    const text = (el.dataset.title + ' ' + (el.dataset.tags||'')).toLowerCase();
    el.style.display = text.includes(query) ? '' : 'none';
  });
}

async function loadCategory(file, catId){
  const container = document.getElementById('grid-recursos');
  container.innerHTML = '';
  try{
    const res = await fetch(file);
    if(!res.ok) throw new Error('No se pudo cargar categoría');
    const data = await res.json();
    currentResources = data;

    data.forEach(item=>{
      const card = document.createElement('article');
      card.className = 'recurso-card';
      card.dataset.id = item.id;
      card.dataset.title = item.title;
      card.dataset.tags = (item.tags||[]).join(' ');

      // default variant index
      const variantIndex = 0;
      const variant = item.variants && item.variants[variantIndex];

      card.innerHTML = `
        <div class="recurso-media">
          <div class="recurso-media-inner">
            <button class="variant-arrow left" aria-label="Anterior variante">&#9664;</button>
            <img src="${variant ? variant.preview : ''}" alt="${item.title}" class="recurso-thumb" loading="lazy">
            <button class="variant-arrow right" aria-label="Siguiente variante">&#9654;</button>
            <div class="variant-counter">${variant ? 1 : 0} / ${item.variants ? item.variants.length : 0}</div>
          </div>
        </div>
        <div class="recurso-content">
          <h3 class="recurso-title">${item.title}</h3>
        </div>
        <div class="recurso-overlay">
          <div class="format-buttons" role="group" aria-label="Formatos disponibles">
            ${(variant && variant.files) ? variant.files.map(f=>`<button data-url="${f.url}" data-type="${f.type}">${f.type.toUpperCase()}</button>`).join('') : ''}
          </div>
        </div>
      `;

      // attach variant behavior
      const left = card.querySelector('.variant-arrow.left');
      const right = card.querySelector('.variant-arrow.right');
      const img = card.querySelector('.recurso-thumb');
      const overlay = card.querySelector('.format-buttons');
      let vi = variantIndex;

      function updateVariant(){
        const v = item.variants && item.variants[vi];
        if(!v) return;
        img.src = v.preview || '';
        // rebuild buttons
        overlay.innerHTML = v.files.map(f=>`<button data-url="${f.url}" data-type="${f.type}">${f.type.toUpperCase()}</button>`).join('');
        const counter = card.querySelector('.variant-counter');
        if(counter) counter.textContent = `${vi+1} / ${item.variants.length}`;
      }

      if(item.variants && item.variants.length > 1){
        left.addEventListener('click', ()=>{ vi = (vi - 1 + item.variants.length) % item.variants.length; updateVariant(); });
        right.addEventListener('click', ()=>{ vi = (vi + 1) % item.variants.length; updateVariant(); });
      } else {
        // hide arrows and counter
        left.style.display = 'none';
        right.style.display = 'none';
        const counter = card.querySelector('.variant-counter');
        if(counter) counter.style.display = 'none';
      }

      // delegate download clicks inside card
      card.addEventListener('click', async (e)=>{
        const btn = e.target.closest('button[data-url]');
        if(!btn) return;
        const url = btn.dataset.url;
        const filename = (url.split('/').pop() || `${item.id}.${btn.dataset.type}`);
        // Try direct download first
        try {
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (err) {
          // fallback: fetch as blob and force download
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo descargar el archivo');
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(()=>URL.revokeObjectURL(blobUrl), 2000);
          } catch (err2) {
            alert('No se pudo descargar el archivo.');
          }
        }
      });

      container.appendChild(card);
    });

  }catch(err){
    console.error(err);
    container.innerHTML = '<p>No fue posible cargar la categoría.</p>';
  }
  // mark active UI
  if(window.__setActiveCategory) window.__setActiveCategory(catId);
}

document.addEventListener('DOMContentLoaded', loadIndex);
