import React, { useEffect, useMemo, useState } from "react";

// --- POMOCNÉ KOMPONENTY PRO UI ---
const Button = ({ children, variant = "primary", size = "md", onClick, className = "" }) => (
  <button onClick={onClick} className={`btn btn-${variant} btn-${size} ${className}`}>{children}</button>
);

const Input = (props) => <input className="builder-input" {...props} />;
const Textarea = (props) => <textarea className="builder-textarea" rows={4} {...props} />;

// --- LOGIKA GENEROVÁNÍ HTML ---
function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function youtubeEmbed(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

// --- HLAVNÍ KOMPONENTA EDITORU ---
export default function EshopTextBuilderPro() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [theme] = useState({ accent: "#9d7a5f", text: "#6e513a", radius: "12px", bg: "#ffffff" });

  const selectedBlock = blocks.find((b) => b.id === selectedId);

  // Přidání nového bloku
  const addBlock = (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      title: type.toUpperCase(),
      heading: "Nový nadpis",
      text: "Zde napište svůj text...",
      url: "https://placehold.co/600x400",
      items: type === "faq" ? [{ q: "Otázka?", a: "Odpověď." }] : []
    };
    setBlocks([...blocks, newBlock]);
    setSelectedId(newBlock.id);
  };

  // Aktualizace dat v bloku
  const updateBlock = (id, patch) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  };

  // Smazání bloku
  const deleteBlock = (id) => {
    if (window.confirm("Smazat tento blok?")) {
      setBlocks(blocks.filter(b => b.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  // Posun bloku
  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // --- RENDEROVÁNÍ NÁHLEDU (HTML) ---
  const renderHtml = (block) => {
    const s = `style="padding:20px; margin-bottom:20px; border-radius:${theme.radius}; background:${theme.bg}; color:${theme.text};"`;
    
    switch (block.type) {
      case "text":
        return `<div ${s}><h2>${escapeHtml(block.heading)}</h2><p>${escapeHtml(block.text).replace(/\n/g, "<br>")}</p></div>`;
      case "image":
        return `<div ${s}><img src="${block.url}" style="width:100%; border-radius:8px;" /></div>`;
      case "video":
        return `<div ${s}><h2>${escapeHtml(block.heading)}</h2><iframe width="100%" height="315" src="${youtubeEmbed(block.url)}" frameborder="0" allowfullscreen></iframe></div>`;
      case "faq":
        return `<div ${s}><h2>${escapeHtml(block.heading)}</h2>${block.items.map(i => `<b>${i.q}</b><p>${i.a}</p>`).join("")}</div>`;
      default:
        return `<div ${s}>Blok: ${block.type}</div>`;
    }
  };

  const fullHtml = useMemo(() => {
    return `<div class="eshop-content">\n${blocks.map(renderHtml).join("\n")}\n</div>`;
  }, [blocks]);

  return (
    <div className="builder-container">
      {/* Header */}
      <header className="builder-header">
        <h1 style={{color: "white"}}>E-shop Content Builder</h1>
        <Button onClick={() => navigator.clipboard.writeText(fullHtml)}>Kopírovat HTML</Button>
      </header>

      <div className="builder-main-layout">
        {/* Levý panel - Widgety */}
        <aside className="builder-sidebar-left">
          <div className="panel-title">Přidat blok</div>
          <div className="widget-grid">
            <button onClick={() => addBlock("text")}>Text</button>
            <button onClick={() => addBlock("image")}>Obrázek</button>
            <button onClick={() => addBlock("video")}>Video</button>
            <button onClick={() => addBlock("faq")}>FAQ</button>
          </div>

          <div className="panel-title" style={{marginTop: "20px"}}>Pořadí bloků</div>
          <div className="block-list">
            {blocks.map((b, i) => (
              <div key={b.id} className={`block-item ${selectedId === b.id ? "active" : ""}`} onClick={() => setSelectedId(b.id)}>
                <span>{i+1}. {b.type}</span>
                <div className="block-controls">
                  <button onClick={(e) => {e.stopPropagation(); moveBlock(i, "up")}}>↑</button>
                  <button onClick={(e) => {e.stopPropagation(); moveBlock(i, "down")}}>↓</button>
                  <button onClick={(e) => {e.stopPropagation(); deleteBlock(b.id)}} style={{color: "red"}}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Střed - Náhled */}
        <main className="builder-preview-area">
          <div className="tabs">
            <button className={activeTab === "preview" ? "active" : ""} onClick={() => setActiveTab("preview")}>Náhled</button>
            <button className={activeTab === "code" ? "active" : ""} onClick={() => setActiveTab("code")}>Kód (HTML)</button>
          </div>
          
          <div className="preview-canvas">
            {activeTab === "preview" ? (
              blocks.length > 0 ? (
                <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
              ) : (
                <div className="empty-state">Pracovní plocha je prázdná. Přidejte první blok.</div>
              )
            ) : (
              <textarea className="code-output" readOnly value={fullHtml} />
            )}
          </div>
        </main>

        {/* Pravý panel - Nastavení */}
        <aside className="builder-sidebar-right">
          <div className="panel-title">Nastavení bloku</div>
          {selectedBlock ? (
            <div className="settings-form">
              <label>Nadpis</label>
              <Input value={selectedBlock.heading} onChange={(e) => updateBlock(selectedBlock.id, { heading: e.target.value })} />
              
              <label>Text / Popis</label>
              <Textarea value={selectedBlock.text} onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })} />
              
              {(selectedBlock.type === "image" || selectedBlock.type === "video") && (
                <>
                  <label>URL (Obrázek/YouTube)</label>
                  <Input value={selectedBlock.url} onChange={(e) => updateBlock(selectedBlock.id, { url: e.target.value })} />
                </>
              )}

              {selectedBlock.type === "faq" && (
                <div className="faq-editor">
                  <label>FAQ Položky</label>
                  <Button size="sm" onClick={() => updateBlock(selectedBlock.id, { items: [...selectedBlock.items, {q: "", a: ""}] })}>+ Přidat dotaz</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">Vyberte blok pro úpravu</div>
          )}
        </aside>
      </div>

      <style>{`
        .builder-container { display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; background: #f0f2f5; }
        .builder-header { background: #1a1a2e; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; }
        .builder-main-layout { display: flex; flex: 1; overflow: hidden; padding: 10px; gap: 10px; }
        
        .builder-sidebar-left, .builder-sidebar-right { width: 300px; background: white; border-radius: 12px; padding: 15px; overflow-y: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .builder-preview-area { flex: 1; display: flex; flex-direction: column; }
        
        .panel-title { font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #333; }
        .widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .widget-grid button { padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
        .widget-grid button:hover { background: #f9f9f9; border-color: #9d7a5f; }
        
        .block-item { display: flex; justify-content: space-between; padding: 8px; border: 1px solid #eee; margin-bottom: 5px; border-radius: 6px; cursor: pointer; background: #fff; font-size: 13px; }
        .block-item.active { border-color: #9d7a5f; background: #fdfaf8; }
        .block-controls button { margin-left: 3px; border: none; background: #eee; border-radius: 3px; cursor: pointer; }

        .preview-canvas { flex: 1; background: #fff; border-radius: 0 0 12px 12px; padding: 30px; overflow-y: auto; border: 1px solid #ddd; border-top: none; }
        .tabs { display: flex; background: #e4e6e9; border-radius: 12px 12px 0 0; }
        .tabs button { flex: 1; padding: 10px; border: none; cursor: pointer; border-radius: 12px 12px 0 0; }
        .tabs button.active { background: #fff; font-weight: bold; }

        .settings-form label { display: block; margin: 10px 0 5px; font-size: 13px; font-weight: bold; }
        .builder-input, .builder-textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .code-output { width: 100%; height: 100%; font-family: monospace; font-size: 12px; padding: 10px; border: none; outline: none; resize: none; }
        
        .btn { padding: 8px 16px; border-radius: 8px; cursor: pointer; border: none; font-weight: bold; }
        .btn-primary { background: #9d7a5f; color: white; }
        .empty-state { text-align: center; color: #999; margin-top: 50px; }
      `}</style>
    </div>
  );
}
