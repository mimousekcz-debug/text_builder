import React, { useEffect, useMemo, useState } from 'react';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(str = 'blok') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'blok';
}

function youtubeEmbed(url = '') {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

function defaultTheme(brand = 'mimousek') {
  if (brand === 'chrapatko') {
    return {
      brand: 'chrapatko',
      brandName: 'Chrápátko',
      accent: '#007599',
      accentSoft: '#e6f6f8',
      text: '#1e293b',
      muted: '#64748b',
      bg: '#ffffff',
      cardBg: '#f8fafc',
      radius: '22px',
      buttonText: '#ffffff',
    };
  }
  return {
    brand: 'mimousek',
    brandName: 'Mimoušek',
    accent: '#d59aa5',
    accentSoft: '#fbf0f2',
    text: '#334155',
    muted: '#64748b',
    bg: '#ffffff',
    cardBg: '#faf7f8',
    radius: '22px',
    buttonText: '#ffffff',
  };
}

const blockTypes = [
  { type: 'heroBenefits', label: 'Výhody s ikonami' },
  { type: 'textImage', label: 'Text a obrázek' },
  { type: 'text', label: 'Textový blok' },
  { type: 'image', label: 'Samostatný obrázek' },
  { type: 'gallery', label: 'Galerie' },
  { type: 'faq', label: 'FAQ' },
  { type: 'columns', label: 'Sloupce' },
  { type: 'video', label: 'YouTube video' },
  { type: 'table', label: 'Tabulka' },
  { type: 'ctaBanner', label: 'CTA banner' },
];

function baseBlock(type, title) {
  return {
    id: uid(),
    type,
    title,
    anchor: slugify(title),
    settings: {
      padding: 'medium',
      rounded: true,
      background: 'white',
      container: 'default',
      border: false,
      shadow: false,
      customClass: '',
    },
  };
}

function createBlock(type) {
  switch (type) {
    case 'heroBenefits':
      return {
        ...baseBlock(type, 'Výhody s ikonami'),
        heading: 'Proč si produkt zamilujete',
        subheading: 'Přehled hlavních výhod nahoře nad popisem.',
        items: [
          { title: 'Česká výroba', text: 'Pečlivě šito s důrazem na kvalitu.' },
          { title: 'Jemné materiály', text: 'Příjemné na dotek pro každodenní použití.' },
          { title: 'Praktické využití', text: 'Krása i funkčnost v jednom.' },
          { title: 'Skvělý dárek', text: 'Potěší nastávající i čerstvé rodiče.' },
        ],
      };
    case 'textImage':
      return {
        ...baseBlock(type, 'Text a obrázek'),
        heading: 'Nadpis bloku',
        text: 'Sem napište text produktu, SEO odstavec nebo výhody produktu.',
        imageUrl: 'https://placehold.co/900x900?text=Obrazek',
        imageAlt: 'Produktová fotografie',
        imagePosition: 'right',
        imageRatio: 'square',
        buttonText: 'Zjistit více',
        buttonLink: '#',
      };
    case 'text':
      return {
        ...baseBlock(type, 'Text'),
        heading: 'Textový blok',
        text: 'Sem napište delší popis, AI SEO text, produktové informace nebo obsah kategorie.',
      };
    case 'image':
      return {
        ...baseBlock(type, 'Obrázek'),
        imageUrl: 'https://placehold.co/1400x800?text=Obrazek',
        imageAlt: 'Obrázek',
        caption: '',
      };
    case 'gallery':
      return {
        ...baseBlock(type, 'Galerie'),
        heading: 'Galerie produktu',
        images: [
          { url: 'https://placehold.co/800x800?text=Foto+1', alt: 'Galerie 1' },
          { url: 'https://placehold.co/800x800?text=Foto+2', alt: 'Galerie 2' },
          { url: 'https://placehold.co/800x800?text=Foto+3', alt: 'Galerie 3' },
        ],
      };
    case 'faq':
      return {
        ...baseBlock(type, 'FAQ'),
        heading: 'Často se ptáte',
        accordion: true,
        items: [
          { q: 'Jak se produkt udržuje?', a: 'Praní na 30 °C, nebělit, nesušit v sušičce.' },
          { q: 'Z jakého materiálu je vyroben?', a: 'Doplňte vlastní materiálové složení.' },
        ],
      };
    case 'columns':
      return {
        ...baseBlock(type, 'Sloupce'),
        heading: 'Hlavní přednosti',
        columns: [
          { heading: 'Výhoda 1', text: 'Popis první výhody produktu.' },
          { heading: 'Výhoda 2', text: 'Popis druhé výhody produktu.' },
          { heading: 'Výhoda 3', text: 'Popis třetí výhody produktu.' },
        ],
      };
    case 'video':
      return {
        ...baseBlock(type, 'Video'),
        heading: 'Video produktu',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Vložte YouTube video produktu, návodu nebo prezentace.',
      };
    case 'table':
      return {
        ...baseBlock(type, 'Tabulka'),
        heading: 'Technické parametry',
        rows: [
          ['Materiál', '100 % bavlna'],
          ['Údržba', 'Praní na 30 °C'],
          ['Výroba', 'Česká republika'],
        ],
      };
    case 'ctaBanner':
      return {
        ...baseBlock(type, 'CTA banner'),
        eyebrow: 'Objevte více',
        heading: 'Vyberte si svou oblíbenou variantu',
        text: 'Dopřejte sobě nebo svým blízkým pohodlí, kvalitu a krásné zpracování.',
        buttonText: 'Nakoupit nyní',
        buttonLink: '#',
      };
    default:
      return baseBlock(type, type);
  }
}

function createTemplate(templateName) {
  if (templateName === 'category') {
    const a = createBlock('textImage');
    a.heading = 'Kategorie plná kvality a pohodlí';
    const b = createBlock('columns');
    b.heading = 'Proč nakoupit právě u nás';
    return [a, b, createBlock('gallery'), createBlock('faq'), createBlock('ctaBanner')];
  }
  if (templateName === 'homepage') {
    const a = createBlock('heroBenefits');
    a.heading = 'To nejlepší pro maminky i miminka na jednom místě';
    const c = createBlock('textImage');
    return [a, c, createBlock('gallery'), createBlock('ctaBanner')];
  }
  return [
    createBlock('heroBenefits'),
    createBlock('textImage'),
    createBlock('columns'),
    createBlock('table'),
    createBlock('video'),
    createBlock('faq'),
    createBlock('ctaBanner'),
  ];
}

function updateBlock(blocks, id, patch) {
  return blocks.map((block) => (block.id === id ? { ...block, ...patch } : block));
}

function sectionStyle(settings, theme) {
  const paddingMap = { small: '16px', medium: '28px', large: '40px' };
  const bgMap = {
    white: theme.bg,
    muted: theme.cardBg,
    accentSoft: theme.accentSoft,
    transparent: 'transparent',
  };
  return [
    `padding:${paddingMap[settings?.padding || 'medium']};`,
    `border-radius:${settings?.rounded ? theme.radius : '0px'};`,
    `background:${bgMap[settings?.background || 'white']};`,
    settings?.border ? 'border:1px solid #e2e8f0;' : 'border:none;',
    settings?.shadow ? 'box-shadow:0 12px 30px rgba(15,23,42,.06);' : 'box-shadow:none;',
  ].join('');
}

function outerStyle(settings) {
  const containerMap = {
    default: 'max-width:1200px;margin:0 auto;',
    narrow: 'max-width:980px;margin:0 auto;',
    full: 'max-width:100%;margin:0 auto;',
  };
  return containerMap[settings?.container || 'default'];
}

function wrapBlock(block, theme, inner) {
  const anchor = block.anchor ? ` id="${escapeHtml(block.anchor)}"` : '';
  const customClass = block.settings?.customClass ? ` ${escapeHtml(block.settings.customClass)}` : '';
  return `
<section${anchor} class="eshop-block eshop-block-${escapeHtml(block.type)}${customClass}" style="${outerStyle(block.settings)}">
  <div style="${sectionStyle(block.settings, theme)}">
    ${inner}
  </div>
</section>`;
}

function renderBlockHtml(block, theme) {
  if (block.type === 'heroBenefits') {
    return wrapBlock(
      block,
      theme,
      `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 10px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <p style="margin:0 0 22px;font-size:16px;line-height:1.8;color:${theme.muted};">${escapeHtml(block.subheading || '')}</p>
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;">
      ${(block.items || []).map((item) => `
        <div style="padding:18px;border-radius:${theme.radius};background:${theme.bg};border:1px solid #e2e8f0;">
          <div style="width:42px;height:42px;border-radius:999px;background:${theme.accentSoft};display:flex;align-items:center;justify-content:center;color:${theme.accent};font-weight:700;margin-bottom:12px;">✓</div>
          <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.title)}</h3>
          <p style="margin:0;font-size:15px;line-height:1.7;color:${theme.muted};">${escapeHtml(item.text)}</p>
        </div>`).join('')}
      </div>`
    );
  }

  if (block.type === 'textImage') {
    const ratio = block.imageRatio === 'portrait' ? 'aspect-ratio:4/5;' : block.imageRatio === 'landscape' ? 'aspect-ratio:16/10;' : 'aspect-ratio:1/1;';
    const imageCol = `
      <div style="flex:1;min-width:280px;">
        <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt)}" style="width:100%;${ratio}height:auto;border-radius:${theme.radius};display:block;object-fit:cover;" />
      </div>`;
    const textCol = `
      <div style="flex:1;min-width:280px;">
        <h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
        <div style="font-size:16px;line-height:1.9;color:${theme.text};">${escapeHtml(block.text).replace(/\n/g, '<br />')}</div>
        ${block.buttonText ? `<div style="margin-top:22px;"><a href="${escapeHtml(block.buttonLink || '#')}" style="display:inline-block;background:${theme.accent};color:${theme.buttonText};text-decoration:none;padding:13px 20px;border-radius:16px;font-weight:700;">${escapeHtml(block.buttonText)}</a></div>` : ''}
      </div>`;
    return wrapBlock(block, theme, `
      <div style="display:flex;gap:34px;align-items:center;flex-wrap:wrap;">
        ${block.imagePosition === 'left' ? `${imageCol}${textCol}` : `${textCol}${imageCol}`}
      </div>`);
  }

  if (block.type === 'text') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <div style="font-size:16px;line-height:1.9;color:${theme.text};">${escapeHtml(block.text).replace(/\n/g, '<br />')}</div>`);
  }

  if (block.type === 'image') {
    return wrapBlock(block, theme, `
      <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt)}" style="width:100%;height:auto;border-radius:${theme.radius};display:block;object-fit:cover;" />
      ${block.caption ? `<p style="margin:12px 0 0;font-size:14px;color:${theme.muted};">${escapeHtml(block.caption)}</p>` : ''}`);
  }

  if (block.type === 'gallery') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 16px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">
        ${(block.images || []).map((img) => `
          <div><img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" style="width:100%;aspect-ratio:1/1;border-radius:${theme.radius};display:block;object-fit:cover;" /></div>`).join('')}
      </div>`);
  }

  if (block.type === 'faq') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      ${(block.items || []).map((item) => block.accordion ? `
        <details style="border-top:1px solid #e2e8f0;padding:16px 0;">
          <summary style="cursor:pointer;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</summary>
          <p style="margin:10px 0 0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p>
        </details>` : `
        <div style="border-top:1px solid #e2e8f0;padding:16px 0;">
          <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</h3>
          <p style="margin:0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p>
        </div>`).join('')}`);
  }

  if (block.type === 'columns') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">
      ${(block.columns || []).map((col) => `
        <div style="padding:20px;border:1px solid #e2e8f0;border-radius:${theme.radius};background:${theme.bg};">
          <h3 style="margin:0 0 10px;font-size:20px;font-weight:700;color:${theme.text};">${escapeHtml(col.heading)}</h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:${theme.muted};">${escapeHtml(col.text)}</p>
        </div>`).join('')}
      </div>`);
  }

  if (block.type === 'video') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(block.description || '')}</p>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:${theme.radius};">
        <iframe src="${escapeHtml(youtubeEmbed(block.youtubeUrl))}" title="YouTube video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
      </div>`);
  }

  if (block.type === 'table') {
    return wrapBlock(block, theme, `
      <h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tbody>
            ${(block.rows || []).map((row) => `
              <tr>
                <td style="padding:14px;border-bottom:1px solid #e2e8f0;font-weight:700;background:${theme.cardBg};color:${theme.text};">${escapeHtml(row[0] || '')}</td>
                <td style="padding:14px;border-bottom:1px solid #e2e8f0;color:${theme.text};">${escapeHtml(row[1] || '')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`);
  }

  if (block.type === 'ctaBanner') {
    return wrapBlock(block, theme, `
      <div style="text-align:center;">
        ${block.eyebrow ? `<div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${theme.accentSoft};color:${theme.accent};font-weight:700;font-size:13px;margin-bottom:14px;">${escapeHtml(block.eyebrow)}</div>` : ''}
        <h2 style="font-size:38px;line-height:1.15;margin:0 0 12px;font-weight:800;color:${theme.text};">${escapeHtml(block.heading)}</h2>
        <p style="margin:0 auto 20px;max-width:760px;font-size:16px;line-height:1.85;color:${theme.text};">${escapeHtml(block.text || '')}</p>
        ${block.buttonText ? `<a href="${escapeHtml(block.buttonLink || '#')}" style="display:inline-block;background:${theme.accent};color:${theme.buttonText};text-decoration:none;padding:14px 22px;border-radius:16px;font-weight:700;">${escapeHtml(block.buttonText)}</a>` : ''}
      </div>`);
  }

  return '';
}

function buildExportCss() {
  return `<style>
.eshop-export *{box-sizing:border-box;}
.eshop-export img{max-width:100%;}
.eshop-export .eshop-block{margin:0 auto 24px;}
@media (max-width:768px){
  .eshop-export .eshop-block [style*="display:flex"]{display:block !important;}
  .eshop-export .eshop-block [style*="grid-template-columns:repeat(4"]{grid-template-columns:1fr 1fr !important;}
  .eshop-export .eshop-block [style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr !important;}
}
</style>`;
}

function buildExportHtml(blocks, theme, includeCss) {
  return `${includeCss ? buildExportCss() : ''}
<div class="eshop-export">
${blocks.map((block) => renderBlockHtml(block, theme)).join('\n\n')}
</div>`;
}

function field(label, input) {
  return (
    <label className="field">
      <span>{label}</span>
      {input}
    </label>
  );
}

function BlockSettings({ block, setBlocks }) {
  if (!block) return <div className="empty-settings">Klikni na blok v náhledu a vpravo se zobrazí jeho nastavení.</div>;

  const patchBlock = (patch) => setBlocks((prev) => updateBlock(prev, block.id, patch));
  const patchSettings = (patch) => patchBlock({ settings: { ...block.settings, ...patch } });

  return (
    <div className="settings-wrap">
      <div className="panel">
        <h3>Nastavení bloku</h3>
        {field('Název bloku', <input value={block.title || ''} onChange={(e) => patchBlock({ title: e.target.value, anchor: slugify(e.target.value) })} />)}
        {field('Anchor ID', <input value={block.anchor || ''} onChange={(e) => patchBlock({ anchor: e.target.value })} />)}
        <div className="grid-two">
          {field('Padding', (
            <select value={block.settings?.padding || 'medium'} onChange={(e) => patchSettings({ padding: e.target.value })}>
              <option value="small">Malý</option>
              <option value="medium">Střední</option>
              <option value="large">Velký</option>
            </select>
          ))}
          {field('Pozadí', (
            <select value={block.settings?.background || 'white'} onChange={(e) => patchSettings({ background: e.target.value })}>
              <option value="white">Bílé</option>
              <option value="muted">Jemně šedé</option>
              <option value="accentSoft">Brand pozadí</option>
              <option value="transparent">Transparentní</option>
            </select>
          ))}
        </div>
        <div className="grid-two">
          {field('Šířka', (
            <select value={block.settings?.container || 'default'} onChange={(e) => patchSettings({ container: e.target.value })}>
              <option value="narrow">Úzká</option>
              <option value="default">Standard</option>
              <option value="full">Plná</option>
            </select>
          ))}
          {field('Vlastní CSS třída', <input value={block.settings?.customClass || ''} onChange={(e) => patchSettings({ customClass: e.target.value })} />)}
        </div>
        <div className="switches">
          <label><input type="checkbox" checked={!!block.settings?.rounded} onChange={(e) => patchSettings({ rounded: e.target.checked })} /> Zaoblené rohy</label>
          <label><input type="checkbox" checked={!!block.settings?.border} onChange={(e) => patchSettings({ border: e.target.checked })} /> Rámeček</label>
          <label><input type="checkbox" checked={!!block.settings?.shadow} onChange={(e) => patchSettings({ shadow: e.target.checked })} /> Stín</label>
        </div>
      </div>

      <div className="panel">
        <h3>Obsah</h3>

        {block.type === 'heroBenefits' && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {field('Podnadpis', <textarea value={block.subheading || ''} onChange={(e) => patchBlock({ subheading: e.target.value })} />)}
            {(block.items || []).map((item, index) => (
              <div key={index} className="mini-card">
                {field('Titulek', <input value={item.title} onChange={(e) => {
                  const next = [...block.items]; next[index] = { ...next[index], title: e.target.value }; patchBlock({ items: next });
                }} />)}
                {field('Text', <textarea value={item.text} onChange={(e) => {
                  const next = [...block.items]; next[index] = { ...next[index], text: e.target.value }; patchBlock({ items: next });
                }} />)}
              </div>
            ))}
            <button className="btn secondary" onClick={() => patchBlock({ items: [...(block.items || []), { title: '', text: '' }] })}>+ Přidat výhodu</button>
          </>
        )}

        {(block.type === 'text' || block.type === 'textImage') && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {field('Text', <textarea rows={8} value={block.text || ''} onChange={(e) => patchBlock({ text: e.target.value })} />)}
          </>
        )}

        {block.type === 'textImage' && (
          <>
            <div className="grid-two">
              {field('URL obrázku', <input value={block.imageUrl || ''} onChange={(e) => patchBlock({ imageUrl: e.target.value })} />)}
              {field('Alt obrázku', <input value={block.imageAlt || ''} onChange={(e) => patchBlock({ imageAlt: e.target.value })} />)}
            </div>
            <div className="grid-three">
              {field('Pozice', (
                <select value={block.imagePosition || 'right'} onChange={(e) => patchBlock({ imagePosition: e.target.value })}>
                  <option value="left">Vlevo</option>
                  <option value="right">Vpravo</option>
                </select>
              ))}
              {field('Poměr', (
                <select value={block.imageRatio || 'square'} onChange={(e) => patchBlock({ imageRatio: e.target.value })}>
                  <option value="square">Čtverec</option>
                  <option value="portrait">Na výšku</option>
                  <option value="landscape">Na šířku</option>
                </select>
              ))}
              {field('Text tlačítka', <input value={block.buttonText || ''} onChange={(e) => patchBlock({ buttonText: e.target.value })} />)}
            </div>
            {field('Odkaz tlačítka', <input value={block.buttonLink || ''} onChange={(e) => patchBlock({ buttonLink: e.target.value })} />)}
          </>
        )}

        {block.type === 'image' && (
          <>
            {field('URL obrázku', <input value={block.imageUrl || ''} onChange={(e) => patchBlock({ imageUrl: e.target.value })} />)}
            {field('Alt obrázku', <input value={block.imageAlt || ''} onChange={(e) => patchBlock({ imageAlt: e.target.value })} />)}
            {field('Popisek', <input value={block.caption || ''} onChange={(e) => patchBlock({ caption: e.target.value })} />)}
          </>
        )}

        {block.type === 'gallery' && (
          <>
            {field('Nadpis galerie', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {(block.images || []).map((img, index) => (
              <div key={index} className="mini-card grid-two">
                {field('URL', <input value={img.url} onChange={(e) => {
                  const next = [...block.images]; next[index] = { ...next[index], url: e.target.value }; patchBlock({ images: next });
                }} />)}
                {field('Alt', <input value={img.alt} onChange={(e) => {
                  const next = [...block.images]; next[index] = { ...next[index], alt: e.target.value }; patchBlock({ images: next });
                }} />)}
              </div>
            ))}
            <button className="btn secondary" onClick={() => patchBlock({ images: [...(block.images || []), { url: '', alt: '' }] })}>+ Přidat obrázek</button>
          </>
        )}

        {block.type === 'video' && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {field('YouTube URL', <input value={block.youtubeUrl || ''} onChange={(e) => patchBlock({ youtubeUrl: e.target.value })} />)}
            {field('Popis', <textarea value={block.description || ''} onChange={(e) => patchBlock({ description: e.target.value })} />)}
          </>
        )}

        {block.type === 'faq' && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            <label className="check-inline"><input type="checkbox" checked={!!block.accordion} onChange={(e) => patchBlock({ accordion: e.target.checked })} /> Rozbalovací FAQ</label>
            {(block.items || []).map((item, index) => (
              <div key={index} className="mini-card">
                {field('Otázka', <input value={item.q} onChange={(e) => {
                  const next = [...block.items]; next[index] = { ...next[index], q: e.target.value }; patchBlock({ items: next });
                }} />)}
                {field('Odpověď', <textarea value={item.a} onChange={(e) => {
                  const next = [...block.items]; next[index] = { ...next[index], a: e.target.value }; patchBlock({ items: next });
                }} />)}
              </div>
            ))}
            <button className="btn secondary" onClick={() => patchBlock({ items: [...(block.items || []), { q: '', a: '' }] })}>+ Přidat otázku</button>
          </>
        )}

        {block.type === 'columns' && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {(block.columns || []).map((col, index) => (
              <div key={index} className="mini-card">
                {field('Nadpis sloupce', <input value={col.heading} onChange={(e) => {
                  const next = [...block.columns]; next[index] = { ...next[index], heading: e.target.value }; patchBlock({ columns: next });
                }} />)}
                {field('Text', <textarea value={col.text} onChange={(e) => {
                  const next = [...block.columns]; next[index] = { ...next[index], text: e.target.value }; patchBlock({ columns: next });
                }} />)}
              </div>
            ))}
            <button className="btn secondary" onClick={() => patchBlock({ columns: [...(block.columns || []), { heading: '', text: '' }] })}>+ Přidat sloupec</button>
          </>
        )}

        {block.type === 'table' && (
          <>
            {field('Nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {(block.rows || []).map((row, index) => (
              <div key={index} className="grid-two">
                {field('Parametr', <input value={row[0]} onChange={(e) => {
                  const next = [...block.rows]; next[index] = [e.target.value, next[index][1]]; patchBlock({ rows: next });
                }} />)}
                {field('Hodnota', <input value={row[1]} onChange={(e) => {
                  const next = [...block.rows]; next[index] = [next[index][0], e.target.value]; patchBlock({ rows: next });
                }} />)}
              </div>
            ))}
            <button className="btn secondary" onClick={() => patchBlock({ rows: [...(block.rows || []), ['', '']] })}>+ Přidat řádek</button>
          </>
        )}

        {block.type === 'ctaBanner' && (
          <>
            {field('Malý titulek', <input value={block.eyebrow || ''} onChange={(e) => patchBlock({ eyebrow: e.target.value })} />)}
            {field('Hlavní nadpis', <input value={block.heading || ''} onChange={(e) => patchBlock({ heading: e.target.value })} />)}
            {field('Text', <textarea value={block.text || ''} onChange={(e) => patchBlock({ text: e.target.value })} />)}
            <div className="grid-two">
              {field('Text tlačítka', <input value={block.buttonText || ''} onChange={(e) => patchBlock({ buttonText: e.target.value })} />)}
              {field('Odkaz tlačítka', <input value={block.buttonLink || ''} onChange={(e) => patchBlock({ buttonLink: e.target.value })} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [projectName, setProjectName] = useState('produkt-cz');
  const [pageType, setPageType] = useState('product');
  const [theme, setTheme] = useState(defaultTheme('mimousek'));
  const [includeCss, setIncludeCss] = useState(true);
  const [blocks, setBlocks] = useState(createTemplate('product'));
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!selectedId && blocks[0]?.id) setSelectedId(blocks[0].id);
  }, [blocks, selectedId]);

  const selectedBlock = blocks.find((block) => block.id === selectedId) || null;

  const generatedHtml = useMemo(() => buildExportHtml(blocks, theme, includeCss), [blocks, theme, includeCss]);

  const addBlock = (type) => {
    const block = createBlock(type);
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index < 0) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  const deleteBlock = (id) => {
    const next = blocks.filter((b) => b.id !== id);
    setBlocks(next);
    if (selectedId === id) setSelectedId(next[0]?.id || null);
  };

  const duplicateBlock = (id) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const copy = JSON.parse(JSON.stringify(blocks[index]));
    copy.id = uid();
    copy.title = `${copy.title} kopie`;
    copy.anchor = slugify(copy.title);
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    setBlocks(next);
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      alert('Hotovo, HTML bylo zkopírováno.');
    } catch {
      alert('Kopírování se nepovedlo.');
    }
  };

  const saveProject = () => {
    localStorage.setItem('eshop-builder-project', JSON.stringify({ projectName, pageType, theme, includeCss, blocks }));
    alert('Projekt byl uložen do prohlížeče.');
  };

  const loadProject = () => {
    const raw = localStorage.getItem('eshop-builder-project');
    if (!raw) return alert('V prohlížeči není uložen žádný projekt.');
    try {
      const payload = JSON.parse(raw);
      setProjectName(payload.projectName || 'projekt');
      setPageType(payload.pageType || 'product');
      setTheme(payload.theme || defaultTheme('mimousek'));
      setIncludeCss(typeof payload.includeCss === 'boolean' ? payload.includeCss : true);
      setBlocks(payload.blocks || []);
      setSelectedId(payload.blocks?.[0]?.id || null);
    } catch {
      alert('Načtení se nepovedlo.');
    }
  };

  const resetByTemplate = (templateName = pageType) => {
    const newBlocks = createTemplate(templateName);
    setBlocks(newBlocks);
    setSelectedId(newBlocks[0]?.id || null);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ projectName, pageType, theme, includeCss, blocks }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(projectName)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'));
        setProjectName(payload.projectName || 'projekt');
        setPageType(payload.pageType || 'product');
        setTheme(payload.theme || defaultTheme('mimousek'));
        setIncludeCss(typeof payload.includeCss === 'boolean' ? payload.includeCss : true);
        setBlocks(payload.blocks || []);
        setSelectedId(payload.blocks?.[0]?.id || null);
      } catch {
        alert('Soubor JSON se nepodařilo načíst.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="app-shell">
      <header className="hero-bar">
        <div>
          <div className="hero-pill">Profesionální builder obsahových bloků</div>
          <h1>Pomocník pro kódování textů a bloků na e-shop</h1>
          <p>Vkládáš texty, obrázky, galerie, FAQ, tabulky, CTA bannery i YouTube videa. Na konci dostaneš hotové HTML pro Shoptet.</p>
        </div>
        <div className="hero-actions">
          <button className="btn white" onClick={saveProject}>Uložit</button>
          <button className="btn white" onClick={loadProject}>Načíst</button>
          <button className="btn white" onClick={exportJson}>JSON</button>
          <label className="btn white file-btn">Import JSON<input type="file" accept="application/json" onChange={importJson} /></label>
          <button className="btn" onClick={copyHtml}>Kopírovat HTML</button>
        </div>
      </header>

      <main className="layout">
        <aside className="left-col">
          <div className="panel">
            <h3>Projekt</h3>
            {field('Název projektu', <input value={projectName} onChange={(e) => setProjectName(e.target.value)} />)}
            <div className="grid-two">
              {field('Typ stránky', (
                <select value={pageType} onChange={(e) => setPageType(e.target.value)}>
                  <option value="product">Produkt</option>
                  <option value="category">Kategorie</option>
                  <option value="homepage">Homepage</option>
                </select>
              ))}
              {field('Brand styl', (
                <select value={theme.brand} onChange={(e) => setTheme(defaultTheme(e.target.value))}>
                  <option value="mimousek">Mimoušek</option>
                  <option value="chrapatko">Chrápátko</option>
                </select>
              ))}
            </div>
            <div className="grid-two">
              {field('Accent barva', <input value={theme.accent} onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))} />)}
              {field('Jemné pozadí', <input value={theme.accentSoft} onChange={(e) => setTheme((t) => ({ ...t, accentSoft: e.target.value }))} />)}
            </div>
            <div className="grid-two">
              {field('Text', <input value={theme.text} onChange={(e) => setTheme((t) => ({ ...t, text: e.target.value }))} />)}
              {field('Radius', <input value={theme.radius} onChange={(e) => setTheme((t) => ({ ...t, radius: e.target.value }))} />)}
            </div>
            <label className="check-inline"><input type="checkbox" checked={includeCss} onChange={(e) => setIncludeCss(e.target.checked)} /> Přibalit exportní CSS</label>
            <div className="grid-two top-gap">
              <button className="btn secondary" onClick={() => resetByTemplate(pageType)}>Načíst šablonu</button>
              <button className="btn secondary" onClick={() => resetByTemplate('product')}>Reset</button>
            </div>
          </div>

          <div className="panel">
            <h3>Přidat blok</h3>
            <div className="type-grid">
              {blockTypes.map((item) => (
                <button key={item.type} className="type-btn" onClick={() => addBlock(item.type)}>{item.label}</button>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Bloky</h3>
            <div className="blocks-list">
              {blocks.map((block, index) => (
                <button key={block.id} className={`block-item ${selectedId === block.id ? 'active' : ''}`} onClick={() => setSelectedId(block.id)}>
                  <div className="block-item-title">#{index + 1} · {block.title}</div>
                  <div className="block-item-type">{block.type}</div>
                  <div className="block-item-actions">
                    <span onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}>↑</span>
                    <span onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}>↓</span>
                    <span onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>Dupl.</span>
                    <span onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>Smazat</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="center-col">
          <div className="panel preview-panel">
            <div className="panel-top-row">
              <h3>{projectName}</h3>
              <div className="muted-text">{blocks.length} bloků</div>
            </div>
            <div className="canvas-preview">
              {blocks.map((block, index) => (
                <div key={block.id} className={`preview-block ${selectedId === block.id ? 'selected' : ''}`} onClick={() => setSelectedId(block.id)}>
                  <div className="preview-meta">{index + 1}. {block.title} · {block.type}</div>
                  <div dangerouslySetInnerHTML={{ __html: renderBlockHtml(block, theme) }} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel export-panel">
            <h3>Export</h3>
            <div className="tabs-note">Tento HTML kód vložíš do Shoptetu do vlastního HTML bloku.</div>
            <textarea className="export-area" readOnly value={generatedHtml} />
            <button className="btn full" onClick={copyHtml}>Kopírovat kompletní HTML</button>
          </div>
        </section>

        <aside className="right-col">
          <BlockSettings block={selectedBlock} setBlocks={setBlocks} />
        </aside>
      </main>
    </div>
  );
}
