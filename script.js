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

    // Data produk (Simulasi)
    const productsData = {
        'Apel Fuji Premium': 35000,
        'Pisang Cavendish': 20000
        // Tambahkan produk lain sesuai dengan yang ada di HTML
    };

    // --- 3. Fungsi Logika Keranjang ---

    function updateCartDisplay() {
        // Hanya memperbarui Total Belanja (Simulasi)
        totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Format harga ke mata uang Rupiah
        const formattedTotal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(totalPrice);
        
        totalDisplay.innerHTML = `Total Belanja (Simulasi): <strong>${formattedTotal}</strong>`;
        
        console.log('Keranjang saat ini:', cart);
        console.log('Total Harga:', formattedTotal);
    }

    // Event Listener untuk tombol "Tambah ke Keranjang"
    productItems.forEach(item => {
        const addButton = item.querySelector('button');
        const productName = item.querySelector('h3').textContent.trim();
        const productPrice = productsData[productName];

        if (productPrice) {
            addButton.addEventListener('click', () => {
                // Cari apakah produk sudah ada di keranjang
                const existingItem = cart.find(item => item.name === productName);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name: productName, price: productPrice, quantity: 1 });
                }

                alert(`${productName} berhasil ditambahkan ke keranjang!`);
                updateCartDisplay();
            });
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
        
        if (totalPrice === 0) {
             alert('Keranjang belanja Anda masih kosong. Silakan tambahkan buah!');
             return;
        }

        if (!selectedMethod) {
            alert('Mohon pilih salah satu metode pembayaran (E-Wallet, Transfer Bank, atau COD).');
            return;
        }

        const method = selectedMethod.value.toUpperCase();

        // Tampilkan pesan sukses berdasarkan metode yang dipilih
        let successMessage = `Pesanan Anda telah berhasil dibuat!\n`;
        successMessage += `Total yang harus dibayar: ${totalDisplay.querySelector('strong').textContent}.\n\n`;

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
        updateCartDisplay();
    });
});
