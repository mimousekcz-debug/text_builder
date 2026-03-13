import React, { useEffect, useMemo, useState } from "react";

// --- IKONY PRO WIDGETY ---
const Icons = {
  Text: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  TextImage: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Benefits: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
  Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
};

export default function EshopBuilderV3() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const [projectName, setProjectName] = useState("Nový produkt");
  const [savedTemplates, setSavedTemplates] = useState([]);

  // --- PERSISTENCE (UKLÁDÁNÍ) ---
  useEffect(() => {
    const localData = localStorage.getItem("eshop_templates");
    if (localData) setSavedTemplates(JSON.parse(localData));
  }, []);

  const saveToLibrary = () => {
    const newTemplate = { id: Date.now(), name: projectName, data: blocks };
    const updated = [...savedTemplates.filter(t => t.name !== projectName), newTemplate];
    setSavedTemplates(updated);
    localStorage.setItem("eshop_templates", JSON.stringify(updated));
    alert("Uloženo do knihovny šablon.");
  };

  const loadTemplate = (id) => {
    const template = savedTemplates.find(t => t.id === id);
    if (template) {
      setBlocks(template.data);
      setProjectName(template.name);
    }
  };

  // --- LOGIKA BLOKŮ ---
  const addBlock = (type) => {
    const id = crypto.randomUUID();
    let newBlock = { id, type, heading: "Nový blok", text: "Obsah...", url: "https://placehold.co/400x300" };
    
    if (type === 'benefits') {
      newBlock.count = 4;
      newBlock.items = [
        { t: "Prémiová kvalita", img: "https://placehold.co/100" },
        { t: "Atestované materiály", img: "https://placehold.co/100" },
        { t: "Baby friendly", img: "https://placehold.co/100" },
        { t: "Snímatelný potah", img: "https://placehold.co/100" },
        { t: "Rychlé doručení", img: "https://placehold.co/100" }
      ];
    }
    if (type === 'text-image-left' || type === 'text-image-right') {
      newBlock.heading = "Nadpis k obrázku";
    }

    setBlocks([...blocks, newBlock]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));

  // --- GENERÁTOR HTML ---
  const generateFullHtml = useMemo(() => {
    return blocks.map(b => {
      const s = "padding:30px 0; max-width:1000px; margin:auto; font-family:sans-serif;";
      if (b.type === 'text-image-left') {
        return `<div style="${s} display:flex; align-items:center; gap:30px;">
                  <div style="flex:1;"><img src="${b.url}" style="width:100%; border-radius:10px;"></div>
                  <div style="flex:1;"><h2>${b.heading}</h2><p>${b.text}</p></div>
                </div>`;
      }
      if (b.type === 'text-image-right') {
        return `<div style="${s} display:flex; align-items:center; gap:30px; flex-direction:row-reverse;">
                  <div style="flex:1;"><img src="${b.url}" style="width:100%; border-radius:10px;"></div>
                  <div style="flex:1;"><h2>${b.heading}</h2><p>${b.text}</p></div>
                </div>`;
      }
      if (b.type === 'benefits') {
        const itemsHtml = b.items.slice(0, b.count).map(item => `
          <div style="flex:1; text-align:center; padding:10px;">
            <img src="${item.img}" style="width:80px; height:80px; border-radius:50%; border:1px solid #ddd; margin-bottom:10px;">
            <div style="font-weight:bold; font-size:14px;">${item.t}</div>
          </div>
        `).join("");
        return `<div style="${s} display:flex; justify-content:space-around; gap:10px;">${itemsHtml}</div>`;
      }
      return "";
    }).join("\n");
  }, [blocks]);

  return (
    <div className="builder-v3">
      {/* Top Bar s Ukládáním */}
      <header className="top-nav">
        <div className="logo">JG-BUILDER <span>PRO</span></div>
        <div className="project-ctrl">
          <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Název produktu..." />
          <button className="btn-save" onClick={saveToLibrary}><Icons.Save /> Uložit vzor</button>
        </div>
        <div className="templates-dropdown">
          <select onChange={(e) => loadTemplate(Number(e.target.value))}>
            <option>Moje uložené vzory...</option>
            {savedTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <button className="btn-export" onClick={() => navigator.clipboard.writeText(generateFullHtml)}>Kopírovat pro Shoptet</button>
      </header>

      <section className="widget-bar">
        <button onClick={() => addBlock('text-image-left')}><Icons.TextImage /> Foto vlevo</button>
        <button onClick={() => addBlock('text-image-right')}><Icons.TextImage /> Foto vpravo</button>
        <button onClick={() => addBlock('benefits')}><Icons.Benefits /> Výhody (3-5)</button>
        <button onClick={() => addBlock('video')}><Icons.Video /> Video</button>
      </section>

      <main className="main-layout">
        {/* Náhled */}
        <section className="canvas">
          {blocks.map(b => (
            <div key={b.id} className={`block-preview ${selectedId === b.id ? 'active' : ''}`} onClick={() => setSelectedId(b.id)}>
              {b.type === 'benefits' ? (
                <div className="benefits-render" style={{gridTemplateColumns: `repeat(${b.count}, 1fr)`}}>
                  {b.items.slice(0, b.count).map((item, i) => (
                    <div key={i} className="benefit-col">
                      <img src={item.img} alt="" />
                      <p>{item.t}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`flex-render ${b.type}`}>
                  <div className="img-box"><img src={b.url} alt="" /></div>
                  <div className="txt-box"><h3>{b.heading}</h3><p>{b.text}</p></div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Nastavení (Dynamické) */}
        <aside className="settings">
          <h3>Nastavení widgetu</h3>
          {selectedId ? (
            <div className="form">
              {blocks.find(b => b.id === selectedId).type === 'benefits' ? (
                <>
                  <label>Počet výhod (3-5)</label>
                  <input type="range" min="3" max="5" value={blocks.find(b => b.id === selectedId).count} 
                         onChange={e => updateBlock(selectedId, {count: parseInt(e.target.value)})} />
                  <div className="benefit-items-edit">
                    {blocks.find(b => b.id === selectedId).items.slice(0, blocks.find(b => b.id === selectedId).count).map((it, i) => (
                      <div key={i} className="mini-edit">
                        <input value={it.t} onChange={e => {
                          const newItems = [...blocks.find(b => b.id === selectedId).items];
                          newItems[i].t = e.target.value;
                          updateBlock(selectedId, {items: newItems});
                        }} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <label>URL Obrázku</label>
                  <input value={blocks.find(b => b.id === selectedId).url} onChange={e => updateBlock(selectedId, {url: e.target.value})} />
                  <label>Nadpis</label>
                  <input value={blocks.find(b => b.id === selectedId).heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
                  <label>Text</label>
                  <textarea value={blocks.find(b => b.id === selectedId).text} onChange={e => updateBlock(selectedId, {text: e.target.value})} />
                </>
              )}
            </div>
          ) : <p>Vyberte blok</p>}
        </aside>
      </main>

      <style>{`
        .builder-v3 { display: flex; flex-direction: column; height: 100vh; font-family: 'Segoe UI', sans-serif; background: #f0f2f5; }
        .top-nav { background: #1a1a2e; padding: 10px 20px; display: flex; align-items: center; gap: 20px; color: white; }
        .project-ctrl { display: flex; gap: 10px; flex: 1; }
        .project-ctrl input { background: #2a2a4e; border: 1px solid #444; color: white; padding: 5px 10px; border-radius: 4px; width: 250px; }
        .btn-save { background: #4ecca3; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; color: #1a1a2e; font-weight: bold; }
        .btn-export { background: #e63946; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

        .widget-bar { background: white; padding: 10px; display: flex; justify-content: center; gap: 15px; border-bottom: 1px solid #ddd; }
        .widget-bar button { background: none; border: 1px solid #eee; padding: 10px 15px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .widget-bar button:hover { border-color: #e63946; color: #e63946; }

        .main-layout { display: flex; flex: 1; overflow: hidden; }
        .canvas { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .block-preview { background: white; width: 100%; max-width: 800px; padding: 20px; border: 2px solid transparent; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .block-preview.active { border-color: #e63946; }

        .flex-render { display: flex; gap: 20px; align-items: center; }
        .flex-render.text-image-right { flex-direction: row-reverse; }
        .img-box { flex: 1; } .img-box img { width: 100%; border-radius: 8px; }
        .txt-box { flex: 1; }

        .benefits-render { display: grid; gap: 10px; }
        .benefit-col { text-align: center; }
        .benefit-col img { width: 60px; height: 60px; border-radius: 50%; border: 1px solid #eee; margin-bottom: 5px; }
        .benefit-col p { font-size: 12px; font-weight: bold; margin: 0; }

        .settings { width: 300px; background: white; border-left: 1px solid #ddd; padding: 20px; overflow-y: auto; }
        .form label { display: block; margin: 15px 0 5px; font-size: 12px; font-weight: bold; color: #666; }
        .form input, .form textarea, .form select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .mini-edit { margin-bottom: 5px; }
      `}</style>
    </div>
  );
}
