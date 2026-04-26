import { useState } from "react";
import { C } from "./lib/theme.js";
import TabNav from "./components/shared/TabNav.jsx";
import OverviewTab from "./components/tabs/OverviewTab.jsx";
import FoodCostTab from "./components/tabs/FoodCostTab.jsx";
import PurchasesTab from "./components/tabs/PurchasesTab.jsx";
import RecipesTab from "./components/tabs/RecipesTab.jsx";
import ReceiptsTab from "./components/tabs/ReceiptsTab.jsx";
import CalendarTab from "./components/tabs/CalendarTab.jsx";
import ExpensesTab from "./components/tabs/ExpensesTab.jsx";

export default function App() {
  const [tab, setTab] = useState("overview");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Crimson Pro', Georgia, serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, #141210, ${C.bg})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              color: C.white,
              letterSpacing: 2,
            }}
          >
            GRUB
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.dim,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Smokehouse Dashboard
          </div>
        </div>
        <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>
          Harvest Hospitality LLC · Youngsville, NC
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNav active={tab} onChange={setTab} />

      {/* Tab Content */}
      <div
        style={{ padding: "18px 16px 40px", maxWidth: 900, margin: "0 auto" }}
      >
        {tab === "overview" && <OverviewTab />}
        {tab === "foodcost" && <FoodCostTab />}
        {tab === "purchases" && <PurchasesTab />}
        {tab === "receipts" && <ReceiptsTab />}
        {tab === "recipes" && <RecipesTab />}
        {tab === "calendar" && <CalendarTab />}
        {tab === "expenses" && <ExpensesTab />}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: 9,
          color: "#3D2E22",
          letterSpacing: 0.5,
        }}
      >
        GRUB SMOKEHOUSE · HARVEST HOSPITALITY LLC · CONFIDENTIAL
      </div>
    </div>
  );
}
