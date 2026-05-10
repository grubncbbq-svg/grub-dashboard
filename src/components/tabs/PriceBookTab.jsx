import { useEffect, useState } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { fmtD } from "../../lib/format.js";
import {
  getPriceBook,
  renamePriceBookEntry,
  mergePriceBookEntries,
  deletePriceBookEntry,
} from "../../lib/supabase.js";

export default function PriceBookTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [mergeTargetFor, setMergeTargetFor] = useState(null); // entry id whose merge dropdown is open
  const [draftNames, setDraftNames] = useState({}); // { [id]: editingName }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const rows = await getPriceBook();
      setEntries(rows || []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function commitRename(entry) {
    const next = (draftNames[entry.id] ?? entry.name).trim();
    if (next === entry.name) return; // no change
    if (!next) {
      setError("Name cannot be empty");
      // restore draft to current name
      setDraftNames((d) => ({ ...d, [entry.id]: entry.name }));
      return;
    }
    try {
      setBusyId(entry.id);
      await renamePriceBookEntry(entry.name, next);
      setDraftNames((d) => {
        const c = { ...d };
        delete c[entry.id];
        return c;
      });
      await load();
    } catch (e) {
      setError(e.message || String(e));
      // keep the draft so user can adjust
    } finally {
      setBusyId(null);
    }
  }

  async function handleMerge(entry, targetName) {
    if (!targetName || targetName === entry.name) {
      setMergeTargetFor(null);
      return;
    }
    if (
      !window.confirm(
        `Merge "${entry.name}" into "${targetName}"?\n\nAll price history from "${entry.name}" will be reassigned to "${targetName}", and the "${entry.name}" entry will be deleted. The price on "${targetName}" stays as-is.`
      )
    ) {
      setMergeTargetFor(null);
      return;
    }
    try {
      setBusyId(entry.id);
      await mergePriceBookEntries(entry.name, targetName);
      setMergeTargetFor(null);
      await load();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(entry) {
    if (
      !window.confirm(
        `Delete "${entry.name}" from the Price Book?\n\nPrice history rows are kept for the historical record but won't show here. This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      setBusyId(entry.id);
      await deletePriceBookEntry(entry.name);
      await load();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusyId(null);
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading && entries.length === 0) {
    return (
      <div style={{ ...cardStyle, textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📒</div>
        <div style={{ fontSize: 14, color: C.dim }}>Loading Price Book…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={cardStyle}>
        <div
          style={{
            fontSize: 11,
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 6,
          }}
        >
          Receipt-Captured Prices
        </div>
        <div style={{ fontSize: 16, color: C.white, fontWeight: 700 }}>
          {entries.length} ingredient{entries.length === 1 ? "" : "s"}
        </div>
        <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
          These are the prices saved automatically when you confirm receipts.
          Tap a name to rename it, merge duplicates from OCR misreads, or delete
          stale entries. Cost cards on the Food Cost tab use a separate curated
          list and aren't affected.
        </div>
      </div>

      {error && (
        <div
          style={{
            ...cardStyle,
            borderLeft: `3px solid ${C.red}`,
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: C.red,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Error
          </div>
          <div style={{ fontSize: 13, color: C.text }}>{error}</div>
          <button
            onClick={() => setError(null)}
            style={{
              marginTop: 8,
              fontSize: 11,
              color: C.dim,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            dismiss
          </button>
        </div>
      )}

      {entries.length === 0 && !loading && (
        <div style={{ ...cardStyle, textAlign: "center", padding: 36 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, color: C.text, marginBottom: 4 }}>
            No prices captured yet
          </div>
          <div style={{ fontSize: 11, color: C.dim }}>
            Confirm a receipt on the Receipts tab and prices will land here.
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length > 0 && (
        <div style={cardStyle}>
          {entries.map((entry, idx) => {
            const isBusy = busyId === entry.id;
            const draft = draftNames[entry.id] ?? entry.name;
            const isLast = idx === entries.length - 1;
            const showMerge = mergeTargetFor === entry.id;

            return (
              <div
                key={entry.id}
                style={{
                  paddingTop: 14,
                  paddingBottom: 14,
                  borderBottom: isLast ? "none" : `1px solid ${C.border}`,
                  opacity: isBusy ? 0.5 : 1,
                  pointerEvents: isBusy ? "none" : "auto",
                }}
              >
                {/* Top row: name input + price */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) =>
                      setDraftNames((d) => ({
                        ...d,
                        [entry.id]: e.target.value,
                      }))
                    }
                    onBlur={() => commitRename(entry)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.target.blur();
                      if (e.key === "Escape") {
                        setDraftNames((d) => ({
                          ...d,
                          [entry.id]: entry.name,
                        }));
                        e.target.blur();
                      }
                    }}
                    spellCheck={false}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 14,
                      color: C.white,
                      fontWeight: 600,
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = C.accent)}
                  />
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.accent,
                      fontFamily: "'Playfair Display', serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.unit === "each"
                      ? `${fmtD(entry.price)}/ea`
                      : `${fmtD(entry.price)}/${entry.unit}`}
                  </div>
                </div>

                {/* Meta row */}
                <div
                  style={{
                    fontSize: 11,
                    color: C.dim,
                    marginTop: 6,
                    marginLeft: 2,
                  }}
                >
                  {entry.vendor || "—"} · updated{" "}
                  {entry.updated_at || entry.created_at?.slice(0, 10) || "—"}
                </div>

                {/* Actions row */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {!showMerge ? (
                    <>
                      <button
                        onClick={() => setMergeTargetFor(entry.id)}
                        style={actionBtnStyle(C)}
                      >
                        Merge into…
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        style={{
                          ...actionBtnStyle(C),
                          color: C.red,
                          borderColor: `${C.red}55`,
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        autoFocus
                        defaultValue=""
                        onChange={(e) => handleMerge(entry, e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 12,
                          padding: "8px 10px",
                          background: C.bg,
                          color: C.text,
                          border: `1px solid ${C.accent}`,
                          borderRadius: 6,
                          fontFamily: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>
                          Pick target ingredient…
                        </option>
                        {entries
                          .filter((e) => e.id !== entry.id)
                          .map((e) => (
                            <option key={e.id} value={e.name}>
                              {e.name} ({fmtD(e.price)}/{e.unit})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => setMergeTargetFor(null)}
                        style={actionBtnStyle(C)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function actionBtnStyle(C) {
  return {
    fontSize: 11,
    padding: "7px 12px",
    background: "transparent",
    color: C.dim,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    letterSpacing: 0.3,
  };
}
