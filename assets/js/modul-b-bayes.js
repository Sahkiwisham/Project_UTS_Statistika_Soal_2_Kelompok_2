/**
 * ====================================================================
 * MODUL-B-BAYES.JS — Logika Perhitungan Teorema Bayes (Klasifikasi Biner)
 * ====================================================================
 */

function calculateBayes() {
  const bayesPH = document.getElementById('bayes-ph');
  const bayesPEH = document.getElementById('bayes-peh');
  const bayesPEHPrime = document.getElementById('bayes-peh-prime');
  const bayesLabelH = document.getElementById('bayes-label-h');
  const bayesLabelE = document.getElementById('bayes-label-e');

  if (!bayesPH || !bayesPEH || !bayesPEHPrime) return;

  const ph = parseProb(bayesPH.value);
  const peh = parseProb(bayesPEH.value);
  const pehPrime = parseProb(bayesPEHPrime.value);

  const labelH = (bayesLabelH ? bayesLabelH.value.trim() : '') || 'Email Phishing';
  const labelE = (bayesLabelE ? bayesLabelE.value.trim() : '') || 'Ditandai Sistem';

  const errPH = document.getElementById('err-bayes-ph');
  const errPEH = document.getElementById('err-bayes-peh');
  const errPEHPrime = document.getElementById('err-bayes-peh-prime');

  if (errPH) errPH.classList.add('hidden');
  if (errPEH) errPEH.classList.add('hidden');
  if (errPEHPrime) errPEHPrime.classList.add('hidden');

  let hasError = false;

  if (isNaN(ph) || ph <= 0 || ph >= 1) {
    if (errPH) {
      errPH.textContent = 'Prior P(H) harus berada di antara 0.0001 dan 0.9999 (tidak boleh 0 atau 1 mutlak).';
      errPH.classList.remove('hidden');
    }
    hasError = true;
  }
  if (isNaN(peh) || peh < 0 || peh > 1) {
    if (errPEH) {
      errPEH.textContent = 'Sensitivitas P(E|H) harus bernilai antara 0.0 hingga 1.0.';
      errPEH.classList.remove('hidden');
    }
    hasError = true;
  }
  if (isNaN(pehPrime) || pehPrime < 0 || pehPrime > 1) {
    if (errPEHPrime) {
      errPEHPrime.textContent = 'False Positive Rate P(E|H\') harus bernilai antara 0.0 hingga 1.0.';
      errPEHPrime.classList.remove('hidden');
    }
    hasError = true;
  }

  // Update badge persentase
  const badgePH = document.getElementById('badge-bayes-ph-pct');
  const badgePEH = document.getElementById('badge-bayes-peh-pct');
  const badgePEHPrime = document.getElementById('badge-bayes-peh-prime-pct');
  if (badgePH) badgePH.textContent = isNaN(ph) ? '0.00%' : fmtPct(ph);
  if (badgePEH) badgePEH.textContent = isNaN(peh) ? '0.00%' : fmtPct(peh);
  if (badgePEHPrime) badgePEHPrime.textContent = isNaN(pehPrime) ? '0.00%' : fmtPct(pehPrime);

  if (hasError) return;

  // Nilai Komplementer
  const phPrime = 1 - ph;                     // P(H')
  const peCompH = 1 - peh;                   // P(E'|H) - False Negative Rate
  const peCompHPrime = 1 - pehPrime;         // P(E'|H') - Spesifisitas (True Negative Rate)

  const elPHComp = document.getElementById('bayes-ph-comp');
  const elPECompH = document.getElementById('bayes-pe-comp-h');
  const elSpec = document.getElementById('bayes-specificity');
  if (elPHComp) elPHComp.textContent = `${fmtDec(phPrime)} (${fmtPct(phPrime)})`;
  if (elPECompH) elPECompH.textContent = `${fmtDec(peCompH)} (${fmtPct(peCompH)})`;
  if (elSpec) elSpec.textContent = `${fmtDec(peCompHPrime)} (${fmtPct(peCompHPrime)})`;

  // Kontribusi Probabilitas Bersama
  const pJointTruePos = peh * ph;            // P(E ∩ H) = P(E|H) × P(H)
  const pJointFalsePos = pehPrime * phPrime; // P(E ∩ H') = P(E|H') × P(H')

  // Hukum Probabilitas Total: P(E)
  const peTotal = pJointTruePos + pJointFalsePos;

  if (peTotal <= 0) {
    if (errPEH) {
      errPEH.textContent = 'Probabilitas bukti P(E) bernilai 0. Terjadi pembagian dengan nol!';
      errPEH.classList.remove('hidden');
    }
    return;
  }

  // Posterior Bayes: P(H|E)
  const posteriorPHE = pJointTruePos / peTotal;
  const posteriorFalseAlarm = 1 - posteriorPHE; // P(H'|E)

  // Perubahan Relatif / Lift
  const lift = posteriorPHE / ph;
  const shiftPct = (posteriorPHE - ph) * 100;

  // Render Metrik Utama
  const elPHE = document.getElementById('out-bayes-phe');
  const elPHEPct = document.getElementById('out-bayes-phe-pct');
  const elPostDesc = document.getElementById('label-posterior-desc');
  const elFDR = document.getElementById('out-bayes-fdr');

  if (elPHE) elPHE.textContent = fmtDec(posteriorPHE);
  if (elPHEPct) elPHEPct.textContent = fmtPct(posteriorPHE);
  if (elPostDesc) elPostDesc.textContent = `P(${labelH} | ${labelE})`;
  if (elFDR) elFDR.textContent = `P(Bukan ${labelH} | ${labelE}) = ${fmtPct(posteriorFalseAlarm)}`;

  const elPE = document.getElementById('out-bayes-pe');
  const elPEPct = document.getElementById('out-bayes-pe-pct');
  const elPEDesc = document.getElementById('desc-bayes-pe');
  if (elPE) elPE.textContent = fmtDec(peTotal);
  if (elPEPct) elPEPct.textContent = fmtPct(peTotal);
  if (elPEDesc) elPEDesc.textContent = `Peluang total "${labelE}" muncul pada populasi`;

  const elLift = document.getElementById('out-bayes-lift');
  const elLiftPrior = document.getElementById('lift-prior');
  const elLiftPost = document.getElementById('lift-post');
  const elShift = document.getElementById('out-bayes-shift');
  if (elLift) elLift.textContent = `${fmtDec(lift, 2)}x`;
  if (elLiftPrior) elLiftPrior.textContent = fmtPct(ph);
  if (elLiftPost) elLiftPost.textContent = fmtPct(posteriorPHE);
  if (elShift) elShift.textContent = shiftPct >= 0 ? `Naik +${fmtDec(shiftPct, 2)}%` : `Turun ${fmtDec(shiftPct, 2)}%`;

  // Render Kotak Interpretasi Naratif Hasil (Dark Theme Typography)
  const narasiBayes = document.getElementById('narasi-teorema-bayes');
  if (narasiBayes) {
    narasiBayes.innerHTML = `
      Dari seluruh populasi, sistem diperkirakan akan memicu tanda <strong class="text-white">"${labelE}"</strong> sebanyak <strong class="text-white">${fmtPct(peTotal)}</strong> (<span class="font-mono text-cyan-300">P(E) = ${fmtDec(peTotal)}</span>).
      <br><br>
      Ketika sistem memberikan tanda <strong class="text-white">"${labelE}"</strong>, peluang bahwa objek/kejadian tersebut benar-benar merupakan <strong class="text-white">"${labelH}"</strong> (<span class="font-mono text-brand-300">P(H|E)</span>) adalah sebesar <strong class="text-white text-base">${fmtPct(posteriorPHE)}</strong> (<span class="font-mono text-emerald-400 font-bold">${fmtDec(posteriorPHE)}</span>).
      <br><br>
      Sebaliknya, sekitar <strong class="text-white">${fmtPct(posteriorFalseAlarm)}</strong> (<span class="font-mono text-rose-300">${fmtDec(posteriorFalseAlarm)}</span>) dari tanda yang muncul tersebut adalah alarm palsu (false positive), yaitu kondisi ketika sistem mendeteksi tanda namun hipotesis aslinya sebenarnya sah/aman.
    `;
  }

  // Render Penurunan Rumus Langkah-demi-Langkah
  const boxLangkahBayes = document.getElementById('box-langkah-bayes');
  if (boxLangkahBayes) {
    boxLangkahBayes.innerHTML = `
      <div class="text-slate-400">// Langkah 1: Tentukan Peluang Awal (Prior) dan Komplemennya</div>
      <div>P(H) = <span class="text-white font-semibold">${fmtDec(ph)}</span> (${fmtPct(ph)}) [Prevalensi ${labelH}]</div>
      <div>P(H') = 1 - P(H) = 1 - ${fmtDec(ph)} = <span class="text-white font-semibold">${fmtDec(phPrime)}</span> (${fmtPct(phPrime)})</div>

      <div class="pt-2 border-t border-slate-800 text-slate-400">// Langkah 2: Hitung Irisan Positif Sejati (True Positives Joint Probability)</div>
      <div>P(E ∩ H) = P(E|H) × P(H)</div>
      <div class="text-emerald-400 font-semibold">= ${fmtDec(peh)} × ${fmtDec(ph)} = <span class="font-bold text-emerald-300">${fmtDec(pJointTruePos, 6)}</span> (${fmtPct(pJointTruePos)})</div>

      <div class="pt-2 border-t border-slate-800 text-slate-400">// Langkah 3: Hitung Irisan Positif Palsu (False Positives Joint Probability)</div>
      <div>P(E ∩ H') = P(E|H') × P(H')</div>
      <div class="text-rose-400 font-semibold">= ${fmtDec(pehPrime)} × ${fmtDec(phPrime)} = <span class="font-bold text-rose-300">${fmtDec(pJointFalsePos, 6)}</span> (${fmtPct(pJointFalsePos)})</div>

      <div class="pt-2 border-t border-slate-800 text-slate-400">// Langkah 4: Hukum Probabilitas Total untuk Bukti P(E) (Penyebut Bayes)</div>
      <div>P(E) = P(E ∩ H) + P(E ∩ H')</div>
      <div class="text-cyan-400 font-semibold">= ${fmtDec(pJointTruePos, 6)} + ${fmtDec(pJointFalsePos, 6)} = <span class="font-bold text-cyan-300">${fmtDec(peTotal, 6)}</span> (${fmtPct(peTotal)})</div>

      <div class="pt-2 border-t border-slate-800 text-slate-400">// Langkah 5: Hitung Posterior Bayes P(H|E)</div>
      <div>P(H|E) = P(E ∩ H) / P(E)</div>
      <div class="text-brand-300 font-bold">= ${fmtDec(pJointTruePos, 6)} / ${fmtDec(peTotal, 6)} = <span class="text-white font-extrabold text-base">${fmtDec(posteriorPHE)} (${fmtPct(posteriorPHE)})</span></div>
    `;
  }

  // Simulasi Frekuensi Alami (Natural Frequencies N = 10,000)
  const N = 10000;
  const countH = Math.round(N * ph);
  const countHPrime = N - countH;

  const countTP = Math.round(countH * peh);
  const countFN = countH - countTP;

  const countFP = Math.round(countHPrime * pehPrime);
  const countTN = countHPrime - countFP;

  const totalFlagged = countTP + countFP;

  const elNFLabelH = document.getElementById('nf-label-h');
  const elNFLabelHPrime = document.getElementById('nf-label-h-prime');
  if (elNFLabelH) elNFLabelH.textContent = `Kelompok ${labelH} (H)`;
  if (elNFLabelHPrime) elNFLabelHPrime.textContent = `Kelompok Bukan ${labelH} (H')`;

  const elNFCountH = document.getElementById('nf-count-h');
  const elNFCountHPrime = document.getElementById('nf-count-h-prime');
  if (elNFCountH) elNFCountH.textContent = `${fmtInt(countH)} sampel`;
  if (elNFCountHPrime) elNFCountHPrime.textContent = `${fmtInt(countHPrime)} sampel`;

  const elNFTP = document.getElementById('nf-tp');
  const elNFFN = document.getElementById('nf-fn');
  const elNFFP = document.getElementById('nf-fp');
  const elNFTN = document.getElementById('nf-tn');
  if (elNFTP) elNFTP.textContent = fmtInt(countTP);
  if (elNFFN) elNFFN.textContent = fmtInt(countFN);
  if (elNFFP) elNFFP.textContent = fmtInt(countFP);
  if (elNFTN) elNFTN.textContent = fmtInt(countTN);

  const elNFTotal = document.getElementById('nf-total-flagged');
  if (elNFTotal) elNFTotal.textContent = `${fmtInt(totalFlagged)} kasus (${fmtInt(countTP)} benar + ${fmtInt(countFP)} alarm palsu)`;
  
  const simBayesRatio = totalFlagged > 0 ? (countTP / totalFlagged) * 100 : 0;
  const elNFRatio = document.getElementById('nf-bayes-ratio');
  if (elNFRatio) elNFRatio.textContent = `${fmtInt(countTP)} / ${fmtInt(totalFlagged)} = ${fmtDec(simBayesRatio, 2)}%`;

  const tpBarWidth = totalFlagged > 0 ? (countTP / totalFlagged) * 100 : 50;
  const fpBarWidth = totalFlagged > 0 ? (countFP / totalFlagged) * 100 : 50;
  const elBarTP = document.getElementById('nf-bar-tp');
  const elBarFP = document.getElementById('nf-bar-fp');
  if (elBarTP) elBarTP.style.width = `${tpBarWidth}%`;
  if (elBarFP) elBarFP.style.width = `${fpBarWidth}%`;
}

