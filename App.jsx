import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(str) {
  return (str || "blok")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function youtubeEmbed(url) {
  if (!url) return "";
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

function createDefaultTheme(brand = "mimousek") {
  if (brand === "chrapatko") {
    return {
      brand,
      brandName: "Chrápátko",
      accent: "#007599",
      accentSoft: "#e6f6f8",
      text: "#1e293b",
      muted: "#64748b",
      bg: "#ffffff",
      cardBg: "#f8fafc",
      radius: "22px",
      buttonText: "#ffffff",
      headingFont: "inherit",
    };
  }

  return {
    brand,
    brandName: "Mimoušek",
    accent: "#9d7a5f",
    accentSoft: "#f5f0f2",
    text: "#6e513a",
    muted: "#8b6a4d",
    bg: "#ffffff",
    cardBg: "#faf7f8",
    radius: "22px",
    buttonText: "#ffffff",
    headingFont: "inherit",
  };
}

const blockCatalog = [
  { type: "benefitIcons3", label: "Výhody 3 ikony" },
  { type: "benefitIcons4", label: "Výhody 4 ikony" },
  { type: "heroBenefits", label: "Výhody s ikonami" },
  { type: "textImage", label: "Text a obrázek" },
  { type: "text", label: "Text" },
  { type: "image", label: "Obrázek" },
  { type: "gallery", label: "Galerie" },
  { type: "faq", label: "Otázky a odpovědi" },
  { type: "columns", label: "Sloupce" },
  { type: "video", label: "Video" },
  { type: "table", label: "Tabulka" },
  { type: "ctaBanner", label: "CTA banner" },
];

function blockBase(type, title) {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    anchor: slugify(title),
    settings: {
      padding: "medium",
      rounded: true,
      background: "white",
      container: "default",
      border: false,
      shadow: false,
      hiddenOnMobile: false,
      customClass: "",
    },
  };
}

function createBenefitItem(title = "prémiová\nkvalita") {
  return {
    imageUrl: "https://placehold.co/180x180?text=Ikona",
    alt: "Ikona výhody",
    title,
  };
}

function createBlock(type) {
  switch (type) {
    case "benefitIcons3":
      return {
        ...blockBase(type, "Výhody 3 ikony"),
        items: [
          createBenefitItem("prémiová\nkvalita"),
          createBenefitItem("atestované\nmateriály"),
          createBenefitItem("baby\nfriendly"),
        ],
      };

    case "benefitIcons4":
      return {
        ...blockBase(type, "Výhody 4 ikony"),
        items: [
          createBenefitItem("prémiová\nkvalita"),
          createBenefitItem("atestované\nmateriály"),
          createBenefitItem("baby\nfriendly"),
          createBenefitItem("snímatelný\npotah"),
        ],
      };

    case "heroBenefits":
      return {
        ...blockBase(type, "Výhody s ikonami"),
        heading: "Proč si produkt zamilujete",
        subheading: "Přehled hlavních výhod nahoře nad popisem.",
        items: [
          { title: "Česká výroba", text: "Pečlivě šito s důrazem na kvalitu." },
          { title: "Jemné materiály", text: "Příjemné na dotek pro každodenní použití." },
          { title: "Praktické využití", text: "Krása i funkčnost v jednom." },
          { title: "Skvělý dárek", text: "Potěší nastávající i čerstvé rodiče." },
        ],
      };

    case "textImage":
      return {
        ...blockBase(type, "Text a obrázek"),
        heading: "Nadpis bloku",
        text: "Sem napište text produktu, SEO odstavec nebo výhody produktu. Text je možné využít pro produktové popisky i obsah kategorií.",
        imageUrl: "https://placehold.co/900x900?text=Obrázek",
        imageAlt: "Produktová fotografie",
        imagePosition: "right",
        imageRatio: "square",
        buttonText: "Zjistit více",
        buttonLink: "#",
      };

    case "text":
      return {
        ...blockBase(type, "Text"),
        heading: "Textový blok",
        text: "Sem napište delší popis, AI SEO text, produktové informace nebo obsah kategorie.",
      };

    case "image":
      return {
        ...blockBase(type, "Obrázek"),
        imageUrl: "https://placehold.co/1400x800?text=Obrázek",
        imageAlt: "Obrázek",
        caption: "",
      };

    case "gallery":
      return {
        ...blockBase(type, "Galerie"),
        heading: "Galerie produktu",
        images: [
          { url: "https://placehold.co/800x800?text=Foto+1", alt: "Galerie 1" },
          { url: "https://placehold.co/800x800?text=Foto+2", alt: "Galerie 2" },
          { url: "https://placehold.co/800x800?text=Foto+3", alt: "Galerie 3" },
        ],
      };

    case "faq":
      return {
        ...blockBase(type, "Otázky a odpovědi"),
        heading: "Často se ptáte",
        accordion: true,
        items: [
          { q: "Jak se produkt udržuje?", a: "Praní na 30 °C, nebělit, nesušit v sušičce." },
          { q: "Z jakého materiálu je vyroben?", a: "Doplňte vlastní materiálové složení." },
        ],
      };

    case "columns":
      return {
        ...blockBase(type, "Sloupce"),
        heading: "Hlavní přednosti",
        columns: [
          { heading: "Výhoda 1", text: "Popis první výhody produktu." },
          { heading: "Výhoda 2", text: "Popis druhé výhody produktu." },
          { heading: "Výhoda 3", text: "Popis třetí výhody produktu." },
        ],
      };

    case "video":
      return {
        ...blockBase(type, "Video"),
        heading: "Video produktu",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Vložte YouTube video produktu, návodu nebo prezentace.",
      };

    case "table":
      return {
        ...blockBase(type, "Tabulka"),
        heading: "Technické parametry",
        rows: [
          ["Materiál", "100 % bavlna"],
          ["Údržba", "Praní na 30 °C"],
          ["Výroba", "Česká republika"],
        ],
      };

    case "ctaBanner":
      return {
        ...blockBase(type, "CTA banner"),
        eyebrow: "Objevte více",
        heading: "Vyberte si svou oblíbenou variantu",
        text: "Dopřejte sobě nebo svým blízkým pohodlí, kvalitu a krásné zpracování.",
        buttonText: "Nakoupit nyní",
        buttonLink: "#",
      };

    default:
      return blockBase(type, type);
  }
}

function createTemplate(templateName) {
  if (templateName === "product") {
    return [
      createBlock("benefitIcons4"),
      createBlock("textImage"),
      createBlock("columns"),
      createBlock("table"),
      createBlock("video"),
      createBlock("faq"),
      createBlock("ctaBanner"),
    ];
  }

  if (templateName === "category") {
    const a = createBlock("benefitIcons3");
    const b = createBlock("textImage");
    b.heading = "Kategorie plná kvality a pohodlí";
    const c = createBlock("columns");
    c.heading = "Proč nakoupit právě u nás";
    const d = createBlock("gallery");
    const e = createBlock("faq");
    return [a, b, c, d, e, createBlock("ctaBanner")];
  }

  if (templateName === "homepage") {
    const a = createBlock("benefitIcons4");
    const b = createBlock("gallery");
    const c = createBlock("textImage");
    const d = createBlock("ctaBanner");
    d.heading = "Objevte nejoblíbenější kolekce";
    return [a, c, b, d];
  }

  return [createBlock("textImage")];
}

function updateBlock(blocks, id, patch) {
  return blocks.map((block) => (block.id === id ? { ...block, ...patch } : block));
}

function blockSectionStyles(settings, theme) {
  const paddingMap = { small: "16px", medium: "28px", large: "40px" };
  const backgroundMap = {
    white: theme.bg,
    muted: theme.cardBg,
    accentSoft: theme.accentSoft,
    transparent: "transparent",
  };

  return [
    `padding:${paddingMap[settings?.padding || "medium"]};`,
    `border-radius:${settings?.rounded ? theme.radius : "0px"};`,
    `background:${backgroundMap[settings?.background || "white"]};`,
    settings?.border ? "border:1px solid #e2e8f0;" : "border:none;",
    settings?.shadow ? "box-shadow:0 12px 30px rgba(15,23,42,.06);" : "box-shadow:none;",
  ].join("");
}

function blockOuterStyles(settings) {
  const containerMap = {
    default: "max-width:1200px;margin:0 auto;",
    narrow: "max-width:980px;margin:0 auto;",
    full: "max-width:100%;margin:0 auto;",
  };
  return containerMap[settings?.container || "default"];
}

function renderBenefitIconsBlock(block, theme, columns) {
  return `
    <div style="display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:28px;align-items:start;">
      ${(block.items || [])
        .map(
          (item) => `
          <div style="text-align:center;">
            <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.alt)}" style="width:110px;height:110px;object-fit:contain;display:block;margin:0 auto 16px;" />
            <div style="font-size:20px;line-height:1.35;font-weight:800;color:${theme.text};white-space:pre-line;">${escapeHtml(item.title)}</div>
          </div>`
        )
        .join("")}
    </div>
  `;
}

