/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 */

const STORAGE_KEY = 'expenseTrackerTransactions';

// Array utama data transaksi, dimuat dari localStorage saat halaman dibuka
let transactions = loadTransactions();

// Menyimpan id transaksi yang sedang di-edit (null = mode "Tambah")
let editingId = null;

// Kata kunci pencarian aktif
let searchKeyword = '';

// Membuat ID unik otomatis
function generateId() {
  return +new Date();
}

/**
 * ========================================================
 * Kriteria 2 (Basic): Web Storage API
 * ========================================================
 */
function loadTransactions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/**
 * Kriteria 2 (Advanced): Custom Event sebagai penghubung
 * data berubah -> tampilan diperbarui.
 * Semua fungsi yang mengubah data memanggil ini di akhir.
 */
function commitChanges() {
  saveTransactions();
  document.dispatchEvent(new Event('transaction:updated'));
}

document.addEventListener('transaction:updated', () => {
  renderTransactions();
  renderDashboard();
});

/**
 * ========================================================
 * Kriteria 1: Ambil elemen dari DOM
 * ========================================================
 */
const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');
const submitButton = document.querySelector('[data-testid="transactionFormSubmitButton"]');

const searchTransactionForm = document.getElementById('searchTransactionForm');
const searchTitleInput = document.getElementById('searchTransactionFormTitleInput');

const incomeListEl = document.getElementById('incomeList');
const expenseListEl = document.getElementById('expenseList');

const balanceAmountEl = document.querySelector('.tracker-summary__balance-amount');
const incomeAmountEl = document.querySelector('.tracker-summary__stat-amount--income');
const expenseAmountEl = document.querySelector('.tracker-summary__stat-amount--expense');

/**
 * ========================================================
 * Kriteria 1 (Advanced): Panel Dasbor
 * ========================================================
 */
function renderDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((trx) => {
    if (trx.type === 'income') {
      totalIncome += trx.amount;
    } else if (trx.type === 'expense') {
      totalExpense += trx.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  balanceAmountEl.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
  incomeAmountEl.textContent = `Rp ${totalIncome.toLocaleString('id-ID')}`;
  expenseAmountEl.textContent = `Rp ${totalExpense.toLocaleString('id-ID')}`;
}

/**
 * ========================================================
 * Kriteria 1 (Basic): Membuat 1 kartu transaksi
 * Struktur & data-testid mengikuti templat wajib di rubrik,
 * ditambah class dari style.css starter project agar tampilannya
 * konsisten, plus 1 tombol "Edit" tambahan (Kriteria 2 - Skilled).
 * ========================================================
 */
function createTransactionElement(transaction) {
  const { id, title, amount, date, type } = transaction;
  const isIncome = type === 'income';

  const item = document.createElement('div');
  item.classList.add('tracker-transaction-item');
  item.setAttribute('data-testid', 'transactionItem');

  // Ikon (elemen tambahan, boleh ditambahkan bebas selama tidak
  // menghapus elemen wajib)
  const icon = document.createElement('div');
  icon.classList.add(
    'tracker-transaction-item__icon',
    isIncome ? 'tracker-transaction-item__icon--income' : 'tracker-transaction-item__icon--expense'
  );
  icon.textContent = isIncome ? '↓' : '↑';

  // Detail: judul, tanggal, nominal, tipe
  const detail = document.createElement('div');
  detail.classList.add('tracker-transaction-item__detail');

  const titleEl = document.createElement('h3');
  titleEl.classList.add('tracker-transaction-item__title');
  titleEl.setAttribute('data-testid', 'transactionItemTitle');
  titleEl.textContent = title;

  const dateEl = document.createElement('p');
  dateEl.classList.add('tracker-transaction-item__date');
  dateEl.setAttribute('data-testid', 'transactionItemDate');
  dateEl.textContent = `Tanggal: ${date}`;

  detail.appendChild(titleEl);
  detail.appendChild(dateEl);

  // Bagian kanan: nominal + tipe (tersembunyi teksnya lewat CSS
  // tapi tetap ada di DOM untuk keperluan testid) + tombol aksi
  const right = document.createElement('div');
  right.classList.add('tracker-transaction-item__right');

  const amountEl = document.createElement('p');
  amountEl.classList.add(
    'tracker-transaction-item__amount',
    isIncome ? 'tracker-transaction-item__amount--income' : 'tracker-transaction-item__amount--expense'
  );
  amountEl.setAttribute('data-testid', 'transactionItemAmount');
  amountEl.textContent = `Nominal: Rp${amount}`;

  const typeEl = document.createElement('p');
  typeEl.classList.add('visually-hidden');
  typeEl.setAttribute('data-testid', 'transactionItemType');
  typeEl.textContent = `Tipe: ${isIncome ? 'Pemasukan' : 'Pengeluaran'}`;

  const actions = document.createElement('div');
  actions.classList.add('tracker-transaction-item__actions');

  const editTypeButton = document.createElement('button');
  editTypeButton.setAttribute('data-testid', 'transactionItemEditTypeButton');
  editTypeButton.classList.add('tracker-transaction-item__btn');
  editTypeButton.textContent = 'Ubah Tipe';
  editTypeButton.addEventListener('click', () => {
    toggleTransactionType(id);
  });

  const editButton = document.createElement('button');
  editButton.classList.add('tracker-transaction-item__btn');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    startEditTransaction(id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'transactionItemDeleteButton');
  deleteButton.classList.add('tracker-transaction-item__btn');
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => {
    deleteTransaction(id);
  });

  actions.appendChild(editTypeButton);
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  right.appendChild(amountEl);
  right.appendChild(typeEl);
  right.appendChild(actions);

  item.appendChild(icon);
  item.appendChild(detail);
  item.appendChild(right);

  return item;
}

/**
 * ========================================================
 * Kriteria 1 (Basic) + Kriteria 3: Render daftar transaksi
 * ke incomeList & expenseList, dengan filter pencarian.
 * ========================================================
 */
function renderTransactions() {
  // Kosongkan kontainer sebelum diisi ulang
  incomeListEl.innerHTML = '';
  expenseListEl.innerHTML = '';

  const keyword = searchKeyword.trim().toLowerCase();

  const filtered = keyword
    ? transactions.filter((trx) => trx.title.toLowerCase().includes(keyword))
    : transactions;

  const incomeTransactions = filtered
    .filter((trx) => trx.type === 'income')
    .sort((a, b) => b.id - a.id);

  const expenseTransactions = filtered
    .filter((trx) => trx.type === 'expense')
    .sort((a, b) => b.id - a.id);

  incomeTransactions.forEach((trx) => {
    incomeListEl.appendChild(createTransactionElement(trx));
  });

  expenseTransactions.forEach((trx) => {
    expenseListEl.appendChild(createTransactionElement(trx));
  });
}

/**
 * ========================================================
 * Operasi data: tambah, hapus, ubah tipe, update (edit)
 * ========================================================
 */
function addTransaction(title, amount, date, type) {
  transactions.push({
    id: generateId(),
    title,
    amount: Number(amount),
    date,
    type
  });
  commitChanges();
}

function updateTransaction(id, title, amount, date, type) {
  transactions = transactions.map((trx) => {
    if (trx.id === id) {
      return { ...trx, title, amount: Number(amount), date, type };
    }
    return trx;
  });
  commitChanges();
}

function deleteTransaction(id) {
  transactions = transactions.filter((trx) => trx.id !== id);
  // Jika transaksi yang sedang di-edit dihapus, batalkan mode edit
  if (editingId === id) {
    resetFormToAddMode();
  }
  commitChanges();
}

function toggleTransactionType(id) {
  transactions = transactions.map((trx) => {
    if (trx.id === id) {
      return { ...trx, type: trx.type === 'income' ? 'expense' : 'income' };
    }
    return trx;
  });
  commitChanges();
}

/**
 * ========================================================
 * Kriteria 2 (Skilled): Mode Edit pada form
 * ========================================================
 */
function startEditTransaction(id) {
  const transaction = transactions.find((trx) => trx.id === id);
  if (!transaction) return;

  editingId = id;
  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  typeSelect.value = transaction.type;

  submitButton.textContent = 'Update';
  titleInput.focus();
}

function resetFormToAddMode() {
  editingId = null;
  transactionForm.reset();
  submitButton.textContent = 'Simpan';
}

/**
 * ========================================================
 * Kriteria 1 (Basic + Skilled): Submit form tambah/update transaksi
 * ========================================================
 */
transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = amountInput.value;
  const date = dateInput.value;
  const type = typeSelect.value;

  // Validasi: judul tidak boleh kosong, nominal tidak boleh kurang dari 1
  if (!title) {
    alert('Judul transaksi tidak boleh kosong.');
    return;
  }

  if (!amount || Number(amount) < 1) {
    alert('Nominal harus diisi dan minimal Rp1.');
    return;
  }

  if (editingId !== null) {
    updateTransaction(editingId, title, amount, date, type);
    resetFormToAddMode();
  } else {
    addTransaction(title, amount, date, type);
    transactionForm.reset();
  }

  titleInput.focus();
});

/**
 * ========================================================
 * Kriteria 3: Pencarian transaksi (real-time + submit form)
 * ========================================================
 */
searchTitleInput.addEventListener('input', (event) => {
  searchKeyword = event.target.value;
  renderTransactions();
});

searchTransactionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchKeyword = searchTitleInput.value;
  renderTransactions();
});

/**
 * ========================================================
 * Render pertama kali saat halaman dimuat
 * ========================================================
 */
renderTransactions();
renderDashboard();