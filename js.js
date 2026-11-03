
/* ==========================================
   KANTINKU - JAVASCRIPT
   Kompatibel dengan browser lama
========================================== */


/* ==========================================
   1. DATA MENU
========================================== */

var data = [
    [
        1,
        "Nasi Ayam Sambal",
        "Makanan",
        20000,
        "Nasi hangat, ayam gurih, sambal pilihan.",
        "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/b31f446f-d365-4052-88f6-28e557107070_Go-Biz_20260411_222817.jpeg"
    ],
    [
        2,
        "Rice Bowl Teriyaki",
        "Makanan",
        18000,
        "Ayam teriyaki dengan saus manis gurih.",
        "https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/chicken_teriyaki_don.jpg"
    ],
    [
        3,
        "Es Kopi Susu",
        "Minuman",
        10000,
        "Kopi creamy untuk teman mengerjakan tugas.",
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"
    ],
    [
        4,
        "Pisang Coklat",
        "Camilan",
        8000,
        "Camilan renyah dengan cokelat lumer.",
        "https://nutrinusa.id/images/makanan/pisang-coklat.webp"
    ],
    [
        5,
        "Fresh Mango Juice",
        "Minuman",
        12000,
        "Jus mangga segar dan menyegarkan.",
        "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80"
    ],
    [
        6,
        "Mie Pedas",
        "Makanan",
        13000,
        "Mie berbumbu dengan level pedas pilihan.",
        "https://assets.ladiestory.id/gallery/16460278901448338666-mie-pedas.jpg"
    ]
];


/* ==========================================
   2. VARIABEL UTAMA
========================================== */

var cat = "Semua";
var cart = {};

try {
    cart = JSON.parse(
        localStorage.getItem("kantinkuCart") || "{}"
    );
} catch (e) {
    cart = {};
}


/* ==========================================
   3. FUNGSI BANTUAN
========================================== */

// Format harga menjadi Rupiah
function money(n) {
    return "Rp" + Number(n).toLocaleString("id-ID");
}

// Mengambil elemen berdasarkan ID
function byId(id) {
    return document.getElementById(id);
}


/* ==========================================
   4. MENAMPILKAN MENU
========================================== */

function render() {

    var cards = byId("cards");

    if (!cards) {
        return;
    }

    var search = byId("search");
    var q = search ? search.value.toLowerCase() : "";

    var found = [];
    var html = "";
    var i;
    var p;

    // Filter menu berdasarkan kategori dan pencarian
    for (i = 0; i < data.length; i++) {

        p = data[i];

        if (
            (cat === "Semua" || p[2] === cat) &&
            p[1].toLowerCase().indexOf(q) !== -1
        ) {
            found.push(p);
        }
    }

    // Membuat kartu menu
    for (i = 0; i < found.length; i++) {

        p = found[i];

        html +=
            '<article class="card">' +

                '<a href="detail.html?id=' + p[0] + '">' +
                    '<img src="' + p[5] + '" alt="' + p[1] + '">' +
                '</a>' +

                '<div class="card-body">' +

                    '<span class="tag">' + p[2] + '</span>' +

                    '<h3>' +
                        '<a href="detail.html?id=' + p[0] + '">' +
                            p[1] +
                        '</a>' +
                    '</h3>' +

                    '<p>' + p[4] + '</p>' +

                    '<div class="card-foot">' +

                        '<span class="price">' +
                            money(p[3]) +
                        '</span>' +

                        '<div style="display:flex;gap:7px;align-items:center">' +

                            '<a href="detail.html?id=' + p[0] + '" ' +
                            'style="font-size:11px;font-weight:700;color:var(--green)">' +
                                'Detail ↗' +
                            '</a>' +

                            '<button class="add" onclick="add(' + p[0] + ')">' +
                                '+' +
                            '</button>' +

                        '</div>' +

                    '</div>' +

                '</div>' +

            '</article>';
    }

    cards.innerHTML = html ||
        "<p>Menu tidak ditemukan. Coba kata kunci lain.</p>";
}


/* ==========================================
   5. PENYIMPANAN KERANJANG
========================================== */

function saveCart() {

    try {
        localStorage.setItem(
            "kantinkuCart",
            JSON.stringify(cart)
        );
    } catch (e) {
        // Penyimpanan dilewati jika browser tidak mendukung
    }
}


/* ==========================================
   6. TAMBAH MENU KE KERANJANG
========================================== */

function add(id) {

    cart[id] = (cart[id] || 0) + 1;

    saveCart();
    update();
}


/* ==========================================
   7. UBAH JUMLAH PESANAN
========================================== */

function change(id, n) {

    cart[id] = (cart[id] || 0) + n;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
    update();
}


