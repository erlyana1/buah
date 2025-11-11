document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Selektor Elemen Penting ---
    const productItems = document.querySelectorAll('.produk-item');
    const paymentRadios = document.querySelectorAll('input[name="metode_bayar"]');
    const detailContainers = document.querySelectorAll('.detail-bayar');
    const totalDisplay = document.querySelector('.keranjang-info p');
    const checkoutForm = document.getElementById('pembayaran-form');

    // --- 2. Variabel Status (Simulasi Keranjang) ---
    let cart = [];
    let totalPrice = 0;

    // Data produk (Simulasi) - PASTIKAN NAMA PRODUK DI SINI SAMA PERSIS DENGAN YANG ADA DI ELEMEN <h3> HTML
    const productsData = {
        'Apel Fuji Premium': 35000,
        'Pisang Cavendish': 20000,
        'Mangga Harum Manis': 45000, // Tambahan produk simulasi
        'Jeruk Sunkist': 28000 // Tambahan produk simulasi
    };

    // --- 3. Fungsi Logika Keranjang ---

    function updateCartDisplay() {
        // Hitung ulang total harga berdasarkan item dan kuantitas di keranjang
        totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Format harga ke mata uang Rupiah
        const formattedTotal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalPrice);
        
        // Perbarui tampilan total belanja
        totalDisplay.innerHTML = `Total Belanja (Simulasi): <strong>${formattedTotal}</strong>`;
        
        console.log('Keranjang saat ini:', cart);
        console.log('Total Harga:', formattedTotal);
    }

    // Event Listener untuk tombol "Tambah ke Keranjang"
    productItems.forEach(item => {
        const addButton = item.querySelector('button');
        // Mendapatkan nama produk dari elemen <h3>
        const productName = item.querySelector('h3').textContent.trim();
        // Mengambil harga dari objek productsData
        const productPrice = productsData[productName];

        // Memastikan produk ada di data simulasi dan memiliki tombol
        if (productPrice !== undefined && addButton) { 
            addButton.addEventListener('click', () => {
                // Cari apakah produk sudah ada di keranjang
                const existingItem = cart.find(item => item.name === productName);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    // Tambahkan produk baru ke keranjang
                    cart.push({ name: productName, price: productPrice, quantity: 1 });
                }

                alert(`${productName} berhasil ditambahkan ke keranjang!`);
                updateCartDisplay(); // Panggil fungsi untuk memperbarui total
            });
        } else {
            // Log jika ada item di HTML yang tidak memiliki data harga
            console.error(`Produk "${productName}" tidak ditemukan di productsData atau tombol tidak ditemukan.`);
        }
    });

    // Inisialisasi tampilan keranjang awal
    updateCartDisplay();


    // --- 4. Fungsi Interaktif Pilihan Pembayaran ---

    // Fungsi untuk menyembunyikan semua detail pembayaran
    function hideAllDetails() {
        detailContainers.forEach(detail => {
            detail.style.display = 'none';
        });
    }

    // Event Listener untuk radio button pembayaran
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            hideAllDetails(); // Sembunyikan semua detail terlebih dahulu
            const selectedValue = event.target.value;
            // Temukan dan tampilkan detail yang sesuai
            const detailElement = document.querySelector(`.${selectedValue}-detail`);
            if (detailElement) {
                detailElement.style.display = 'block';
            }
        });
    });

    // Panggil fungsi ini saat script dimuat agar detail tersembunyi
    hideAllDetails();

    // --- 5. Simulasi Proses Checkout (Form Submit) ---

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form melakukan submit default (reload halaman)

        const selectedMethod = document.querySelector('input[name="metode_bayar"]:checked');
        
        // Validasi keranjang kosong
        if (totalPrice === 0) {
             alert('Keranjang belanja Anda masih kosong. Silakan tambahkan buah!');
             return;
        }

        // Validasi metode pembayaran
        if (!selectedMethod) {
            alert('Mohon pilih salah satu metode pembayaran (E-Wallet, Transfer Bank, atau COD).');
            return;
        }

        const method = selectedMethod.value.toUpperCase();

        // Ambil total harga yang sudah terformat dari tampilan
        const finalTotalDisplay = totalDisplay.querySelector('strong').textContent;

        // Tampilkan pesan sukses berdasarkan metode yang dipilih
        let successMessage = `Pesanan Anda telah berhasil dibuat!\n`;
        successMessage += `Total yang harus dibayar: ${finalTotalDisplay}.\n\n`;

        switch (method) {
            case 'EWALLET':
                successMessage += `Langkah selanjutnya: Anda akan diarahkan ke halaman gerbang pembayaran E-Wallet (simulasi).`;
                break;
            case 'TRANSFER':
                successMessage += `Langkah selanjutnya: Silakan lakukan Transfer Bank dan kirimkan bukti pembayaran.`;
                break;
            case 'COD':
                successMessage += `Langkah selanjutnya: Kami akan segera memproses pengiriman. Siapkan uang tunai saat kurir tiba!`;
                break;
            default:
                successMessage += `Langkah selanjutnya: Pesanan sedang diproses.`;
        }

        alert(successMessage);
        
        // Reset keranjang setelah simulasi checkout
        cart = [];
        updateCartDisplay(); // Perbarui total menjadi nol
    });
});
