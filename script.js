// Master Transformasi Geometri - Script Utama
// Mengelola Navigasi, Kuis, dan Simulator

// --- 0. MOBILE MENU ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link (for mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// --- 1. NAVIGASI ---
function MapsTo(sectionId) {
    // Sembunyikan semua section
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Tampilkan section yang dipilih
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- 2. BANK SOAL KUIS (40 Soal + Campuran) ---
const QUIZ_BANK = {
    translasi: [
        { q: "Titik A(1, 2) ditranslasi oleh T(3, 4). Bayangannya adalah...", o: ["(4, 6)", "(2, 6)", "(4, 8)", "(3, 5)"], a: 0, x: "1+3=4, 2+4=6." },
        { q: "Jika P'(5, -1) adalah bayangan P(2, 3) oleh T(a, b), maka T adalah...", o: ["(3, -4)", "(-3, 4)", "(7, 2)", "(3, 4)"], a: 0, x: "a=5-2=3, b=-1-3=-4." },
        { q: "Bayangan titik (0, 0) oleh T(-5, 2) adalah...", o: ["(-5, 2)", "(5, -2)", "(0, 0)", "(-5, -2)"], a: 0, x: "0+(-5)=-5, 0+2=2." },
        { q: "Titik B(-1, -1) digeser 2 ke kanan dan 3 ke atas menjadi...", o: ["(1, 2)", "(-3, -4)", "(1, -4)", "(-3, 2)"], a: 0, x: "x=-1+2=1, y=-1+3=2." },
        { q: "Hasil translasi T(1, 1) dilanjutkan T(2, 2) sama dengan translasi...", o: ["T(3, 3)", "T(1, 1)", "T(2, 2)", "T(0, 0)"], a: 0, x: "(1+2, 1+2) = (3, 3)." },
        { q: "Bayangan garis y = x oleh T(0, 1) adalah...", o: ["y = x + 1", "y = x - 1", "y = x", "y = 2x"], a: 0, x: "y-1 = x => y = x+1." },
        { q: "Jika (x, y) ditranslasi (2, 3) menjadi (5, 5), maka x + y = ...", o: ["5", "10", "8", "7)"], a: 0, x: "x=5-2=3, y=5-3=2. 3+2=5." },
        { q: "Titik (4, 10) adalah bayangan (a, b) oleh T(4, 10). Maka (a, b) adalah...", o: ["(0, 0)", "(8, 20)", "(4, 10)", "(-4, -10)"], a: 0, x: "a=4-4=0, b=10-10=0." },
        { q: "Translasi T(-2, -3) memindahkan titik ke arah...", o: ["Kiri 2, Bawah 3", "Kanan 2, Atas 3", "Kiri 2, Atas 3", "Kanan 2, Bawah 3"], a: 0, x: "Negatif x = kiri, negatif y = bawah." },
        { q: "Segitiga ditranslasi, apakah luasnya berubah?", o: ["Tidak", "Ya, jadi lebih besar", "Ya, jadi lebih kecil", "Tergantung vektor"], a: 0, x: "Translasi adalah isometri (mempertahankan ukuran)." }
    ],
    refleksi: [
        { q: "Bayangan A(3, 4) terhadap sumbu X adalah...", o: ["(3, -4)", "(-3, 4)", "(-3, -4)", "(4, 3)"], a: 0, x: "(x, y) -> (x, -y)." },
        { q: "Refleksi B(-2, 5) terhadap sumbu Y menghasilkan...", o: ["(2, 5)", "(-2, -5)", "(2, -5)", "(5, -2)"], a: 0, x: "(x, y) -> (-x, y)." },
        { q: "Titik (1, 2) dicerminkan terhadap y = x menjadi...", o: ["(2, 1)", "(-1, -2)", "(-2, -1)", "(1, 2)"], a: 0, x: "(x, y) -> (y, x)." },
        { q: "Bayangan (4, -1) terhadap garis y = -x adalah...", o: ["(1, -4)", "(-1, 4)", "(-4, 1)", "(4, 1)"], a: 0, x: "(x, y) -> (-y, -x)." },
        { q: "Refleksi terhadap titik asal (0, 0) dari (x, y) adalah...", o: ["(-x, -y)", "(y, x)", "(-y, -x)", "(x, y)"], a: 0, x: "Kedua tanda berubah." },
        { q: "Pencerminan terhadap garis x = 2 dari titik (1, 5) adalah...", o: ["(3, 5)", "(1, 5)", "(0, 5)", "(2, 5)"], a: 0, x: "2(2) - 1 = 3." },
        { q: "Pencerminan terhadap garis y = 3 dari titik (2, 1) adalah...", o: ["(2, 5)", "(2, 1)", "(2, 3)", "(2, 2)"], a: 0, x: "2(3) - 1 = 5." },
        { q: "Jika A'(-2, 3) bayangan A terhadap sumbu Y, maka A adalah...", o: ["(2, 3)", "(-2, -3)", "(2, -3)", "(-2, 3)"], a: 0, x: "-(-2) = 2." },
        { q: "Bayangan garis y = 2 terhadap sumbu X adalah...", o: ["y = -2", "x = 2", "y = 2", "x = -2"], a: 0, x: "y jadi -y." },
        { q: "Sifat refleksi adalah...", o: ["Jarak benda ke cermin = jarak bayangan ke cermin", "Ukuran bayangan jadi dua kali lipat", "Bayangan selalu di atas benda", "Benda berubah bentuk"], a: 0, x: "Definisi dasar refleksi." }
    ],
    rotasi: [
        { q: "Rotasi 90° CCW terhadap (0,0) dari titik (1, 0) adalah...", o: ["(0, 1)", "(0, -1)", "(-1, 0)", "(1, 0)"], a: 0, x: "(x, y) -> (-y, x)." },
        { q: "Bayangan (2, 3) diputar 180° terhadap (0,0) adalah...", o: ["(-2, -3)", "(3, 2)", "(-3, -2)", "(2, -3)"], a: 0, x: "(x, y) -> (-x, -y)." },
        { q: "Rotasi 270° CCW terhadap (0,0) dari (1, 2) adalah...", o: ["(2, -1)", "(-2, 1)", "(-1, 2)", "(1, -2)"], a: 0, x: "(x, y) -> (y, -x)." },
        { q: "Diputar -90° (searah jarum jam) sama dengan diputar...", o: ["270° CCW", "90° CCW", "180° CCW", "360° CCW"], a: 0, x: "360 - 90 = 270." },
        { q: "Titik (5, 0) diputar 90° menjadi...", o: ["(0, 5)", "(0, -5)", "(-5, 0)", "(5, 5)"], a: 0, x: "x=0, y=5." },
        { q: "Hasil rotasi 360° dari (a, b) adalah...", o: ["(a, b)", "(-a, -b)", "(b, a)", "(0, 0)"], a: 0, x: "Kembali ke posisi awal." },
        { q: "Rotasi 180° sama dengan refleksi terhadap...", o: ["Titik asal (0, 0)", "Sumbu X", "Sumbu Y", "Garis y=x"], a: 0, x: "Keduanya menghasilkan (-x, -y)." },
        { q: "Jika (0, 1) diputar 90° menjadi (-1, 0), berapakah pusatnya?", o: ["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)"], a: 0, x: "Gunakan rumus standar pusat (0,0)." },
        { q: "Rotasi adalah transformasi yang mempertahankan...", o: ["Jarak dan sudut", "Hanya jarak", "Hanya sudut", "Luas saja"], a: 0, x: "Rotasi adalah isometri." },
        { q: "Bayangan (1, 1) diputar 90° adalah...", o: ["(-1, 1)", "(1, -1)", "(-1, -1)", "(1, 1)"], a: 0, x: "(-y, x) -> (-1, 1)." }
    ],
    dilatasi: [
        { q: "Titik (2, 4) didilatasi [O, 2]. Bayangannya...", o: ["(4, 8)", "(1, 2)", "(4, 4)", "(2, 8)"], a: 0, x: "2*2=4, 4*2=8." },
        { q: "Hasil dilatasi [O, 1/2] dari (10, -6) adalah...", o: ["(5, -3)", "(20, -12)", "(5, 3)", "(-5, 3)"], a: 0, x: "10/2=5, -6/2=-3." },
        { q: "Faktor skala k jika (1, 2) menjadi (5, 10) adalah...", o: ["5", "1/5", "2", "10"], a: 0, x: "1*k=5 => k=5." },
        { q: "Bayangan (3, 3) didilatasi k=-1 adalah...", o: ["(-3, -3)", "(3, 3)", "(0, 0)", "(1, 1)"], a: 0, x: "3*-1=-3." },
        { q: "Luas persegi 4 didilatasi k=2. Luas barunya...", o: ["16", "8", "4", "2"], a: 0, x: "k^2 * Luas = 4 * 4 = 16." },
        { q: "Dilatasi [O, k] memindahkan (2, 2) ke (1, 1). k = ...", o: ["1/2", "2", "-2", "0"], a: 0, x: "2k=1 => k=1/2." },
        { q: "Objek didilatasi k > 1 maka objek akan...", o: ["Diperbesar", "Diperkecil", "Tetap", "Hilang"], a: 0, x: "Definisi faktor skala." },
        { q: "Objek didilatasi 0 < k < 1 maka objek akan...", o: ["Diperkecil", "Diperbesar", "Tetap", "Berubah arah"], a: 0, x: "Definisi faktor skala." },
        { q: "Dilatasi pusat (0,0) faktor k. Matriksnya adalah...", o: ["[[k, 0], [0, k]]", "[[1, 0], [0, 1]]", "[[0, k], [k, 0]]", "[[k, k], [k, k]]"], a: 0, x: "Representasi matriks dilatasi." },
        { q: "Bayangan (0, 5) oleh [O, 3] adalah...", o: ["(0, 15)", "(15, 0)", "(0, 5)", "(3, 15)"], a: 0, x: "0*3=0, 5*3=15." }
    ]
};

let currentQuiz = {
    category: '',
    questions: [],
    index: 0,
    score: 0
};

function startQuiz(category) {
    currentQuiz.category = category;
    if (category === 'campuran') {
        currentQuiz.questions = [...QUIZ_BANK.translasi, ...QUIZ_BANK.refleksi, ...QUIZ_BANK.rotasi, ...QUIZ_BANK.dilatasi]
            .sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
        currentQuiz.questions = [...QUIZ_BANK[category]].sort(() => Math.random() - 0.5);
    }
    currentQuiz.index = 0;
    currentQuiz.score = 0;

    document.querySelector('.quiz-menu').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('result-box').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    const q = currentQuiz.questions[currentQuiz.index];
    const qBox = document.getElementById('question-box');
    const oBox = document.getElementById('options-box');
    const fBox = document.getElementById('feedback-box');
    const nBtn = document.getElementById('next-btn');

    qBox.innerHTML = `<h3>Soal ${currentQuiz.index + 1} dari ${currentQuiz.questions.length}</h3><p style="font-size: 1.2rem; margin: 1rem 0;">${q.q}</p>`;
    oBox.innerHTML = '';
    fBox.style.display = 'none';
    nBtn.style.display = 'none';

    q.o.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        oBox.appendChild(btn);
    });
}

