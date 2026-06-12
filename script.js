/**
 * script.js
 * SPA navigation, interactivity, quiz, and a real-time simulator for Transformasi Geometri.
 * Semua fungsi diberi komentar untuk memudahkan pemahaman.
 */

/* ---------------------- Small DOM helpers ---------------------- */
const qs = (s, ctx=document) => ctx.querySelector(s);
const qsa = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* ---------------------- SPA Navigation ---------------------- */
// Show one section (by data-id) and hide others; update active nav item
function showSection(id){
  const sections = qsa('.spa-section');
  sections.forEach(sec=>{
    if(sec.dataset.id === id){ sec.classList.remove('hidden'); sec.classList.add('active') }
    else{ sec.classList.add('hidden'); sec.classList.remove('active') }
  });
  // update nav active class
  qsa('.nav-list a').forEach(a=>{
    a.classList.toggle('active', a.dataset.target===id);
  });
}

// Attach click handlers to nav links (data-target) to route SPA
qsa('.nav-list a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const target = a.dataset.target;
    if(target) showSection(target);
    // update address bar hash (optional)
    history.replaceState(null, '', '#'+target);
  });
});

// On load, read hash to show section
window.addEventListener('load', ()=>{
  const hash = location.hash.replace('#','') || 'home';
  showSection(hash);
});

/* ---------------------- Toggle show/hide for pembahasan examples ---------------------- */
// Buttons have class .toggle-sol and data-target pointing to solution id
qsa('.toggle-sol').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.target;
    const el = document.getElementById(id);
    if(!el) return;
    const shown = !el.classList.contains('hidden');
    el.classList.toggle('hidden');
    btn.textContent = shown ? 'Tampilkan Pembahasan' : 'Sembunyikan Pembahasan';
  });
});

