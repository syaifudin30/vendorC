require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Panggil koneksi Neon
const app = express();
const PORT = process.env.PORT || 3003;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({ ok: true, service: "vendor-c-api" });
});

// === Vendor C API Route: Mengambil data dari Neon dan me-NESTED-kannya kembali ===
app.get("/products/makanan", async (req, res, next) => {
  try {
    const sql = `
      SELECT id, "details_name", "details_category", 
             "pricing_base_price", "pricing_tax", stock 
      FROM products_vendor_c 
      ORDER BY id ASC
    `;
    const result = await db.query(sql);
    
    // Melakukan restrukturisasi (re-nesting) data dari format flat DB ke format Complex JSON (Nested Object)
    const nestedData = result.rows.map(row => ({
      id: row.id,
      details: {
        name: row.details_name,
        category: row.details_category,
      },
      pricing: {
        base_price: row.pricing_base_price,
        tax: row.pricing_tax,
      },
      stock: row.stock,
    }));
    
    res.json(nestedData); 
  } catch (err) {
    console.error("Error fetching data from Vendor C DB:", err.stack);
    next(err);
  }
});

// === FALLBACK & ERROR HANDLING ===
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error("[SERVER ERROR M3]", err.stack);
  res.status(500).json({ error: "Terjadi kesalahan pada server M3" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server M3 aktif di http://localhost:${PORT}`);
});