// Preset Kasus B: Filter Phishing (8%, 92%, 3%)
function loadBayesPhishingPreset() {
  const bayesPH = document.getElementById('bayes-ph');
  const bayesPEH = document.getElementById('bayes-peh');
  const bayesPEHPrime = document.getElementById('bayes-peh-prime');
  const bayesLabelH = document.getElementById('bayes-label-h');
  const bayesLabelE = document.getElementById('bayes-label-e');

  if (bayesPH) bayesPH.value = '0.08';
  if (bayesPEH) bayesPEH.value = '0.92';
  if (bayesPEHPrime) bayesPEHPrime.value = '0.03';
  if (bayesLabelH) bayesLabelH.value = 'Email Phishing';
  if (bayesLabelE) bayesLabelE.value = 'Ditandai Sistem';
  
  const selectPreset = document.getElementById('select-preset-bayes');
  if (selectPreset) selectPreset.value = 'phishing';

  calculateBayes();
  showToast('Preset Kasus B (Filter Phishing) Berhasil Dimuat!', 'success');
}

// Handler Dropdown Studi Kasus Teorema Bayes
function handleBayesTemplateChange(e) {
  const mode = e.target.value;
  const bayesPH = document.getElementById('bayes-ph');
  const bayesPEH = document.getElementById('bayes-peh');
  const bayesPEHPrime = document.getElementById('bayes-peh-prime');
  const bayesLabelH = document.getElementById('bayes-label-h');
  const bayesLabelE = document.getElementById('bayes-label-e');

  if (mode === 'phishing') {
    loadBayesPhishingPreset();
  } else if (mode === 'medis') {
    if (bayesPH) bayesPH.value = '0.01';
    if (bayesPEH) bayesPEH.value = '0.95';
    if (bayesPEHPrime) bayesPEHPrime.value = '0.05';
    if (bayesLabelH) bayesLabelH.value = 'Pasien Mengidap Penyakit';
    if (bayesLabelE) bayesLabelE.value = 'Hasil Tes Positif';
    calculateBayes();
    showToast('Studi Kasus Medis Penyakit Langka Dimuat', 'info');
  } else if (mode === 'pabrik') {
    if (bayesPH) bayesPH.value = '0.02';
    if (bayesPEH) bayesPEH.value = '0.98';
    if (bayesPEHPrime) bayesPEHPrime.value = '0.01';
    if (bayesLabelH) bayesLabelH.value = 'Komponen Cacat';
    if (bayesLabelE) bayesLabelE.value = 'Sensor QA Mendeteksi';
    calculateBayes();
    showToast('Studi Kasus Kontrol Kualitas Pabrik Dimuat', 'info');
  }
}
