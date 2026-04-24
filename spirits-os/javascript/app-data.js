(() => {
  "use strict";

  const KEYS = {
    medicines: "spirits-os-medicines",
    batches: "spirits-os-batches",
    sales: "spirits-os-sales",
    expenses: "spirits-os-expenses",
    stockMovements: "spirits-os-stock-movements"
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function safeArrayParse(value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function readArray(key) {
    return safeArrayParse(localStorage.getItem(key) || "[]");
  }

  function writeArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    emitChange({ key });
  }

  function emitChange(detail = {}) {
    window.dispatchEvent(new CustomEvent("spirits:data-changed", { detail }));
  }

  window.addEventListener("storage", (event) => {
    if (event.key && event.key.startsWith("spirits-os-")) {
      emitChange({ key: event.key, external: true });
    }
  });

  function normalizeMedicine(medicine) {
    return {
      id: medicine.id || makeId("med"),
      sku: String(medicine.sku || "").trim(),
      category: String(medicine.category || "").trim(),
      brandName: String(medicine.brandName || "").trim(),
      genericName: String(medicine.genericName || "").trim(),
      dosage: String(medicine.dosage || "").trim(),
      price: Number(medicine.price || 0),
      formType: String(medicine.formType || "").trim(),
      unitType: String(medicine.unitType || "Piece").trim(),
      reorderLevel: Number.isFinite(Number(medicine.reorderLevel)) ? Number(medicine.reorderLevel) : 0,
      archived: Boolean(medicine.archived),
      updatedAt: medicine.updatedAt || nowIso()
    };
  }

  function normalizeBatch(batch) {
    return {
      id: batch.id || makeId("bat"),
      batchCode: String(batch.batchCode || "").trim(),
      medicineId: String(batch.medicineId || "").trim(),
      supplier: String(batch.supplier || "").trim(),
      receivedDate: String(batch.receivedDate || "").trim(),
      expiryDate: String(batch.expiryDate || "").trim(),
      quantity: Number.isFinite(Number(batch.quantity)) ? Number(batch.quantity) : 0,
      unitCost: Number.isFinite(Number(batch.unitCost)) ? Number(batch.unitCost) : 0,
      reference: String(batch.reference || "").trim(),
      notes: String(batch.notes || "").trim(),
      archived: Boolean(batch.archived),
      updatedAt: batch.updatedAt || nowIso()
    };
  }

  function normalizeMovement(movement) {
    return {
      id: movement.id || makeId("mov"),
      medicineId: String(movement.medicineId || "").trim(),
      batchId: String(movement.batchId || "").trim(),
      type: String(movement.type || "Updated").trim(),
      quantity: Number.isFinite(Number(movement.quantity)) ? Number(movement.quantity) : 0,
      note: String(movement.note || "").trim(),
      reference: String(movement.reference || "").trim(),
      createdAt: movement.createdAt || nowIso()
    };
  }

  function getMedicines() {
    return readArray(KEYS.medicines).map(normalizeMedicine);
  }

  function getBatches() {
    return readArray(KEYS.batches).map(normalizeBatch);
  }

  function getStockMovements() {
    return readArray(KEYS.stockMovements).map(normalizeMovement);
  }

  function saveMedicines(items) {
    writeArray(KEYS.medicines, items.map(normalizeMedicine));
  }

  function saveBatches(items) {
    writeArray(KEYS.batches, items.map(normalizeBatch));
  }

  function saveStockMovements(items) {
    writeArray(KEYS.stockMovements, items.map(normalizeMovement));
  }

  function getMedicineById(id) {
    return getMedicines().find((item) => item.id === id && !item.archived) || null;
  }

  function getDaysRemaining(dateValue) {
    const today = new Date();
    const target = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.round((target - today) / (1000 * 60 * 60 * 24));
  }

  function getBatchStatus(batch, nearDays = 60) {
    if (batch.archived) return { key: "archived", label: "Archived" };
    if (batch.quantity <= 0) return { key: "depleted", label: "Depleted" };

    const daysRemaining = getDaysRemaining(batch.expiryDate);

    if (daysRemaining < 0) return { key: "expired", label: "Expired" };
    if (daysRemaining <= nearDays) return { key: "near", label: "Near Expiry" };

    return { key: "active", label: "Active" };
  }

  function pushStockMovement(movementInput) {
    const movements = getStockMovements();
    movements.unshift(
      normalizeMovement({
        ...movementInput,
        createdAt: nowIso()
      })
    );
    saveStockMovements(movements.slice(0, 500));
  }

  function upsertBatch(batchInput) {
    const batches = getBatches();
    const normalized = normalizeBatch({
      ...batchInput,
      updatedAt: nowIso()
    });

    const index = batches.findIndex((item) => item.id === normalized.id);

    if (index >= 0) {
      batches[index] = { ...batches[index], ...normalized };
    } else {
      batches.unshift(normalized);
    }

    saveBatches(batches);

    pushStockMovement({
      medicineId: normalized.medicineId,
      batchId: normalized.id,
      type: index >= 0 ? "Batch Updated" : "Batch Added",
      quantity: normalized.quantity,
      note: `${normalized.batchCode} saved in batch records.`,
      reference: normalized.batchCode
    });

    return normalized;
  }

  function archiveBatch(batchId) {
    const batches = getBatches();
    const index = batches.findIndex((item) => item.id === batchId);

    if (index < 0) return null;

    batches[index].archived = true;
    batches[index].updatedAt = nowIso();
    saveBatches(batches);

    pushStockMovement({
      medicineId: batches[index].medicineId,
      batchId: batches[index].id,
      type: "Batch Archived",
      quantity: 0,
      note: `${batches[index].batchCode} archived from active list.`,
      reference: batches[index].batchCode
    });

    return batches[index];
  }

  function seedDemoData() {
    const medicines = getMedicines();
    const batches = getBatches();

    if (!medicines.length) {
      saveMedicines([
        {
          id: "med-001",
          sku: "PAR-500",
          category: "Analgesics",
          brandName: "Biogesic",
          genericName: "Paracetamol",
          dosage: "500mg",
          price: 5,
          formType: "Tablet",
          unitType: "Piece",
          reorderLevel: 100,
          archived: false
        },
        {
          id: "med-002",
          sku: "AMX-500",
          category: "Antibiotics",
          brandName: "Amoxil",
          genericName: "Amoxicillin",
          dosage: "500mg",
          price: 18,
          formType: "Capsule",
          unitType: "Capsule",
          reorderLevel: 40,
          archived: false
        }
      ]);
    }

    if (!batches.length) {
      saveBatches([
        {
          id: "bat-001",
          batchCode: "BAT-APR-001",
          medicineId: "med-001",
          supplier: "Mercury Supplier Hub",
          receivedDate: "2026-04-01",
          expiryDate: "2027-01-15",
          quantity: 300,
          unitCost: 3.2,
          reference: "PO-24001",
          notes: "Main replenishment batch.",
          archived: false
        },
        {
          id: "bat-002",
          batchCode: "BAT-APR-002",
          medicineId: "med-002",
          supplier: "SouthCare Distribution",
          receivedDate: "2026-03-21",
          expiryDate: "2026-05-20",
          quantity: 86,
          unitCost: 5.1,
          reference: "INV-88210",
          notes: "Monitor due to near expiry threshold.",
          archived: false
        }
      ]);
    }
  }

  seedDemoData();

  window.SpiritStore = {
    KEYS,
    getMedicines,
    getMedicineById,
    getBatches,
    getBatchStatus,
    getStockMovements,
    saveMedicines,
    saveBatches,
    upsertBatch,
    archiveBatch,
    pushStockMovement,
    makeId
  };
})();