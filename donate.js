// ============================================
// THE NO-ROTE CLUB — donate page (fake / demo)
// ============================================

(function () {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customWrap = document.getElementById('customAmountWrap');
  const customInput = document.getElementById('customAmountInput');
  const amountContext = document.getElementById('amountContext');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const submitAmountEl = document.getElementById('submitAmount');
  const submitFreqEl = document.getElementById('submitFreq');
  const form = document.getElementById('donateForm');
  const successOverlay = document.getElementById('successOverlay');
  const successClose = document.getElementById('successClose');

  let selectedAmount = 500;
  let selectedFreq = 'once';

  const contextMap = {
    100: '₹100 covers an hour of expert review on an existing lesson.',
    250: '₹250 helps fund one round of expert feedback on a draft chapter.',
    500: '₹500 covers expert review time for one full lesson draft.',
    1000: '₹1,000 funds a full lesson, reviewed and built across two learning styles.',
    2500: '₹2,500 funds a small topic cluster, start to finish, multiple ways in.'
  };

  function formatRupees(n) {
    if (!n || isNaN(n)) return '₹0';
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function updateSubmitLabel() {
    submitAmountEl.textContent = formatRupees(selectedAmount);
    submitFreqEl.textContent = selectedFreq === 'monthly' ? '/ month' : '';
  }

  function selectAmount(btn) {
    amountBtns.forEach(b => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');

    if (btn.dataset.amount === 'custom') {
      customWrap.classList.add('is-visible');
      customInput.focus();
      const val = parseInt(customInput.value, 10);
      selectedAmount = isNaN(val) || val <= 0 ? 0 : val;
      amountContext.textContent = 'Every rupee goes directly toward expert-reviewed lessons.';
    } else {
      customWrap.classList.remove('is-visible');
      selectedAmount = parseInt(btn.dataset.amount, 10);
      amountContext.textContent = contextMap[selectedAmount] || '';
    }
    updateSubmitLabel();
  }

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => selectAmount(btn));
  });

  customInput.addEventListener('input', () => {
    const val = parseInt(customInput.value, 10);
    selectedAmount = isNaN(val) || val <= 0 ? 0 : val;
    updateSubmitLabel();
  });

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedFreq = btn.dataset.freq;
      updateSubmitLabel();
    });
  });

  /* ---------- light card-number formatting for realism ---------- */
  const cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', () => {
      let digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
      cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
  }
  const cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', () => {
      let digits = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
      if (digits.length > 2) digits = digits.slice(0, 2) + ' / ' + digits.slice(2);
      cardExpiry.value = digits;
    });
  }
  const cardCvc = document.getElementById('cardCvc');
  if (cardCvc) {
    cardCvc.addEventListener('input', () => {
      cardCvc.value = cardCvc.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  /* ---------- fake submit ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedAmount <= 0) {
      customInput.focus();
      customInput.style.borderColor = '#D6336C';
      return;
    }

    successOverlay.classList.add('is-visible');
    successOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeSuccess() {
    successOverlay.classList.remove('is-visible');
    successOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  successClose.addEventListener('click', closeSuccess);
  successOverlay.addEventListener('click', (e) => {
    if (e.target === successOverlay) closeSuccess();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSuccess();
  });

  updateSubmitLabel();
})();
