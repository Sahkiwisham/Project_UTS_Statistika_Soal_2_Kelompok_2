/**
 * ====================================================================
 * MODUL-A.JS — Logika Perhitungan Probabilitas Dasar & Diagram Venn
 * ====================================================================
 */

function getModuleARadioRelation() {
  const selected = document.querySelector('input[name="relasi-kejadian"]:checked');
  return selected ? selected.value : 'mutually_exclusive';
}

function calculateModuleA() {
  const inputPA = document.getElementById('input-pa');
  const inputPB = document.getElementById('input-pb');
  const inputPIrisan = document.getElementById('input-p-irisan');
  const containerPIrisan = document.getElementById('container-p-irisan');

  if (!inputPA || !inputPB) return;

  const pa = parseProb(inputPA.value);
  const pb = parseProb(inputPB.value);
  const relation = getModuleARadioRelation();

  const errPA = document.getElementById('err-pa');
  const errPB = document.getElementById('err-pb');
  const errIrisan = document.getElementById('err-p-irisan');

  if (errPA) errPA.classList.add('hidden');
  if (errPB) errPB.classList.add('hidden');
  if (errIrisan) errIrisan.classList.add('hidden');

  let hasError = false;

  if (isNaN(pa) || pa < 0 || pa > 1) {
    if (errPA) {
      errPA.textContent = 'P(A) harus berada dalam rentang 0.0 hingga 1.0 (atau 0% - 100%).';
      errPA.classList.remove('hidden');
    }
    hasError = true;
  }
  if (isNaN(pb) || pb < 0 || pb > 1) {
    if (errPB) {
      errPB.textContent = 'P(B) harus berada dalam rentang 0.0 hingga 1.0 (atau 0% - 100%).';
      errPB.classList.remove('hidden');
    }
    hasError = true;
  }

  // Update badge persentase input
  const badgePA = document.getElementById('badge-pa-pct');
  const badgePB = document.getElementById('badge-pb-pct');
  if (badgePA) badgePA.textContent = isNaN(pa) ? '0.00%' : fmtPct(pa);
  if (badgePB) badgePB.textContent = isNaN(pb) ? '0.00%' : fmtPct(pb);

  // Toggle input irisan untuk opsi umum
  if (containerPIrisan) {
    if (relation === 'general') {
      containerPIrisan.classList.remove('hidden');
    } else {
      containerPIrisan.classList.add('hidden');
    }
  }

  if (hasError) return;

  // Hitung Irisan P(A ∩ B)
  let pIntersect = 0;
  let irisanSourceLabel = '';

  if (relation === 'mutually_exclusive') {
    pIntersect = 0;
    irisanSourceLabel = 'Saling Lepas = 0';
    if (pa + pb > 1.000001 && errPB) {
      errPB.textContent = `Peringatan: Pada kejadian saling lepas, P(A) + P(B) tidak boleh > 1.0 (Saat ini: ${fmtDec(pa + pb)}).`;
      errPB.classList.remove('hidden');
    }
  } else if (relation === 'independent') {
    pIntersect = pa * pb;
    irisanSourceLabel = 'Independen = P(A) × P(B)';
  } else {
    // General
    const pIrisanRaw = inputPIrisan ? inputPIrisan.value : '0';
    pIntersect = parseProb(pIrisanRaw);
    irisanSourceLabel = 'Empiris / Kustom';

    if (isNaN(pIntersect) || pIntersect < 0 || pIntersect > 1) {
      if (errIrisan) {
        errIrisan.textContent = 'Nilai irisan P(A ∩ B) harus bernilai antara 0 hingga 1.';
        errIrisan.classList.remove('hidden');
      }
      return;
    }

    const maxAllowed = Math.min(pa, pb);
    if (pIntersect > maxAllowed + 0.000001) {
      if (errIrisan) {
        errIrisan.textContent = `P(A ∩ B) tidak boleh melebihi min(P(A), P(B)) = ${fmtDec(maxAllowed)}.`;
        errIrisan.classList.remove('hidden');
      }
      return;
    }

    const minAllowed = Math.max(0, pa + pb - 1);
    if (pIntersect < minAllowed - 0.000001) {
      if (errIrisan) {
        errIrisan.textContent = `Nilai irisan terlalu kecil. Agar P(A ∪ B) ≤ 1, P(A ∩ B) minimal ${fmtDec(minAllowed)}.`;
        errIrisan.classList.remove('hidden');
      }
      return;
    }

    const badgeIrisan = document.getElementById('badge-p-irisan-pct');
    if (badgeIrisan) badgeIrisan.textContent = fmtPct(pIntersect);
  }

  // Hitung Komplemen & Gabungan
  const paComp = 1 - pa;
  const pbComp = 1 - pb;
  const paUnionB = pa + pb - pIntersect;
  const pNeither = 1 - paUnionB;

  // Tampilkan Hasil Utama
  const elUnion = document.getElementById('out-pa-union-b');
  const elUnionPct = document.getElementById('out-pa-union-b-pct');
  if (elUnion) elUnion.textContent = fmtDec(paUnionB);
  if (elUnionPct) elUnionPct.textContent = fmtPct(paUnionB);

  const elAComp = document.getElementById('out-pa-comp');
  const elACompPct = document.getElementById('out-pa-comp-pct');
  if (elAComp) elAComp.textContent = fmtDec(paComp);
  if (elACompPct) elACompPct.textContent = fmtPct(paComp);

  const elBComp = document.getElementById('out-pb-comp');
  const elBCompPct = document.getElementById('out-pb-comp-pct');
  if (elBComp) elBComp.textContent = fmtDec(pbComp);
  if (elBCompPct) elBCompPct.textContent = fmtPct(pbComp);

  const elIntersect = document.getElementById('out-pa-intersect-b');
  const elIntersectPct = document.getElementById('out-pa-intersect-b-pct');
  const elIntersectSource = document.getElementById('label-irisan-source');
  if (elIntersect) elIntersect.textContent = fmtDec(pIntersect);
  if (elIntersectPct) elIntersectPct.textContent = fmtPct(pIntersect);
  if (elIntersectSource) elIntersectSource.textContent = irisanSourceLabel;

  const elNeither = document.getElementById('out-neither');
  const elNeitherPct = document.getElementById('out-neither-pct');
  if (elNeither) elNeither.textContent = fmtDec(pNeither);
  if (elNeitherPct) elNeitherPct.textContent = fmtPct(pNeither);

  // Status Boundary Gabungan
  const boundElem = document.getElementById('union-bound-check');
  if (boundElem) {
    if (paUnionB <= 1.000001) {
      boundElem.textContent = 'Valid (≤ 1.0)';
      boundElem.className = 'text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium border border-emerald-500/30';
    } else {
      boundElem.textContent = 'Peringatan (> 1.0)!';
      boundElem.className = 'text-[11px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded font-bold border border-rose-500/40';
    }
  }

  const relationLabels = {
    mutually_exclusive: 'Saling Lepas (Mutually Exclusive: P(A ∩ B) = 0)',
    independent: `Independen (Bebas: P(A ∩ B) = ${fmtDec(pIntersect)})`,
    general: `Umum / Tidak Saling Lepas (P(A ∩ B) = ${fmtDec(pIntersect)})`
  };
  const labelStatus = document.getElementById('label-status-relasi');
  if (labelStatus) labelStatus.textContent = `Hubungan: ${relationLabels[relation]}`;

  // Langkah Perhitungan Lengkap
  const boxLangkah = document.getElementById('box-langkah-a');
  if (boxLangkah) {
    boxLangkah.innerHTML = `
      <div class="text-slate-400 mb-1">// Rumus Dasar Penjumlahan Probabilitas:</div>
      <div>P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</div>
      <div class="text-brand-400 font-semibold">= ${fmtDec(pa)} + ${fmtDec(pb)} - ${fmtDec(pIntersect)}</div>
      <div class="font-bold text-white text-base">= ${fmtDec(paUnionB)} (${fmtPct(paUnionB)})</div>
      <div class="pt-2 border-t border-slate-800 text-slate-400">// Perhitungan Komplemen:</div>
      <div>P(A') = 1 - P(A) = 1 - ${fmtDec(pa)} = <span class="text-white font-bold">${fmtDec(paComp)} (${fmtPct(paComp)})</span></div>
      <div>P(B') = 1 - P(B) = 1 - ${fmtDec(pb)} = <span class="text-white font-bold">${fmtDec(pbComp)} (${fmtPct(pbComp)})</span></div>
      <div>P((A ∪ B)') = 1 - P(A ∪ B) = 1 - ${fmtDec(paUnionB)} = <span class="text-white font-bold">${fmtDec(pNeither)} (${fmtPct(pNeither)})</span></div>
    `;
  }

  // Penjelasan Naratif
  const narasi = document.getElementById('narasi-modul-a');
  if (narasi) {
    let relasiTeks = '';
    if (relation === 'mutually_exclusive') {
      relasiTeks = `Kedua kejadian bersifat <strong class="text-white">saling lepas (mutually exclusive)</strong>, artinya kejadian A dan B mustahil terjadi secara bersamaan (irisan bernilai 0). Probabilitas bahwa setidaknya salah satu kejadian terjadi dihitung murni dari penjumlahan langsung P(A) + P(B).`;
    } else if (relation === 'independent') {
      relasiTeks = `Kedua kejadian bersifat <strong class="text-white">independen (bebas)</strong>, artinya kemunculan kejadian A sama sekali tidak memengaruhi peluang kejadian B. Probabilitas terjadinya A dan B secara bersamaan adalah hasil kali keduanya yaitu P(A ∩ B) = ${fmtPct(pIntersect)}.`;
    } else {
      relasiTeks = `Kejadian A dan B merupakan <strong class="text-white">kejadian umum yang tidak saling lepas</strong> dengan irisan empiris sebesar ${fmtPct(pIntersect)}. Nilai irisan ini dikurangkan satu kali agar peluang gabungan tidak terhitung ganda (double-counting).`;
    }

    narasi.innerHTML = `
      Peluang terjadinya kejadian A adalah <strong class="text-white">${fmtPct(pa)}</strong> (${fmtDec(pa)}) dan kejadian B adalah <strong class="text-white">${fmtPct(pb)}</strong> (${fmtDec(pb)}). 
      ${relasiTeks}
      Peluang gabungan kejadian A atau B terwujud adalah sebesar <strong class="text-white">${fmtPct(paUnionB)}</strong> (${fmtDec(paUnionB)}). 
      Peluang tidak satu pun dari kedua peristiwa tersebut terjadi adalah sebesar <strong class="text-white">${fmtPct(pNeither)}</strong>.
    `;
  }

  // Update Diagram Venn Visual
  updateVennDiagram(pa, pb, pIntersect, relation);
}

