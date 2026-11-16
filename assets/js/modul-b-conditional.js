/**
 * ====================================================================
 * MODUL-B-CONDITIONAL.JS — Probabilitas Bersyarat Dasar P(A|B) & Uji Independensi
 * ====================================================================
 */

function calculateConditional() {
  const condPA = document.getElementById('cond-pa');
  const condPB = document.getElementById('cond-pb');
  const condPAB = document.getElementById('cond-pab');

  if (!condPA || !condPB || !condPAB) return;

  const pa = parseProb(condPA.value);
  const pb = parseProb(condPB.value);
  const pab = parseProb(condPAB.value);

  const errCond = document.getElementById('err-cond');
  if (errCond) errCond.classList.add('hidden');

  let hasError = false;

  if (isNaN(pa) || pa <= 0 || pa > 1) {
    if (errCond) {
      errCond.textContent = 'P(A) harus bernilai > 0 dan ≤ 1.';
      errCond.classList.remove('hidden');
    }
    hasError = true;
  }
  if (isNaN(pb) || pb <= 0 || pb > 1) {
    if (errCond) {
      errCond.textContent = 'P(B) harus bernilai > 0 dan ≤ 1 (tidak boleh 0 untuk pembagian).';
      errCond.classList.remove('hidden');
    }
    hasError = true;
  }
  if (isNaN(pab) || pab < 0 || pab > 1) {
    if (errCond) {
      errCond.textContent = 'P(A ∩ B) harus berada di rentang 0 hingga 1.';
      errCond.classList.remove('hidden');
    }
    hasError = true;
  }

  const badgePA = document.getElementById('badge-cond-pa');
  const badgePB = document.getElementById('badge-cond-pb');
  const badgePAB = document.getElementById('badge-cond-pab');
  if (badgePA) badgePA.textContent = fmtDec(pa);
  if (badgePB) badgePB.textContent = fmtDec(pb);
  if (badgePAB) badgePAB.textContent = fmtDec(pab);

  if (hasError) return;

  if (pab > pa + 0.000001 || pab > pb + 0.000001) {
    if (errCond) {
      errCond.textContent = `Nilai irisan P(A ∩ B) = ${fmtDec(pab)} tidak boleh melebihi P(A) = ${fmtDec(pa)} atau P(B) = ${fmtDec(pb)}.`;
      errCond.classList.remove('hidden');
    }
    return;
  }

  // Hitung P(A|B) dan P(B|A)
  const pAgivenB = pab / pb;
  const pBgivenA = pab / pa;

  const elPAB = document.getElementById('out-cond-pab');
  const elPABPct = document.getElementById('out-cond-pab-pct');
  const elPBA = document.getElementById('out-cond-pba');
  const elPBAPct = document.getElementById('out-cond-pba-pct');

  if (elPAB) elPAB.textContent = fmtDec(pAgivenB);
  if (elPABPct) elPABPct.textContent = fmtPct(pAgivenB);
  if (elPBA) elPBA.textContent = fmtDec(pBgivenA);
  if (elPBAPct) elPBAPct.textContent = fmtPct(pBgivenA);

  // Uji Independensi
  const isIndependent = Math.abs(pAgivenB - pa) < 0.0001 || Math.abs(pab - (pa * pb)) < 0.0001;

  const elTestPAB = document.getElementById('cond-test-pab');
  const elTestMult = document.getElementById('cond-test-mult');
  const indepVerdict = document.getElementById('cond-indep-verdict');

  if (elTestPAB) elTestPAB.textContent = `${fmtDec(pAgivenB)} vs ${fmtDec(pa)}`;
  if (elTestMult) elTestMult.textContent = `${fmtDec(pab)} vs ${fmtDec(pa * pb)}`;

  if (indepVerdict) {
    if (isIndependent) {
      indepVerdict.innerHTML = `<span class="text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2 py-1 rounded inline-block font-bold">✓ Kejadian A dan B Bersifat Independen (P(A|B) = P(A))</span>`;
    } else {
      indepVerdict.innerHTML = `<span class="text-blue-300 bg-blue-950/80 border border-blue-800/60 px-2 py-1 rounded inline-block font-bold">ℹ Kejadian A dan B Bersifat Dependen (Saling Terkait / P(A|B) ≠ P(A))</span>`;
    }
  }

  // Narasi
  const narasi = document.getElementById('cond-narasi');
  if (narasi) {
    narasi.innerHTML = `
      Dengan syarat bahwa kejadian B telah dipastikan terjadi (<span class="font-mono text-cyan-300">P(B) = ${fmtPct(pb)}</span>), peluang kejadian A ikut terjadi adalah sebesar <strong class="text-white">${fmtPct(pAgivenB)}</strong> (<span class="font-mono text-brand-300">${fmtDec(pAgivenB)}</span>).
      Sebaliknya, jika kejadian A dipastikan telah terjadi lebih dahulu (<span class="font-mono text-indigo-300">P(A) = ${fmtPct(pa)}</span>), peluang kejadian B terwujud adalah <strong class="text-white">${fmtPct(pBgivenA)}</strong> (<span class="font-mono text-blue-300">${fmtDec(pBgivenA)}</span>).
    `;
  }
}

function loadConditionalPreset() {
  const condPA = document.getElementById('cond-pa');
  const condPB = document.getElementById('cond-pb');
  const condPAB = document.getElementById('cond-pab');

  if (condPA) condPA.value = '0.5';
  if (condPB) condPB.value = '0.4';
  if (condPAB) condPAB.value = '0.2';
  
  calculateConditional();
  showToast('Contoh Probabilitas Bersyarat Dimuat!', 'info');
}
