/**
 * ====================================================================
 * MAIN.JS — Inisialisasi Aplikasi, Tab Switching, & Event Listeners
 * ====================================================================
 */

function switchMainTab(tabId) {
  const panelA = document.getElementById('panel-modul-a');
  const panelB = document.getElementById('panel-modul-b');
  const tabBtnA = document.getElementById('tab-btn-a');
  const tabBtnB = document.getElementById('tab-btn-b');

  if (!panelA || !panelB) return;

  if (tabId === 'modul-a') {
    panelA.classList.remove('hidden');
    panelB.classList.add('hidden');

    if (tabBtnA) tabBtnA.className = 'tab-indicator group flex items-center space-x-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-brand-600 text-white shadow-md shadow-brand-500/30';
    if (tabBtnB) tabBtnB.className = 'tab-indicator group flex items-center space-x-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80';
  } else {
    panelA.classList.add('hidden');
    panelB.classList.remove('hidden');

    if (tabBtnB) tabBtnB.className = 'tab-indicator group flex items-center space-x-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-brand-600 text-white shadow-md shadow-brand-500/30';
    if (tabBtnA) tabBtnA.className = 'tab-indicator group flex items-center space-x-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80';
  }
}

function switchModuleBMode(mode) {
  const subBayes = document.getElementById('subpanel-bayes');
  const subCond = document.getElementById('subpanel-conditional');
  const btnBayes = document.getElementById('subtab-bayes');
  const btnCond = document.getElementById('subtab-conditional');

  if (!subBayes || !subCond) return;

  if (mode === 'bayes') {
    subBayes.classList.remove('hidden');
    subCond.classList.add('hidden');

    if (btnBayes) btnBayes.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-brand-600 text-white shadow-sm shadow-brand-500/20';
    if (btnCond) btnCond.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800';
  } else {
    subBayes.classList.add('hidden');
    subCond.classList.remove('hidden');

    if (btnCond) btnCond.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-brand-600 text-white shadow-sm shadow-brand-500/20';
    if (btnBayes) btnBayes.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // 1. Event Listeners Modul A (jika elemen tersedia di halaman)
  const inputPA = document.getElementById('input-pa');
  const inputPB = document.getElementById('input-pb');
  const inputPIrisan = document.getElementById('input-p-irisan');
  const btnPresetA = document.getElementById('btn-preset-a');
  const btnResetA = document.getElementById('btn-reset-a');

  if (inputPA) inputPA.addEventListener('input', calculateModuleA);
  if (inputPB) inputPB.addEventListener('input', calculateModuleA);
  if (inputPIrisan) inputPIrisan.addEventListener('input', calculateModuleA);

  document.querySelectorAll('input[name="relasi-kejadian"]').forEach(radio => {
    radio.addEventListener('change', calculateModuleA);
  });

  if (btnPresetA) {
    btnPresetA.addEventListener('click', () => {
      loadModuleAPreset(0.3, 0.4, 'mutually_exclusive');
    });
  }

  if (btnResetA) {
    btnResetA.addEventListener('click', () => {
      if (inputPA) inputPA.value = '';
      if (inputPB) inputPB.value = '';
      if (inputPIrisan) inputPIrisan.value = '';
      const defRadio = document.querySelector('input[name="relasi-kejadian"][value="mutually_exclusive"]');
      if (defRadio) defRadio.checked = true;
      calculateModuleA();
      showToast('Form Modul A telah di-reset.', 'info');
    });
  }

  // 2. Event Listeners Modul B (Bayes)
  const bayesPH = document.getElementById('bayes-ph');
  const bayesPEH = document.getElementById('bayes-peh');
  const bayesPEHPrime = document.getElementById('bayes-peh-prime');
  const bayesLabelH = document.getElementById('bayes-label-h');
  const bayesLabelE = document.getElementById('bayes-label-e');
  const btnPresetB = document.getElementById('btn-preset-b');
  const selectPresetBayes = document.getElementById('select-preset-bayes');

  if (bayesPH) bayesPH.addEventListener('input', calculateBayes);
  if (bayesPEH) bayesPEH.addEventListener('input', calculateBayes);
  if (bayesPEHPrime) bayesPEHPrime.addEventListener('input', calculateBayes);
  if (bayesLabelH) bayesLabelH.addEventListener('input', calculateBayes);
  if (bayesLabelE) bayesLabelE.addEventListener('input', calculateBayes);

  if (btnPresetB) btnPresetB.addEventListener('click', loadBayesPhishingPreset);
  if (selectPresetBayes) selectPresetBayes.addEventListener('change', handleBayesTemplateChange);

  // 3. Event Listeners Modul B (Bersyarat Dasar)
  const condPA = document.getElementById('cond-pa');
  const condPB = document.getElementById('cond-pb');
  const condPAB = document.getElementById('cond-pab');

  if (condPA) condPA.addEventListener('input', calculateConditional);
  if (condPB) condPB.addEventListener('input', calculateConditional);
  if (condPAB) condPAB.addEventListener('input', calculateConditional);

  // 4. Link Halaman Statistik Deskriptif
  const btnLinkDeskriptif = document.getElementById('btn-link-deskriptif');
  if (btnLinkDeskriptif) {
    btnLinkDeskriptif.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Menghubungkan ke Halaman Statistik Deskriptif...', 'info');
    });
  }

  // 5. Modal Dialog Panduan & Rumus
  const modalInfo = document.getElementById('modal-info');
  const btnToggleInfo = document.getElementById('btn-toggle-info');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalOk = document.getElementById('btn-modal-ok');

  if (btnToggleInfo && modalInfo) {
    btnToggleInfo.addEventListener('click', () => {
      modalInfo.classList.remove('hidden');
      modalInfo.classList.add('flex');
    });
  }

  const closeModal = () => {
    if (modalInfo) {
      modalInfo.classList.add('hidden');
      modalInfo.classList.remove('flex');
    }
  };

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnModalOk) btnModalOk.addEventListener('click', closeModal);
  if (modalInfo) {
    modalInfo.addEventListener('click', (e) => {
      if (e.target === modalInfo) closeModal();
    });
  }

  // 6. Hitung Data Awal jika elemen terkait ada di DOM
  if (inputPA && inputPB) {
    loadModuleAPreset(0.3, 0.4, 'mutually_exclusive');
  }
  if (bayesPH && bayesPEH) {
    calculateBayes();
  }
  if (condPA && condPB) {
    calculateConditional();
  }
});
