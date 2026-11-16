/**
 * ====================================================================
 * UTILS.JS — Helper Formatting, Parsing, & Toast Notification
 * ====================================================================
 */

// Format angka desimal (default 4 digit)
function fmtDec(num, digits = 4) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return Number(num).toFixed(digits);
}

// Format persentase (default 2 digit desimal)
function fmtPct(num, digits = 2) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return (Number(num) * 100).toFixed(digits) + '%';
}

// Format bilangan bulat dengan pemisah ribuan lokal ID
function fmtInt(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return Math.round(num).toLocaleString('id-ID');
}

// Parse input probabilitas (menerima 0-1 desimal atau 0-100%)
function parseProb(val) {
  if (val === undefined || val === null) return NaN;
  let str = String(val).trim();
  if (str === '') return NaN;
  
  if (str.endsWith('%')) {
    const num = parseFloat(str.slice(0, -1));
    return isNaN(num) ? NaN : num / 100;
  }
  
  const num = parseFloat(str);
  if (isNaN(num)) return NaN;

  // Jika user memasukkan angka di atas 1 sampai 100, perlakukan sebagai persentase
  if (num > 1 && num <= 100) {
    return num / 100;
  }
  
  return num;
}

// Menampilkan Toast notifikasi sementara
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    info: 'bg-slate-900 border border-slate-700 text-slate-100 shadow-slate-950/80',
    success: 'bg-emerald-950 border border-emerald-700/80 text-emerald-200 shadow-emerald-950/80',
    warning: 'bg-amber-950 border border-amber-700/80 text-amber-200 shadow-amber-950/80',
    error: 'bg-rose-950 border border-rose-700/80 text-rose-200 shadow-rose-950/80'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 pointer-events-auto transform transition-all duration-300 opacity-0 translate-y-2 backdrop-blur-md`;
  toast.innerHTML = `
    <svg class="w-4 h-4 flex-shrink-0 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