function renderBlockHtml(block, theme) {
  const sectionStyle = blockSectionStyles(block.settings, theme);
  const outerStyle = blockOuterStyles(block.settings);
  const customClass = block.settings?.customClass ? ` ${escapeHtml(block.settings.customClass)}` : "";
  const anchor = block.anchor ? ` id="${escapeHtml(block.anchor)}"` : "";

  const wrap = (inner) => `
<section${anchor} class="eshop-block eshop-block-${escapeHtml(block.type)}${customClass}" style="${outerStyle}">
  <div style="${sectionStyle}">
    ${inner}
  </div>
</section>`;

  if (block.type === "benefitIcons3") return wrap(renderBenefitIconsBlock(block, theme, 3));
  if (block.type === "benefitIcons4") return wrap(renderBenefitIconsBlock(block, theme, 4));

  if (block.type === "heroBenefits") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 10px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      ${block.subheading ? `<p style="margin:0 0 22px;font-size:16px;line-height:1.8;color:${theme.muted};">${escapeHtml(block.subheading)}</p>` : ""}
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;">
        ${(block.items || [])
          .map(
            (item) => `
            <div style="padding:18px;border-radius:${theme.radius};background:${theme.bg};border:1px solid #e2e8f0;">
              <div style="width:42px;height:42px;border-radius:999px;background:${theme.accentSoft};display:flex;align-items:center;justify-content:center;color:${theme.accent};font-weight:700;margin-bottom:12px;">✓</div>
              <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.title)}</h3>
              <p style="margin:0;font-size:15px;line-height:1.7;color:${theme.muted};">${escapeHtml(item.text)}</p>
            </div>`
          )
          .join("")}
      </div>
    `);
  }

  if (block.type === "textImage") {
    const imageStyle =
      block.imageRatio === "portrait"
        ? "aspect-ratio:4/5;"
        : block.imageRatio === "landscape"
          ? "aspect-ratio:16/10;"
          : "aspect-ratio:1/1;";

    const imageCol = `<div style="flex:1;min-width:280px;"><img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt)}" style="width:100%;${imageStyle}height:auto;border-radius:${theme.radius};display:block;object-fit:cover;" /></div>`;
    const textCol = `<div style="flex:1;min-width:280px;"><h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2><div style="font-size:16px;line-height:1.9;color:${theme.text};">${escapeHtml(block.text).replace(/\n/g, "<br />")}</div>${block.buttonText ? `<div style="margin-top:22px;"><a href="${escapeHtml(block.buttonLink || "#")}" style="display:inline-block;background:${theme.accent};color:${theme.buttonText};text-decoration:none;padding:13px 20px;border-radius:16px;font-weight:700;">${escapeHtml(block.buttonText)}</a></div>` : ""}</div>`;

    return wrap(`<div style="display:flex;gap:34px;align-items:center;flex-wrap:wrap;">${block.imagePosition === "left" ? `${imageCol}${textCol}` : `${textCol}${imageCol}`}</div>`);
  }

  if (block.type === "text") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="font-size:16px;line-height:1.9;color:${theme.text};">${escapeHtml(block.text).replace(/\n/g, "<br />")}</div>
    `);
  }

  if (block.type === "image") {
    return wrap(`
      <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt)}" style="width:100%;height:auto;border-radius:${theme.radius};display:block;object-fit:cover;" />
      ${block.caption ? `<p style="margin:12px 0 0;font-size:14px;color:${theme.muted};">${escapeHtml(block.caption)}</p>` : ""}
    `);
  }

  if (block.type === "gallery") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 16px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">
        ${(block.images || [])
          .map(
            (img) => `
            <div><img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" style="width:100%;aspect-ratio:1/1;border-radius:${theme.radius};display:block;object-fit:cover;" /></div>`
          )
          .join("")}
      </div>
    `);
  }

  if (block.type === "faq") {
    const items = (block.items || [])
      .map((item) =>
        block.accordion
          ? `<details style="border-top:1px solid #e2e8f0;padding:16px 0;"><summary style="cursor:pointer;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</summary><p style="margin:10px 0 0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p></details>`
          : `<div style="border-top:1px solid #e2e8f0;padding:16px 0;"><h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</h3><p style="margin:0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p></div>`
      )
      .join("");

    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      ${items}
    `);
  }

  if (block.type === "columns") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">
        ${(block.columns || [])
          .map(
            (col) => `
            <div style="padding:20px;border:1px solid #e2e8f0;border-radius:${theme.radius};background:${theme.bg};">
              <h3 style="margin:0 0 10px;font-size:20px;font-weight:700;color:${theme.text};">${escapeHtml(col.heading)}</h3>
              <p style="margin:0;font-size:15px;line-height:1.75;color:${theme.muted};">${escapeHtml(col.text)}</p>
            </div>`
          )
          .join("")}
      </div>
    `);
  }

  if (block.type === "video") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      ${block.description ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(block.description)}</p>` : ""}
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:${theme.radius};">
        <iframe src="${escapeHtml(youtubeEmbed(block.youtubeUrl))}" title="YouTube video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
      </div>
    `);
  }

  if (block.type === "table") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tbody>
            ${(block.rows || [])
              .map(
                (row) => `<tr><td style="padding:14px;border-bottom:1px solid #e2e8f0;font-weight:700;background:${theme.cardBg};color:${theme.text};">${escapeHtml(row[0] || "")}</td><td style="padding:14px;border-bottom:1px solid #e2e8f0;color:${theme.text};">${escapeHtml(row[1] || "")}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  }

  if (block.type === "ctaBanner") {
    return wrap(`
      <div style="text-align:center;">
        ${block.eyebrow ? `<div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${theme.accentSoft};color:${theme.accent};font-weight:700;font-size:13px;margin-bottom:14px;">${escapeHtml(block.eyebrow)}</div>` : ""}
        ${block.heading ? `<h2 style="font-size:38px;line-height:1.15;margin:0 0 12px;font-weight:800;color:${theme.text};">${escapeHtml(block.heading)}</h2>` : ""}
        ${block.text ? `<p style="margin:0 auto 20px;max-width:760px;font-size:16px;line-height:1.85;color:${theme.text};">${escapeHtml(block.text)}</p>` : ""}
        ${block.buttonText ? `<a href="${escapeHtml(block.buttonLink || "#")}" style="display:inline-block;background:${theme.accent};color:${theme.buttonText};text-decoration:none;padding:14px 22px;border-radius:16px;font-weight:700;">${escapeHtml(block.buttonText)}</a>` : ""}
      </div>
    `);
  }

  return "";
}

function buildExportCss() {
  return `<style>
.eshop-export *{box-sizing:border-box;}
.eshop-export img{max-width:100%;}
.eshop-export .eshop-block{margin:0 auto 24px;}
@media (max-width: 768px){
  .eshop-export .eshop-block [style*="display:flex"]{display:block !important;}
  .eshop-export .eshop-block [style*="grid-template-columns:repeat(4"]{grid-template-columns:1fr 1fr !important;}
  .eshop-export .eshop-block [style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr !important;}
}
</style>`;
}

function buildExportHtml(blocks, theme, includeCss = true) {
  const css = includeCss ? buildExportCss(theme) : "";
  return `${css}\n<div class="eshop-export">\n${blocks.map((block) => renderBlockHtml(block, theme)).join("\n\n")}\n</div>`;
}

function CatalogButton({ item, onAdd }) {
  return (
    <button onClick={() => onAdd(item.type)} className="builder-catalog-btn">
      {item.label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="builder-field">
      <label className="builder-label">{label}</label>
      {children}
    </div>
  );
}

function BlockSettings({ block, setBlocks, theme }) {
  const patchBlock = (patch) => setBlocks((prev) => updateBlock(prev, block.id, patch));
  const patchSettings = (patch) => patchBlock({ settings: { ...block.settings, ...patch } });

  if (!block) {
    return <div className="builder-empty">Klikni na blok v náhledu a vpravo se zobrazí jeho nastavení.</div>;
  }

  return (
    <div className="builder-settings">
      <div className="builder-panel">
        <div className="builder-panel-title">Nastavení bloku</div>

        <Field label="Název bloku">
          <Input value={block.title || ""} onChange={(e) => patchBlock({ title: e.target.value, anchor: slugify(e.target.value) })} />
        </Field>

        <Field label="Anchor ID">
          <Input value={block.anchor || ""} onChange={(e) => patchBlock({ anchor: e.target.value })} />
        </Field>

        <div className="builder-grid-2">
          <Field label="Padding">
            <Select value={block.settings?.padding || "medium"} onValueChange={(value) => patchSettings({ padding: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Malý</SelectItem>
                <SelectItem value="medium">Střední</SelectItem>
                <SelectItem value="large">Velký</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Pozadí">
            <Select value={block.settings?.background || "white"} onValueChange={(value) => patchSettings({ background: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="white">Bílé</SelectItem>
                <SelectItem value="muted">Jemně šedé</SelectItem>
                <SelectItem value="accentSoft">Brand pozadí</SelectItem>
                <SelectItem value="transparent">Transparentní</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="builder-grid-2">
          <Field label="Šířka kontejneru">
            <Select value={block.settings?.container || "default"} onValueChange={(value) => patchSettings({ container: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Úzká</SelectItem>
                <SelectItem value="default">Standard</SelectItem>
                <SelectItem value="full">Plná šířka</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Vlastní CSS třída">
            <Input value={block.settings?.customClass || ""} onChange={(e) => patchSettings({ customClass: e.target.value })} />
          </Field>
        </div>

        <div className="builder-toggle-grid">
          <div className="builder-toggle-row"><span>Zaoblené rohy</span><Switch checked={!!block.settings?.rounded} onCheckedChange={(val) => patchSettings({ rounded: val })} /></div>
          <div className="builder-toggle-row"><span>Rámeček</span><Switch checked={!!block.settings?.border} onCheckedChange={(val) => patchSettings({ border: val })} /></div>
          <div className="builder-toggle-row"><span>Stín</span><Switch checked={!!block.settings?.shadow} onCheckedChange={(val) => patchSettings({ shadow: val })} /></div>
          <div className="builder-toggle-row"><span>Skrýt na mobilu</span><Switch checked={!!block.settings?.hiddenOnMobile} onCheckedChange={(val) => patchSettings({ hiddenOnMobile: val })} /></div>
        </div>
      </div>

      <div className="builder-panel">
        <div className="builder-panel-title">Obsah</div>

        {(block.type === "benefitIcons3" || block.type === "benefitIcons4") && (
          <>
            {(block.items || []).map((item, index) => (
              <div key={index} className="builder-subpanel">
                <Field label={`URL obrázku ${index + 1}`}>
                  <Input
                    value={item.imageUrl || ""}
                    onChange={(e) => {
                      const next = [...block.items];
                      next[index] = { ...next[index], imageUrl: e.target.value };
                      patchBlock({ items: next });
                    }}
                  />
                </Field>

                <Field label={`ALT obrázku ${index + 1}`}>
                  <Input
                    value={item.alt || ""}
                    onChange={(e) => {
                      const next = [...block.items];
                      next[index] = { ...next[index], alt: e.target.value };
                      patchBlock({ items: next });
                    }}
                  />
                </Field>

                <Field label={`Text výhody ${index + 1}`}>
                  <Textarea
                    value={item.title || ""}
                    onChange={(e) => {
                      const next = [...block.items];
                      next[index] = { ...next[index], title: e.target.value };
                      patchBlock({ items: next });
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {block.type === "textImage" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>

            <Field label="Text">
              <Textarea value={block.text || ""} onChange={(e) => patchBlock({ text: e.target.value })} />
            </Field>

            <Field label="URL obrázku">
              <Input value={block.imageUrl || ""} onChange={(e) => patchBlock({ imageUrl: e.target.value })} />
            </Field>

            <Field label="ALT obrázku">
              <Input value={block.imageAlt || ""} onChange={(e) => patchBlock({ imageAlt: e.target.value })} />
            </Field>

            <div className="builder-grid-2">
              <Field label="Pozice obrázku">
                <Select value={block.imagePosition || "right"} onValueChange={(value) => patchBlock({ imagePosition: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Vlevo</SelectItem>
                    <SelectItem value="right">Vpravo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Poměr obrázku">
                <Select value={block.imageRatio || "square"} onValueChange={(value) => patchBlock({ imageRatio: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Čtverec</SelectItem>
                    <SelectItem value="portrait">Na výšku</SelectItem>
                    <SelectItem value="landscape">Na šířku</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="builder-grid-2">
              <Field label="Text tlačítka">
                <Input value={block.buttonText || ""} onChange={(e) => patchBlock({ buttonText: e.target.value })} />
              </Field>
              <Field label="Odkaz tlačítka">
                <Input value={block.buttonLink || ""} onChange={(e) => patchBlock({ buttonLink: e.target.value })} />
              </Field>
            </div>
          </>
        )}

        {block.type === "text" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>
            <Field label="Text">
              <Textarea value={block.text || ""} onChange={(e) => patchBlock({ text: e.target.value })} />
            </Field>
          </>
        )}

        {block.type === "image" && (
          <>
            <Field label="URL obrázku">
              <Input value={block.imageUrl || ""} onChange={(e) => patchBlock({ imageUrl: e.target.value })} />
            </Field>
            <Field label="ALT obrázku">
              <Input value={block.imageAlt || ""} onChange={(e) => patchBlock({ imageAlt: e.target.value })} />
            </Field>
            <Field label="Popisek">
              <Input value={block.caption || ""} onChange={(e) => patchBlock({ caption: e.target.value })} />
            </Field>
          </>
        )}

        {block.type === "gallery" && (
          <>
            <Field label="Nadpis galerie">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>

            {(block.images || []).map((img, index) => (
              <div key={index} className="builder-subpanel">
                <Field label="URL">
                  <Input
                    value={img.url}
                    onChange={(e) => {
                      const next = [...block.images];
                      next[index] = { ...next[index], url: e.target.value };
                      patchBlock({ images: next });
                    }}
                  />
                </Field>
                <Field label="ALT">
                  <Input
                    value={img.alt}
                    onChange={(e) => {
                      const next = [...block.images];
                      next[index] = { ...next[index], alt: e.target.value };
                      patchBlock({ images: next });
                    }}
                  />
                </Field>
              </div>
            ))}

            <Button variant="outline" onClick={() => patchBlock({ images: [...(block.images || []), { url: "", alt: "" }] })}>
              + Přidat obrázek
            </Button>
          </>
        )}

        {block.type === "faq" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>

            <div className="builder-toggle-row">
              <span>Rozbalovací FAQ</span>
              <Switch checked={!!block.accordion} onCheckedChange={(val) => patchBlock({ accordion: val })} />
            </div>

            {(block.items || []).map((item, index) => (
              <div key={index} className="builder-subpanel">
                <Field label="Otázka">
                  <Input
                    value={item.q}
                    onChange={(e) => {
                      const next = [...block.items];
                      next[index] = { ...next[index], q: e.target.value };
                      patchBlock({ items: next });
                    }}
                  />
                </Field>
                <Field label="Odpověď">
                  <Textarea
                    value={item.a}
                    onChange={(e) => {
                      const next = [...block.items];
                      next[index] = { ...next[index], a: e.target.value };
                      patchBlock({ items: next });
                    }}
                  />
                </Field>
              </div>
            ))}

            <Button variant="outline" onClick={() => patchBlock({ items: [...(block.items || []), { q: "", a: "" }] })}>
              + Přidat otázku
            </Button>
          </>
        )}

        {block.type === "columns" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>

            {(block.columns || []).map((col, index) => (
              <div key={index} className="builder-subpanel">
                <Field label="Nadpis sloupce">
                  <Input
                    value={col.heading}
                    onChange={(e) => {
                      const next = [...block.columns];
                      next[index] = { ...next[index], heading: e.target.value };
                      patchBlock({ columns: next });
                    }}
                  />
                </Field>
                <Field label="Text">
                  <Textarea
                    value={col.text}
                    onChange={(e) => {
                      const next = [...block.columns];
                      next[index] = { ...next[index], text: e.target.value };
                      patchBlock({ columns: next });
                    }}
                  />
                </Field>
              </div>
            ))}

            <Button variant="outline" onClick={() => patchBlock({ columns: [...(block.columns || []), { heading: "", text: "" }] })}>
              + Přidat sloupec
            </Button>
          </>
        )}

        {block.type === "video" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>
            <Field label="YouTube URL">
              <Input value={block.youtubeUrl || ""} onChange={(e) => patchBlock({ youtubeUrl: e.target.value })} />
            </Field>
            <Field label="Popis">
              <Textarea value={block.description || ""} onChange={(e) => patchBlock({ description: e.target.value })} />
            </Field>
          </>
        )}

        {block.type === "table" && (
          <>
            <Field label="Nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>

            {(block.rows || []).map((row, index) => (
              <div key={index} className="builder-grid-2">
                <Input
                  value={row[0]}
                  onChange={(e) => {
                    const next = [...block.rows];
                    next[index] = [e.target.value, next[index][1]];
                    patchBlock({ rows: next });
                  }}
                  placeholder="Název parametru"
                />
                <Input
                  value={row[1]}
                  onChange={(e) => {
                    const next = [...block.rows];
                    next[index] = [next[index][0], e.target.value];
                    patchBlock({ rows: next });
                  }}
                  placeholder="Hodnota"
                />
              </div>
            ))}

            <Button variant="outline" onClick={() => patchBlock({ rows: [...(block.rows || []), ["", ""]] })}>
              + Přidat řádek
            </Button>
          </>
        )}

        {block.type === "ctaBanner" && (
          <>
            <Field label="Malý titulek">
              <Input value={block.eyebrow || ""} onChange={(e) => patchBlock({ eyebrow: e.target.value })} />
            </Field>
            <Field label="Hlavní nadpis">
              <Input value={block.heading || ""} onChange={(e) => patchBlock({ heading: e.target.value })} />
            </Field>
            <Field label="Text">
              <Textarea value={block.text || ""} onChange={(e) => patchBlock({ text: e.target.value })} />
            </Field>
            <div className="builder-grid-2">
              <Field label="Text tlačítka">
                <Input value={block.buttonText || ""} onChange={(e) => patchBlock({ buttonText: e.target.value })} />
              </Field>
              <Field label="Odkaz tlačítka">
                <Input value={block.buttonLink || ""} onChange={(e) => patchBlock({ buttonLink: e.target.value })} />
              </Field>
            </div>
          </>
        )}
      </div>

      <div className="builder-panel builder-brand-panel">
        <div className="builder-panel-title">Aktivní brand styl</div>
        <div>Barva značky: <span style={{ color: theme.accent }}>{theme.accent}</span></div>
        <div>Značka: {theme.brandName}</div>
      </div>
    </div>
  );
}

export default function EshopTextBuilderPro() {
  const [projectName, setProjectName] = useState("produkt - CZ");
  const [pageType, setPageType] = useState("product");
  const [theme, setTheme] = useState(createDefaultTheme("mimousek"));
  const [includeCss, setIncludeCss] = useState(true);
  const [blocks, setBlocks] = useState(createTemplate("product"));
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

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

  const deleteBlock = (id) => {
    const target = blocks.find((block) => block.id === id);
    const ok = window.confirm(`Opravdu smazat blok „${target?.title || "bez názvu"}“?`);
    if (!ok) return;
    const next = blocks.filter((block) => block.id !== id);
    setBlocks(next);
    if (selectedId === id) setSelectedId(next[0]?.id || null);
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setBlocks(next);
  };

  const duplicateBlock = (id) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const original = blocks[index];
    const copy = {
      ...structuredClone(original),
      id: crypto.randomUUID(),
      title: `${original.title} kopie`,
      anchor: slugify(`${original.title}-kopie`),
    };
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    setBlocks(next);
  };

  const moveBlockToIndex = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setBlocks((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((b) => b.id === fromId);
      const toIndex = next.findIndex((b) => b.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (id) => setDraggedId(id);
  const handleDragEnd = () => setDraggedId(null);
  const handleDropOnBlock = (targetId) => {
    moveBlockToIndex(draggedId, targetId);
    setDraggedId(null);
  };

  const copyToClipboard = async (value = generatedHtml) => {
    try {
      await navigator.clipboard.writeText(value);
      alert("Hotovo, obsah byl zkopírován.");
    } catch {
      alert("Kopírování se nepovedlo.");
    }
  };

  const saveProject = () => {
    const payload = { projectName, pageType, theme, includeCss, blocks };
    localStorage.setItem("eshop-builder-project", JSON.stringify(payload));
    alert("Projekt byl uložen do prohlížeče.");
  };

  const loadProject = () => {
    const raw = localStorage.getItem("eshop-builder-project");
    if (!raw) return alert("V prohlížeči není uložen žádný projekt.");
    try {
      const payload = JSON.parse(raw);
      setProjectName(payload.projectName || "projekt");
      setPageType(payload.pageType || "product");
      setTheme(payload.theme || createDefaultTheme("mimousek"));
      setIncludeCss(typeof payload.includeCss === "boolean" ? payload.includeCss : true);
      setBlocks(payload.blocks || []);
      setSelectedId(payload.blocks?.[0]?.id || null);
    } catch {
      alert("Projekt se nepodařilo načíst.");
    }
  };

  const resetProject = () => {
    setBlocks(createTemplate(pageType));
    setSelectedId(null);
  };

  const applyTemplate = (templateName) => {
    setPageType(templateName);
    const newBlocks = createTemplate(templateName);
    setBlocks(newBlocks);
    setSelectedId(newBlocks[0]?.id || null);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ projectName, pageType, theme, includeCss, blocks }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(projectName || "projekt")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="builder-app">
      <div className="builder-shell">
        <div className="builder-hero">
          <div>
            <div className="builder-hero-badge">Profesionální builder obsahových bloků</div>
            <h1>Pomocník pro kódování textů a bloků na e-shop</h1>
            <p>
              Profesionální rozhraní pro produktové a kategoriové popisky. Vkládáš texty, obrázky, galerie, FAQ, tabulky,
              CTA bannery i YouTube videa. Na konci dostaneš hotové HTML pro Shoptet.
            </p>
          </div>

          <div className="builder-top-actions">
            <Button variant="secondary" onClick={saveProject}>💾 Uložit</Button>
            <Button variant="secondary" onClick={loadProject}>◫ Načíst</Button>
            <Button variant="secondary" onClick={exportJson}>⬇ JSON</Button>
            <Button onClick={() => copyToClipboard()}>⧉ Kopírovat HTML</Button>
          </div>
        </div>

        <div className="builder-layout">
          <div className="builder-left">
            <div className="builder-panel">
              <div className="builder-panel-title">Projekt</div>

              <Field label="Název projektu">
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </Field>

              <div className="builder-grid-2">
                <Field label="Typ stránky">
                  <Select value={pageType} onValueChange={(value) => setPageType(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produkt</SelectItem>
                      <SelectItem value="category">Kategorie</SelectItem>
                      <SelectItem value="homepage">Homepage</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Brand styl">
                  <Select value={theme.brand} onValueChange={(value) => setTheme(createDefaultTheme(value))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mimousek">Mimoušek</SelectItem>
                      <SelectItem value="chrapatko">Chrápátko</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="builder-grid-2">
                <Field label="Accent barva">
                  <Input value={theme.accent} onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))} />
                </Field>
                <Field label="Jemné pozadí">
                  <Input value={theme.accentSoft} onChange={(e) => setTheme((t) => ({ ...t, accentSoft: e.target.value }))} />
                </Field>
              </div>

              <div className="builder-grid-2">
                <Field label="Text">
                  <Input value={theme.text} onChange={(e) => setTheme((t) => ({ ...t, text: e.target.value }))} />
                </Field>
                <Field label="Radius">
                  <Input value={theme.radius} onChange={(e) => setTheme((t) => ({ ...t, radius: e.target.value }))} />
                </Field>
              </div>

              <div className="builder-toggle-row">
                <span>Přibalit exportní CSS</span>
                <Switch checked={includeCss} onCheckedChange={setIncludeCss} />
              </div>

              <div className="builder-grid-2">
                <Button variant="outline" onClick={() => applyTemplate(pageType)}>✧ Šablona</Button>
                <Button variant="outline" onClick={resetProject}>↺ Reset</Button>
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel-title">Přidat blok</div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="builder-full-btn">+ Nový blok</Button>
                </DialogTrigger>

                <DialogContent className="builder-dialog">
                  <DialogHeader>
                    <DialogTitle>Obsahové bloky</DialogTitle>
                  </DialogHeader>

                  <div className="builder-catalog-grid">
                    {blockCatalog.map((item) => (
                      <CatalogButton key={item.type} item={item} onAdd={addBlock} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="builder-panel">
              <div className="builder-panel-title">Bloky</div>

              <div className="builder-block-list">
                {blocks.map((block, index) => (
                  <button
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnBlock(block.id)}
                    onClick={() => setSelectedId(block.id)}
                    className={`builder-block-item ${selectedId === block.id ? "is-active" : ""} ${draggedId === block.id ? "is-dragging" : ""}`}
                  >
                    <div className="builder-block-item-head">
                      <div>
                        <div className="builder-block-item-title">{block.title || block.type}</div>
                        <div className="builder-block-item-meta">#{index + 1} · {block.type}</div>
                      </div>
                    </div>

                    <div className="builder-block-actions">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}>↑</Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}>↓</Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>Dupl.</Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>🗑</Button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="builder-center">
            <div className="builder-panel">
              <div className="builder-preview-head">
                <div className="builder-panel-title">{projectName}</div>
                <div className="builder-muted">{blocks.length} bloků v projektu</div>
              </div>

              <div className="builder-canvas">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnBlock(block.id)}
                    onClick={() => setSelectedId(block.id)}
                    className={`builder-preview-card ${selectedId === block.id ? "is-active" : ""} ${draggedId === block.id ? "is-dragging" : ""}`}
                  >
                    <div className="builder-preview-card-head">
                      <div className="builder-preview-meta">
                        <span className="builder-chip">{blockCatalog.find((i) => i.type === block.type)?.label || block.type}</span>
                        <span>#{index + 1}</span>
                        <span>{block.title}</span>
                      </div>

                      <div className="builder-block-actions">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}>↑</Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}>↓</Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>Dupl.</Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>Smazat</Button>
                      </div>
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: renderBlockHtml(block, theme) }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="builder-panel">
              <div className="builder-panel-title">Export</div>

              <Tabs defaultValue="preview">
                <TabsList className="builder-tabs-list">
                  <TabsTrigger value="preview">◉ Náhled</TabsTrigger>
                  <TabsTrigger value="html"></> HTML</TabsTrigger>
                  <TabsTrigger value="shoptet">✧ Shoptet</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="builder-tab-content">
                  <div className="builder-export-preview" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                </TabsContent>

                <TabsContent value="html" className="builder-tab-content">
                  <Textarea className="builder-code" readOnly value={generatedHtml} />
                  <Button className="builder-full-btn" onClick={() => copyToClipboard(generatedHtml)}>⧉ Kopírovat kompletní HTML</Button>
                </TabsContent>

                <TabsContent value="shoptet" className="builder-tab-content">
                  <div className="builder-note">
                    Tento export je připravený pro vložení do Shoptet editoru nebo do vlastního HTML bloku.
                  </div>
                  <Textarea className="builder-code" readOnly value={generatedHtml} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="builder-right">
            <BlockSettings block={selectedBlock} setBlocks={setBlocks} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