// Update Diagram Venn SVG
function updateVennDiagram(pa, pb, pIntersect, relation) {
  const circleA = document.getElementById('venn-circle-a');
  const circleB = document.getElementById('venn-circle-b');
  const labelA = document.getElementById('venn-label-a');
  const labelB = document.getElementById('venn-label-b');
  const labelAB = document.getElementById('venn-label-ab');

  if (!circleA || !circleB) return;

  const rA = Math.max(30, Math.min(75, 30 + pa * 50));
  const rB = Math.max(30, Math.min(75, 30 + pb * 50));

  circleA.setAttribute('r', rA);
  circleB.setAttribute('r', rB);

  if (relation === 'mutually_exclusive' || pIntersect === 0) {
    circleA.setAttribute('cx', 120);
    circleB.setAttribute('cx', 280);
    if (labelA) {
      labelA.setAttribute('x', 120);
      labelA.textContent = `A (${fmtPct(pa)})`;
    }
    if (labelB) {
      labelB.setAttribute('x', 280);
      labelB.textContent = `B (${fmtPct(pb)})`;
    }
    if (labelAB) labelAB.setAttribute('display', 'none');
  } else {
    const overlapRatio = pIntersect / Math.max(0.001, Math.min(pa, pb));
    const distance = (rA + rB) - (overlapRatio * Math.min(rA, rB) * 0.9);
    
    const cxA = 200 - distance / 2;
    const cxB = 200 + distance / 2;

    circleA.setAttribute('cx', cxA);
    circleB.setAttribute('cx', cxB);
    if (labelA) {
      labelA.setAttribute('x', Math.max(50, cxA - rA / 2));
      labelA.textContent = `A (${fmtPct(Math.max(0, pa - pIntersect))})`;
    }
    if (labelB) {
      labelB.setAttribute('x', Math.min(350, cxB + rB / 2));
      labelB.textContent = `B (${fmtPct(Math.max(0, pb - pIntersect))})`;
    }
    if (labelAB) {
      labelAB.setAttribute('display', 'block');
      labelAB.setAttribute('x', 200);
      labelAB.textContent = fmtPct(pIntersect);
    }
  }
}

// Preset Soal A: P(A) = 0.3, P(B) = 0.4, Saling Lepas
function loadModuleAPreset(pa = 0.3, pb = 0.4, relation = 'mutually_exclusive') {
  const inputPA = document.getElementById('input-pa');
  const inputPB = document.getElementById('input-pb');
  const inputPIrisan = document.getElementById('input-p-irisan');

  if (inputPA) inputPA.value = pa;
  if (inputPB) inputPB.value = pb;
  
  const radio = document.querySelector(`input[name="relasi-kejadian"][value="${relation}"]`);
  if (radio) radio.checked = true;

  if (relation === 'general' && inputPIrisan) {
    inputPIrisan.value = 0.1;
  }

  calculateModuleA();
  showToast(`Preset Kasus A dimuat: P(A)=${pa}, P(B)=${pb} (${relation})`, 'success');
}
