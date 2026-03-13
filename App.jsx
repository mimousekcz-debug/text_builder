import React, { useEffect, useState } from "react";

const Icons = {
  Move: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
};

export default function ShoptetBuilderFinal() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [projectName, setProjectName] = useState("produkt - CZ");
  const [library, setLibrary] = useState([]);

  // Načtení knihovny
  useEffect(() => {
    const saved = localStorage.getItem("shoptet_builder_data");
    if (saved) setLibrary(JSON.parse(saved));
  }, []);

  const saveToLibrary = () => {
    const newEntry = { id: Date.now(), name: projectName, data: blocks };
    const updated = [...library.filter(i => i.name !== projectName), newEntry];
    setLibrary(updated);
    localStorage.setItem("shoptet_builder_data", JSON.stringify(updated));
    alert("Uloženo do knihovny.");
  };

  const addBlock = (type, meta = {}) => {
    const id = crypto.randomUUID();
    let newBlock = { 
      id, 
      type, 
      heading: "Nadpis", 
      text: "Textový obsah...", 
      url: "https://placehold.co/600x400",
      items: [] 
    };
    
    if (type === 'benefits') {
      newBlock.items = Array(meta.count || 3).fill(0).map((_, i) => ({
        t: `Výhoda ${i+1}`,
        img: "https://www.chrapatko.cz/user/documents/upload/icon-placeholder.png"
      }));
    }
    
    setBlocks([...blocks, newBlock]);
    setSelectedId(id);
  };

  const updateBlock = (id, patch) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
  };

  const updateBenefitItem = (blockId, index, field, value) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        const newItems = [...b.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...b, items: newItems };
      }
      return b;
    }));
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const copyHTML = () => {
    let finalHTML = `<div class="shoptet-custom-content" style="font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto;">\n`;
    
    blocks.forEach(b => {
      if (b.type === 'heading') finalHTML += `  <h2 style="text-align:center; margin: 40px 0;">${b.heading}</h2>\n`;
      if (b.type === 'text') finalHTML += `  <p style="line-height:1.6; margin-bottom:20px;">${b.text}</p>\n`;
      if (b.type === 'image') finalHTML += `  <img src="${b.url}" style="width:100%; height:auto; border-radius:10px; margin-bottom:30px;" alt="${b.heading}">\n`;
      if (b.type === 'youtube') {
        const ytId = getYouTubeId(b.url);
        finalHTML += `  <div style="position:relative; padding-bottom:56.25%; height:0; margin-bottom:30px;"><iframe src="https://www.youtube.com/embed/${ytId}" style="position:absolute; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe></div>\n`;
      }
      if (b.type === 'benefits') {
        finalHTML += `  <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:20px; margin: 40px 0;">\n`;
        b.items.forEach(it => {
          finalHTML += `    <div style="flex:1; min-width:150px; text-align:center;"><img src="${it.img}" style="width:80px; height:80px; margin-bottom:10px;"><p><strong>${it.t}</strong></p></div>\n`;
        });
        finalHTML += `  </div>\n`;
      }
    });

    finalHTML += `</div>`;
    navigator.clipboard.writeText(finalHTML);
    alert("HTML kód byl zkopírován!");
  };

  const activeBlock = blocks.find(b => b.id === selectedId);

  return (
    <div className="builder-wrapper">
      <header className="top-bar">
        <div className="logo">E-shop Content Builder</div>
        <button className="export-btn" onClick={copyHTML}>Kopírovat HTML</button>
      </header>

      <div className="main-layout">
        {/* LEVÝ PANEL */}
        <aside className="side-panel left">
          <div className="card">
            <label>Název projektu</label>
            <input value={projectName} onChange={e => setProjectName(e.target.value)} />
            <button className="primary-btn" onClick={saveToLibrary}>Uložit vzor</button>
          </div>

          <div className="card">
            <h3>Přidat blok</h3>
            <div className="widget-grid">
              <button onClick={() => addBlock('benefits', {count: 3})}>Výhody 3 ikony</button>
              <button onClick={() => addBlock('benefits', {count: 4})}>Výhody 4 ikony</button>
              <button onClick={() => addBlock('text-image-left')}>Text a obrázek</button>
              <button onClick={() => addBlock('text')}>Text</button>
              <button onClick={() => addBlock('image')}>Obrázek</button>
              <button onClick={() => addBlock('youtube')}>Video</button>
              <button onClick={() => addBlock('faq')}>Otázky a odpovědi</button>
              <button onClick={() => addBlock('cta')}>CTA banner</button>
            </div>
          </div>
        </aside>

        {/* STŘEDNÍ PLOCHA */}
        <main className="canvas">
          {blocks.length === 0 && <div className="empty-info">Klikněte na tlačítko vlevo pro přidání bloku</div>}
          {blocks.map((b) => (
            <div 
              key={b.id} 
              className={`block-item ${selectedId === b.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(b.id)}
            >
              <div className="block-label">{b.type.toUpperCase()}</div>
              <button className="delete-icon" onClick={(e) => { e.stopPropagation(); setBlocks(blocks.filter(x => x.id !== b.id)); }}>
                <Icons.Trash />
              </button>
              <div className="preview-content">
                {b.type === 'benefits' ? (
                  <div className="benefits-preview">
                    {b.items.map((it, i) => <div key={i}><img src={it.img} alt="" /><span>{it.t}</span></div>)}
                  </div>
                ) : (
                  <div>{b.heading}</div>
                )}
              </div>
            </div>
          ))}
        </main>

        {/* PRAVÝ PANEL */}
        <aside className="side-panel right">
          {activeBlock ? (
            <div className="settings">
              <h3>Nastavení: {activeBlock.type}</h3>
              <label>Nadpis</label>
              <input value={activeBlock.heading} onChange={e => updateBlock(selectedId, {heading: e.target.value})} />
              
              <label>Text</label>
              <textarea value={activeBlock.text} onChange={e => updateBlock(selectedId, {text: e.target.value})} />

              {(activeBlock.type === 'image' || activeBlock.type === 'youtube') && (
                <>
                  <label>{activeBlock.type === 'youtube' ? 'YouTube URL' : 'URL Obrázku'}</label>
                  <input value={activeBlock.url} onChange={e => updateBlock(selectedId, {url: e.target.value})} />
                </>
              )}

              {activeBlock.type === 'benefits' && activeBlock.items.map((it, i) => (
                <div key={i} className="benefit-editor">
                  <hr />
                  <label>Ikona {i+1} (URL)</label>
                  <input value={it.img} onChange={e => updateBenefitItem(selectedId, i, 'img', e.target.value)} />
                  <label>Text {i+1}</label>
                  <input value={it.t} onChange={e => updateBenefitItem(selectedId, i, 't', e.target.value)} />
                </div>
              ))}
            </div>
          ) : <div className="empty-info">Vyberte blok pro úpravu</div>}
        </aside>
      </div>

      <style>{`
        .builder-wrapper { display: flex; flex-direction: column; height: 100vh; font-family: 'Segoe UI', Tahoma, sans-serif; background: #f0f2f5; }
        .top-bar { background: #1a1b35; color: white; padding: 12px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .export-btn { background: #fff; color: #1a1b35; border: none; padding: 6px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; }
        
        .main-layout { display: flex; flex: 1; overflow: hidden; }
        .side-panel { width: 320px; background: #fff; padding: 20px; border: 1px solid #e0e0e0; overflow-y: auto; }
        .card { background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid #eee; }
        
        .widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
        .widget-grid button { background: #f8f9fa; border: 1px solid #ddd; padding: 10px 5px; border-radius: 8px; font-size: 11px; cursor: pointer; transition: 0.2s; }
        .widget-grid button:hover { background: #e9ecef; border-color: #1a1b35; }

        .canvas { flex: 1; padding: 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        .block-item { background: #fff; padding: 25px; border-radius: 12px; position: relative; border: 2px solid transparent; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .block-item.selected { border-color: #1a1b35; }
        .block-label { position: absolute; top: 8px; left: 12px; font-size: 9px; font-weight: bold; color: #999; }
        .delete-icon { position: absolute; top: 10px; right: 10px; border: none; background: #fee2e2; color: #ef4444; border-radius: 4px; padding: 4px; cursor: pointer; }
        
        .benefits-preview { display: flex; gap: 20px; justify-content: center; }
        .benefits-preview img { width: 40px; height: 40px; display: block; margin: 0 auto; }
        .benefits-preview span { font-size: 10px; display: block; text-align: center; margin-top: 5px; }

        .settings h3 { border-bottom: 2px solid #1a1b35; padding-bottom: 8px; margin-bottom: 20px; }
        label { display: block; font-size: 11px; font-weight: bold; margin-top: 15px; color: #666; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        textarea { height: 100px; }
        .primary-btn { width: 100%; background: #1a1b35; color: white; border: none; padding: 10px; border-radius: 6px; margin-top: 10px; cursor: pointer; }
        
        .empty-info { text-align: center; color: #ccc; margin-top: 50px; }
      `}</style>
    </div>
  );
}
