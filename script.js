let transaksi = JSON.parse(localStorage.getItem('transaksi_keuangan')) || [];
document.getElementById('tanggal').valueAsDate = new Date();

// ================= FITUR BARU: LOGIKA MODE GELAP & TERANG =================
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
// =========================================================================

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString('id-ID');
}

function updateTampilan() {
    let listRiwayat = document.getElementById('list-riwayat');
    listRiwayat.innerHTML = ''; 

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transaksi.forEach((item, index) => {
        if (item.jenis === 'masuk') {
            totalPemasukan += item.nominal;
        } else {
            totalPengeluaran += item.nominal;
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
