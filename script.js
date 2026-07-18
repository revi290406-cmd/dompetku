let transaksi = JSON.parse(localStorage.getItem('transaksi_keuangan')) || [];
let batasBudget = parseInt(localStorage.getItem('batas_anggaran')) || 0;
document.getElementById('tanggal').valueAsDate = new Date();

// ================= FITUR BARU: LOGIKA KUNCI PIN RAHASIA =================
function verifikasiPIN() {
    let pinInput = document.getElementById('pin-input').value;
    // PIN Default diatur ke "1234", Anda bisa mengubahnya di sini jika mau
    if (pinInput === "1234") {
        document.getElementById('pin-screen').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('pin-screen').style.display = "none";
        }, 300);
    } else {
        alert("❌ PIN Salah! Coba lagi.");
        document.getElementById('pin-input').value = "";
    }
}

// ================= LOGIKA TEMA GELAP/TERANG =================
if (localStorage.getItem('tema_aplikasi') === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-toggle').innerText = '☀️';
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    let tombol = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('tema_aplikasi', 'dark');
        tombol.innerText = '☀️';
    } else {
        localStorage.setItem('tema_aplikasi', 'light');
        tombol.innerText = '🌙';
    }
}

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString('id-ID');
}

// ================= SIMPAN & AMBIL DATA ANGGARAN =================
if (batasBudget > 0) {
    document.getElementById('input-budget').value = batasBudget;
}

function simpanBudget() {
    let nilaiBudget = document.getElementById('input-budget').value;
    batasBudget = parseInt(nilaiBudget) || 0;
    localStorage.setItem('batas_anggaran', batasBudget);
    updateTampilan();
}

// ================= REKAYASA TAMPILAN UTAMA =================
function updateTampilan() {
    let listRiwayat = document.getElementById('list-riwayat');
    let filter = document.getElementById('filter-kategori').value;
    listRiwayat.innerHTML = ''; 

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transaksi.forEach((item, index) => {
        if (item.jenis === 'masuk') {
            totalPemasukan += item.nominal;
        } else {
            totalPengeluaran += item.nominal;
        }

        // Fitur Baru: Logika Memfilter Riwayat
        if (filter !== "semua" && item.kategori !== filter) {
            return; // Lewati data jika tidak sesuai kategori filter
        }

        let li = document.createElement('li');
        li.className = item.jenis === 'masuk' ? 'plus' : 'minus'; 
        
        li.innerHTML = `
            <div>
                <small style="color: gray;">${item.tanggal}</small><br>
                <strong>${item.kategori}</strong> <span style="font-size:12px">(${item.keterangan})</span> <br>
                <span style="font-weight:bold; color:${item.jenis === 'masuk' ? '#28a745' : '#dc3545'}">
                    ${item.jenis === 'masuk' ? '+' : '-'} ${formatRupiah(item.nominal)}
                </span>
            </div>
            <button class="delete-btn" onclick="hapusData(${index})">Hapus</button>
        `;
        listRiwayat.appendChild(li);
    });

    let totalSaldo = totalPemasukan - totalPengeluaran;
    document.getElementById('saldo').innerText = formatRupiah(totalSaldo);
    document.getElementById('pemasukan').innerText = formatRupiah(totalPemasukan);
    document.getElementById('pengeluaran').innerText = formatRupiah(totalPengeluaran);

    // ================= FITUR BARU: LOGIKA KONDISI ANGGARAN KRITIS =================
    let kartuAtm = document.getElementById('kartu-atm');
    let badgeStatus = document.getElementById('status-anggaran');

    if (batasBudget > 0 && totalPengeluaran > batasBudget) {
        kartuAtm.classList.add('kritis');
        badgeStatus.innerText = "🚨 DOMPET KRITIS!";
        badgeStatus.style.background = "rgba(0,0,0,0.4)";
    } else if (batasBudget > 0 && totalPengeluaran >= batasBudget * 0.8) {
        kartuAtm.classList.remove('kritis');
        badgeStatus.innerText = "⚠️ Siaga (80% Anggaran)";
        badgeStatus.style.background = "#f39c12";
    } else {
        kartuAtm.classList.remove('kritis');
        badgeStatus.innerText = "💸 Saldo Aman";
        badgeStatus.style.background = "rgba(255,255,255,0.2)";
    }

    localStorage.setItem('transaksi_keuangan', JSON.stringify(transaksi));
}

function tambahData() {
    let tanggal = document.getElementById('tanggal').value;
    let kategori = document.getElementById('kategori').value;
    let keterangan = document.getElementById('keterangan').value;
    let nominal = document.getElementById('nominal').value;
    let jenis = document.getElementById('jenis').value;

    if (nominal === "") {
        alert("Nominal tidak boleh kosong!");
        return;
    }

    let dataBaru = {
        tanggal: tanggal,
        kategori: kategori,
        keterangan: keterangan || "-",
        nominal: parseInt(nominal), 
        jenis: jenis
    };

    transaksi.push(dataBaru);
    document.getElementById('keterangan').value = "";
    document.getElementById('nominal').value = "";
    updateTampilan();
}

function hapusData(index) {
    if(confirm("Hapus catatan ini?")) {
        transaksi.splice(index, 1); 
        updateTampilan(); 
    }
}

function resetData() {
    if(confirm("PERINGATAN! Anda yakin ingin menghapus semua data?")) {
        transaksi = [];
        localStorage.removeItem('transaksi_keuangan');
        updateTampilan();
    }
}

window.onload = updateTampilan;
