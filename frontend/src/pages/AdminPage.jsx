import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminLogin, adminLogout, adminRequest, apiGet, isAdminLoggedIn, mediaUrl } from "../api";
import { clearCmsCache } from "../lib/cms";
import { ICON_KEYS } from "../lib/icons";
import { DEFAULT_SLOT_MEDIA } from "../lib/defaultSlotMedia";
import { TEXT_MANIFEST as BASE_TEXT_MANIFEST } from "../lib/textManifest";
import { seoManifestEntries } from "../lib/seoDefaults";

const TEXT_MANIFEST = [...BASE_TEXT_MANIFEST, ...seoManifestEntries()];
import "../styles/AdminPage.css";

/* ====================================================================
   Moscow Centre — website CMS (/admin)
   Same pattern as the Genet Dental CMS: JWT login, a sidebar of content
   sections and generic add / edit / delete / publish panels that talk to
   the Django REST API with multipart uploads (images and videos go to
   Cloudflare R2 in production).
   ==================================================================== */

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 150;

const iconOptions = [["", "Default"], ...ICON_KEYS.map((key) => [key, key])];
const iconHelp = `Icon names: ${ICON_KEYS.join(", ")}.`;

/* ------------------------------ field sets ------------------------------ */

const doctorFields = [
  { type: "heading", label: "Photo & home page card" },
  { name: "name", label: "Full name", required: true },
  { name: "photo", label: "Photo", type: "image", required: true, help: "Shown on the home page team slider and the Doctors page." },
  { name: "role", label: "Role", help: "e.g. Managing Director / Senior Consultant" },
  { name: "specialty", label: "Speciality label", help: "e.g. HOMEOPATHIC PRACTITIONER" },
  { name: "experience", label: "Experience", help: "e.g. 17+ Years Experience" },
  { name: "qualification", label: "Qualification", type: "textarea", rows: 2 },
  { name: "card_description", label: "Short description (home card)", type: "textarea", rows: 2 },
  { name: "availability", label: "Availability", help: "e.g. Mon – Sat" },

  { type: "heading", label: "Doctors page profile" },
  { name: "photo_label", label: "Caption under the photo" },
  { name: "tag", label: "Small heading above the name", help: "e.g. CLINICAL FACULTY DOSSIER • HOMEOPATHY" },
  { name: "subtitle", label: "Credentials line" },
  { name: "quote", label: "Quote", type: "textarea", rows: 3 },
  { name: "quote_by", label: "Quote attribution (optional)" },
  { name: "bio", label: "Biography", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
  { name: "highlight_title", label: "Highlight box — title (optional)" },
  { name: "highlight_text", label: "Highlight box — text", type: "textarea", rows: 3 },
  { name: "stages_heading", label: "Process steps — heading (optional)" },
  { name: "stages", label: "Process steps", type: "textarea", rows: 4, help: "One per line:  STAGE 01 | Title | Text" },
  { name: "section_heading", label: "Conditions / expertise — heading" },
  { name: "cards", label: "Conditions / expertise cards", type: "textarea", rows: 6, help: `One per line:  Title | Text | icon (optional). ${iconHelp}` },
  { name: "note", label: "Closing note (optional)" },
  { name: "languages", label: "Languages", help: "Comma separated, e.g. English, Arabic" },
  { name: "badge", label: "Badge (optional)", help: "e.g. DOH Registered Clinical Facility" },
  { name: "facts", label: "Quick facts", type: "textarea", rows: 4, help: "One per line:  LABEL | Value" },
  { name: "book_label", label: "Booking button text", help: "e.g. Book with Dr. Ehab" },
  { name: "whatsapp_label", label: "WhatsApp button text" },
  { name: "whatsapp_url", label: "WhatsApp link", type: "url", help: "e.g. https://wa.me/971507800163" },

  { type: "heading", label: "Publishing" },
  { name: "order", label: "Order", type: "number", help: "Smaller numbers appear first." },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

const treatmentFields = [
  { type: "heading", label: "Treatment" },
  { name: "title", label: "Title", required: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      ["ayurveda", "Ayurveda treatments"],
      ["relaxation", "Relaxation therapies (sliding cards)"],
      ["package", "Treatment packages"],
      ["homeopathy", "Homeopathy approach"],
    ],
    help: "Decides which block of the Treatments page the card appears in.",
  },
  { name: "tag", label: "Small label above the title", help: "Ayurveda & homeopathy cards" },
  { name: "subtitle", label: "Subtitle", help: "Ayurveda cards" },
  { name: "duration", label: "Duration", help: "e.g. 45 Mins (Ayurveda cards)" },
  { name: "description", label: "Description", type: "textarea", rows: 5 },
  { name: "chips", label: "Short labels", type: "textarea", rows: 3, help: "One per line (homeopathy cards)." },
  { name: "image", label: "Image", type: "image" },
  { name: "image_alt", label: "Image description (for accessibility)" },

  { type: "heading", label: "Relaxation therapy — back of the card" },
  { name: "detail", label: "Detailed description", type: "textarea", rows: 4 },
  { name: "points", label: "Benefits", type: "textarea", rows: 5, help: "One benefit per line." },

  { type: "heading", label: "Where it appears" },
  { name: "show_on_page", label: "Show on the Treatments page", type: "checkbox" },
  { name: "show_on_home", label: "Show in the home page treatments section", type: "checkbox" },
  { name: "home_title", label: "Home page title (optional)", help: "Leave blank to reuse the title." },
  { name: "home_description", label: "Home page text (optional)", type: "textarea", rows: 3, help: "Leave blank to reuse the description." },
  { name: "home_image", label: "Home page image (optional)", type: "image", help: "Leave empty to reuse the main image." },

  { type: "heading", label: "Publishing" },
  { name: "order", label: "Order", type: "number", help: "Smaller numbers appear first." },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

const serviceFields = [
  { type: "heading", label: "Service" },
  { name: "title", label: "Title", required: true },
  {
    name: "kind",
    label: "Where it appears",
    type: "select",
    options: [
      ["department", "Services page — department card"],
      ["highlight", "Home page — 'Our Services' highlights"],
      ["condition", "Home page — conditions we care for"],
    ],
  },
  { name: "short_description", label: "Short description", type: "textarea", rows: 2, help: "Used on the home page cards." },
  { name: "icon_key", label: "Icon (home page cards)", type: "select", options: iconOptions },

  { type: "heading", label: "Department card (Services page)" },
  { name: "tag", label: "Small label above the title" },
  { name: "supervised_by", label: "Supervised by" },
  { name: "description", label: "Description", type: "textarea", rows: 5 },
  { name: "conditions", label: "Key conditions addressed", type: "textarea", rows: 4, help: "One per line." },
  { name: "cta_label", label: "Button text", help: "e.g. Book Homeopathy Desk" },
  { name: "image", label: "Image", type: "image" },
  { name: "image_alt", label: "Image description (for accessibility)" },

  { type: "heading", label: "Publishing" },
  { name: "order", label: "Order", type: "number", help: "Smaller numbers appear first." },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

const aboutContentFields = [
  { type: "heading", label: "Top banner" },
  { name: "hero_pill", label: "Small label" },
  { name: "hero_heading", label: "Heading", help: "Press Enter to force a line break." , type: "textarea", rows: 2 },
  { name: "hero_text", label: "Intro text", type: "textarea", rows: 4, help: "Press Enter where the line should break." },
  { name: "hero_image", label: "Banner photo", type: "image" },
  { name: "chips", label: "Badges", type: "textarea", rows: 3, help: "One per line (up to 3 look best)." },

  { type: "heading", label: "Our story" },
  { name: "story_kicker", label: "Small label" },
  { name: "story_heading", label: "Heading", type: "textarea", rows: 2 },
  { name: "story_body", label: "Story text", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
  { name: "quote", label: "Quote", type: "textarea", rows: 3 },
  { name: "quote_cite", label: "Quote attribution" },
  { name: "story_image", label: "Story photo", type: "image" },
  { name: "badge_title", label: "Floating badge — title" },
  { name: "badge_text", label: "Floating badge — text" },

  { type: "heading", label: "Our approach (heading above the cards)" },
  { name: "approach_kicker", label: "Small label" },
  { name: "approach_heading", label: "Heading" },
  { name: "approach_text", label: "Text", type: "textarea", rows: 3 },

  { type: "heading", label: "Closing call-to-action" },
  { name: "cta_pill", label: "Small label" },
  { name: "cta_heading", label: "Heading", type: "textarea", rows: 2 },
  { name: "cta_text", label: "Text", type: "textarea", rows: 3 },
];

const protocolFields = [
  { name: "label", label: "Label", help: "e.g. PROTOCOL 01" },
  { name: "title", label: "Title", required: true },
  { name: "text", label: "Text", type: "textarea", rows: 4 },
  { name: "icon_key", label: "Icon", type: "select", options: iconOptions },
  { name: "order", label: "Order", type: "number" },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

const blockFields = [
  { name: "kicker", label: "Small label (optional)" },
  { name: "heading", label: "Heading", required: true },
  { name: "body", label: "Text", type: "textarea", rows: 7, help: "Separate paragraphs with a blank line." },
  { name: "image", label: "Image (optional)", type: "image" },
  { name: "order", label: "Order", type: "number" },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

const categoryLabels = {
  ayurveda: "Ayurveda",
  relaxation: "Relaxation",
  package: "Package",
  homeopathy: "Homeopathy",
};

/* ------------------------------ small pieces ------------------------------ */

function Notice({ kind = "info", children, onClose }) {
  if (!children) return null;
  return (
    <div className={`mca-notice ${kind}`} role={kind === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}

function Thumb({ src, kind }) {
  if (!src) return <div className="mca-thumb empty">{kind === "video" ? "▶" : "—"}</div>;
  if (kind === "video") return <video className="mca-thumb" src={`${src}#t=0.1`} muted preload="metadata" />;
  return <img className="mca-thumb" src={src} alt="" />;
}

/* ------------------------------ record form ------------------------------ */

function FileField({ field, current, file, cleared, onPick, onClear, required, fallback }) {
  const isVideo = field.type === "video";
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const shown = preview || (!cleared ? mediaUrl(current) : null);
  const original = !shown && fallback ? fallback : null;

  return (
    <div className="mca-file">
      {shown || original ? (
        isVideo ? (
          <video src={shown || original} controls preload="metadata" />
        ) : (
          <img src={shown || original} alt="" />
        )
      ) : (
        <div className="mca-file-empty">No {isVideo ? "video" : "image"} selected</div>
      )}
      {original && <small className="mca-file-note">Original design — shown on the website until you upload a replacement.</small>}
      <div className="mca-file-actions">
        <label className="mca-btn ghost">
          {shown ? "Replace" : "Choose file"}
          <input
            type="file"
            accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "image/*"}
            required={required && !shown}
            hidden
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (!picked) return;
              const limit = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
              if (picked.size > limit * 1024 * 1024) {
                window.alert(`That file is larger than ${limit} MB. Please choose a smaller one.`);
                e.target.value = "";
                return;
              }
              onPick(picked);
            }}
          />
        </label>
        {shown && !required && (
          <button type="button" className="mca-btn ghost danger" onClick={onClear}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function RecordForm({ endpoint, fields, item, defaults = {}, extraData = {}, noun, onSaved, onCancel, saveLabel, originalMedia = {} }) {
  const isNew = !item || !item.id;
  const [values, setValues] = useState(() => {
    const start = {};
    fields.forEach((f) => {
      if (f.type === "heading") return;
      if (f.type === "image" || f.type === "video") return;
      const source = !isNew && item[f.name] !== undefined ? item[f.name] : defaults[f.name];
      start[f.name] = source ?? (f.type === "checkbox" ? false : f.type === "number" ? 0 : "");
    });
    return start;
  });
  const [files, setFiles] = useState({});
  const [cleared, setCleared] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      Object.entries(extraData).forEach(([k, v]) => body.append(k, v));
      fields.forEach((f) => {
        if (f.type === "heading") return;
        if (f.type === "image" || f.type === "video") {
          if (files[f.name]) body.append(f.name, files[f.name]);
          else if (cleared[f.name]) body.append(f.name, "");
        } else if (f.type === "checkbox") {
          body.append(f.name, values[f.name] ? "true" : "false");
        } else {
          body.append(f.name, values[f.name] ?? "");
        }
      });
      const saved = await adminRequest(isNew ? endpoint : `${endpoint}/${item.id}`, {
        method: isNew ? "POST" : "PATCH",
        body,
      });
      clearCmsCache();
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="mca-form" onSubmit={submit}>
      <div className="mca-form-head">
        <h3>{isNew ? `Add ${noun}` : `Edit ${noun}`}</h3>
        {onCancel && (
          <button type="button" className="mca-btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <Notice kind="error">{error}</Notice>

      <div className="mca-fields">
        {fields.map((f, i) => {
          if (f.type === "heading") return <h4 key={`h${i}`} className="mca-group">{f.label}</h4>;
          const id = `f-${f.name}`;
          return (
            <div className={`mca-field ${f.type === "checkbox" ? "check" : ""}`} key={f.name}>
              {f.type === "checkbox" ? (
                <label htmlFor={id} className="mca-check">
                  <input id={id} type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
                  <span>{f.label}</span>
                </label>
              ) : (
                <>
                  <label htmlFor={id}>
                    {f.label}
                    {f.required && <em> *</em>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea id={id} rows={f.rows || 4} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
                  ) : f.type === "select" ? (
                    <select id={id} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                      {f.options.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  ) : f.type === "image" || f.type === "video" ? (
                    <FileField
                      field={f}
                      current={isNew ? null : item[f.name]}
                      file={files[f.name]}
                      cleared={cleared[f.name]}
                      required={f.required}
                      fallback={originalMedia[f.name]}
                      onPick={(file) => {
                        setFiles((s) => ({ ...s, [f.name]: file }));
                        setCleared((s) => ({ ...s, [f.name]: false }));
                      }}
                      onClear={() => {
                        setFiles((s) => ({ ...s, [f.name]: null }));
                        setCleared((s) => ({ ...s, [f.name]: true }));
                      }}
                    />
                  ) : (
                    <input
                      id={id}
                      type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                      min={f.type === "number" ? 0 : undefined}
                      value={values[f.name]}
                      onChange={(e) => set(f.name, f.type === "number" ? e.target.value.replace(/\D/g, "") : e.target.value)}
                      required={f.required}
                    />
                  )}
                  {f.help && <small>{f.help}</small>}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mca-form-actions">
        <button className="mca-btn primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : saveLabel || (isNew ? `Add ${noun}` : "Save changes")}
        </button>
        {onCancel && (
          <button type="button" className="mca-btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* ------------------------------ list panel ------------------------------ */

function ResourcePanel({ endpoint, noun, nounPlural, fields, defaults, renderMeta, thumb, filter, intro, emptyText, where, createData }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [filterValue, setFilterValue] = useState("all");

  const load = useCallback(async () => {
    try {
      setItems(await adminRequest(endpoint));
      setError("");
    } catch (err) {
      setError(err.message);
      setItems([]);
    }
  }, [endpoint]);

  useEffect(() => {
    setItems(null);
    setEditing(null);
    setNotice("");
    setFilterValue("all");
    load();
  }, [load]);

  async function togglePublished(item) {
    try {
      await adminRequest(`${endpoint}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      clearCmsCache();
      setNotice(item.is_published ? `${item.title || item.name || noun} is now hidden from the website.` : `${item.title || item.name || noun} is now published.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    const label = item.title || item.name || `this ${noun}`;
    if (!window.confirm(`Delete “${label}”? This also removes its uploaded files and cannot be undone.`)) return;
    try {
      await adminRequest(`${endpoint}/${item.id}`, { method: "DELETE" });
      clearCmsCache();
      setNotice(`Deleted “${label}”.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (editing) {
    return (
      <RecordForm
        endpoint={endpoint}
        fields={fields}
        item={editing === "new" ? null : editing}
        defaults={defaults}
        extraData={createData}
        noun={noun}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          setNotice(`${noun[0].toUpperCase()}${noun.slice(1)} saved. The website is updated.`);
          load();
        }}
      />
    );
  }

  const visible = (items || [])
    .filter((item) => !where || where(item))
    .filter((item) => !filter || filterValue === "all" || item[filter.field] === filterValue);

  return (
    <div className="mca-panel">
      {intro && <p className="mca-intro">{intro}</p>}
      <Notice kind="error" onClose={() => setError("")}>{error}</Notice>
      <Notice kind="success" onClose={() => setNotice("")}>{notice}</Notice>

      <div className="mca-toolbar">
        <button className="mca-btn primary" onClick={() => setEditing("new")}>
          + Add {noun}
        </button>
        {filter && (
          <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)} aria-label="Filter">
            <option value="all">{filter.allLabel}</option>
            {filter.options.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        )}
      </div>

      {items === null ? (
        <p className="mca-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="mca-empty">{emptyText || `No ${nounPlural} yet.`}</p>
      ) : (
        <ul className="mca-list">
          {visible.map((item) => (
            <li key={item.id} className={item.is_published === false ? "hidden-item" : ""}>
              <Thumb src={mediaUrl(thumb ? thumb(item) : item.image)} kind={item.kind === "video" && !item.image ? "video" : "image"} />
              <div className="mca-list-main">
                <strong>{item.title || item.name || item.heading || item.label || `${noun} #${item.id}`}</strong>
                <span>{renderMeta ? renderMeta(item) : ""}</span>
              </div>
              <span className={`mca-pill ${item.is_published === false ? "off" : "on"}`}>
                {item.is_published === false ? "Hidden" : "Published"}
              </span>
              <div className="mca-actions">
                <button className="mca-btn ghost" onClick={() => setEditing(item)}>Edit</button>
                <button className="mca-btn ghost" onClick={() => togglePublished(item)}>
                  {item.is_published === false ? "Publish" : "Hide"}
                </button>
                <button className="mca-btn ghost danger" onClick={() => remove(item)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ home page slots ------------------------------ */

const slotFieldConfig = {
  image: { name: "image", label: "Photo", type: "image" },
  video: { name: "video", label: "Video", type: "video", help: `MP4, WebM or MOV up to ${MAX_VIDEO_MB} MB.` },
  title: { name: "title", label: "Title" },
  eyebrow: { name: "eyebrow", label: "Small label above the title" },
  body: { name: "body", label: "Description", type: "textarea", rows: 4 },
};

function HomePanel({ groups, intro, mode = "all" }) {
  const [allSlots, setSlots] = useState(null);
  const [rows, setRows] = useState([]);
  const [editKey, setEditKey] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const [slotList, rowList] = await Promise.all([apiGet("home-sections/slots"), adminRequest("home-sections")]);
      setSlots(slotList);
      setRows(rowList);
      setError("");
    } catch (err) {
      setError(err.message);
      setSlots([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function reset(row, slot) {
    if (!window.confirm(`Reset “${slot.label}” to the original design? Your uploaded files are removed.`)) return;
    try {
      await adminRequest(`home-sections/${row.id}`, { method: "DELETE" });
      clearCmsCache();
      setNotice(`“${slot.label}” is back to the original design.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (allSlots === null) return <p className="mca-muted">Loading…</p>;
  const hasVideo = (slot) => slot.fields.some((f) => (typeof f === "string" ? f : f.name) === "video");
  const slots = allSlots
    .filter((s) => groups.includes(s.group))
    .filter((s) => (mode === "video" ? hasVideo(s) : mode === "images" ? !hasVideo(s) : true));

  if (editKey) {
    const slot = slots.find((s) => s.key === editKey);
    const row = rows.find((r) => r.key === editKey) || null;
    return (
      <RecordForm
        endpoint="home-sections"
        fields={slot.fields.map((f) => slotFieldConfig[f])}
        item={row}
        extraData={{ key: slot.key }}
        originalMedia={DEFAULT_SLOT_MEDIA[slot.key] || {}}
        noun={slot.label}
        saveLabel="Save"
        onCancel={() => setEditKey(null)}
        onSaved={() => {
          setEditKey(null);
          setNotice(`“${slot.label}” saved. The home page is updated.`);
          load();
        }}
      />
    );
  }

  return (
    <div className="mca-panel">
      <p className="mca-intro">{intro}</p>
      <Notice kind="error" onClose={() => setError("")}>{error}</Notice>
      <Notice kind="success" onClose={() => setNotice("")}>{notice}</Notice>
      {slots.length === 0 && <p className="mca-empty">Nothing to replace here.</p>}
      <div className="mca-slots">
        {slots.map((slot) => {
          const row = rows.find((r) => r.key === slot.key);
          const custom = Boolean(row && (row.image || row.video || row.title || row.eyebrow || row.body));
          return (
            <article key={slot.key} className="mca-slot">
              {row?.video || (!row?.image && DEFAULT_SLOT_MEDIA[slot.key]?.video) ? (
                <Thumb src={mediaUrl(row?.video) || DEFAULT_SLOT_MEDIA[slot.key]?.video} kind="video" />
              ) : (
                <Thumb src={mediaUrl(row?.image) || DEFAULT_SLOT_MEDIA[slot.key]?.image} />
              )}
              <div className="mca-slot-body">
                <strong>{slot.label}</strong>
                <span>{slot.help}</span>
                <span className={`mca-pill ${custom ? "on" : "off"}`}>{custom ? "Uploaded" : "Original design"}</span>
              </div>
              <div className="mca-actions">
                <button className="mca-btn ghost" onClick={() => setEditKey(slot.key)}>{custom ? "Edit" : "Customise"}</button>
                {row && (
                  <button className="mca-btn ghost danger" onClick={() => reset(row, slot)}>Reset</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ about page ------------------------------ */

/* ------------------------------ page text editor ------------------------------ */

/** Every editable text of one admin page. Each shows its original wording; edit it,
 *  press Save, and the website changes. “Reset” brings the original back. */
function TextPanel({ page, only = "all", intro }) {
  const entries = useMemo(
    () => TEXT_MANIFEST.filter((e) => e.page === page && (only === "settings" ? e.setting : only === "text" ? !e.setting : true)),
    [page, only],
  );
  const [saved, setSaved] = useState(null); // key -> edited value currently live
  const [draft, setDraft] = useState({}); // key -> unsaved value
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const rows = await adminRequest("site-texts");
      setSaved(Object.fromEntries(rows.map((r) => [r.key, r.value])));
      setError("");
    } catch (err) {
      setError(err.message);
      setSaved({});
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (saved === null) return <p className="mca-muted">Loading…</p>;

  const liveValue = (e) => (saved[e.key] !== undefined && saved[e.key].trim() !== "" ? saved[e.key] : e.text);
  const current = (e) => (draft[e.key] !== undefined ? draft[e.key] : liveValue(e));
  const isEdited = (e) => current(e).trim() !== e.text.trim();
  const dirtyKeys = entries.filter((e) => draft[e.key] !== undefined && draft[e.key] !== liveValue(e)).map((e) => e.key);

  const q = query.trim().toLowerCase();
  const visible = entries.filter((e) => !q || (e.label || "").toLowerCase().includes(q) || current(e).toLowerCase().includes(q) || e.text.toLowerCase().includes(q));
  const sections = [];
  visible.forEach((e) => {
    let group = sections.find((g) => g.name === e.section);
    if (!group) sections.push((group = { name: e.section, items: [] }));
    group.items.push(e);
  });

  async function save() {
    setBusy(true);
    setError("");
    try {
      const values = {};
      dirtyKeys.forEach((key) => {
        const e = entries.find((x) => x.key === key);
        const value = draft[key];
        values[key] = value.trim() === "" || value.trim() === e.text.trim() ? null : value;
      });
      await adminRequest("site-texts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      clearCmsCache();
      setDraft({});
      setNotice(`Saved ${dirtyKeys.length} change${dirtyKeys.length === 1 ? "" : "s"}. The website is updated.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mca-panel mca-textpanel">
      {intro && <p className="mca-intro">{intro}</p>}
      <Notice kind="error" onClose={() => setError("")}>{error}</Notice>
      <Notice kind="success" onClose={() => setNotice("")}>{notice}</Notice>

      <div className="mca-toolbar">
        <input
          className="mca-search"
          type="search"
          placeholder="Search these texts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="mca-muted">{entries.length} editable texts</span>
      </div>

      {sections.length === 0 && <p className="mca-empty">No texts match.</p>}

      {sections.map((group) => (
        <details className="mca-textgroup" key={group.name} open={!!q || sections.length === 1}>
          <summary>
            <strong>{group.name}</strong>
            <span>{group.items.length} text{group.items.length === 1 ? "" : "s"}{group.items.some(isEdited) ? " · edited" : ""}</span>
          </summary>
          <div className="mca-textlist">
            {group.items.map((e) => {
              const value = current(e);
              const long = value.length > 70 || value.includes("\n") || e.text.length > 70 || e.text.includes("\n");
              const rows = Math.min(8, Math.max(2, value.split("\n").length + Math.floor(value.length / 90)));
              const id = `t-${e.key}`;
              return (
                <div className={`mca-textrow ${isEdited(e) ? "edited" : ""}`} key={e.key}>
                  <label htmlFor={id}>
                    {e.label || (e.text.length > 60 ? `${e.text.slice(0, 60).trim()}…` : e.text.trim())}
                    {isEdited(e) && <em className="mca-edited">edited</em>}
                  </label>
                  {long ? (
                    <textarea id={id} rows={rows} value={value} onChange={(ev) => setDraft((d) => ({ ...d, [e.key]: ev.target.value }))} />
                  ) : (
                    <input id={id} type="text" value={value} onChange={(ev) => setDraft((d) => ({ ...d, [e.key]: ev.target.value }))} />
                  )}
                  {e.help && <small>{e.help}</small>}
                  {e.lines && <small>Each line appears on its own row, as in the original design.</small>}
                  {isEdited(e) && (
                    <button type="button" className="mca-btn ghost" onClick={() => setDraft((d) => ({ ...d, [e.key]: e.text }))}>
                      Reset to original
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </details>
      ))}

      <div className="mca-savebar">
        <span>{dirtyKeys.length ? `${dirtyKeys.length} unsaved change${dirtyKeys.length === 1 ? "" : "s"}` : "No unsaved changes"}</span>
        <button className="mca-btn primary" disabled={busy || !dirtyKeys.length} onClick={save}>
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ about content ------------------------------ */

function AboutContentTab() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminRequest("about-content")
      .then(setContent)
      .catch((err) => {
        setError(err.message);
        setContent({});
      });
  }, []);

  return (
    <>
      <Notice kind="error" onClose={() => setError("")}>{error}</Notice>
      <Notice kind="success" onClose={() => setNotice("")}>{notice}</Notice>
      {content === null ? (
        <p className="mca-muted">Loading…</p>
      ) : (
        <RecordForm
          key={content.id || "new"}
          endpoint="about-content"
          fields={aboutContentFields}
          item={content.id ? content : null}
          noun="About page"
          saveLabel="Save About page"
          onSaved={(saved) => {
            setContent(saved);
            setNotice("About page saved. The website is updated.");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}

/* ------------------------------ page shell with tabs ------------------------------ */

function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);
  const tab = tabs.find((t) => t.key === active) || tabs[0];
  return (
    <div className="mca-panel">
      <div className="mca-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={t.key === tab.key} className={t.key === tab.key ? "active" : ""} onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={tab.key}>{tab.render()}</div>
    </div>
  );
}

/* ------------------------------ field sets per list ------------------------------ */

const departmentFields = serviceFields.filter((f) => ["title", "tag", "supervised_by", "description", "conditions", "cta_label", "image", "image_alt", "order", "is_published"].includes(f.name));
const homeServiceFields = [
  { name: "title", label: "Title", required: true },
  { name: "short_description", label: "Short description", type: "textarea", rows: 2 },
  { name: "icon_key", label: "Icon", type: "select", options: iconOptions },
  { name: "order", label: "Order", type: "number", help: "Smaller numbers appear first." },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];
const testimonialFields = [
  { name: "name", label: "Patient name", required: true },
  { name: "initials", label: "Initials (optional)", help: "Leave blank to use the first letters of the name." },
  { name: "review", label: "Review", type: "textarea", rows: 6, required: true },
  { name: "order", label: "Order", type: "number", help: "Smaller numbers appear first." },
  { name: "is_published", label: "Published on the website", type: "checkbox" },
];

/* ------------------------------ enquiries inbox ------------------------------ */

const digitsOnly = (value) => String(value || "").replace(/[^\d]/g, "");

function EnquiriesPanel({ onChanged }) {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("new");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setItems(await adminRequest("appointments"));
      setError("");
    } catch (err) {
      setError(err.message);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setHandled(item, handled) {
    try {
      await adminRequest(`appointments/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_handled: handled }),
      });
      await load();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete the request from “${item.full_name}”? This cannot be undone.`)) return;
    try {
      await adminRequest(`appointments/${item.id}`, { method: "DELETE" });
      setNotice("Request deleted.");
      await load();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    }
  }

  if (items === null) return <p className="mca-muted">Loading…</p>;

  const newCount = items.filter((i) => !i.is_handled).length;
  const visible = items.filter((i) => (filter === "all" ? true : filter === "new" ? !i.is_handled : i.is_handled));

  return (
    <div className="mca-panel">
      <p className="mca-intro">
        Appointment requests sent from the home page and the Contact page. Call or WhatsApp the patient, then mark the request as handled.
      </p>
      <Notice kind="error" onClose={() => setError("")}>{error}</Notice>
      <Notice kind="success" onClose={() => setNotice("")}>{notice}</Notice>

      <div className="mca-tabs" role="tablist">
        {[["new", `New (${newCount})`], ["handled", "Handled"], ["all", "All"]].map(([key, label]) => (
          <button key={key} role="tab" aria-selected={filter === key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
        <button className="mca-refresh" onClick={load}>Refresh</button>
      </div>

      {visible.length === 0 ? (
        <p className="mca-empty">{filter === "new" ? "No new requests. 🎉" : "Nothing here."}</p>
      ) : (
        <ul className="mca-enq-list">
          {visible.map((item) => {
            const wa = digitsOnly(item.phone);
            return (
              <li key={item.id} className={item.is_handled ? "done" : ""}>
                <div className="mca-enq-head">
                  <strong>{item.full_name}</strong>
                  <span className={`mca-pill ${item.is_handled ? "off" : "on"}`}>{item.is_handled ? "Handled" : "New"}</span>
                  <small>{new Date(item.created_at).toLocaleString()}</small>
                </div>
                <dl className="mca-enq-meta">
                  <div><dt>Phone</dt><dd><a href={`tel:${item.phone}`}>{item.phone}</a></dd></div>
                  {item.email && <div><dt>Email</dt><dd><a href={`mailto:${item.email}`}>{item.email}</a></dd></div>}
                  {item.department && <div><dt>For</dt><dd>{item.department}</dd></div>}
                  {(item.preferred_date || item.preferred_time) && (
                    <div><dt>Preferred</dt><dd>{[item.preferred_date, item.preferred_time].filter(Boolean).join(" · ")}</dd></div>
                  )}
                  <div><dt>Form</dt><dd>{item.source === "home" ? "Home page" : "Contact page"}</dd></div>
                </dl>
                {item.concern && <p className="mca-enq-concern">{item.concern}</p>}
                <div className="mca-actions">
                  <a className="mca-btn ghost" href={`tel:${item.phone}`}>Call</a>
                  {wa && <a className="mca-btn ghost" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp</a>}
                  <button className="mca-btn ghost" onClick={() => setHandled(item, !item.is_handled)}>
                    {item.is_handled ? "Mark as new" : "Mark as handled"}
                  </button>
                  <button className="mca-btn ghost danger" onClick={() => remove(item)}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ the admin, page by page ------------------------------ */

const SECTIONS = [
  {
    key: "enquiries",
    label: "Enquiries",
    hint: "Appointment requests",
    render: (ctx) => <EnquiriesPanel onChanged={ctx.refreshCount} />,
  },
  {
    key: "home",
    label: "Home Page",
    hint: "Images, video, text, reviews",
    render: () => (
      <Tabs
        tabs={[
          { key: "images", label: "Images", render: () => <HomePanel groups={["home"]} mode="images" intro="Replace the photos on the home page. Anything you don’t customise keeps the original design." /> },
          { key: "video", label: "Video", render: () => <HomePanel groups={["home"]} mode="video" intro="Replace the video in the ‘Why choose us’ section (and its cover photo)." /> },
          { key: "text", label: "Page text", render: () => <TextPanel page="home" intro="Every heading, paragraph and button on the home page. Edit the text, then press Save." /> },
          {
            key: "services",
            label: "Our Services",
            render: () => (
              <ResourcePanel
                endpoint="services" noun="service" nounPlural="services" fields={homeServiceFields}
                defaults={{ order: 0, is_published: true }} createData={{ kind: "highlight" }} where={(s) => s.kind === "highlight"}
                renderMeta={(s) => s.short_description} thumb={() => null}
                intro="The ‘Our Services’ highlight row on the home page."
              />
            ),
          },
          {
            key: "conditions",
            label: "Conditions we care for",
            render: () => (
              <ResourcePanel
                endpoint="services" noun="condition" nounPlural="conditions" fields={homeServiceFields}
                defaults={{ order: 0, is_published: true }} createData={{ kind: "condition" }} where={(s) => s.kind === "condition"}
                renderMeta={(s) => s.short_description} thumb={() => null}
                intro="The services grid under ‘Services’ on the home page."
              />
            ),
          },
          {
            key: "treatments",
            label: "Treatments",
            render: () => (
              <ResourcePanel
                endpoint="treatments" noun="treatment" nounPlural="treatments" fields={treatmentFields}
                defaults={{ category: "relaxation", show_on_page: true, show_on_home: true, order: 0, is_published: true }}
                where={(t) => t.show_on_home} thumb={(t) => t.home_image || t.image}
                renderMeta={(t) => `${categoryLabels[t.category] || t.category}${t.show_on_page ? "" : " · home page only"}`}
                intro="The treatments shown in ‘Ayurvedic Treatments’ on the home page. To feature another treatment here, open it under Treatments and tick ‘Show in the home page treatments section’."
              />
            ),
          },
          { key: "reviews", label: "Reviews", render: () => (
            <ResourcePanel
              endpoint="testimonials" noun="review" nounPlural="reviews" fields={testimonialFields}
              defaults={{ order: 0, is_published: true }} thumb={() => null}
              renderMeta={(t) => (t.review.length > 90 ? `${t.review.slice(0, 90)}…` : t.review)}
              intro="Patient reviews in the ‘Patient testimonials’ section of the home page."
            />
          ) },
        ]}
      />
    ),
  },
  {
    key: "about",
    label: "About Page",
    hint: "Text, photos, sections",
    render: () => (
      <Tabs
        tabs={[
          { key: "content", label: "Text & photos", render: () => <AboutContentTab /> },
          { key: "protocols", label: "Approach cards", render: () => (
            <ResourcePanel endpoint="about-protocols" noun="approach card" nounPlural="approach cards" fields={protocolFields}
              defaults={{ order: 0, is_published: true }} renderMeta={(i) => `${i.label || ""} · order ${i.order}`}
              intro="The cards under ‘Our approach to holistic care’ on the About page." />
          ) },
          { key: "blocks", label: "Extra sections", render: () => (
            <ResourcePanel endpoint="about-blocks" noun="section" nounPlural="extra sections" fields={blockFields}
              defaults={{ order: 0, is_published: true }} thumb={(i) => i.image}
              renderMeta={(i) => `${i.kicker || "Text section"} · order ${i.order}`}
              intro="Extra text-and-photo sections shown on the About page after ‘Our story’." />
          ) },
          { key: "text", label: "Buttons & labels", render: () => <TextPanel page="about" intro="The remaining button labels on the About page." /> },
        ]}
      />
    ),
  },
  {
    key: "services",
    label: "Services Page",
    hint: "Banner, departments, text",
    render: () => (
      <Tabs
        tabs={[
          { key: "images", label: "Banner photo", render: () => <HomePanel groups={["services"]} mode="all" intro="The photo at the top of the Services page." /> },
          { key: "departments", label: "Departments", render: () => (
            <ResourcePanel endpoint="services" noun="department" nounPlural="departments" fields={departmentFields}
              defaults={{ order: 0, is_published: true }} createData={{ kind: "department" }} where={(s) => s.kind === "department"}
              renderMeta={(s) => s.tag} intro="The department cards on the Services page (photo, description, key conditions)." />
          ) },
          { key: "text", label: "Page text", render: () => <TextPanel page="services" intro="Every heading, paragraph and button on the Services page." /> },
        ]}
      />
    ),
  },
  {
    key: "treatments",
    label: "Treatments Page",
    hint: "Photos, treatments, text",
    render: () => (
      <Tabs
        tabs={[
          { key: "images", label: "Photos", render: () => <HomePanel groups={["treatments"]} mode="all" intro="The banner photo and the cupping section photo on the Treatments page." /> },
          { key: "list", label: "Treatments", render: () => (
            <ResourcePanel endpoint="treatments" noun="treatment" nounPlural="treatments" fields={treatmentFields}
              defaults={{ category: "ayurveda", show_on_page: true, show_on_home: false, order: 0, is_published: true }}
              renderMeta={(t) => `${categoryLabels[t.category] || t.category}${t.show_on_home ? " · on home page" : ""}${t.show_on_page ? "" : " · hidden from Treatments page"}`}
              filter={{ field: "category", allLabel: "All categories", options: Object.entries(categoryLabels) }}
              intro="Every treatment card: Ayurveda treatments, relaxation therapies, packages and the homeopathy approach." />
          ) },
          { key: "text", label: "Page text", render: () => <TextPanel page="treatments" intro="Every heading, paragraph, button and list on the Treatments page." /> },
        ]}
      />
    ),
  },
  {
    key: "doctors",
    label: "Doctors Page",
    hint: "Profiles and text",
    render: () => (
      <Tabs
        tabs={[
          { key: "list", label: "Doctors", render: () => (
            <ResourcePanel endpoint="doctors" noun="doctor" nounPlural="doctors" fields={doctorFields}
              defaults={{ order: 0, is_published: true, availability: "Mon – Sat" }} thumb={(d) => d.photo}
              renderMeta={(d) => [d.role, d.specialty].filter(Boolean).join(" · ")}
              intro="Doctors appear on the Doctors page and in the home page team slider." />
          ) },
          { key: "text", label: "Page text", render: () => <TextPanel page="doctors" intro="The heading, introduction and highlights strip of the Doctors page." /> },
        ]}
      />
    ),
  },
  {
    key: "contact",
    label: "Contact Page",
    hint: "Photos and text",
    render: () => (
      <Tabs
        tabs={[
          { key: "images", label: "Photos & map", render: () => <HomePanel groups={["contact"]} mode="all" intro="The banner photo and the map picture on the Contact page." /> },
          { key: "text", label: "Page text", render: () => <TextPanel page="contact" intro="Every heading, paragraph and card on the Contact page. Phone, email and WhatsApp are under Site-wide → Contact details." /> },
        ]}
      />
    ),
  },
  {
    key: "site",
    label: "Site-wide",
    hint: "Logo, contact details, footer",
    render: () => (
      <Tabs
        tabs={[
          { key: "contact", label: "Contact details", render: () => <TextPanel page="site" only="settings" intro="Change these once and they update everywhere on the website: the top strip, menu, footer, contact sections and WhatsApp buttons." /> },
          { key: "logo", label: "Logo", render: () => <HomePanel groups={["site"]} mode="all" intro="The clinic logo in the navigation bar and footer." /> },
          { key: "text", label: "Menu & footer text", render: () => <TextPanel page="site" only="text" intro="Text in the navigation bar and the footer." /> },
        ]}
      />
    ),
  },
];

function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin(username, password);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mca-login">
      <form onSubmit={submit}>
        <h1>Moscow Centre</h1>
        <p>Website admin — sign in with your staff account.</p>
        <Notice kind="error">{error}</Notice>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        <button className="mca-btn primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <a href="/" className="mca-back">← Back to website</a>
        <small className="mca-build">{ADMIN_BUILD}</small>
      </form>
    </div>
  );
}

const ADMIN_BUILD = "Admin build 2.1";

/* The public website hides the normal mouse pointer (`cursor: none !important`)
   and draws its own custom cursor, which does not exist on this page. While the
   admin is open we mark <body> and inject rules that out-rank that one, so a
   pointer is always visible: arrow, hand on buttons/links, text bar in fields. */
function useVisibleCursor() {
  useEffect(() => {
    document.body.classList.add("mca-admin-body");
    // The admin must never appear in search results.
    let robots = document.head.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content");
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
    const style = document.createElement("style");
    style.setAttribute("data-mca-cursor", "true");
    style.textContent = `
      html body.mca-admin-body, html body.mca-admin-body * { cursor: default !important; }
      html body.mca-admin-body button, html body.mca-admin-body a, html body.mca-admin-body select,
      html body.mca-admin-body label.mca-btn, html body.mca-admin-body summary, html body.mca-admin-body .mca-check,
      html body.mca-admin-body .mca-check *, html body.mca-admin-body [role="tab"] { cursor: pointer !important; }
      html body.mca-admin-body input[type="text"], html body.mca-admin-body input[type="url"],
      html body.mca-admin-body input[type="number"], html body.mca-admin-body input[type="password"], html body.mca-admin-body input[type="search"],
      html body.mca-admin-body textarea { cursor: text !important; }
      html body.mca-admin-body button:disabled { cursor: wait !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.body.classList.remove("mca-admin-body");
      style.remove();
      if (previousRobots) robots.setAttribute("content", previousRobots);
      else robots.remove();
    };
  }, []);
}

export default function AdminPage() {
  useVisibleCursor();
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [active, setActive] = useState("home");
  const [newCount, setNewCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const rows = await adminRequest("appointments");
      setNewCount(rows.filter((r) => !r.is_handled).length);
    } catch {
      /* the badge is optional */
    }
  }, []);

  useEffect(() => {
    if (loggedIn) refreshCount();
  }, [loggedIn, active, refreshCount]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Moscow Centre — Website Admin";
  }, []);

  if (!loggedIn) return <LoginForm onLoggedIn={() => setLoggedIn(true)} />;

  const section = SECTIONS.find((s) => s.key === active);

  return (
    <div className="mca-shell">
      <aside className={`mca-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="mca-brand">
          <strong>Moscow Centre</strong>
          <span>Website Admin</span>
        </div>
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={s.key === active ? "active" : ""}
              onClick={() => {
                setActive(s.key);
                setMenuOpen(false);
              }}
            >
              <strong>
                {s.label}
                {s.key === "enquiries" && newCount > 0 && <em className="mca-badge">{newCount}</em>}
              </strong>
              <span>{s.hint}</span>
            </button>
          ))}
        </nav>
        <div className="mca-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer">View website ↗</a>
          <small className="mca-build">{ADMIN_BUILD}</small>
          <button
            onClick={() => {
              adminLogout();
              setLoggedIn(false);
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="mca-main">
        <header className="mca-topbar">
          <button className="mca-menu" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">☰</button>
          <h1>{section.label}</h1>
        </header>
        <div className="mca-content" key={active}>{section.render({ refreshCount })}</div>
      </main>
    </div>
  );
}
