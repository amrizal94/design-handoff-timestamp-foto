(() => {
  const els = {
    fileInput: document.getElementById('fileInput'),
    uploadLabel: document.getElementById('uploadLabel'),
    timeInput: document.getElementById('timeInput'),
    dateInput: document.getElementById('dateInput'),
    datePreview: document.getElementById('datePreview'),
    locationInput: document.getElementById('locationInput'),
    codeDisplay: document.getElementById('codeDisplay'),
    regenBtn: document.getElementById('regenBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    emptyState: document.getElementById('emptyState'),
    canvas: document.getElementById('canvas'),
  };

  const state = {
    imageEl: null,
    fileName: null,
    time: '13:20',
    dateInput: toDateInputValue(new Date()),
    location: 'Galala, Oba Utara, Kota Tidore Kepulauan, Maluku Utara',
    code: randomCode(),
  };

  function toDateInputValue(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function formatIndonesianDate(dateInput) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const [y, m, d] = dateInput.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return `${days[dt.getDay()]}, ${String(d).padStart(2, '0')} ${months[m - 1]} ${y}`;
  }

  function randomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let s = '';
    for (let i = 0; i < 12; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function drawOverlay(ctx, w, h) {
    const s = w / 1200;
    const time = state.time || '00:00';
    const date = formatIndonesianDate(state.dateInput);
    const location = state.location;
    const code = state.code;

    ctx.textBaseline = 'alphabetic';

    const grad = ctx.createLinearGradient(0, h * 0.55, 0, h);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);

    const gradTop = ctx.createLinearGradient(0, 0, 0, h * 0.18);
    gradTop.addColorStop(0, 'rgba(0,0,0,0.35)');
    gradTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradTop;
    ctx.fillRect(0, 0, w, h * 0.18);

    ctx.textAlign = 'right';
    ctx.font = `700 ${Math.round(34 * s)}px Arial, sans-serif`;
    ctx.fillStyle = '#FFB020';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4 * s;
    ctx.fillText('Timemark', w - 24 * s, 44 * s);
    ctx.font = `400 ${Math.round(19 * s)}px Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Foto 100% akurat', w - 24 * s, 68 * s);
    ctx.shadowBlur = 0;

    ctx.save();
    ctx.translate(w - 12 * s, h * 0.62);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.font = `600 ${Math.round(15 * s)}px Arial, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 3 * s;
    ctx.fillText(`© ${code}   Timemark Verified`, 0, 0);
    ctx.restore();
    ctx.shadowBlur = 0;

    let cursorY = h - 30 * s;

    ctx.font = `400 ${Math.round(15 * s)}px Arial, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('✓  Timemark menjamin keaslian waktu', 26 * s, cursorY);
    cursorY -= 30 * s;

    ctx.font = `700 ${Math.round(23 * s)}px Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    const maxWidth = w - 60 * s;
    const words = (location || '').split(' ');
    let lines = [];
    let cur = '';
    for (const word of words) {
      const test = cur ? cur + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = word;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    lines = lines.slice(0, 2);
    const lineH = 30 * s;
    for (let i = lines.length - 1; i >= 0; i--) {
      ctx.fillText(lines[i], 26 * s, cursorY);
      cursorY -= lineH;
    }
    cursorY -= 6 * s;

    ctx.font = `700 ${Math.round(26 * s)}px Arial, sans-serif`;
    ctx.fillStyle = '#FFB020';
    ctx.fillRect(26 * s, cursorY - 22 * s, 4 * s, 30 * s);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(date, 38 * s, cursorY);
    cursorY -= 44 * s;

    const boxH2 = 56 * s;
    const boxTopY = cursorY - boxH2 + 8 * s;
    ctx.font = `700 ${Math.round(40 * s)}px Arial, sans-serif`;
    const tw = ctx.measureText(time).width;
    ctx.fillStyle = '#ffffff';
    const bx = 26 * s, by = boxTopY, bw = tw + 32 * s, bh = boxH2;
    const r = 4 * s;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + bh, r);
    ctx.arcTo(bx + bw, by + bh, bx, by + bh, r);
    ctx.arcTo(bx, by + bh, bx, by, r);
    ctx.arcTo(bx, by, bx + bw, by, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.textBaseline = 'middle';
    ctx.fillText(time, bx + 16 * s, by + bh / 2 + 2 * s);
    ctx.textBaseline = 'alphabetic';
  }

  function draw() {
    const img = state.imageEl;
    if (!img) return;
    els.canvas.width = img.naturalWidth;
    els.canvas.height = img.naturalHeight;
    const ctx = els.canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    drawOverlay(ctx, els.canvas.width, els.canvas.height);
  }

  function render() {
    const hasImage = !!state.imageEl;
    els.uploadLabel.textContent = hasImage ? 'Ganti Foto' : 'Pilih Foto';
    els.datePreview.textContent = formatIndonesianDate(state.dateInput);
    els.codeDisplay.textContent = state.code;
    els.downloadBtn.disabled = !hasImage;
    els.downloadBtn.classList.toggle('enabled', hasImage);
    els.emptyState.style.display = hasImage ? 'none' : 'flex';
    els.canvas.style.display = hasImage ? 'block' : 'none';
  }

  els.fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        state.imageEl = img;
        state.fileName = file.name;
        render();
        draw();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  els.timeInput.addEventListener('input', (e) => {
    state.time = e.target.value;
    draw();
  });

  els.dateInput.addEventListener('input', (e) => {
    state.dateInput = e.target.value;
    render();
    draw();
  });

  els.locationInput.addEventListener('input', (e) => {
    state.location = e.target.value;
    draw();
  });

  els.regenBtn.addEventListener('click', () => {
    state.code = randomCode();
    render();
    draw();
  });

  els.downloadBtn.addEventListener('click', () => {
    if (!state.imageEl) return;
    const baseName = (state.fileName || 'foto').replace(/\.[^./\\]+$/, '');
    const link = document.createElement('a');
    link.download = 'timestamp-' + baseName + '.jpg';
    link.href = els.canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  });

  els.timeInput.value = state.time;
  els.dateInput.value = state.dateInput;
  els.locationInput.value = state.location;

  render();
})();