/* ==========================================
   8. MEMPERBARUI KERANJANG
========================================== */

function update() {

    var count = 0;
    var chosen = [];
    var total = 0;
    var html = "";

    var items = byId("items");
    var countEl = byId("count");
    var totalEl = byId("total");

    var i;
    var p;

    // Menghitung jumlah seluruh pesanan
    for (var key in cart) {

        if (Object.prototype.hasOwnProperty.call(cart, key)) {
            count += Number(cart[key]) || 0;
        }
    }

    if (countEl) {
        countEl.textContent = count;
    }

    // Mengambil menu yang sudah dipilih
    for (i = 0; i < data.length; i++) {

        if (cart[data[i][0]]) {
            chosen.push(data[i]);
        }
    }

    // Menampilkan daftar keranjang
    for (i = 0; i < chosen.length; i++) {

        p = chosen[i];

        total += p[3] * cart[p[0]];

        html +=
            '<div class="rowitem">' +

                '<span>' +
                    p[1] +
                    '<br>' +
                    '<small>' + money(p[3]) + '</small>' +
                '</span>' +

                '<span class="qty">' +

                    '<button onclick="change(' + p[0] + ',-1)">' +
                        '−' +
                    '</button> ' +

                    cart[p[0]] +

                    ' <button onclick="change(' + p[0] + ',1)">' +
                        '+' +
                    '</button>' +

                '</span>' +

            '</div>';
    }

    if (items) {

        items.innerHTML = html ||
            "<p style='color:#788178;text-align:center;padding:20px'>" +
                "Keranjang masih kosong." +
            "</p>";
    }

    // Menampilkan total harga
    if (totalEl) {
        totalEl.textContent = money(total);
    }
}


/* ==========================================
   9. MENUNGGU HALAMAN SELESAI DIMUAT
========================================== */

function ready(fn) {

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", fn);

    } else {

        fn();
    }
}


/* ==========================================
   10. MENJALANKAN FITUR WEBSITE
========================================== */

ready(function () {

    // Menampilkan menu dan keranjang
    render();
    update();


    /* --------------------------------------
       FILTER KATEGORI
    -------------------------------------- */

    var filters = byId("filters");

    if (filters) {

        filters.addEventListener("click", function (e) {

            e = e || window.event;

            var target = e.target || e.srcElement;

            while (
                target &&
                target !== filters &&
                !(target.getAttribute &&
                  target.getAttribute("data-cat") !== null)
            ) {
                target = target.parentNode;
            }

            if (!target || target === filters) {
                return;
            }

            cat = target.getAttribute("data-cat");

            var buttons = filters.getElementsByTagName("button");

            for (var i = 0; i < buttons.length; i++) {

                if (buttons[i].className.indexOf("filter") !== -1) {

                    buttons[i].className =
                        buttons[i] === target
                            ? "filter active"
                            : "filter";
                }
            }

            render();
        });
    }


    /* --------------------------------------
       PENCARIAN MENU
    -------------------------------------- */

    var search = byId("search");

    if (search) {
        search.addEventListener("input", render);
    }


    /* --------------------------------------
       BUKA DAN TUTUP KERANJANG
    -------------------------------------- */

    var openCart = byId("openCart");
    var overlay = byId("overlay");
    var close = byId("close");

    if (openCart && overlay) {

        openCart.addEventListener("click", function () {

            update();
            overlay.classList.add("show");
        });
    }

    if (close && overlay) {

        close.addEventListener("click", function () {

            overlay.classList.remove("show");
        });
    }

    if (overlay) {

        overlay.addEventListener("click", function (e) {

            if (e.target === overlay) {
                overlay.classList.remove("show");
            }
        });
    }


    /* --------------------------------------
       CHECKOUT / KONFIRMASI PESANAN
    -------------------------------------- */

    var checkout = byId("checkout");

    if (checkout) {

        checkout.addEventListener("click", function () {

            var chosen = [];
            var total = 0;
            var lines = [];

            var i;

            for (i = 0; i < data.length; i++) {

                if (cart[data[i][0]]) {

                    chosen.push(data[i]);

                    total += data[i][3] * cart[data[i][0]];

                    lines.push(
                        data[i][1] +
                        " x" + cart[data[i][0]] +
                        " = " +
                        money(data[i][3] * cart[data[i][0]])
                    );
                }
            }

            if (!chosen.length) {

                alert(
                    "Keranjang masih kosong. " +
                    "Pilih menu terlebih dahulu."
                );

                return;
            }

            alert(
                "Ringkasan pesanan:\n" +
                lines.join("\n") +
                "\nTotal: " + money(total) +
                "\n\nSilakan konfirmasi ke tenant kantin."
            );
        });
    }

});