function checkAnswer(selectedIdx) {
    const q = currentQuiz.questions[currentQuiz.index];
    const options = document.querySelectorAll('.option-btn');
    const fBox = document.getElementById('feedback-box');
    const nBtn = document.getElementById('next-btn');

    options.forEach(btn => btn.disabled = true);

    if (selectedIdx === q.a) {
        options[selectedIdx].classList.add('correct');
        currentQuiz.score++;
        fBox.innerHTML = "✅ Benar! " + q.x;
        fBox.style.backgroundColor = "#e8f5e9";
        fBox.style.color = "#2e7d32";
    } else {
        options[selectedIdx].classList.add('wrong');
        options[q.a].classList.add('correct');
        fBox.innerHTML = "❌ Salah. Pembahasan: " + q.x;
        fBox.style.backgroundColor = "#ffebee";
        fBox.style.color = "#c62828";
    }

    fBox.style.display = 'block';
    nBtn.style.display = 'inline-block';
    if (currentQuiz.index === currentQuiz.questions.length - 1) {
        nBtn.innerText = "Lihat Hasil";
    } else {
        nBtn.innerText = "Lanjut";
    }
}

document.getElementById('next-btn').onclick = () => {
    currentQuiz.index++;
    if (currentQuiz.index < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    document.getElementById('quiz-content').style.display = 'none';
    const rBox = document.getElementById('result-box');
    rBox.style.display = 'block';
    rBox.innerHTML = `
        <h2>Hasil Kuis ${currentQuiz.category.toUpperCase()}</h2>
        <div style="font-size: 3rem; margin: 1rem 0;">${currentQuiz.score} / ${currentQuiz.questions.length}</div>
        <p>Bagus sekali! Teruslah berlatih agar semakin mahir.</p>
        <button class="btn btn-primary" onclick="resetQuiz()">Kembali ke Menu Kuis</button>
    `;
}

function resetQuiz() {
    document.querySelector('.quiz-menu').style.display = 'grid';
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-box').style.display = 'none';
}

// --- 3. SIMULATOR ---
const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const resCoord = document.getElementById('res-coord');

function drawGrid() {
    const w = canvas.width;
    const h = canvas.height;
    const step = 30;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let x = 0; x <= w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
}

function toCanvasCoords(x, y) {
    return {
        cx: canvas.width / 2 + x * 30,
        cy: canvas.height / 2 - y * 30
    };
}

function drawPoint(x, y, color, label) {
    const { cx, cy } = toCanvasCoords(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "12px Poppins";
    ctx.fillText(label + `(${x}, ${y})`, cx + 8, cy - 8);
}

function updateSimParams() {
    const type = document.getElementById('sim-type').value;
    const container = document.getElementById('dynamic-params');
    container.innerHTML = '';

    if (type === 'translasi') {
        container.innerHTML = `
            <label>Vektor T (a, b)</label>
            <div class="input-row">
                <input type="number" id="pa" value="2" placeholder="a">
                <input type="number" id="pb" value="1" placeholder="b">
            </div>
        `;
    } else if (type === 'refleksi') {
        container.innerHTML = `
            <label>Sumbu</label>
            <select id="p-axis">
                <option value="x">Sumbu X</option>
                <option value="y">Sumbu Y</option>
                <option value="y=x">Garis y = x</option>
                <option value="origin">Titik Pusat O(0,0)</option>
            </select>
        `;
    } else if (type === 'rotasi') {
        container.innerHTML = `
            <label>Sudut (Derajat)</label>
            <input type="number" id="p-angle" value="90">
        `;
    } else if (type === 'dilatasi') {
        container.innerHTML = `
            <label>Faktor Skala k</label>
            <input type="number" id="p-k" value="2" step="0.5">
        `;
    }
}

document.getElementById('sim-type').onchange = updateSimParams;

document.getElementById('run-sim').onclick = () => {
    const x = parseFloat(document.getElementById('sx').value) || 0;
    const y = parseFloat(document.getElementById('sy').value) || 0;
    const type = document.getElementById('sim-type').value;

    let nx = x, ny = y;

    if (type === 'translasi') {
        const a = parseFloat(document.getElementById('pa').value) || 0;
        const b = parseFloat(document.getElementById('pb').value) || 0;
        nx = x + a; ny = y + b;
    } else if (type === 'refleksi') {
        const axis = document.getElementById('p-axis').value;
        if (axis === 'x') { nx = x; ny = -y; }
        else if (axis === 'y') { nx = -x; ny = y; }
        else if (axis === 'y=x') { nx = y; ny = x; }
        else if (axis === 'origin') { nx = -x; ny = -y; }
    } else if (type === 'rotasi') {
        const angle = (parseFloat(document.getElementById('p-angle').value) || 0) * Math.PI / 180;
        nx = Math.round((x * Math.cos(angle) - y * Math.sin(angle)) * 100) / 100;
        ny = Math.round((x * Math.sin(angle) + y * Math.cos(angle)) * 100) / 100;
    } else if (type === 'dilatasi') {
        const k = parseFloat(document.getElementById('p-k').value) || 1;
        nx = x * k; ny = y * k;
    }

    drawGrid();
    drawPoint(x, y, '#ff6f00', 'A');
    drawPoint(nx, ny, '#00796b', "A'");
    
    // Line connecting
    const p1 = toCanvasCoords(x, y);
    const p2 = toCanvasCoords(nx, ny);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#aaa';
    ctx.beginPath(); ctx.moveTo(p1.cx, p1.cy); ctx.lineTo(p2.cx, p2.cy); ctx.stroke();
    ctx.setLineDash([]);

    resCoord.innerText = `(${nx}, ${ny})`;
};

// Inisialisasi
window.onload = () => {
    updateSimParams();
    drawGrid();
};
