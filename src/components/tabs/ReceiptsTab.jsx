import { useState, useRef } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { fmtD } from "../../lib/format.js";
import { saveReceipt, confirmReceiptItems } from "../../lib/supabase.js";

const CAT_COLORS = { R: C.green, H: C.red, S: C.blue };
const CAT_LABELS = { R: "Restaurant", H: "Home", S: "Supply" };

export default function ReceiptsTab() {
  const [stage, setStage] = useState("upload"); // upload | scanning | review | done
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [items, setItems] = useState([]);
  const fileRef = useRef();

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setStage("scanning");

    try {
      // Convert image to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const mediaType = file.type || "image/jpeg";

      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Scan failed");
      }

      const data = await res.json();
      setScanResult(data);
      setItems(data.items.map((item, i) => ({ ...item, id: i, confirmed: false })));
      setStage("review");
    } catch (err) {
      setError(err.message);
      setStage("upload");
    }
  }

  function updateItem(idx, field, value) {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  async function handleConfirm() {
    try {
      setStage("scanning");
      const receipt = await saveReceipt({
        vendor: scanResult.vendor,
        receipt_date: scanResult.date,
        total: scanResult.total,
        raw_text: scanResult.raw_text,
        items: items.map(({ id, confirmed, ...item }) => item),
      });
      await confirmReceiptItems(receipt.id, items.map(({ id, confirmed, ...item }) => item));
      setStage("done");
    } catch (err) {
      setError(err.message);
      setStage("review");
    }
  }

  // ── Upload screen ──────────────────────────────────────────────────────────
  if (stage === "upload") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {error && (
          <div style={{ ...cardStyle, borderLeft: `3px solid ${C.red}`, padding: 14 }}>
            <div style={{ fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 4 }}>Error</div>
            <div style={{ fontSize: 13, color: C.text }}>{error}</div>
          </div>
        )}

        <div
          onClick={() => fileRef.current?.click()}
          style={{
            ...cardStyle,
            padding: 40,
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            borderColor: C.accent,
            borderWidth: 2,
            background: "#0F0D0A",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
          <div style={{ fontSize: 16, color: C.white, fontWeight: 600, marginBottom: 6 }}>
            Tap to upload a receipt
          </div>
          <div style={{ fontSize: 12, color: C.dim }}>
            Photo or screenshot · Claude will extract every line item
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            How it works
          </div>
          {[
            ["📷", "Snap or upload a receipt photo"],
            ["🤖", "Claude reads every line item automatically"],
            ["✅", "Review & confirm — fix any categories"],
            ["📊", "Prices update across Food Cost tab instantly"],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontSize: 13, color: C.text }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Scanning screen ────────────────────────────────────────────────────────
  if (stage === "scanning") {
    return (
      <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 16, color: C.white, fontWeight: 600, marginBottom: 8 }}>
          Reading receipt...
        </div>
        <div style={{ fontSize: 12, color: C.dim }}>Claude is extracting the line items</div>
      </div>
    );
  }

  // ── Done screen ────────────────────────────────────────────────────────────
  if (stage === "done") {
    const rItems = items.filter((i) => i.category === "R");
    const total = rItems.reduce((s, i) => s + (i.total_price || 0), 0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...cardStyle, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 6 }}>
            Receipt saved!
          </div>
          <div style={{ fontSize: 13, color: C.dim }}>
            {rItems.length} restaurant items · {fmtD(total)} added to Price Book
          </div>
        </div>
        <button
          onClick={() => { setStage("upload"); setScanResult(null); setItems([]); setError(null); }}
          style={{
            background: C.accent,
            color: "#0C0A07",
            border: "none",
            borderRadius: 8,
            padding: "14px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Scan Another Receipt
        </button>
      </div>
    );
  }

  // ── Review screen ──────────────────────────────────────────────────────────
  const rCount = items.filter((i) => i.category === "R").length;
  const hCount = items.filter((i) => i.category === "H").length;
  const sCount = items.filter((i) => i.category === "S").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={cardStyle}>
        <div style={{ fontSize: 16, color: C.white, fontWeight: 700, marginBottom: 4 }}>
          {scanResult.vendor || "Receipt"}
        </div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 12 }}>
          {scanResult.date || "Date unknown"} · {items.length} items found
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["R", rCount], ["H", hCount], ["S", sCount]].map(([cat, count]) => (
            <div
              key={cat}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 8,
                background: CAT_COLORS[cat] + "22",
                border: `1px solid ${CAT_COLORS[cat]}44`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: CAT_COLORS[cat] }}>{count}</div>
              <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase" }}>
                {CAT_LABELS[cat]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line items */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          Review Items — tap category to change
        </div>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: idx < items.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  placeholder="Item name"
                  spellCheck={false}
                  style={{
                    width: "100%",
                    fontSize: 13,
                    color: C.white,
                    fontWeight: 600,
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = C.accent)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)}
                />
                <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>
                  {item.quantity && item.unit ? `${item.quantity} ${item.unit} · ` : ""}
                  {item.unit_price ? `${fmtD(item.unit_price)}/unit · ` : ""}
                  {item.total_price ? fmtD(item.total_price) : ""}
                </div>
              </div>
              {/* Category toggle */}
              <div style={{ display: "flex", gap: 4 }}>
                {["R", "H", "S"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateItem(idx, "category", cat)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 11,
                      fontWeight: 700,
                      background: item.category === cat ? CAT_COLORS[cat] : C.bg,
                      color: item.category === cat ? "#fff" : C.dim,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        style={{
          background: C.accent,
          color: "#0C0A07",
          border: "none",
          borderRadius: 8,
          padding: "16px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Confirm & Save to Price Book
      </button>
      <button
        onClick={() => setStage("upload")}
        style={{
          background: "transparent",
          color: C.dim,
          border: "none",
          padding: "8px",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
