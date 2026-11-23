function parseData(value) {
  const parts = String(value)
    .replace(/,/g, ' ')
    .replace(/;/g, ' ')
    .split(/\s+/)
    .map(part => part.trim())
    .filter(Boolean);

  if (!parts.length) return { data: [], error: 'Masukkan minimal satu angka.' };

  const data = parts.map(Number);
  if (data.some(Number.isNaN)) {
    return { data: [], error: 'Data hanya boleh berisi angka yang dipisahkan dengan koma, spasi, atau baris baru.' };
  }

  return { data, error: '' };
}

function median(sorted) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function percentile(sorted, q) {
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const fraction = position - lower;
  return sorted[lower] + ((sorted[lower + 1] - sorted[lower]) * fraction);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '-';
  return Number(value.toFixed(4)).toLocaleString('id-ID');
}

function calculateDescriptiveStats() {
  const input = document.getElementById('data-input');
  const error = document.getElementById('data-error');
  if (!input) return;

  const parsed = parseData(input.value);
  if (error) {
    error.textContent = parsed.error;
    error.classList.toggle('hidden', !parsed.error);
  }
  if (parsed.error) return;

  const data = parsed.data;
  const sorted = [...data].sort((a, b) => a - b);
  const count = data.length;
  const sum = data.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const minimum = sorted[0];
  const maximum = sorted[count - 1];

  const frequencies = new Map();
  data.forEach(value => frequencies.set(value, (frequencies.get(value) || 0) + 1));
  let highestFrequency = 0;
  frequencies.forEach(frequency => {
    if (frequency > highestFrequency) highestFrequency = frequency;
  });

  const modes = highestFrequency > 1
    ? [...frequencies.entries()].filter(([, frequency]) => frequency === highestFrequency).map(([value]) => value)
    : [];

  const squaredDifferences = data.reduce((total, value) => total + Math.pow(value - mean, 2), 0);
  const populationVariance = squaredDifferences / count;
  const sampleVariance = count > 1 ? squaredDifferences / (count - 1) : 0;
  const populationDeviation = Math.sqrt(populationVariance);
  const sampleDeviation = count > 1 ? Math.sqrt(sampleVariance) : 0;

  const output = {
    'out-count': count,
    'out-sum': formatNumber(sum),
    'out-mean': formatNumber(mean),
    'out-median': formatNumber(median(sorted)),
    'out-mode': modes.length ? modes.map(formatNumber).join(', ') : 'Tidak ada modus',
    'out-min': formatNumber(minimum),
    'out-max': formatNumber(maximum),
    'out-range': formatNumber(maximum - minimum),
    'out-q1': formatNumber(percentile(sorted, 0.25)),
    'out-q3': formatNumber(percentile(sorted, 0.75)),
    'out-var-sample': count > 1 ? formatNumber(sampleVariance) : '-',
    'out-var-population': formatNumber(populationVariance),
    'out-sd-sample': count > 1 ? formatNumber(sampleDeviation) : '-',
    'out-sd-population': formatNumber(populationDeviation)
  };

  Object.entries(output).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });

  renderFrequencyChart(frequencies);
}

function renderFrequencyChart(frequencies) {
  const chart = document.getElementById('frequency-chart');
  if (!chart) return;

  const entries = [...frequencies.entries()].sort((a, b) => a[0] - b[0]);
  const maximum = Math.max(...entries.map(([, frequency]) => frequency));

  chart.innerHTML = entries.map(([value, frequency]) => {
    const width = Math.max(8, (frequency / maximum) * 100);
    return `
      <div class="grid grid-cols-[70px_minmax(0,1fr)_38px] items-center gap-3 text-xs">
        <span class="font-mono text-slate-300">${formatNumber(value)}</span>
        <div class="h-6 rounded-md bg-slate-950 overflow-hidden">
          <div class="h-full rounded-md bg-gradient-to-r from-brand-600 to-cyan-500" style="width:${width}%"></div>
        </div>
        <strong class="text-right text-slate-300">${frequency}</strong>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('data-input');
  const calculateButton = document.getElementById('btn-hitung-deskriptif');
  const resetButton = document.getElementById('btn-reset-deskriptif');
  const presetButton = document.getElementById('btn-presets-deskriptif');

  if (calculateButton) calculateButton.addEventListener('click', () => {
    calculateDescriptiveStats();
    if (input && input.value.trim()) showToast('Statistik deskriptif berhasil dihitung.', 'success');
  });

  if (input) input.addEventListener('input', calculateDescriptiveStats);

  if (resetButton) resetButton.addEventListener('click', () => {
    input.value = '';
    [
      'out-count', 'out-sum', 'out-mean', 'out-median', 'out-mode', 'out-min',
      'out-max', 'out-range', 'out-q1', 'out-q3', 'out-var-sample',
      'out-var-population', 'out-sd-sample', 'out-sd-population'
    ].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = '-';
    });
    document.getElementById('frequency-chart').innerHTML = '<p class="text-sm text-slate-500">Belum ada data.</p>';
    document.getElementById('data-error').classList.add('hidden');
    showToast('Data telah direset.', 'info');
  });

  if (presetButton) presetButton.addEventListener('click', () => {
    input.value = '68, 72, 75, 80, 80, 85, 88, 90';
    calculateDescriptiveStats();
    showToast('Contoh data dimuat.', 'success');
  });
});
