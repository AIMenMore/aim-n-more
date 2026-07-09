"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, type Service } from "@/lib/supabase";
import { compressImage } from "@/lib/image";
import styles from "./page.module.css";

const CATEGORIES = ["Facials", "Mani / Pedi", "Waxing", "PMU"];

const BLANK: Omit<Service, "id"> = {
  name: "",
  category: "Facials",
  price: 0,
  deal_price: null,
  active: true,
  duration_minutes: 60,
  image_url: "",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const compressedBlob = await compressImage(file);
      
      try {
        await supabase.storage.createBucket("service-images", { public: true });
      } catch (err) {
        // ignore
      }

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(fileName, compressedBlob, {
          contentType: "image/jpeg"
        });

      if (uploadError) {
        showToast("Upload failed: " + uploadError.message, "error");
        return;
      }

      const { data } = supabase.storage.from("service-images").getPublicUrl(fileName);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      showToast("Image uploaded successfully!");
    } catch (err: any) {
      showToast("Error processing image: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("category").order("price");
    setServices(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openEdit = (service: Service) => {
    setEditId(service.id);
    setShowUrlInput(false);
    setForm({
      name: service.name,
      category: service.category,
      price: service.price,
      deal_price: service.deal_price,
      active: service.active,
      duration_minutes: service.duration_minutes,
      image_url: service.image_url || "",
    });
  };

  const openNew = () => {
    setEditId("new");
    setShowUrlInput(false);
    setForm(BLANK);
  };

  const cancel = () => {
    setEditId(null);
    setShowUrlInput(false);
  };

  const save = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      deal_price: form.deal_price ? Number(form.deal_price) : null,
      duration_minutes: Number(form.duration_minutes),
      image_url: form.image_url?.trim() || null,
    };

    let err;
    if (editId === "new") {
      ({ error: err } = await supabase.from("services").insert(payload));
    } else {
      ({ error: err } = await supabase.from("services").update(payload).eq("id", editId!));
    }
    setSaving(false);
    if (err) { showToast("Failed to save service.", "error"); return; }
    showToast(editId === "new" ? "Service added!" : "Service updated!");
    setEditId(null);
    fetchServices();
  };

  const toggleActive = async (s: Service) => {
    await supabase.from("services").update({ active: !s.active }).eq("id", s.id);
    setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x));
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast("Service deleted.");
  };

  const categories = [...new Set(services.map((s) => s.category))].sort(
    (a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b)
  );

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.sub}>Manage your menu — prices, deals, and status</p>
        </div>
        <button id="add-service" className="btn btn-primary" onClick={openNew}>
          + Add Service
        </button>
      </div>

      {/* Add / Edit form */}
      {editId && (
        <div className={`card ${styles.formCard}`}>
          <h2 className={styles.formTitle}>
            {editId === "new" ? "New Service" : "Edit Service"}
          </h2>
          <div className={styles.formGrid}>
            <div className="field">
              <label htmlFor="svc-name">Name</label>
              <input
                id="svc-name"
                type="text"
                placeholder="e.g. Russian Pedicure"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="svc-category">Category</label>
              <select
                id="svc-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: "span 2" }}>
              <label>Service Image</label>
              
              <div 
                className={`${styles.uploadZone} ${isDragging ? styles.dragging : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className={styles.uploadProgress}>
                    <div className={styles.spinner} />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className={styles.fileInputHidden}
                    />
                    <label htmlFor="file-input" className={styles.uploadLabel}>
                      {form.image_url ? (
                        <div className={styles.previewContainer}>
                          <img src={form.image_url} alt="Preview" className={styles.previewImage} />
                          <div className={styles.previewOverlay}>
                            <span>Click or drag to change image</span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <span className={styles.uploadIcon}>📷</span>
                          <span className={styles.uploadText}>
                            <strong>Click to upload</strong> or drag &amp; drop
                          </span>
                          <span className={styles.uploadSubtext}>JPG, PNG or WebP up to 10MB</span>
                        </div>
                      )}
                    </label>
                  </>
                )}
              </div>

              <div style={{ marginTop: "12px" }}>
                <button 
                  type="button" 
                  className={styles.fallbackToggle} 
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  {showUrlInput ? "Hide manual URL option" : "Or paste image link manually"}
                </button>
                
                {showUrlInput && (
                  <input
                    id="svc-image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.image_url || ""}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    style={{ marginTop: "8px", width: "100%" }}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor="svc-price">Price (SRD)</label>
              <input
                id="svc-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div className="field">
              <label htmlFor="svc-deal">Deal Price (SRD) — optional</label>
              <input
                id="svc-deal"
                type="number"
                min={0}
                placeholder="Leave blank for no deal"
                value={form.deal_price ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, deal_price: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
            <div className="field">
              <label htmlFor="svc-duration">Duration (minutes)</label>
              <input
                id="svc-duration"
                type="number"
                min={5}
                step={5}
                value={form.duration_minutes}
                onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))}
              />
            </div>
            <div className={styles.activeToggle}>
              <label htmlFor="svc-active" className={styles.toggleLabel}>
                <input
                  id="svc-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className={styles.checkbox}
                />
                Active (visible on site)
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
            <button
              id="save-service"
              className="btn btn-primary"
              onClick={save}
              disabled={saving || !form.name.trim()}
            >
              {saving ? "Saving…" : editId === "new" ? "Add Service" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Services list */}
      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : (
        categories.map((cat) => (
          <div key={cat} className={styles.category}>
            <h2 className={styles.catTitle}>{cat}</h2>
            <div className={styles.serviceList}>
              {services.filter((s) => s.category === cat).map((s) => (
                <div
                  key={s.id}
                  className={`card ${styles.serviceCard} ${!s.active ? styles.inactive : ""}`}
                >
                  <div className={styles.serviceInfo}>
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.serviceMeta}>~{s.duration_minutes} min</span>
                  </div>
                  <div className={styles.priceBlock}>
                    {s.deal_price ? (
                      <>
                        <span className={styles.dealPrice}>SRD {s.deal_price.toLocaleString()}</span>
                        <span className={styles.oldPrice}>SRD {s.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className={styles.price}>SRD {s.price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className={styles.serviceActions}>
                    <button
                      className={`btn btn-ghost btn-sm ${s.active ? "" : styles.activateBtn}`}
                      id={`toggle-${s.id}`}
                      onClick={() => toggleActive(s)}
                    >
                      {s.active ? "Hide" : "Show"}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      id={`edit-${s.id}`}
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      id={`delete-${s.id}`}
                      onClick={() => deleteService(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                  {!s.active && <span className={styles.hiddenBadge}>Hidden</span>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
