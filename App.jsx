import {
  Copy,
  Wand2,
  Trash2,
  Plus,
  Eye,
  Code2,
  Type,
  Image as ImageIcon,
  HelpCircle,
  Columns2,
  Video,
  Table,
  GripVertical,
  Settings2,
  GalleryHorizontal,
  BadgeCheck,
  Megaphone,
  LayoutTemplate,
  Download,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className = "", children }) {
  return <div className={cn("bg-white", className)}>{children}</div>;
}

function CardHeader({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardTitle({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({
  className = "",
  children,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? "span" : "button";

  const base =
    "inline-flex items-center justify-center border text-sm font-medium transition disabled:opacity-50";
  const variants = {
    default: "bg-slate-900 text-white border-slate-900 hover:opacity-90",
    secondary: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
    outline: "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-900 border-transparent hover:bg-slate-100",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1.5 text-xs",
    icon: "h-10 w-10 p-0",
  };

  return (
    <Comp
      className={cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400",
        className
      )}
      {...props}
    />
  );
}

function Label({ className = "", children, ...props }) {
  return (
    <label className={cn("text-sm font-medium text-slate-700", className)} {...props}>
      {children}
    </label>
  );
}

function Badge({ className = "", variant = "default", children }) {
  const styles =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700"
      : "border border-transparent bg-slate-100 text-slate-700";
  return <span className={cn("inline-flex items-center px-2 py-1 text-xs font-medium", styles, className)}>{children}</span>;
}

function ScrollArea({ className = "", children }) {
  return <div className={cn("overflow-auto", className)}>{children}</div>;
}

function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition",
        checked ? "bg-slate-900" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
          checked ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

function Select({ value, onValueChange, children }) {
  const options = React.Children.toArray(children)
    .flatMap((child) => (child?.props?.children ? React.Children.toArray(child.props.children) : []))
    .filter(Boolean)
    .map((item) => ({
      value: item.props.value,
      label: item.props.children,
    }));

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SelectTrigger({ children }) {
  return <>{children}</>;
}
function SelectValue() {
  return null;
}
function SelectContent({ children }) {
  return <>{children}</>;
}
function SelectItem() {
  return null;
}

function Dialog({ children }) {
  return <>{children}</>;
}
function DialogTrigger({ children }) {
  return <>{children}</>;
}
function DialogContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
function DialogHeader({ children }) {
  return <div>{children}</div>;
}
function DialogTitle({ children }) {
  return <div className="text-lg font-semibold">{children}</div>;
}

function Tabs({ children }) {
  return <div>{children}</div>;
}
function TabsList({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
function TabsTrigger({ className = "", children }) {
  return <button type="button" className={cn("rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm", className)}>{children}</button>;
}
function TabsContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
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
  { type: "benefitIcons3", label: "Výhody 3 ikony", icon: BadgeCheck },
  { type: "benefitIcons4", label: "Výhody 4 ikony", icon: BadgeCheck },
  { type: "heroBenefits", label: "Výhody s ikonami", icon: BadgeCheck },
  { type: "textImage", label: "Text a obrázek", icon: Type },
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Obrázek", icon: ImageIcon },
  { type: "gallery", label: "Galerie", icon: GalleryHorizontal },
  { type: "faq", label: "Otázky a odpovědi", icon: HelpCircle },
  { type: "columns", label: "Sloupce", icon: Columns2 },
  { type: "video", label: "Video", icon: Video },
  { type: "table", label: "Tabulka", icon: Table },
  { type: "ctaBanner", label: "CTA banner", icon: Megaphone },
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
        imageUrl: "https://placehold.co/900x900?text=Obr%C3%A1zek",
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
        text: "Sem napište delší popis, AI SEO text, produktové informace nebo obsah kategorie. Můžete využít i pro odstavce s klíčovými slovy.",
      };

    case "image":
      return {
        ...blockBase(type, "Obrázek"),
        imageUrl: "https://placehold.co/1400x800?text=Obr%C3%A1zek",
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

  if (block.type === "benefitIcons3") {
    return wrap(renderBenefitIconsBlock(block, theme, 3));
  }

  if (block.type === "benefitIcons4") {
    return wrap(renderBenefitIconsBlock(block, theme, 4));
  }

  if (block.type === "heroBenefits") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 10px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
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

    const imageCol = `
      <div style="flex:1;min-width:280px;">
        <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt)}" style="width:100%;${imageStyle}height:auto;border-radius:${theme.radius};display:block;object-fit:cover;" />
      </div>`;

    const textCol = `
      <div style="flex:1;min-width:280px;">
        <h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>
        <div style="font-size:16px;line-height:1.9;color:${theme.text};">${escapeHtml(block.text).replace(/\n/g, "<br />")}</div>
        ${block.buttonText ? `<div style="margin-top:22px;"><a href="${escapeHtml(block.buttonLink || "#")}" style="display:inline-block;background:${theme.accent};color:${theme.buttonText};text-decoration:none;padding:13px 20px;border-radius:16px;font-weight:700;">${escapeHtml(block.buttonText)}</a></div>` : ""}
      </div>`;

    return wrap(`
      <div style="display:flex;gap:34px;align-items:center;flex-wrap:wrap;">
        ${block.imagePosition === "left" ? `${imageCol}${textCol}` : `${textCol}${imageCol}`}
      </div>
    `);
  }

  if (block.type === "text") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
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
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 16px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">
        ${(block.images || [])
          .map(
            (img) => `
            <div>
              <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt)}" style="width:100%;aspect-ratio:1/1;border-radius:${theme.radius};display:block;object-fit:cover;" />
            </div>`
          )
          .join("")}
      </div>
    `);
  }

  if (block.type === "faq") {
    const items = (block.items || [])
      .map((item) => {
        if (block.accordion) {
          return `
          <details style="border-top:1px solid #e2e8f0;padding:16px 0;">
            <summary style="cursor:pointer;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</summary>
            <p style="margin:10px 0 0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p>
          </details>`;
        }

        return `
        <div style="border-top:1px solid #e2e8f0;padding:16px 0;">
          <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${theme.text};">${escapeHtml(item.q)}</h3>
          <p style="margin:0;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(item.a)}</p>
        </div>`;
      })
      .join("");

    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
      ${items}
    `);
  }

  if (block.type === "columns") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 18px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
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
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
      ${block.description ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:${theme.text};">${escapeHtml(block.description)}</p>` : ""}
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:${theme.radius};">
        <iframe src="${escapeHtml(youtubeEmbed(block.youtubeUrl))}" title="YouTube video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
      </div>
    `);
  }

  if (block.type === "table") {
    return wrap(`
      ${block.heading ? `<h2 style="font-size:34px;line-height:1.2;margin:0 0 14px;font-weight:700;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tbody>
            ${(block.rows || [])
              .map(
                (row) => `
                <tr>
                  <td style="padding:14px;border-bottom:1px solid #e2e8f0;font-weight:700;background:${theme.cardBg};color:${theme.text};">${escapeHtml(row[0] || "")}</td>
                  <td style="padding:14px;border-bottom:1px solid #e2e8f0;color:${theme.text};">${escapeHtml(row[1] || "")}</td>
                </tr>`
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
        ${block.heading ? `<h2 style="font-size:38px;line-height:1.15;margin:0 0 12px;font-weight:800;color:${theme.text};font-family:${theme.headingFont};">${escapeHtml(block.heading)}</h2>` : ""}
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
  const Icon = item.icon;
  return (
    <button
      onClick={() => onAdd(item.type)}
      className="flex min-h-[92px] items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm font-semibold transition hover:border-slate-300 hover:shadow-sm"
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function BlockSettings({ block, setBlocks, theme }) {
  const patchBlock = (patch) => setBlocks((prev) => updateBlock(prev, block.id, patch));
  const patchSettings = (patch) => patchBlock({ settings: { ...block.settings, ...patch } });

  if (!block) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500">
        Klikni na blok v náhledu a vpravo se zobrazí jeho nastavení.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 pr-1">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5" /> Nastavení bloku
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Název bloku">
            <Input
              value={block.title || ""}
              onChange={(e) => patchBlock({ title: e.target.value, anchor: slugify(e.target.value) })}
            />
          </Field>

          <Field label="Anchor ID">
            <Input
              value={block.anchor || ""}
              onChange={(e) => patchBlock({ anchor: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Padding">
              <Select
                value={block.settings?.padding || "medium"}
                onValueChange={(value) => patchSettings({ padding: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Malý</SelectItem>
                  <SelectItem value="medium">Střední</SelectItem>
                  <SelectItem value="large">Velký</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Pozadí">
              <Select
                value={block.settings?.background || "white"}
                onValueChange={(value) => patchSettings({ background: value })}
              >
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Šířka kontejneru">
              <Select
                value={block.settings?.container || "default"}
                onValueChange={(value) => patchSettings({ container: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Úzká</SelectItem>
                  <SelectItem value="default">Standard</SelectItem>
                  <SelectItem value="full">Plná šířka</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Vlastní CSS třída">
              <Input
                value={block.settings?.customClass || ""}
                onChange={(e) => patchSettings({ customClass: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between rounded-2xl border p-3">
              <span>Zaoblené rohy</span>
              <Switch
                checked={!!block.settings?.rounded}
                onCheckedChange={(val) => patchSettings({ rounded: val })}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border p-3">
              <span>Rámeček</span>
              <Switch
                checked={!!block.settings?.border}
                onCheckedChange={(val) => patchSettings({ border: val })}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border p-3">
              <span>Stín</span>
              <Switch
                checked={!!block.settings?.shadow}
                onCheckedChange={(val) => patchSettings({ shadow: val })}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border p-3">
              <span>Skrýt na mobilu</span>
              <Switch
                checked={!!block.settings?.hiddenOnMobile}
                onCheckedChange={(val) => patchSettings({ hiddenOnMobile: val })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Obsah</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(block.type === "benefitIcons3" || block.type === "benefitIcons4") && (
            <>
              {(block.items || []).map((item, index) => (
                <div key={index} className="rounded-2xl border p-4 space-y-3">
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

          {block.type === "heroBenefits" && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              <Field label="Podnadpis">
                <Textarea
                  value={block.subheading || ""}
                  onChange={(e) => patchBlock({ subheading: e.target.value })}
                />
              </Field>

              {(block.items || []).map((item, index) => (
                <div key={index} className="rounded-2xl border p-4 space-y-3">
                  <Field label="Titulek">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const next = [...block.items];
                        next[index] = { ...next[index], title: e.target.value };
                        patchBlock({ items: next });
                      }}
                    />
                  </Field>

                  <Field label="Text">
                    <Textarea
                      value={item.text}
                      onChange={(e) => {
                        const next = [...block.items];
                        next[index] = { ...next[index], text: e.target.value };
                        patchBlock({ items: next });
                      }}
                    />
                  </Field>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => patchBlock({ items: [...(block.items || []), { title: "", text: "" }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Přidat výhodu
              </Button>
            </>
          )}

          {(block.type === "textImage" || block.type === "text") && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              <Field label="Text">
                <Textarea
                  className="min-h-[180px]"
                  value={block.text || ""}
                  onChange={(e) => patchBlock({ text: e.target.value })}
                />
              </Field>
            </>
          )}

          {block.type === "textImage" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="URL obrázku">
                  <Input
                    value={block.imageUrl || ""}
                    onChange={(e) => patchBlock({ imageUrl: e.target.value })}
                  />
                </Field>

                <Field label="Alt obrázku">
                  <Input
                    value={block.imageAlt || ""}
                    onChange={(e) => patchBlock({ imageAlt: e.target.value })}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Pozice obrázku">
                  <Select
                    value={block.imagePosition || "right"}
                    onValueChange={(value) => patchBlock({ imagePosition: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Vlevo</SelectItem>
                      <SelectItem value="right">Vpravo</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Poměr obrázku">
                  <Select
                    value={block.imageRatio || "square"}
                    onValueChange={(value) => patchBlock({ imageRatio: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Čtverec</SelectItem>
                      <SelectItem value="portrait">Na výšku</SelectItem>
                      <SelectItem value="landscape">Na šířku</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Text tlačítka">
                  <Input
                    value={block.buttonText || ""}
                    onChange={(e) => patchBlock({ buttonText: e.target.value })}
                  />
                </Field>
              </div>

              <Field label="Odkaz tlačítka">
                <Input
                  value={block.buttonLink || ""}
                  onChange={(e) => patchBlock({ buttonLink: e.target.value })}
                />
              </Field>
            </>
          )}

          {block.type === "image" && (
            <>
              <Field label="URL obrázku">
                <Input
                  value={block.imageUrl || ""}
                  onChange={(e) => patchBlock({ imageUrl: e.target.value })}
                />
              </Field>

              <Field label="Alt obrázku">
                <Input
                  value={block.imageAlt || ""}
                  onChange={(e) => patchBlock({ imageAlt: e.target.value })}
                />
              </Field>

              <Field label="Popisek">
                <Input
                  value={block.caption || ""}
                  onChange={(e) => patchBlock({ caption: e.target.value })}
                />
              </Field>
            </>
          )}

          {block.type === "gallery" && (
            <>
              <Field label="Nadpis galerie">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              {(block.images || []).map((img, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 rounded-2xl border p-4">
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

                  <Field label="Alt">
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

              <Button
                variant="outline"
                onClick={() => patchBlock({ images: [...(block.images || []), { url: "", alt: "" }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Přidat obrázek
              </Button>
            </>
          )}

          {block.type === "video" && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              <Field label="YouTube URL">
                <Input
                  value={block.youtubeUrl || ""}
                  onChange={(e) => patchBlock({ youtubeUrl: e.target.value })}
                />
              </Field>

              <Field label="Popis">
                <Textarea
                  value={block.description || ""}
                  onChange={(e) => patchBlock({ description: e.target.value })}
                />
              </Field>
            </>
          )}

          {block.type === "faq" && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              <div className="flex items-center justify-between rounded-2xl border p-3 text-sm">
                <span>Rozbalovací FAQ</span>
                <Switch
                  checked={!!block.accordion}
                  onCheckedChange={(val) => patchBlock({ accordion: val })}
                />
              </div>

              {(block.items || []).map((item, index) => (
                <div key={index} className="rounded-2xl border p-4 space-y-3">
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

              <Button
                variant="outline"
                onClick={() => patchBlock({ items: [...(block.items || []), { q: "", a: "" }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Přidat otázku
              </Button>
            </>
          )}

          {block.type === "columns" && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              {(block.columns || []).map((col, index) => (
                <div key={index} className="rounded-2xl border p-4 space-y-3">
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

              <Button
                variant="outline"
                onClick={() => patchBlock({ columns: [...(block.columns || []), { heading: "", text: "" }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Přidat sloupec
              </Button>
            </>
          )}

          {block.type === "table" && (
            <>
              <Field label="Nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              {(block.rows || []).map((row, index) => (
                <div key={index} className="grid grid-cols-2 gap-3">
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

              <Button
                variant="outline"
                onClick={() => patchBlock({ rows: [...(block.rows || []), ["", ""]] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Přidat řádek
              </Button>
            </>
          )}

          {block.type === "ctaBanner" && (
            <>
              <Field label="Malý titulek">
                <Input
                  value={block.eyebrow || ""}
                  onChange={(e) => patchBlock({ eyebrow: e.target.value })}
                />
              </Field>

              <Field label="Hlavní nadpis">
                <Input
                  value={block.heading || ""}
                  onChange={(e) => patchBlock({ heading: e.target.value })}
                />
              </Field>

              <Field label="Text">
                <Textarea
                  value={block.text || ""}
                  onChange={(e) => patchBlock({ text: e.target.value })}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Text tlačítka">
                  <Input
                    value={block.buttonText || ""}
                    onChange={(e) => patchBlock({ buttonText: e.target.value })}
                  />
                </Field>

                <Field label="Odkaz tlačítka">
                  <Input
                    value={block.buttonLink || ""}
                    onChange={(e) => patchBlock({ buttonLink: e.target.value })}
                  />
                </Field>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm bg-slate-900 text-white">
        <CardContent className="p-5 text-sm">
          <div className="mb-2 font-semibold">Aktivní brand styl</div>
          <div className="space-y-1 text-slate-300">
            <div>
              Barva značky: <span style={{ color: theme.accent }}>{theme.accent}</span>
            </div>
            <div>Značka: {theme.brandName}</div>
          </div>
        </CardContent>
      </Card>
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
    if (!selectedId && blocks[0]?.id) {
      setSelectedId(blocks[0].id);
    }
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

    if (selectedId === id) {
      setSelectedId(next[0]?.id || null);
    }
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
    if (!raw) {
      alert("V prohlížeči není uložen žádný projekt.");
      return;
    }

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
    const blob = new Blob(
      [JSON.stringify({ projectName, pageType, theme, includeCss, blocks }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(projectName || "projekt")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9] p-4 md:p-6">
      <div className="mx-auto max-w-[1880px] space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-5 text-white shadow-lg">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <Badge className="mb-3 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                Profesionální builder obsahových bloků
              </Badge>
              <h1 className="text-2xl font-bold md:text-3xl">
                Pomocník pro kódování textů a bloků na e-shop
              </h1>
              <p className="mt-2 max-w-4xl text-sm text-slate-300 md:text-base">
                Profesionální rozhraní pro produktové a kategoriové popisky. Vkládáš texty, obrázky, galerie,
                FAQ, tabulky, CTA bannery i YouTube videa. Na konci dostaneš hotové HTML pro Shoptet.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100"
                onClick={saveProject}
              >
                <Save className="mr-2 h-4 w-4" /> Uložit
              </Button>

              <Button
                variant="secondary"
                className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100"
                onClick={loadProject}
              >
                <LayoutTemplate className="mr-2 h-4 w-4" /> Načíst
              </Button>

              <Button
                variant="secondary"
                className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100"
                onClick={exportJson}
              >
                <Download className="mr-2 h-4 w-4" /> JSON
              </Button>

              <Button className="rounded-2xl" onClick={() => copyToClipboard()}>
                <Copy className="mr-2 h-4 w-4" /> Kopírovat HTML
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_430px]">
          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Projekt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Název projektu">
                  <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
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

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Accent barva">
                    <Input value={theme.accent} onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))} />
                  </Field>
                  <Field label="Jemné pozadí">
                    <Input value={theme.accentSoft} onChange={(e) => setTheme((t) => ({ ...t, accentSoft: e.target.value }))} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Text">
                    <Input value={theme.text} onChange={(e) => setTheme((t) => ({ ...t, text: e.target.value }))} />
                  </Field>
                  <Field label="Radius">
                    <Input value={theme.radius} onChange={(e) => setTheme((t) => ({ ...t, radius: e.target.value }))} />
                  </Field>
                </div>

                <div className="flex items-center justify-between rounded-2xl border p-3 text-sm">
                  <span>Přibalit exportní CSS</span>
                  <Switch checked={includeCss} onCheckedChange={setIncludeCss} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-2xl" onClick={() => applyTemplate(pageType)}>
                    <Sparkles className="mr-2 h-4 w-4" /> Šablona
                  </Button>

                  <Button variant="outline" className="rounded-2xl" onClick={resetProject}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Přidat blok</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full rounded-2xl">
                      <Plus className="mr-2 h-4 w-4" /> Nový blok
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl rounded-3xl">
                    <DialogHeader>
                      <DialogTitle>Obsahové bloky</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      {blockCatalog.map((item) => (
                        <CatalogButton key={item.type} item={item} onAdd={addBlock} />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Bloky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {blocks.map((block, index) => {
                  const Icon = blockCatalog.find((i) => i.type === block.type)?.icon || Type;

                  return (
                    <button
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(block.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropOnBlock(block.id)}
                      onClick={() => setSelectedId(block.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedId === block.id
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      } ${draggedId === block.id ? "opacity-60" : "opacity-100"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <GripVertical className="mt-0.5 h-4 w-4 opacity-60" />
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              <Icon className="h-4 w-4" /> {block.title || block.type}
                            </div>
                            <div className={`mt-1 text-xs ${selectedId === block.id ? "text-slate-300" : "text-slate-500"}`}>
                              #{index + 1} · {block.type}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}>
                          ↑
                        </Button>
                        <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}>
                          ↓
                        </Button>
                        <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                          Dupl.
                        </Button>
                        <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{projectName}</CardTitle>
                <div className="text-sm text-slate-500">{blocks.length} bloků v projektu</div>
              </CardHeader>
              <CardContent>
                <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-white p-4 md:p-6">
                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(block.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnBlock(block.id)}
                        onClick={() => setSelectedId(block.id)}
                        className={`cursor-pointer rounded-[24px] border-2 p-3 transition ${
                          selectedId === block.id
                            ? "border-sky-400 bg-sky-50"
                            : "border-slate-200 hover:border-slate-300"
                        } ${draggedId === block.id ? "opacity-60" : "opacity-100"}`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full">
                              {blockCatalog.find((i) => i.type === block.type)?.label || block.type}
                            </Badge>
                            <span>#{index + 1}</span>
                            <span>{block.title}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl bg-white" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}>
                              ↑
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl bg-white" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}>
                              ↓
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl bg-white" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                              Dupl.
                            </Button>
                            <Button type="button" size="sm" variant="outline" className="h-8 rounded-xl bg-white" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>
                              Smazat
                            </Button>
                          </div>
                        </div>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderBlockHtml(block, theme),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5" /> Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="preview">
                      <Eye className="mr-2 h-4 w-4" /> Náhled
                    </TabsTrigger>
                    <TabsTrigger value="html">
                      <Code2 className="mr-2 h-4 w-4" /> HTML
                    </TabsTrigger>
                    <TabsTrigger value="shoptet">
                      <Sparkles className="mr-2 h-4 w-4" /> Shoptet
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="rounded-2xl border bg-white p-5">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generatedHtml,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="mt-4">
                    <Textarea className="min-h-[460px] rounded-2xl font-mono text-sm" readOnly value={generatedHtml} />
                    <Button className="mt-3 w-full rounded-2xl" onClick={() => copyToClipboard(generatedHtml)}>
                      <Copy className="mr-2 h-4 w-4" /> Kopírovat kompletní HTML
                    </Button>
                  </TabsContent>

                  <TabsContent value="shoptet" className="mt-4">
                    <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                      Tento export je připravený pro vložení do Shoptet editoru nebo do vlastního HTML bloku.
                      U složitějších stránek doporučeno ponechat zapnuté exportní CSS.
                    </div>
                    <Textarea className="mt-4 min-h-[420px] rounded-2xl font-mono text-sm" readOnly value={generatedHtml} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)] rounded-3xl">
            <BlockSettings block={selectedBlock} setBlocks={setBlocks} theme={theme} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
