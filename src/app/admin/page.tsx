"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, SECTIONS, normalizeSettings } from "@/lib/settings";
import { Mandala } from "@/components/svg-defs";

type Draft = Omit<Settings, "timeline" | "details_lines" | "bride_lines" | "groom_lines"> & {
  timeline: { time: string; text: string }[];
  details_text: string;
  bride_lines_text: string;
  groom_lines_text: string;
};

/** Compress any uploaded image to a ~100KB JPEG data-URL (base64) with no visible quality loss. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const cx = cv.getContext("2d");
      if (!cx) return reject(new Error("no canvas"));
      cx.drawImage(img, 0, 0, w, h);
      let q = 0.82;
      let data = cv.toDataURL("image/jpeg", q);
      // ~130,000 base64 chars ≈ 97KB binary
      while (data.length > 130000 && q > 0.35) {
        q -= 0.08;
        data = cv.toDataURL("image/jpeg", q);
      }
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

function toDraft(s: Settings): Draft {
  return {
    ...s,
    timeline: s.timeline.length ? s.timeline : [{ time: "", text: "" }],
    details_text: s.details_lines.join("\n"),
    bride_lines_text: s.bride_lines.join("\n"),
    groom_lines_text: s.groom_lines.join("\n"),
  };
}

function fromDraft(d: Draft): Record<string, unknown> {
  const split = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);
  return {
    ...d,
    timeline: d.timeline.filter((t) => t.text.trim()),
    details_lines: split(d.details_text),
    bride_lines: split(d.bride_lines_text),
    groom_lines: split(d.groom_lines_text),
    details_text: undefined,
    bride_lines_text: undefined,
    groom_lines_text: undefined,
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "login" | "ready">("checking");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const loadStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setVisits((await res.json()).visits);
  }, []);

  const loadAll = useCallback(async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setDraft(toDraft(normalizeSettings(data.settings)));
    }
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/session");
      if (res.ok && (await res.json()).authed) {
        setState("ready");
        loadAll();
      } else setState("login");
    })();
  }, [loadAll]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const login = async () => {
    if (!pin.trim() || busy) return;
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setBusy(false);
    if (res.ok) {
      setState("ready");
      loadAll();
    } else {
      setErr("Incorrect PIN — try again");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  };

  const save = async () => {
    if (!draft || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fromDraft(draft)),
      });
      if (res.ok) {
        const data = await res.json();
        setDraft(toDraft(normalizeSettings(data.settings)));
        setToast({ msg: "Saved successfully ✓" });
      } else {
        setToast({ msg: res.status === 401 ? "Session expired — login again" : "Save failed", err: true });
      }
    } catch {
      setToast({ msg: "Connection error", err: true });
    } finally {
      setBusy(false);
    }
  };

  const set = (k: keyof Draft, v: string) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const toggleSection = (id: string, visible: boolean) =>
    setDraft((d) => {
      if (!d) return d;
      const hs = new Set(d.hidden_sections);
      if (visible) hs.delete(id);
      else hs.add(id);
      return { ...d, hidden_sections: [...hs] };
    });

  const uploadPhoto = async (i: number, file: File) => {
    try {
      const data = await compressImage(file);
      setDraft((d) => {
        if (!d) return d;
        const gal = [...d.gallery];
        gal[i] = data;
        return { ...d, gallery: gal.slice(0, 4) };
      });
      setToast({ msg: `Photo ${i + 1} compressed & ready ✓` });
    } catch {
      setToast({ msg: "Could not read that image", err: true });
    }
  };

  if (state === "checking") {
    return (
      <>
        <Mandala id="adm-md" />
        <div className="screen">
          <div className="cin foil" style={{ fontSize: 16 }}>
            Loading…
          </div>
        </div>
      </>
    );
  }

  if (state === "login") {
    return (
      <div className="ad-login">
        <Mandala id="adm-md" />
        <div className={`pin-card${shake ? " shake" : ""}`}>
          <h3>Admin Login</h3>
          <div className="ad-note" style={{ textAlign: "center" }}>
            Enter the admin PIN to open the dashboard
          </div>
          <input
            type="password"
            value={pin}
            autoFocus
            placeholder="• • • • • •"
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <div className="pin-err">{err}</div>
          <button className="ad-save" style={{ width: "100%" }} disabled={busy} onClick={login}>
            {busy ? "Checking…" : "Enter Dashboard"}
          </button>
          <button className="ad-logout" style={{ width: "100%", marginTop: 10, textAlign: "center" }} onClick={() => router.push("/")}>
            ← Back to Invitation
          </button>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <>
        <Mandala id="adm-md" />
        <div className="screen">
          <div className="cin foil" style={{ fontSize: 16 }}>
            Loading dashboard…
          </div>
        </div>
      </>
    );
  }

  const field = (k: keyof Draft, label: string, type = "text") => (
    <div className="ad-field">
      <label>{label}</label>
      <input type={type} value={draft[k] as string} onChange={(e) => set(k, e.target.value)} />
    </div>
  );

  return (
    <div className="ad-wrap">
      <Mandala id="adm-md" />
      <div className="ad-head">
        <div>
          <div className="ad-title foil">Admin Dashboard</div>
          <div className="ad-sub">Wedding Invitation Control Panel</div>
        </div>
        <button className="ad-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="ad-card">
        <h2>Visitors</h2>
        <div className="ad-stat">
          <b>{visits ?? "—"}</b>
          <span>Total Invitation Views</span>
          <button className="ad-refresh" onClick={loadStats}>
            Refresh
          </button>
        </div>
      </div>

      <div className="ad-card">
        <h2>Couple &amp; Message</h2>
        <div className="ad-grid">
          {field("groom", "Groom's Name")}
          {field("bride", "Bride's Name")}
        </div>
        <div className="ad-field" style={{ marginTop: 14 }}>
          <label>Invitation Message</label>
          <textarea className="wide" value={draft.invitation_message} onChange={(e) => set("invitation_message", e.target.value)} />
        </div>
      </div>

      <div className="ad-card">
        <h2>Family Details — Standard Format</h2>
        <div className="ad-field" style={{ marginBottom: 14 }}>
          <label>Section Title</label>
          <input value={draft.family_title} onChange={(e) => set("family_title", e.target.value)} />
        </div>
        <div className="ad-grid">
          <div className="ad-field">
            <label>Bride's Side — Lines (village, father, mother, relation… one per line)</label>
            <textarea value={draft.bride_lines_text} onChange={(e) => set("bride_lines_text", e.target.value)} />
            <label style={{ marginTop: 10 }}>Bride's Highlighted Name</label>
            <input value={draft.bride_family_name} onChange={(e) => set("bride_family_name", e.target.value)} />
          </div>
          <div className="ad-field">
            <label>Groom's Side — Lines (village, father, mother, relation… one per line)</label>
            <textarea value={draft.groom_lines_text} onChange={(e) => set("groom_lines_text", e.target.value)} />
            <label style={{ marginTop: 10 }}>Groom's Highlighted Name</label>
            <input value={draft.groom_family_name} onChange={(e) => set("groom_family_name", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="ad-card">
        <h2>Date &amp; Times</h2>
        <div className="ad-grid">
          {field("wedding_date", "Wedding Date", "date")}
          {field("poruwa_time", "Poruwa Ceremony Time")}
          {field("lunch_time", "Wedding Lunch Time")}
          {field("reception_time", "Evening Reception Time")}
        </div>
      </div>

      <div className="ad-card">
        <h2>Venue</h2>
        <div className="ad-grid">
          {field("venue_name", "Venue Name")}
          {field("venue_address", "Venue Address / City")}
          {field("map_query", "Google Maps Search Text")}
          {field("map_link", "Custom Map Link (optional — overrides search text)")}
        </div>
      </div>

      <div className="ad-card">
        <h2>Photo Gallery (up to 4)</h2>
        <div className="ad-note" style={{ marginBottom: 12 }}>
          Large photos are automatically compressed to ~100KB with no visible quality loss.
        </div>
        <div className="ad-gal">
          {[0, 1, 2, 3].map((i) => (
            <div className="ad-slot" key={i}>
              {draft.gallery[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.gallery[i]} alt={`Photo ${i + 1}`} />
              ) : (
                <div className="ad-slot-empty">No photo</div>
              )}
              <input
                type="file"
                accept="image/*"
                id={`gal-${i}`}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) uploadPhoto(i, f);
                }}
              />
              <label htmlFor={`gal-${i}`}>{draft.gallery[i] ? "Replace" : "+ Add Photo"}</label>
              {draft.gallery[i] && (
                <button
                  className="ad-del ad-slot-x"
                  title="Remove"
                  onClick={() =>
                    setDraft((d) => {
                      if (!d) return d;
                      const gal = [...d.gallery];
                      gal.splice(i, 1);
                      return { ...d, gallery: gal };
                    })
                  }
                >
                  ✕
                </button>
              )}
              {draft.gallery[i] && (
                <span className="ad-slot-size">≈ {Math.round((draft.gallery[i].length * 0.75) / 1024)} KB</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="ad-card">
        <h2>Poruwa Ceremony Timeline</h2>
        {draft.timeline.map((item, i) => (
          <div className="ad-tl-row" key={i}>
            <div className="ad-field">
              <input
                placeholder="9:00 AM"
                value={item.time}
                onChange={(e) =>
                  setDraft((d) => {
                    if (!d) return d;
                    const tl = [...d.timeline];
                    tl[i] = { ...tl[i], time: e.target.value };
                    return { ...d, timeline: tl };
                  })
                }
              />
            </div>
            <div className="ad-field">
              <input
                placeholder="Event description"
                value={item.text}
                onChange={(e) =>
                  setDraft((d) => {
                    if (!d) return d;
                    const tl = [...d.timeline];
                    tl[i] = { ...tl[i], text: e.target.value };
                    return { ...d, timeline: tl };
                  })
                }
              />
            </div>
            <button
              className="ad-del"
              title="Remove"
              onClick={() =>
                setDraft((d) => (d ? { ...d, timeline: d.timeline.filter((_, j) => j !== i) } : d))
              }
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="ad-add"
          onClick={() =>
            setDraft((d) => (d ? { ...d, timeline: [...d.timeline, { time: "", text: "" }] } : d))
          }
        >
          + Add Step
        </button>
      </div>

      <div className="ad-card">
        <h2>Details Section</h2>
        <div className="ad-field">
          <label>Details — one per line</label>
          <textarea
            className="wide"
            value={draft.details_text}
            onChange={(e) => set("details_text", e.target.value)}
            placeholder={"Dress code: Traditional / White & Gold\nComplimentary parking available"}
          />
        </div>
        <div className="ad-grid" style={{ marginTop: 14 }}>
          {field("rsvp_deadline", "RSVP Deadline")}
          {field("rsvp_phone", "RSVP Phone (tel: link)")}
          {field("whatsapp_number", "WhatsApp Number (digits only)")}
        </div>
      </div>

      <div className="ad-card">
        <h2>Section Visibility</h2>
        <div className="ad-note" style={{ marginBottom: 12 }}>
          Turn sections of the invitation on/off — changes appear on the invitation immediately after saving.
        </div>
        <div className="ad-toggles">
          {SECTIONS.map((s) => (
            <label className="ad-toggle" key={s.id}>
              <input
                type="checkbox"
                checked={!draft.hidden_sections.includes(s.id)}
                onChange={(e) => toggleSection(s.id, e.target.checked)}
              />
              <span className="sw" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div className="ad-actions">
        <button className="ad-save" disabled={busy} onClick={save}>
          {busy ? "Saving…" : "Save All Changes"}
        </button>
        <button className="ad-logout" onClick={() => router.push("/")}>
          View Invitation →
        </button>
      </div>

      {toast && <div className={`ad-toast${toast.err ? " err" : ""}`}>{toast.msg}</div>}
    </div>
  );
}