/* ---------------------- Home canvas: simple Cartesian axes illustration ----------------------
   Fungsi ini menggambar grid dan sumbu pada canvas 'home-canvas'.
*/
function drawHomeCanvas(){
  const c = qs('#home-canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  // background
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,w,h);
  // thin grid
  ctx.strokeStyle = '#eef2ff'; ctx.lineWidth = 1;
  const step = 30;
  for(let x=0;x<w;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=0;y<h;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  // axes
  ctx.strokeStyle = '#0ea5ff'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke(); // x
  ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.stroke(); // y
  // origin marker
  ctx.fillStyle = '#8b5cf6'; ctx.beginPath(); ctx.arc(w/2,h/2,4,0,Math.PI*2); ctx.fill();
}

/* ---------------------- Quiz: render & scoring ---------------------- */
// Quiz questions (10 soal) — setiap item: {q, opts:[], a:index}
const QUIZ = [
  {q:'Translasi titik (2,3) dengan vektor (1,-2) menghasilkan?', opts:['(3,1)','(1,5)','(2,1)','(3,5)'], a:0},
  {q:'Refleksi (3,-2) terhadap sumbu-X menjadi?', opts:['(3,2)','(-3,2)','(3,-2)','(-3,-2)'], a:0},
  {q:'Rotasi 90° CCW pada (1,0) menghasilkan?', opts:['(0,1)','(0,-1)','(-1,0)','(1,0)'], a:0},
  {q:'Dilatasi (2,3) dengan k=0.5 menghasilkan?', opts:['(1,1.5)','(4,6)','(2,1.5)','(1,3)'], a:0},
  {q:'Refleksi terhadap garis y=x mengubah (2,5) menjadi?', opts:['(5,2)','(-5,-2)','(2,5)','(-2,-5)'], a:0},
  {q:'Jika hasil translasi (x,y) → (x+3,y-1) dan A(0,0), A\' adalah?', opts:['(3,-1)','(1,1)','(-3,1)','(0,0)'], a:0},
  {q:'Rotasi 180° pada (3,4) menjadi?', opts:['(-3,-4)','(4,-3)','(-4,3)','(3,4)'], a:0},
  {q:'Dilatasi negatif k akan menyebabkan?', opts:['Pembalikan orientasi','Hanya pembesaran','Hanya pengecilan','Tidak ada perubahan'], a:0},
  {q:'Hasil refleksi terhadap titik O dari (a,b) adalah?', opts:['(-a,-b)','(a,b)','(b,a)','(-b,-a)'], a:0},
  {q:'Komposisi translasi (2,1) lalu (-2,-1) hasilnya?', opts:['kembali semula','hasil (4,2)','hasil (0,0) selalu','tidak terdefinisi'], a:0}
];

// Render quiz questions into #quiz-list
function renderQuiz(){
  const list = qs('#quiz-list'); list.innerHTML='';
  QUIZ.forEach((item,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<p>${i+1}. ${item.q}</p>`;
    const ul = document.createElement('ul'); ul.style.listStyle='none'; ul.style.padding='0';
    item.opts.forEach((opt,j)=>{
      const liopt = document.createElement('li');
      liopt.innerHTML = `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label>`;
      ul.appendChild(liopt);
    });
    li.appendChild(ul); list.appendChild(li);
  });
}
renderQuiz();

// Check answers and show score with feedback
qs('#check-answers').addEventListener('click', ()=>{
  let correct=0, total=QUIZ.length;
  QUIZ.forEach((item,i)=>{
    const sel = qs(`input[name=q${i}]:checked`);
    if(sel && Number(sel.value)===item.a) correct++;
  });
  const score = Math.round((correct/total)*100);
  const res = qs('#quiz-result');
  let msg = `Skor: ${score}% — Benar: ${correct}, Salah: ${total-correct}. `;
  if(score===100) msg += 'Sangat baik — lanjutkan!';
  else if(score>=70) msg += 'Bagus, perbaiki bagian yang belum benar.';
  else if(score>=40) msg += 'Perlu latihan lebih, coba ulang.';
  else msg += 'Jangan menyerah — pelajari kembali materi lalu coba lagi.';
  res.textContent = msg;
});
qs('#reset-quiz').addEventListener('click', ()=>{ qs('#quiz-form').reset(); qs('#quiz-result').textContent=''; });

/* ---------------------- Simulator (real-time) ----------------------
   - Menggambar grid pada canvas '#sim-canvas'
   - Menggambar titik P (awal) dan P' (hasil transformasi)
   - Meng-update saat input berubah (real-time)
*/
const simCanvas = qs('#sim-canvas');
const simCtx = simCanvas.getContext('2d');
const simW = simCanvas.width, simH = simCanvas.height;
const origin = {x: simW/2, y: simH/2};
const unit = 20; // pixels per unit

/** Gambar grid dan sumbu pada canvas simulator */
function drawSimGrid(){
  simCtx.clearRect(0,0,simW,simH);
  simCtx.fillStyle = '#ffffff'; simCtx.fillRect(0,0,simW,simH);
  simCtx.strokeStyle = '#eef2ff'; simCtx.lineWidth=1;
  for(let x=0;x<=simW;x+=unit){ simCtx.beginPath(); simCtx.moveTo(x,0); simCtx.lineTo(x,simH); simCtx.stroke(); }
  for(let y=0;y<=simH;y+=unit){ simCtx.beginPath(); simCtx.moveTo(0,y); simCtx.lineTo(simW,y); simCtx.stroke(); }
  simCtx.strokeStyle = '#0ea5ff'; simCtx.lineWidth=2;
  simCtx.beginPath(); simCtx.moveTo(0,origin.y); simCtx.lineTo(simW,origin.y); simCtx.stroke();
  simCtx.beginPath(); simCtx.moveTo(origin.x,0); simCtx.lineTo(origin.x,simH); simCtx.stroke();
}

/** Convert logical point (x,y) to canvas coordinates */
function toCanvas(pt){ return {x: origin.x + pt.x*unit, y: origin.y - pt.y*unit}; }

/** Draw a labeled point on simulator canvas */
function drawPoint(pt, color='#8b5cf6', label='P'){
  const c = toCanvas(pt);
  simCtx.fillStyle = color; simCtx.beginPath(); simCtx.arc(c.x,c.y,6,0,Math.PI*2); simCtx.fill();
  simCtx.fillStyle = '#334155'; simCtx.font = '12px sans-serif'; simCtx.fillText(label, c.x+8, c.y-8);
}

/** Render parameter input fields based on transform type */
function renderParams(){
  const type = qs('#sim-type').value;
  const params = qs('#params'); params.innerHTML='';
  if(type==='translasi'){
    params.innerHTML = `
      <label>a (horizontal): <input id="p-a" type="number" value="1" step="any"></label>
      <label>b (vertikal): <input id="p-b" type="number" value="-1" step="any"></label>
    `;
  } else if(type==='refleksi'){
    params.innerHTML = `
      <label>Pilih garis/titik:
        <select id="p-ref">
          <option value="x">Sumbu-X</option>
          <option value="y">Sumbu-Y</option>
          <option value="o">Titik O</option>
          <option value="yx">Garis y=x</option>
          <option value="y-x">Garis y=-x</option>
        </select>
      </label>
    `;
  } else if(type==='rotasi'){
    params.innerHTML = `
      <label>Sudut (derajat, CCW): <input id="p-theta" type="number" value="90"></label>
    `;
  } else if(type==='dilatasi'){
    params.innerHTML = `
      /* script.js
         SPA behavior, interactivity, and simulator for Transformasi Geometri.
         Semua fungsi diberi komentar untuk kemudahan pemahaman.
      */

      // ---------------------- Utility helpers ----------------------
      /** qs(selector, ctx) — singkatan querySelector */
      function qs(selector, ctx=document){ return ctx.querySelector(selector) }
      /** qsa(selector, ctx) — singkatan querySelectorAll (mengembalikan array) */
      function qsa(selector, ctx=document){ return Array.from(ctx.querySelectorAll(selector)) }

      // ---------------------- SPA Navigation (state-based) ----------------------
      /** setActiveSection(id) — menampilkan section SPA berdasarkan data-id */
      function setActiveSection(id){
        qsa('.spa-section').forEach(sec=>{
          if(sec.dataset.id === id){ sec.classList.remove('hidden'); sec.classList.add('active') }
          else { sec.classList.add('hidden'); sec.classList.remove('active') }
        })
        // update active nav link
        qsa('.nav-list a').forEach(a=>{
          if(a.dataset.target === id) a.classList.add('active'); else a.classList.remove('active');
        })
        // focus first focusable element in section for accessibility
        const sec = document.querySelector(`.spa-section[data-id="${id}"]`);
        if(sec) setTimeout(()=>{ const btn = sec.querySelector('button, a, input, select, textarea'); if(btn) btn.focus(); }, 120);
      }

      // Attach SPA nav handlers
      qsa('.nav-list a').forEach(a=>{
        a.addEventListener('click', e=>{
          e.preventDefault();
          const target = a.dataset.target || 'home';
          setActiveSection(target);
          // update URL hash (optional, no reload)
          history.replaceState(null,'',`#${target}`);
        })
      });

      // On load, restore section from hash
      window.addEventListener('load', ()=>{
        const id = location.hash ? location.hash.replace('#','') : 'home';
        setActiveSection(id);
        drawHomeCanvas(); // draw static home canvas
        drawSimGrid(); // draw simulator grid
      });

      // ---------------------- Toggle solusi (show/hide) ----------------------
      /** enableSolutionToggles() — menghubungkan tombol show/hide untuk pembahasan */
      function enableSolutionToggles(){
        qsa('.toggle-sol').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            const id = btn.dataset.target; const el = document.getElementById(id);
            if(!el) return;
            const shown = !el.classList.contains('hidden');
            if(shown){ el.classList.add('hidden'); btn.textContent='Tampilkan Pembahasan' }
            else { el.classList.remove('hidden'); btn.textContent='Sembunyikan Pembahasan' }
          })
          // keyboard accessibility
          btn.addEventListener('keydown', e=>{ if(e.key==='Enter') btn.click(); })
        })
      }
      enableSolutionToggles();

      // ---------------------- Home canvas — menggambar bidang koordinat sederhana ----------------------
      /** drawHomeCanvas() — menggambar grid & sumbu di canvas home */
      function drawHomeCanvas(){
        const c = qs('#home-canvas'); if(!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        ctx.clearRect(0,0,w,h);
        // background
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,w,h);
        // soft grid
        ctx.strokeStyle = '#eef6ff'; ctx.lineWidth = 1;
        for(let x=0;x<w;x+=30){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
        for(let y=0;y<h;y+=30){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }
        // axes
        ctx.strokeStyle = '#0ea5ff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke(); // x
        ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.stroke(); // y
        // origin
        ctx.fillStyle = '#0ea5ff'; ctx.beginPath(); ctx.arc(w/2,h/2,4,0,Math.PI*2); ctx.fill();
      }

      // ---------------------- Quiz: 10 soal + scoring ----------------------
      /* QUIZ array berisi objek soal: {q, opts, a} */
      const QUIZ = [
        {q:'Translasi titik (2,3) dengan vektor (1,-2) menghasilkan?', opts:['(3,1)','(1,5)','(2,1)','(3,5)'], a:0},
        {q:'Refleksi (3,-2) terhadap sumbu-X menjadi?', opts:['(3,2)','(-3,2)','(3,-2)','(-3,-2)'], a:0},
        {q:'Rotasi 90° CCW pada (1,0) menghasilkan?', opts:['(0,1)','(0,-1)','(-1,0)','(1,0)'], a:0},
        {q:'Dilatasi (2,3) dengan k=0.5 menghasilkan?', opts:['(1,1.5)','(4,6)','(2,1.5)','(1,3)'], a:0},
        {q:'Refleksi terhadap garis y=x mengubah (2,5) menjadi?', opts:['(5,2)','(-5,-2)','(2,5)','(-2,-5)'], a:0},
        {q:'Jika hasil translasi (x,y) → (x+3,y-1) dan A(0,0), A\' adalah?', opts:['(3,-1)','(1,1)','(-3,1)','(0,0)'], a:0},
        {q:'Rotasi 180° pada (3,4) menjadi?', opts:['(-3,-4)','(4,-3)','(-4,3)','(3,4)'], a:0},
        {q:'Dilatasi negatif k akan menyebabkan?', opts:['Pembalikan orientasi','Hanya pembesaran','Hanya pengecilan','Tidak ada perubahan'], a:0},
        {q:'Hasil refleksi terhadap titik O dari (a,b) adalah?', opts:['(-a,-b)','(a,b)','(b,a)','(-b,-a)'], a:0},
        {q:'Komposisi translasi (2,1) lalu (-2,-1) hasilnya?', opts:['kembali semula','hasil (4,2)','hasil (0,0) selalu','tidak terdefinisi'], a:0}
      ];

      /** renderQuiz() — buat DOM quiz berdasarkan array QUIZ */
      function renderQuiz(){
        const list = qs('#quiz-list'); if(!list) return; list.innerHTML='';
        QUIZ.forEach((item,i)=>{
          const li = document.createElement('li');
          li.innerHTML = `<p>${i+1}. ${item.q}</p>`;
          const ul = document.createElement('ul'); ul.style.listStyle='none'; ul.style.padding='0'; ul.style.margin='0.3rem 0 0 0';
          item.opts.forEach((opt,j)=>{
            const liopt = document.createElement('li');
            liopt.innerHTML = `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label>`;
            ul.appendChild(liopt);
          })
          li.appendChild(ul); list.appendChild(li);
        })
      }
      renderQuiz();

      /** checkQuiz() — periksa jawaban, hitung skor, dan tampilkan pesan motivasi */
      function checkQuiz(){
        let correct=0, wrong=0;
        QUIZ.forEach((item,i)=>{
          const sel = qs(`input[name=q${i}]:checked`);
          if(sel){ if(Number(sel.value)===item.a) correct++; else wrong++ }
          else wrong++;
        })
        const res = qs('#quiz-result'); const score = Math.round((correct/QUIZ.length)*100);
        let msg = `Skor: ${score}% — Benar: ${correct}, Salah: ${wrong}. `;
        if(score===100) msg += 'Sangat baik — prestasi sempurna!';
        else if(score>=80) msg += 'Bagus — usaha yang sangat baik.';
        else if(score>=60) msg += 'Cukup — ulangi beberapa soal yang salah.';
        else msg += 'Perlu latihan lebih — coba pelajari kembali materi dan kerjakan ulang.';
        res.textContent = msg;
      }
      qs('#check-answers').addEventListener('click', checkQuiz);
      qs('#reset-quiz').addEventListener('click', ()=>{ document.getElementById('quiz-form').reset(); qs('#quiz-result').textContent=''; })

      // ---------------------- Simulator (real-time) ----------------------
      const simCanvas = qs('#sim-canvas');
      const simCtx = simCanvas.getContext('2d');
      const simW = simCanvas.width, simH = simCanvas.height;
      const origin = {x: simW/2, y: simH/2};
      const unit = 24; // pixels per unit; pilih ukuran agar grid rapi

      /** drawSimGrid() — menggambar grid dan sumbu pada canvas simulator */
      function drawSimGrid(){
        simCtx.clearRect(0,0,simW,simH);
        // background
        simCtx.fillStyle = '#ffffff'; simCtx.fillRect(0,0,simW,simH);
        // vertical/horizontal grid
        simCtx.strokeStyle = '#f1f8ff'; simCtx.lineWidth=1;
        for(let x=0;x<=simW;x+=unit){ simCtx.beginPath(); simCtx.moveTo(x,0); simCtx.lineTo(x,simH); simCtx.stroke(); }
        for(let y=0;y<=simH;y+=unit){ simCtx.beginPath(); simCtx.moveTo(0,y); simCtx.lineTo(simW,y); simCtx.stroke(); }
        // axes
        simCtx.strokeStyle = '#0ea5ff'; simCtx.lineWidth=2;
        simCtx.beginPath(); simCtx.moveTo(0,origin.y); simCtx.lineTo(simW,origin.y); simCtx.stroke();
        simCtx.beginPath(); simCtx.moveTo(origin.x,0); simCtx.lineTo(origin.x,simH); simCtx.stroke();
      }

      /** toCanvas(pt) — konversi koordinat matematika (x,y) ke koordinat canvas */
      function toCanvas(pt){ return {x: origin.x + pt.x*unit, y: origin.y - pt.y*unit} }

      /** drawPoint(pt, color, label) — gambar titik dengan label pada canvas */
      function drawPoint(pt, color='#8b5cf6', label=null){
        const c = toCanvas(pt);
        simCtx.fillStyle = color; simCtx.beginPath(); simCtx.arc(c.x,c.y,6,0,Math.PI*2); simCtx.fill();
        if(label){ simCtx.fillStyle='#0f172a'; simCtx.font='12px system-ui'; simCtx.fillText(label, c.x+8, c.y-8); }
      }

      /** renderParams() — tunjukkan kontrol parameter sesuai jenis transformasi */
      function renderParams(){
        const type = qs('#sim-type').value; const params = qs('#params'); params.innerHTML='';
        if(type==='translasi'){
          params.innerHTML = `
            <label style="display:block;margin-top:0.5rem">a (horizontal): <input id="p-a" type="number" value="1" step="any"></label>
            <label style="display:block;margin-top:0.3rem">b (vertikal): <input id="p-b" type="number" value="-1" step="any"></label>
          `;
        } else if(type==='refleksi'){
          params.innerHTML = `
            <label style="display:block;margin-top:0.5rem">Pilih:</label>
            <select id="p-ref">
              <option value="x">Sumbu-X</option>
              <option value="y">Sumbu-Y</option>
              <option value="o">Titik O (0,0)</option>
              <option value="yx">Garis y = x</option>
              <option value="y-x">Garis y = -x</option>
            </select>
          `;
        } else if(type==='rotasi'){
          params.innerHTML = `
            <label style="display:block;margin-top:0.5rem">Sudut (derajat, CCW positif): <input id="p-theta" type="number" value="90"></label>
          `;
        } else if(type==='dilatasi'){
          params.innerHTML = `
            <label style="display:block;margin-top:0.5rem">k (faktor skala): <input id="p-k" type="number" value="2" step="any"></label>
          `;
        }
      }
      qs('#sim-type').addEventListener('change', ()=>{ renderParams(); updateSim(); });
      renderParams();

      /** computeTransformation(pt, type) — hitung titik hasil dan langkah perhitungan */
      function computeTransformation(pt, type){
        let result = {x:pt.x, y:pt.y};
        const steps = [];
        if(type==='translasi'){
          const a = Number(qs('#p-a').value), b = Number(qs('#p-b').value);
          steps.push(`Rumus: (x,y) → (x+a, y+b)`);
          steps.push(`Hitung: (${pt.x}, ${pt.y}) → (${pt.x}+${a}, ${pt.y}+${b}) = (${pt.x+a}, ${pt.y+b})`);
          result = {x: pt.x + a, y: pt.y + b};
        } else if(type==='refleksi'){
          const ref = qs('#p-ref').value;
          if(ref==='x'){ result={x:pt.x,y:-pt.y}; steps.push(`Refleksi sumbu-X: (x,y)→(x,-y) → (${result.x},${result.y})`) }
          else if(ref==='y'){ result={x:-pt.x,y:pt.y}; steps.push(`Refleksi sumbu-Y: (x,y)→(-x,y) → (${result.x},${result.y})`) }
          else if(ref==='o'){ result={x:-pt.x,y:-pt.y}; steps.push(`Refleksi titik O: (x,y)→(-x,-y) → (${result.x},${result.y})`) }
          else if(ref==='yx'){ result={x:pt.y,y:pt.x}; steps.push(`Refleksi garis y=x: (x,y)→(y,x) → (${result.x},${result.y})`) }
          else if(ref==='y-x'){ result={x:-pt.y,y:-pt.x}; steps.push(`Refleksi garis y=-x: (x,y)→(-y,-x) → (${result.x},${result.y})`) }
        } else if(type==='rotasi'){
          const deg = Number(qs('#p-theta').value) % 360; const rad = deg * Math.PI/180;
          const xr = +(pt.x*Math.cos(rad) - pt.y*Math.sin(rad)).toFixed(6);
          const yr = +(pt.x*Math.sin(rad) + pt.y*Math.cos(rad)).toFixed(6);
          result = {x:xr,y:yr};
          steps.push(`Rotasi ${deg}° CCW dengan matriks rotasi`);
          steps.push(`Hitung: (${xr}, ${yr})`);
        } else if(type==='dilatasi'){
          const k = Number(qs('#p-k').value);
          result = {x: +(pt.x*k), y: +(pt.y*k)};
          steps.push(`Dilatasi k=${k}: (x,y)→(kx,ky) → (${result.x}, ${result.y})`);
        }
        return {result, steps};
      }

      /** updateSim() — ambil input dari user, hitung transformasi, dan render di canvas */
      function updateSim(){
        const x = Number(qs('#sim-x').value || 0); const y = Number(qs('#sim-y').value || 0);
        const type = qs('#sim-type').value;
        const base = {x,y};
        const {result, steps} = computeTransformation(base, type);
        drawSimGrid(); drawPoint(base,'#0ea5ff','P'); drawPoint(result,'#8b5cf6',"P' ");
        // show steps
        const stepsEl = qs('#sim-steps'); stepsEl.innerHTML=''; steps.forEach(s=>{ const p=document.createElement('p'); p.textContent=s; stepsEl.appendChild(p); });
      }

      // Wire up simulator controls
      qs('#sim-x').addEventListener('input', updateSim); qs('#sim-y').addEventListener('input', updateSim);
      qs('#sim-type').addEventListener('input', ()=>{ renderParams(); setTimeout(()=>{ qs('#p-a')?.addEventListener('input',updateSim); qs('#p-b')?.addEventListener('input',updateSim); qs('#p-k')?.addEventListener('input',updateSim); qs('#p-theta')?.addEventListener('input',updateSim); qs('#p-ref')?.addEventListener('change',updateSim); updateSim(); },50); });

      // Apply click handlers for initial param inputs
      qs('#apply-transform').addEventListener('click', updateSim);
      qs('#reset-sim').addEventListener('click', ()=>{ qs('#sim-x').value=0; qs('#sim-y').value=0; renderParams(); drawSimGrid(); qs('#sim-steps').innerHTML=''; });

      // Draw initial views
      drawHomeCanvas(); drawSimGrid(); updateSim();

      // Make canvas adapt on window resize (redraw static layouts)
      window.addEventListener('resize', ()=>{ drawHomeCanvas(); drawSimGrid(); updateSim(); });

      // End of script.js