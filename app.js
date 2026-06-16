const STORAGE_KEY = "pedido-ceasa-iphone-state-v1";
const SORT_KEY = "pedido-ceasa-iphone-sort-v1";
const WEBER_XML_EMIT_CNPJ = "06048063000102";
const WEBER_XML_DEST_CNPJ = "31204831000109";

const initialVendors = [
  "andrei", "andre", "silvio", "lb", "dieguinho", "donato", "primo"
].map((name, index) => ({ id: crypto.randomUUID(), name, order: index + 1 }));

const byVendor = {
  andrei: [
    "abobrinha cx 17kg", "alho poro molho 6un", "batata doce rosa cx 17kg",
    "berinjela cx 9kg", "beterraba molho un 1", "brocolis un 1",
    "cenoura top papelao cx 17kg", "couve flor un 1", "chuchu cx 17kg",
    "gengibre 1kg", "milho verde un 1", "moranga cabutia cx 17kg",
    "pepino japones cx 17kg", "pepino salada cx 17kg", "pimentao verde cx 9kg",
    "pimentao colorido cx 9kg", "pinhao top cx 9kg", "rabanete un 1",
    "repolho verde un 1", "repolho roxo un 1", "tomate lv cx 17kg",
    "tomate rasteiro cx 17kg", "tomate italiano cx 17kg", "vagem bdj c6 cx 6un",
    "tomate cereja bdj cx 6un", "alface americana cx 1dz", "berga pokan cx 17kg",
    "berga cai cx 17kg", "caqui mel cx 5kg", "caqui branco cx 9kg",
    "caqui chocolate cx 9kg", "ceu cx 17kg", "laranja umbigo cx 17kg",
    "suco cx 17kg", "limao cx 17kg", "uva cx 5kg"
  ],
  andre: [
    "alface crespa cx 12un", "alface lisa cx 12un", "salsa cx 12un",
    "tempero verde cx 12un", "rucula cx 12un", "couve folha cx 12un",
    "couve manteiga cx 12un", "espinafre cx 12un"
  ],
  silvio: ["formosa capixaba cx 9kg", "papaia capixaba cx 9kg"],
  lb: ["cebola roxa cx 19kg", "batata branca cx 24kg", "cebola cx3 cx 19kg", "alho cx 9kg"],
  dieguinho: ["moranguinho extra cx 6un", "moranguinho cx 4un"],
  donato: ["melancia un 12kg"],
  primo: [
    "abacaxi graudo cx 10un", "manga cx 17kg", "maracuja cx 9kg",
    "fuji cx 16kg", "gala cx 16kg", "melao espanhol barato cx 12kg",
    "melao rei cx 9kg", "abacate un 1", "uva sem semente cx 10un",
    "pera importada cx 8kg", "umbigo importada cx 15kg"
  ]
};

const PRODUCT_CODES = {
  abacate: "2001",
  "abacaxi graudo": "2041",
  abobrinha: "3002",
  alho: "3003",
  "alho poro": "4017",
  "alface americana": "4003",
  "alface crespa": "4000",
  "alface lisa": "4001",
  "batata branca": "3005",
  "batata doce rosa": "3008",
  "berga cai": "2066",
  "berga pokan": "2004",
  berinjela: "3009",
  "beterraba molho": "3029",
  "beterraba molho un 1": "3029",
  brocolis: "4016",
  "brocolis un 1": "4016",
  "caqui branco": "2007",
  "caqui chocolate": "2056",
  "caqui mel": "2059",
  cebola: "3011",
  "cebola cx3": "3011",
  "cebola roxa": "3004",
  cenoura: "3012",
  "cenoura top papelao": "3012",
  ceu: "2011",
  chuchu: "3013",
  "couve flor": "4015",
  "couve flor un 1": "4015",
  "couve folha": "4012",
  "couve manteiga": "4013",
  espinafre: "4011",
  formosa: "2023",
  "formosa capixaba": "2023",
  fuji: "2018",
  gala: "2019",
  gengibre: "3014",
  "laranja umbigo": "2012",
  limao: "2014",
  manga: "2021",
  maracuja: "2022",
  melancia: "380",
  "melao espanhol barato": "2044",
  "melao rei": "2017",
  "milho verde": "4018",
  "milho verde un 1": "4018",
  "moranga cabutia": "3015",
  moranguinho: "2025",
  "moranguinho extra": "2025",
  "papaia capixaba": "2024",
  "pepino japones": "3017",
  "pepino salada": "3016",
  "pera importada": "2030",
  "pimentao colorido": "3019",
  "pimentao verde": "3018",
  pinhao: "3020",
  "pinhao top": "3020",
  rabanete: "3021",
  "rabanete un 1": "3021",
  "repolho roxo": "4020",
  "repolho roxo un 1": "4020",
  "repolho verde": "4019",
  "repolho verde un 1": "4019",
  rucula: "4008",
  salsa: "4006",
  suco: "2010",
  "tempero verde": "4005",
  "tomate cereja": "4021",
  "tomate cereja bdj": "4021",
  "tomate italiano": "3028",
  "tomate lv": "3022",
  "tomate rasteiro": "3023",
  "umbigo importada": "2013",
  "abacate un 1": "2001",
  uva: "2043",
  "uva sem semente": "1474",
  vagem: "4022",
  "vagem bdj c6": "4022"
};

function parseProduct(raw, vendorId) {
  const clean = raw.trim().replace(/\s+/g, " ");
  const dzMatch = clean.match(/(.+?)\s+(cx|un|molho|bdj)?\s*(\d+(?:[,.]\d+)?)dz$/i);
  const singleUnitMatch = clean.match(/(.+?)\s+un\s+1$/i);
  const unitMatch = clean.match(/(.+?)\s+(cx|un|molho|bdj)?\s*(\d+(?:[,.]\d+)?)\s*(kg|un)$/i);
  const looseKg = clean.match(/(.+?)\s+(\d+(?:[,.]\d+)?)kg$/i);

  if (dzMatch) {
    return makeProduct(vendorId, dzMatch[1], dzMatch[2] || "cx", Number(dzMatch[3].replace(",", ".")) * 12, "un");
  }
  if (singleUnitMatch) {
    return makeProduct(vendorId, singleUnitMatch[1], "dz", 12, "un");
  }
  if (unitMatch) {
    const label = unitMatch[2] || unitMatch[4];
    const size = Number(unitMatch[3].replace(",", "."));
    if (unitMatch[4] === "un" && size <= 6) {
      return makeProduct(vendorId, unitMatch[1], "dz", 12, "un");
    }
    return makeProduct(vendorId, unitMatch[1], label, size, unitMatch[4]);
  }
  if (looseKg) {
    return makeProduct(vendorId, looseKg[1], "kg", Number(looseKg[2].replace(",", ".")), "kg");
  }
  return makeProduct(vendorId, clean, "dz", 12, "un");
}

function makeProduct(vendorId, name, packageLabel, packageSize, baseUnit) {
  return {
    id: crypto.randomUUID(),
    vendorId,
    code: codeForProductName(name),
    name: name.trim(),
    packageLabel: packageLabel || "cx",
    packageSize: Number(packageSize) || 1,
    baseUnit,
    markup: 0
  };
}

function seedState() {
  const products = [];
  for (const vendor of initialVendors) {
    for (const raw of byVendor[vendor.name] || []) {
      products.push(parseProduct(raw, vendor.id));
    }
  }
  return {
    vendors: initialVendors,
    products,
    order: {},
    history: [],
    orderLists: { principal: [], favoritos: [] },
    weberXml: { nextNumber: 900001, usedNumbers: [] }
  };
}

let state = loadState();
let deferredInstallPrompt = null;
let orderMode = "select";
let pendingOnly = false;
let productSortMode = localStorage.getItem(SORT_KEY) || "category";
let productFormOpen = false;
let manualOrderEditing = false;
let manualOrderSnapshot = null;
let manualOrderSource = "principal";
let costImportRows = [];

const dom = {
  vendorFilter: document.getElementById("vendorFilter"),
  productSort: document.getElementById("productSort"),
  orderSaveTargetWrap: document.getElementById("orderSaveTargetWrap"),
  orderSaveTarget: document.getElementById("orderSaveTarget"),
  manualOrderBtn: document.getElementById("manualOrderBtn"),
  productVendor: document.getElementById("productVendor"),
  productList: document.getElementById("productList"),
  productTemplate: document.getElementById("productTemplate"),
  vendorShareList: document.getElementById("vendorShareList"),
  costSummary: document.getElementById("costSummary"),
  costTools: document.getElementById("costTools"),
  pendingOnlyInput: document.getElementById("pendingOnlyInput"),
  nextCostBtn: document.getElementById("nextCostBtn"),
  openCostTextBtn: document.getElementById("openCostTextBtn"),
  readCostPhotoBtn: document.getElementById("readCostPhotoBtn"),
  costPhotoInput: document.getElementById("costPhotoInput"),
  costTextPanel: document.getElementById("costTextPanel"),
  costMessageInput: document.getElementById("costMessageInput"),
  parseCostTextBtn: document.getElementById("parseCostTextBtn"),
  clearCostImportBtn: document.getElementById("clearCostImportBtn"),
  costImportReview: document.getElementById("costImportReview"),
  selectModeBtn: document.getElementById("selectModeBtn"),
  costModeBtn: document.getElementById("costModeBtn"),
  exportTxtBtn: document.getElementById("exportTxtBtn"),
  exportXmlBtn: document.getElementById("exportXmlBtn"),
  saveOrderBtn: document.getElementById("saveOrderBtn"),
  clearOrderBtn: document.getElementById("clearOrderBtn"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  historyList: document.getElementById("historyList"),
  orderStatus: document.getElementById("orderStatus"),
  vendorForm: document.getElementById("vendorForm"),
  vendorId: document.getElementById("vendorId"),
  vendorName: document.getElementById("vendorName"),
  vendorList: document.getElementById("vendorList"),
  newVendorBtn: document.getElementById("newVendorBtn"),
  productForm: document.getElementById("productForm"),
  productFormSlot: document.getElementById("productFormSlot"),
  openProductFormBtn: document.getElementById("openProductFormBtn"),
  productId: document.getElementById("productId"),
  productCode: document.getElementById("productCode"),
  productName: document.getElementById("productName"),
  packageLabel: document.getElementById("packageLabel"),
  packageSize: document.getElementById("packageSize"),
  baseUnit: document.getElementById("baseUnit"),
  productMarkup: document.getElementById("productMarkup"),
  productImageUrl: document.getElementById("productImageUrl"),
  productImageFile: document.getElementById("productImageFile"),
  productImagePreview: document.getElementById("productImagePreview"),
  clearProductImageBtn: document.getElementById("clearProductImageBtn"),
  editableProductList: document.getElementById("editableProductList"),
  newProductBtn: document.getElementById("newProductBtn"),
  downloadBackupBtn: document.getElementById("downloadBackupBtn"),
  restoreBackupInput: document.getElementById("restoreBackupInput"),
  installBtn: document.getElementById("installBtn")
};

const {
  vendorFilter, productSort, orderSaveTargetWrap, orderSaveTarget, manualOrderBtn, productVendor, productList, productTemplate, vendorShareList,
  costSummary, costTools, pendingOnlyInput, nextCostBtn, openCostTextBtn, readCostPhotoBtn, costPhotoInput,
  costTextPanel, costMessageInput, parseCostTextBtn, clearCostImportBtn, costImportReview, selectModeBtn, costModeBtn,
  exportTxtBtn, exportXmlBtn, saveOrderBtn, clearOrderBtn, clearHistoryBtn,
  historyList, orderStatus, vendorForm, vendorId, vendorName, vendorList, newVendorBtn,
  productForm, productFormSlot, openProductFormBtn, productId, productCode, productName, packageLabel, packageSize, baseUnit, productMarkup,
  productImageUrl, productImageFile, productImagePreview, clearProductImageBtn,
  editableProductList, newProductBtn, downloadBackupBtn, restoreBackupInput, installBtn
} = dom;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedState();
  try {
    const loaded = { ...seedState(), ...JSON.parse(saved) };
    migrateProducts(loaded);
    return loaded;
  } catch {
    return seedState();
  }
}

function migrateProducts(nextState) {
  for (const product of nextState.products || []) {
    product.name = product.name.replace(/\s+un\s+1$/i, "").trim();
    if (normalizeName(product.name) === "uva") product.code = "2043";
    if (!product.code) product.code = codeForProductName(product.name);
    if (!Number.isFinite(Number(product.markup))) product.markup = 0;
    if (!Number.isFinite(Number(product.order))) product.order = nextState.products.indexOf(product) + 1;
    if (Number(product.packageSize) <= 6 && product.baseUnit === "un") {
      product.packageLabel = "dz";
      product.packageSize = 12;
    }
  }
  ensureOrderLists(nextState);
  ensureWeberXml(nextState);
}

function ensureWeberXml(nextState = state) {
  nextState.weberXml = nextState.weberXml || {};
  const nextNumber = Number(nextState.weberXml.nextNumber);
  nextState.weberXml.nextNumber = Number.isFinite(nextNumber) && nextNumber >= 1 ? Math.floor(nextNumber) : 900001;
  nextState.weberXml.usedNumbers = Array.isArray(nextState.weberXml.usedNumbers)
    ? [...new Set(nextState.weberXml.usedNumbers.map(Number).filter(Number.isFinite))]
    : [];
}

function ensureOrderLists(nextState = state) {
  nextState.orderLists = nextState.orderLists || {};
  const fallback = (nextState.products || [])
    .slice()
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map(product => product.id);
  for (const name of ["principal", "favoritos"]) {
    const current = Array.isArray(nextState.orderLists[name]) ? nextState.orderLists[name] : [];
    const known = new Set((nextState.products || []).map(product => product.id));
    const clean = current.filter(id => known.has(id));
    const existing = new Set(clean);
    const missing = fallback.filter(id => !existing.has(id));
    nextState.orderLists[name] = [...clean, ...missing];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function orderItem(productId) {
  if (!state.order[productId]) state.order[productId] = { qty: 0, fraction: 0, boxPrice: 0 };
  return state.order[productId];
}

function selectedLines() {
  return state.products
    .map(product => ({ product, item: state.order[product.id], vendor: state.vendors.find(v => v.id === product.vendorId) }))
    .filter(row => row.item && (orderQty(row.item) > 0 || Number(row.item.boxPrice) > 0));
}

function quantityLines(lines = selectedLines()) {
  return lines.filter(row => orderQty(row.item) > 0);
}

function isOnlyHalfPackage(item) {
  return !(Number(item?.qty) > 0) && Number(item?.fraction) >= 0.5;
}

function effectivePackageSize(product, item) {
  const size = Number(product.packageSize) || 0;
  if (!size) return 0;
  return isOnlyHalfPackage(item) ? size / 2 : size;
}

function unitCost(product, item) {
  const price = Number(item.boxPrice) || 0;
  const size = effectivePackageSize(product, item);
  return size ? price / size : 0;
}

function totalCost(item) {
  const price = Number(item?.boxPrice) || 0;
  if (isOnlyHalfPackage(item)) return price;
  return orderQty(item) * price;
}

function salePrice(product, item) {
  const markup = Number(product.markup) || 0;
  return priceEndingInNine(unitCost(product, item) * (1 + (markup / 100)));
}

function markupFromSalePrice(product, item, sale, roundSale = true) {
  const cost = unitCost(product, item);
  if (!cost || !sale) return 0;
  const finalSale = roundSale ? priceEndingInNine(sale) : sale;
  return ((finalSale / cost) - 1) * 100;
}

function priceEndingInNine(value) {
  const cents = Math.ceil(((Number(value) || 0) * 100) - 0.000001);
  if (!cents) return 0;
  if (cents % 100 <= 9) return (cents - (cents % 100) - 1) / 100;
  const lastDigit = cents % 10;
  return (cents + ((9 - lastDigit + 10) % 10)) / 100;
}

function orderQty(item) {
  return (Number(item?.qty) || 0) + (Number(item?.fraction) || 0);
}

function readNumber(value) {
  const normalized = String(value || "").replace(",", ".");
  return Number(normalized) || 0;
}

function codeForProductName(name) {
  return PRODUCT_CODES[normalizeName(name)] ?? "";
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function productLabel(product) {
  return product.code ? `${product.code} - ${titleText(product.name)}` : titleText(product.name);
}

function titleText(value) {
  return String(value || "").replace(/\p{L}[\p{L}\p{M}]*/gu, word =>
    word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
  );
}

function productImage(product) {
  if (product.image) return product.image;
  return `assets/product-images/${localProductImageFile(product)}`;
}

function localProductImageFile(product) {
  return productImageFileName(product);
}

function productImageLock(product) {
  const base = product.code || product.name || product.id || "1";
  return Array.from(String(base)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function productImageFileName(product) {
  const code = product.code || productImageLock(product);
  const slug = normalizeName(product.name).replace(/\s+/g, "-") || "produto";
  return `${code}-${slug}.png`;
}

function placeholderProductImage(product) {
  const name = normalizeName(product.name);
  const palette = imagePalette(name);
  const shape = imageShape(name, palette);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${escapeHtml(product.name)}">
    <rect width="96" height="96" rx="18" fill="${palette.bg}"/>
    ${shape}
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function imagePalette(name) {
  if (hasAny(name, ["tomate", "pimentao", "moranguinho", "maca"])) return { bg: "#fff1f0", main: "#d9473f", dark: "#9f2c27", leaf: "#2f8f4e" };
  if (hasAny(name, ["laranja", "limao", "berg", "caqui", "manga", "maracuja", "melao"])) return { bg: "#fff7df", main: "#f0b429", dark: "#b7791f", leaf: "#3f8f4d" };
  if (hasAny(name, ["uva", "berinjela", "repolho roxo"])) return { bg: "#f4efff", main: "#7557b8", dark: "#4b3387", leaf: "#3f8f4d" };
  if (hasAny(name, ["alho", "cebola", "batata", "gengibre", "pinhao"])) return { bg: "#fff8ea", main: "#d8b36a", dark: "#9c7631", leaf: "#6f8f3f" };
  if (hasAny(name, ["cenoura", "moranga", "abobora"])) return { bg: "#fff2df", main: "#e8792f", dark: "#ad4f1e", leaf: "#3f8f4d" };
  return { bg: "#edf8ef", main: "#38a169", dark: "#217a45", leaf: "#2f855a" };
}

function imageShape(name, p) {
  if (hasAny(name, ["cenoura"])) return `<path d="M30 55c13-23 25-32 34-28 8 5 2 18-17 39-8 9-21 1-17-11Z" fill="${p.main}"/><path d="M60 26c-2-10 4-16 13-18 2 10-3 17-13 18Zm-3 2c-9-5-11-13-6-21 8 4 11 11 6 21Z" fill="${p.leaf}"/>`;
  if (hasAny(name, ["brocolis", "couve", "alface", "rucula", "salsa", "espinafre", "tempero", "repolho"])) return `<circle cx="39" cy="35" r="16" fill="${p.main}"/><circle cx="55" cy="32" r="18" fill="${p.main}"/><circle cx="62" cy="49" r="16" fill="${p.main}"/><circle cx="37" cy="52" r="18" fill="${p.main}"/><path d="M49 50v25" stroke="${p.dark}" stroke-width="9" stroke-linecap="round"/><path d="M33 77h35" stroke="${p.dark}" stroke-width="9" stroke-linecap="round"/>`;
  if (hasAny(name, ["pepino", "abobrinha", "vagem"])) return `<path d="M22 58c11-24 42-35 55-22 9 10-4 30-29 36-18 4-31-3-26-14Z" fill="${p.main}"/><path d="M34 60c9-10 22-16 36-18" fill="none" stroke="${p.dark}" stroke-width="5" stroke-linecap="round" opacity=".45"/>`;
  if (hasAny(name, ["alho", "cebola"])) return `<path d="M48 18c23 19 26 48 0 62-26-14-23-43 0-62Z" fill="${p.main}"/><path d="M48 18c-5 18-6 40 0 62M48 18c7 19 9 39 0 62" fill="none" stroke="${p.dark}" stroke-width="4" opacity=".45"/>`;
  if (hasAny(name, ["batata", "gengibre", "pinhao"])) return `<path d="M23 51c0-17 19-29 38-24 17 4 25 20 17 34-8 15-33 23-48 12-5-4-7-12-7-22Z" fill="${p.main}"/><circle cx="42" cy="43" r="3" fill="${p.dark}" opacity=".55"/><circle cx="59" cy="57" r="3" fill="${p.dark}" opacity=".55"/>`;
  if (hasAny(name, ["melancia"])) return `<path d="M17 49c19 27 55 27 74 0-10 34-64 35-74 0Z" fill="#e74b5b"/><path d="M17 49c19 27 55 27 74 0" fill="none" stroke="#2f855a" stroke-width="9"/><circle cx="43" cy="58" r="3" fill="#1d2723"/><circle cx="60" cy="62" r="3" fill="#1d2723"/>`;
  if (hasAny(name, ["abacaxi"])) return `<path d="M48 21c9 8 18 9 26 2-4 11-11 18-22 19 9 7 12 19 7 32H37c-5-13-2-25 7-32-11-1-18-8-22-19 8 7 17 6 26-2Z" fill="${p.leaf}"/><path d="M34 40h28c8 9 8 27 0 38H34c-8-11-8-29 0-38Z" fill="${p.main}"/><path d="M36 48h24M34 59h28M36 70h24" stroke="${p.dark}" stroke-width="3" opacity=".45"/>`;
  return `<circle cx="48" cy="50" r="27" fill="${p.main}"/><path d="M50 21c5-10 14-13 25-10-4 10-12 15-25 10Z" fill="${p.leaf}"/><path d="M36 38c7-8 20-11 31-4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".45"/>`;
}

function hasAny(value, words) {
  return words.some(word => value.includes(word));
}

function productCategory(product) {
  const name = normalizeName(product.name);
  if (hasAny(name, [
    "abacate", "abacaxi", "berga", "caqui", "ceu", "formosa", "fuji", "gala",
    "laranja", "limao", "manga", "maracuja", "melancia", "melao", "moranguinho",
    "papaia", "pera", "suco", "uva", "umbigo"
  ])) return "Frutas";
  if (hasAny(name, [
    "alface", "alho poro", "brocolis", "couve", "espinafre", "rabanete",
    "repolho", "rucula", "salsa", "tempero"
  ])) return "Verduras";
  if (hasAny(name, [
    "abobrinha", "alho", "batata", "berinjela", "beterraba", "cebola", "cenoura",
    "chuchu", "gengibre", "milho", "moranga", "pepino", "pimentao", "pinhao",
    "tomate", "vagem"
  ])) return "Legumes";
  return "Outros";
}

function categoryOrder(category) {
  return ["Frutas", "Legumes", "Verduras", "Outros"].indexOf(category);
}

function orderListNameForSort(mode = productSortMode) {
  if (mode === "favorites") return "favoritos";
  return "principal";
}

function orderIndexMap(listName) {
  ensureOrderLists();
  const ids = state.orderLists?.[listName] || [];
  return new Map(ids.map((id, index) => [id, index]));
}

function sortProductRows(rows) {
  const indexed = rows.map((row, index) => ({ ...row, index }));
  const byName = (a, b) => a.product.name.localeCompare(b.product.name, "pt-BR");
  if (productSortMode === "alpha") return indexed.sort(byName);
  if (productSortMode === "vendor") {
    return indexed.sort((a, b) =>
      (a.vendor?.order || 0) - (b.vendor?.order || 0) ||
      (a.vendor?.name || "").localeCompare(b.vendor?.name || "", "pt-BR") ||
      byName(a, b)
    );
  }
  if (productSortMode === "saved") return indexed.sort((a, b) => a.index - b.index);
  if (productSortMode === "manual" || productSortMode === "favorites") {
    const positions = orderIndexMap(orderListNameForSort());
    return indexed.sort((a, b) => (positions.get(a.product.id) ?? a.index) - (positions.get(b.product.id) ?? b.index));
  }
  return indexed.sort((a, b) =>
    categoryOrder(productCategory(a.product)) - categoryOrder(productCategory(b.product)) ||
    byName(a, b)
  );
}

function renderAll() {
  updateOrderModeUi();
  renderFilters();
  renderProducts();
  renderShareList();
  renderCostSummary();
  renderHistory();
  renderEdits();
  updateStatus();
  saveState();
}

function renderFilters() {
  const current = vendorFilter.value || "all";
  productSort.value = productSortMode;
  vendorFilter.innerHTML = `<option value="all">Todos</option>` + state.vendors
    .map(v => `<option value="${v.id}">${escapeHtml(titleText(v.name))}</option>`).join("");
  vendorFilter.value = state.vendors.some(v => v.id === current) ? current : "all";
  productVendor.innerHTML = state.vendors.map(v => `<option value="${v.id}">${escapeHtml(titleText(v.name))}</option>`).join("");
}

function renderProducts() {
  const q = "";
  const vendorId = vendorFilter.value;
  const rows = state.products.map(product => ({
    product,
    item: orderItem(product.id),
    vendor: state.vendors.find(v => v.id === product.vendorId)
  }));
  const list = sortProductRows(rows.filter(({ product, item, vendor }) => {
    const text = `${product.code || ""} ${product.name} ${vendor?.name || ""}`.toLowerCase();
    const matchesFilter = (!q || text.includes(q)) && (vendorId === "all" || product.vendorId === vendorId);
    const needsCost = !(Number(item.boxPrice) > 0);
    return matchesFilter && (orderMode === "select" || (orderQty(item) > 0 && (!pendingOnly || needsCost)));
  }));

  productList.classList.toggle("select-mode", orderMode === "select");
  productList.classList.toggle("cost-mode", orderMode === "cost");
  productList.classList.toggle("manual-order-mode", (productSortMode === "manual" || productSortMode === "favorites") && manualOrderEditing);
  productList.innerHTML = "";
  if (!list.length) {
    productList.innerHTML = `<div class="empty">${orderMode === "cost" ? "Selecione Produtos Primeiro Para Lancar Custos." : "Nenhum Produto Encontrado."}</div>`;
    return;
  }

  let currentCategory = "";
  for (const { product, item, vendor } of list) {
    const category = productCategory(product);
    if (productSortMode === "category" && category !== currentCategory) {
      currentCategory = category;
      const header = document.createElement("div");
      header.className = "category-header";
      header.textContent = category;
      productList.appendChild(header);
    }
    const node = productTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("selected-product", orderQty(item) > 0);
    node.querySelector("h3").textContent = productLabel(product);
    node.querySelector("p").textContent = `${titleText(vendor?.name || "")} - ${titleText(product.packageLabel)} ${formatQty(product.packageSize)}${titleText(product.baseUnit)}`;
    const image = node.querySelector(".product-image");
    image.src = productImage(product);
    image.alt = product.name;
    image.onerror = () => {
      image.onerror = null;
      image.src = placeholderProductImage(product);
    };
    node.querySelector(".qty").value = item.qty || "";
    node.querySelector(".qty-fraction").value = item.fraction || "";
    node.querySelector(".half-display").textContent = item.fraction ? "1/2" : "0";
    node.querySelector(".box-price").value = item.boxPrice ? formatInputNumber(item.boxPrice) : "";
    node.querySelector(".markup").value = product.markup ? formatInputNumber(product.markup) : "";
    node.querySelector(".sale-price-input").value = salePrice(product, item) ? formatInputNumber(salePrice(product, item)) : "";
    updateProductNode(node, product, item);
    const syncItem = event => {
      item.qty = readNumber(node.querySelector(".qty").value);
      item.fraction = readNumber(node.querySelector(".qty-fraction").value);
      item.boxPrice = readNumber(node.querySelector(".box-price").value);
      const markupInput = node.querySelector(".markup");
      const saleInput = node.querySelector(".sale-price-input");
      if (event?.target === saleInput) {
        const typedSale = readNumber(saleInput.value);
        const finalSale = event.type === "blur" ? priceEndingInNine(typedSale) : typedSale;
        product.markup = markupFromSalePrice(product, item, finalSale, event.type === "blur");
        if (event.type === "blur") saleInput.value = finalSale ? formatInputNumber(finalSale) : "";
        markupInput.value = product.markup ? formatInputNumber(product.markup) : "";
      } else {
        product.markup = readNumber(markupInput.value);
      }
      updateProductNode(node, product, item);
      renderShareList();
      renderCostSummary();
      updateStatus();
      saveState();
    };
    for (const input of node.querySelectorAll("input")) {
      input.addEventListener("input", syncItem);
    }
    node.querySelector(".box-price").addEventListener("blur", event => {
      const value = readNumber(event.currentTarget.value);
      event.currentTarget.value = value ? formatInputNumber(value) : "";
    });
    node.querySelector(".markup").addEventListener("blur", event => {
      const value = readNumber(event.currentTarget.value);
      event.currentTarget.value = value ? formatInputNumber(value) : "";
    });
    node.querySelector(".sale-price-input").addEventListener("blur", syncItem);
    node.querySelector(".sale-price-input").addEventListener("keydown", event => {
      if (event.key === "Enter") event.currentTarget.blur();
    });
    const handleCostEnter = event => {
      if (isEnterKey(event)) {
        event.preventDefault();
        syncItem(event);
        const value = readNumber(event.currentTarget.value);
        event.currentTarget.value = value ? formatInputNumber(value) : "";
        if (pendingOnly && orderMode === "cost") {
          renderProducts();
          requestAnimationFrame(focusNextCost);
        } else {
          requestAnimationFrame(() => focusNextCost(node));
        }
      }
    };
    node.querySelector(".box-price").addEventListener("keydown", handleCostEnter);
    node.querySelector(".box-price").addEventListener("keyup", handleCostEnter);
    node.querySelector(".qty-minus").addEventListener("click", () => changeQty(node, -1, syncItem));
    node.querySelector(".qty-plus").addEventListener("click", () => changeQty(node, 1, syncItem));
    node.querySelector(".half-minus").addEventListener("click", () => changeHalf(node, -0.5, syncItem));
    node.querySelector(".half-plus").addEventListener("click", () => changeHalf(node, 0.5, syncItem));
    node.querySelector(".move-up").addEventListener("click", () => moveProduct(product.id, -1));
    node.querySelector(".move-down").addEventListener("click", () => moveProduct(product.id, 1));
    node.querySelector(".move-up-five").addEventListener("click", () => moveProduct(product.id, -5));
    node.querySelector(".move-down-five").addEventListener("click", () => moveProduct(product.id, 5));
    productList.appendChild(node);
  }
}

function moveProduct(productId, direction) {
  ensureOrderLists();
  const ids = [...state.orderLists[manualOrderSource]];
  const current = ids.indexOf(productId);
  const next = Math.max(0, Math.min(ids.length - 1, current + direction));
  if (current < 0 || next === current) return;
  const [id] = ids.splice(current, 1);
  ids.splice(next, 0, id);
  state.orderLists[manualOrderSource] = ids;
  renderProducts();
}

function startManualOrderEdit() {
  if (!confirm("Editar Ordem Dos Produtos?")) return;
  ensureOrderLists();
  manualOrderSource = orderListNameForSort();
  orderSaveTarget.value = manualOrderSource;
  manualOrderSnapshot = JSON.parse(JSON.stringify(state.orderLists));
  manualOrderEditing = true;
  updateOrderModeUi();
  renderProducts();
}

function finishManualOrderEdit() {
  if (confirm("Salvar Nova Ordem Dos Produtos?")) {
    const target = orderSaveTarget.value || manualOrderSource;
    if (target !== manualOrderSource) {
      state.orderLists[target] = [...state.orderLists[manualOrderSource]];
      restoreManualOrderSource();
    }
    productSortMode = target === "favoritos" ? "favorites" : "manual";
    localStorage.setItem(SORT_KEY, productSortMode);
    manualOrderSnapshot = null;
    manualOrderEditing = false;
    saveState();
  } else {
    restoreManualOrderSnapshot();
    manualOrderEditing = false;
    saveState();
  }
  updateOrderModeUi();
  renderProducts();
}

function restoreManualOrderSnapshot() {
  if (!manualOrderSnapshot) return;
  state.orderLists = JSON.parse(JSON.stringify(manualOrderSnapshot));
  manualOrderSnapshot = null;
}

function restoreManualOrderSource() {
  if (!manualOrderSnapshot?.[manualOrderSource]) return;
  state.orderLists[manualOrderSource] = [...manualOrderSnapshot[manualOrderSource]];
}

function changeQty(node, delta, syncItem) {
  const input = node.querySelector(".qty");
  const next = Math.max(0, (Number(input.value) || 0) + delta);
  input.value = next || "";
  syncItem();
}

function changeHalf(node, delta, syncItem) {
  const input = node.querySelector(".qty-fraction");
  const current = Number(input.value) || 0;
  const next = Math.max(0, Math.min(0.5, current + delta));
  input.value = next || "";
  node.querySelector(".half-display").textContent = next ? "1/2" : "0";
  syncItem();
}

function updateProductNode(node, product, item) {
  const cost = unitCost(product, item);
  const sale = salePrice(product, item);
  const total = totalCost(item);
  const saleInput = node.querySelector(".sale-price-input");
  node.classList.toggle("selected-product", orderQty(item) > 0);
  node.querySelector(".unit-cost").textContent = `${money.format(cost)} / ${product.baseUnit}`;
  node.querySelector(".product-total").textContent = money.format(total);
  if (document.activeElement !== saleInput) {
    saleInput.value = sale ? formatInputNumber(sale) : "";
  }
}

function renderShareList() {
  const rows = quantityLines();
  const groups = groupRows(rows, row => row.vendor?.id || "sem");
  vendorShareList.innerHTML = "";
  if (!rows.length || orderMode !== "select") return;

  for (const [vendorId, lines] of groups) {
    const vendor = state.vendors.find(v => v.id === vendorId);
    const item = document.createElement("div");
    item.className = "share-item";
    item.innerHTML = `<strong>${escapeHtml(titleText(vendor?.name || "Sem Fornecedor"))}</strong><button type="button">WhatsApp</button>`;
    item.querySelector("button").addEventListener("click", () => shareVendor(lines));
    vendorShareList.appendChild(item);
  }
}

function renderCostSummary() {
  const rows = quantityLines();
  const total = rows.reduce((sum, row) => sum + totalCost(row.item), 0);
  const pending = rows.filter(row => !(Number(row.item.boxPrice) > 0)).length;
  costSummary.classList.toggle("hidden", orderMode !== "cost");
  costTools.classList.toggle("hidden", orderMode !== "cost");
  pendingOnlyInput.checked = pendingOnly;
  costSummary.innerHTML = `
    <div>Itens<strong>${rows.length}</strong></div>
    <div>Sem Custo<strong>${pending}</strong></div>
    <div>Total<strong>${money.format(total)}</strong></div>
  `;
}

function groupRows(rows, getKey) {
  const groups = new Map();
  for (const row of rows) {
    const key = getKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

function parseCostImportText(text) {
  const rows = [];
  const lines = String(text || "")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  let context = null;

  for (const line of lines) {
    if (isIgnoredCostLine(line)) continue;
    const matchInLine = findBestProduct(line);
    const numbers = extractNumbers(line);
    if (matchInLine.product && (!numbers.length || numbers.every(item => item.value < 5))) {
      context = {
        ...matchInLine,
        quantity: extractQuantity(line, { allowLeading: true })
      };
      continue;
    }

    if (!numbers.length) continue;

    const usingContext = Boolean(!matchInLine.product && context && isContextPriceLine(line, numbers));
    const lineHasUsefulProductText = hasUsefulProductText(line) && !isMostlyNumberLine(line);
    const match = matchInLine.product ? matchInLine : (usingContext ? context : { product: null, score: 0, ambiguous: false });
    if (!match.product && !lineHasUsefulProductText) continue;
    if (!match.product) continue;

    const price = usingContext ? pickContextCostValue(numbers, context?.quantity) : pickCostValue(line, numbers);
    if (!price || price < 5) continue;
    const quantity = usingContext && context?.quantity ? context.quantity : extractQuantity(line, { allowLeading: true });
    const product = match.product;
    const status = match.ambiguous || match.score < 3 ? "duvidoso" : "ok";
    rows.push({
      id: crypto.randomUUID(),
      source: line,
      productId: product?.id || "",
      qty: quantity.qty,
      fraction: quantity.fraction,
      price,
      apply: status === "ok",
      status
    });
    if (!matchInLine.product && (!usingContext || isMostlyNumberLine(line))) context = null;
  }

  return rows;
}

function isIgnoredCostLine(line) {
  const text = normalizeName(line);
  return hasAny(text, [
    "total", "desconto", "valor pago", "forma de pagamento", "pedido", "data", "cliente",
    "placa", "local", "vendedor", "fone", "telefone", "box", "ceasa", "cnp", "gpn",
    "avenida", "av", "rua", "consumidor", "obrigado", "preferencia", "cupom", "fiscal",
    "listagem", "separacao", "descricao", "qtde", "unit", "vl tot"
  ]);
}

function isMostlyNumberLine(line) {
  const compact = String(line || "").replace(/\s+/g, "");
  const numeric = compact.replace(/[0-9R$.,/*+-]/gi, "");
  return compact.length > 0 && numeric.length <= Math.max(1, compact.length * 0.25);
}

function hasUsefulProductText(line) {
  return normalizeName(line)
    .replace(/\b(r|rs|kg|cx|dz|un|bdj)\b/g, "")
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, "").length >= 3;
}

function isContextPriceLine(line, numbers) {
  const text = normalizeName(line);
  return isMostlyNumberLine(line)
    || numbers.some(item => item.hasCurrency)
    || text.startsWith("tipo ")
    || text.startsWith("apartir ")
    || text.startsWith("a partir ");
}

function extractNumbers(line) {
  return [...String(line || "").matchAll(/(?:R\$\s*)?(\d{1,4}(?:[,.]\d{1,2})?)/gi)]
    .map(match => ({
      raw: match[0],
      value: readNumber(match[1]),
      hasCurrency: /R\$/i.test(match[0])
    }))
    .filter(item => Number(item.value) > 0);
}

function pickCostValue(line, numbers) {
  const currency = numbers.filter(item => item.hasCurrency);
  if (currency.length) return currency.at(-1).value;
  const lower = normalizeName(line);
  if (/\b(vl\s*unit|unitario|unit)\b/i.test(line) || lower.includes("cx")) {
    const prices = numbers.filter(item => item.value >= 5);
    if (prices.length >= 2) return prices.at(-2).value;
  }
  return numbers.at(-1).value;
}

function pickContextCostValue(numbers, quantity) {
  const prices = numbers.filter(item => item.value >= 5);
  if (!prices.length) return 0;
  const qty = Number(quantity?.qty || 0) + Number(quantity?.fraction || 0);
  if (qty > 1 && prices.length >= 2) return prices[0].value;
  return prices.at(-1).value;
}

function extractQuantity(line, options = {}) {
  const matches = [...String(line || "").matchAll(/(\d+(?:[,.]\d+)?)\s*(cx|dz|un|bdj|caixa|duzia|d[uú]zia)\b/gi)];
  const match = matches.find(item => /^(cx|caixa)$/i.test(item[2])) || matches.find(item => /^(dz|duzia|d[uú]zia|un)$/i.test(item[2])) || matches[0];
  const leading = options.allowLeading ? String(line || "").trim().match(/^(\d+(?:[,.]\d+)?)(?=\s*[A-Za-zÀ-ÿ])/i) : null;
  const quantity = match ? readNumber(match[1]) : (leading ? readNumber(leading[1]) : 0);
  if (quantity >= 1) return { qty: Math.floor(quantity), fraction: quantity % 1 >= 0.5 ? 0.5 : 0 };
  if (quantity > 0) return { qty: 0, fraction: 0.5 };
  return { qty: "", fraction: 0 };
}

function findBestProduct(source) {
  const text = normalizeName(source);
  const candidates = [...state.products]
    .sort((a, b) => Number(orderQty(orderItem(b.id)) > 0) - Number(orderQty(orderItem(a.id)) > 0));
  const scored = candidates
    .map(product => ({ product, score: productMatchScore(product, text) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 2) return { product: null, score: best?.score || 0, ambiguous: false };
  return {
    product: best.product,
    score: best.score,
    ambiguous: Boolean(best && scored[1] && best.score - scored[1].score < 2)
  };
}

function productMatchScore(product, text) {
  const name = normalizeName(product.name);
  if (!name || !text) return 0;
  if (text.includes(name)) return 8 + name.split(" ").length;
  const tokens = name.split(" ").filter(token => token.length > 2 && !["top", "papelao", "capixaba", "bdj"].includes(token) && !/^c\d+$/.test(token));
  let score = 0;
  for (const token of tokens) {
    if (text.includes(token)) score += token.length > 5 ? 2 : 1;
  }
  if (product.code && text.includes(String(product.code))) score += 6;
  if (orderQty(orderItem(product.id)) > 0) score += 1;
  return score;
}

function renderCostImportReview() {
  costImportReview.classList.toggle("hidden", !costImportRows.length);
  if (!costImportRows.length) {
    costImportReview.innerHTML = "";
    return;
  }

  const options = state.products
    .map(product => `<option value="${product.id}">${escapeHtml(productLabel(product))}</option>`)
    .join("");
  costImportReview.innerHTML = `
    <div class="import-review-footer">
      <strong>${costImportRows.length} Valores Encontrados Para Conferir</strong>
      <button id="applyCostImportBtn" type="button">Aplicar Custos Aprovados</button>
    </div>
    ${costImportRows.map(row => `
      <div class="import-row" data-import-row="${row.id}">
        <label class="check-row"><input class="import-apply" type="checkbox" ${row.apply ? "checked" : ""}></label>
        <label class="import-product-label">Produto
          <select class="import-product">
            <option value="">Nao Encontrado</option>
            ${options}
          </select>
          <small>${escapeHtml(row.source)}</small>
          <span class="import-status ${row.status}">${escapeHtml(statusLabel(row.status))}</span>
        </label>
        <label class="import-qty-label">Qtd<input class="import-qty" type="text" inputmode="decimal" value="${escapeHtml(importQtyValue(row))}"></label>
        <label class="import-price-label">Custo<input class="import-price" type="text" inputmode="decimal" value="${escapeHtml(formatInputNumber(row.price))}"></label>
        <label class="import-half-label">Meia
          <select class="import-half">
            <option value="0">Nao</option>
            <option value="0.5" ${Number(row.fraction) >= 0.5 ? "selected" : ""}>Sim</option>
          </select>
        </label>
      </div>`).join("")}
  `;

  for (const row of costImportRows) {
    const node = costImportReview.querySelector(`[data-import-row="${CSS.escape(row.id)}"]`);
    node.querySelector(".import-product").value = row.productId;
  }
}

function statusLabel(status) {
  if (status === "ok") return "Ok";
  if (status === "duvidoso") return "Duvidoso";
  return "Nao Encontrado";
}

function importQtyValue(row) {
  const qty = Number(row.qty) || 0;
  const fraction = Number(row.fraction) || 0;
  return qty || fraction ? formatQty(qty + fraction) : "";
}

function syncCostImportRows() {
  for (const node of costImportReview.querySelectorAll(".import-row")) {
    const row = costImportRows.find(item => item.id === node.dataset.importRow);
    if (!row) continue;
    row.apply = node.querySelector(".import-apply").checked;
    row.productId = node.querySelector(".import-product").value;
    const qty = readNumber(node.querySelector(".import-qty").value);
    row.qty = qty >= 1 ? Math.floor(qty) : 0;
    row.fraction = Number(node.querySelector(".import-half").value) || (qty > 0 && qty < 1 ? 0.5 : (qty % 1 >= 0.5 ? 0.5 : 0));
    row.price = readNumber(node.querySelector(".import-price").value);
  }
}

function analyzeCostText(text) {
  costImportRows = parseCostImportText(text);
  renderCostImportReview();
  if (!costImportRows.length) alert("Nao Encontrei Produtos E Valores Nesse Texto.");
}

function applyCostImport() {
  syncCostImportRows();
  const rows = costImportRows.filter(row => row.apply && row.productId && row.price > 0);
  if (!rows.length) return alert("Marque Pelo Menos Um Valor Para Aplicar.");
  const overwrites = rows.filter(row => Number(orderItem(row.productId).boxPrice) > 0);
  if (overwrites.length && !confirm("Alguns Produtos Ja Tem Custo. Substituir Esses Valores?")) return;

  for (const row of rows) {
    const item = orderItem(row.productId);
    if (Number(row.qty) > 0 || Number(row.fraction) > 0) {
      item.qty = Number(row.qty) || 0;
      item.fraction = Number(row.fraction) >= 0.5 ? 0.5 : 0;
    }
    item.boxPrice = row.price;
  }

  costImportRows = [];
  costMessageInput.value = "";
  costTextPanel.classList.add("hidden");
  renderAll();
  requestAnimationFrame(focusNextCost);
}

function clearCostImport() {
  costImportRows = [];
  costMessageInput.value = "";
  costTextPanel.classList.add("hidden");
  renderCostImportReview();
}

function shareVendor(lines) {
  const rows = quantityLines(lines);
  if (!rows.length) return alert("Selecione A Quantidade De Pelo Menos Um Produto.");
  openWhatsApp(buildMessage(rows));
}

function shareAll() {
  const rows = quantityLines();
  if (!rows.length) return alert("Selecione A Quantidade De Pelo Menos Um Produto.");
  openWhatsApp(buildMessage(rows));
}

function buildMessage(lines) {
  const body = lines
    .map(({ product, item }) => `${formatPackageQty(product, item)} - ${product.name}`)
    .join("\n");
  return `Bom Dia Pedido Kombi 6878
Somente Produtos De Primeira

${body}

6 Do Banco Apartir Das 14:30
Mandar Valor`;
}

function formatPackageQty(product, item) {
  const full = Number(item.qty) || 0;
  const half = Number(item.fraction) >= 0.5;
  const packageName = product.packageLabel || "cx";
  if (!full && half) return `meia ${packageName}`;
  if (full && half) return `${formatQty(full)} ${packageName} e meia`;
  return `${formatQty(full)} ${packageName}`;
}

function openWhatsApp(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

function exportCsv() {
  const rows = selectedLines();
  if (!rows.length) return alert("Selecione Pelo Menos Um Produto.");
  const header = ["Fornecedor", "Codigo", "Produto", "Embalagem", "Qtd Caixas", "Custo Embalagem", "Custo Kg/Un", "Total Custo"];
  const csvRows = [header, ...rows.map(({ vendor, product, item }) => [
    vendor?.name || "",
    product.code || "",
    product.name,
    `${product.packageLabel} ${formatQty(product.packageSize)}${product.baseUnit}`,
    orderQty(item),
    item.boxPrice || 0,
    unitCost(product, item).toFixed(2),
    totalCost(item).toFixed(2)
  ])];
  downloadFile(`entrada-weber-${dateStamp()}.csv`, toCsv(csvRows), "text/csv;charset=utf-8");
}

async function exportWeberTxt() {
  const rows = quantityLines();
  if (!rows.length) return alert("Selecione Pelo Menos Um Produto Com Quantidade.");

  const missingCode = rows.filter(({ product }) => !product.code);
  if (missingCode.length) {
    return alert(`Produtos Sem Codigo:\n${missingCode.map(({ product }) => titleText(product.name)).join("\n")}`);
  }

  const missingCost = rows.filter(({ item }) => !(Number(item.boxPrice) > 0));
  if (missingCost.length) {
    return alert(`Produtos Sem Custo:\n${missingCost.map(({ product }) => productLabel(product)).join("\n")}`);
  }

  const lines = rows.map(({ product, item }, index) => {
    const qty = orderQty(item);
    return [
      product.code,
      formatTxtQty(qty)
    ].join(",");
  });
  const name = `weber-entrada-${dateStamp()}.txt`;
  const content = lines.join("\r\n");
  await sendFileToDrive(name, content, "text/plain", "Entrada Weber TXT", "Arquivo TXT Para Importar No Weber.");
}

async function exportWeberXml() {
  const rows = quantityLines();
  if (!rows.length) return alert("Selecione Pelo Menos Um Produto Com Quantidade.");

  const missingCode = rows.filter(({ product }) => !product.code);
  if (missingCode.length) {
    return alert(`Produtos Sem Codigo:\n${missingCode.map(({ product }) => titleText(product.name)).join("\n")}`);
  }

  const missingCost = rows.filter(({ item }) => !(Number(item.boxPrice) > 0));
  if (missingCost.length) {
    return alert(`Produtos Sem Custo:\n${missingCost.map(({ product }) => productLabel(product)).join("\n")}`);
  }

  ensureWeberXml();
  const noteNumber = nextWeberXmlNumber();
  const total = rows.reduce((sum, row) => sum + totalCost(row.item), 0);
  if (!confirm(`Gerar XML Weber MOD 99?\nNota: ${noteNumber}\nItens: ${rows.length}\nTotal: ${money.format(total)}`)) return;

  const content = buildWeberXml(rows, noteNumber);
  markWeberXmlNumberUsed(noteNumber);
  saveState();
  const name = `weber-entrada-${dateStamp()}-${noteNumber}.xml`;
  await sendFileToDrive(name, content, "application/xml", "Entrada Weber XML", "Arquivo XML MOD 99 Para Importar No Weber.");
}

function nextWeberXmlNumber() {
  ensureWeberXml();
  const used = new Set(state.weberXml.usedNumbers.map(Number));
  let number = Math.max(1, Math.floor(Number(state.weberXml.nextNumber) || 900001));
  while (used.has(number)) number += 1;
  return number;
}

function markWeberXmlNumberUsed(number) {
  ensureWeberXml();
  const used = new Set(state.weberXml.usedNumbers.map(Number));
  used.add(Number(number));
  state.weberXml.usedNumbers = [...used].sort((a, b) => a - b);
  state.weberXml.nextNumber = Math.max(Number(number) + 1, nextWeberXmlNumber());
}

function buildWeberXml(rows, noteNumber) {
  const issuedAt = new Date();
  const issueDate = formatXmlDate(issuedAt);
  const accessKey = buildWeberXmlKey(noteNumber, issuedAt);
  const accessId = `NFe${accessKey}`;
  const checkDigit = accessKey.slice(-1);
  const total = rows.reduce((sum, row) => sum + totalCost(row.item), 0);
  const det = rows.map((row, index) => buildWeberXmlItem(row, index + 1)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe versao="4.00" Id="${accessId}">
      <ide>
        <cUF>43</cUF>
        <cNF>${String(noteNumber).slice(-8).padStart(8, "0")}</cNF>
        <natOp>ENTRADA PEDIDO CEASA</natOp>
        <mod>99</mod>
        <serie>0</serie>
        <nNF>${noteNumber}</nNF>
        <dhEmi>${issueDate}</dhEmi>
        <dhSaiEnt>${issueDate}</dhSaiEnt>
        <tpNF>0</tpNF>
        <idDest>1</idDest>
        <cMunFG>4314902</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <cDV>${checkDigit}</cDV>
        <tpAmb>1</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>0</indFinal>
        <indPres>9</indPres>
        <procEmi>0</procEmi>
        <verProc>PedidoCeasa</verProc>
      </ide>
      <emit>
        <CNPJ>${WEBER_XML_EMIT_CNPJ}</CNPJ>
        <xNome>PRIMO COMERCIO DE FRUTAS LTDA</xNome>
        <xFant>COMERCIO DE FRUTAS DO PRIMO</xFant>
        <enderEmit>
          <xLgr>AVENIDA FERNANDO FERRARI</xLgr>
          <nro>1001</nro>
          <xCpl>BOX 13 D-2</xCpl>
          <xBairro>ANCHIETA</xBairro>
          <cMun>4314902</cMun>
          <xMun>PORTO ALEGRE</xMun>
          <UF>RS</UF>
          <CEP>90200041</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderEmit>
        <IE>0963029983</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        <CNPJ>${WEBER_XML_DEST_CNPJ}</CNPJ>
        <xNome>MERCADO SAO JOSE LTDA</xNome>
        <enderDest>
          <xLgr>RUA JOAO LEIVAS DE CARVALHO</xLgr>
          <nro>244</nro>
          <xBairro>MERCADO SAO JOSE</xBairro>
          <cMun>4304606</cMun>
          <xMun>CANOAS</xMun>
          <UF>RS</UF>
          <CEP>92000000</CEP>
          <cPais>1058</cPais>
          <xPais>BRASIL</xPais>
        </enderDest>
        <indIEDest>9</indIEDest>
      </dest>
${det}
      <total>
        <ICMSTot>
          <vBC>0.00</vBC>
          <vICMS>0.00</vICMS>
          <vICMSDeson>0.00</vICMSDeson>
          <vFCP>0.00</vFCP>
          <vBCST>0.00</vBCST>
          <vST>0.00</vST>
          <vFCPST>0.00</vFCPST>
          <vFCPSTRet>0.00</vFCPSTRet>
          <vProd>${formatXmlMoney(total)}</vProd>
          <vFrete>0.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>0.00</vDesc>
          <vII>0.00</vII>
          <vIPI>0.00</vIPI>
          <vIPIDevol>0.00</vIPIDevol>
          <vPIS>0.00</vPIS>
          <vCOFINS>0.00</vCOFINS>
          <vOutro>0.00</vOutro>
          <vNF>${formatXmlMoney(total)}</vNF>
        </ICMSTot>
      </total>
      <transp>
        <modFrete>9</modFrete>
      </transp>
    </infNFe>
  </NFe>
</nfeProc>`;
}

function buildWeberXmlItem({ product, item }, number) {
  const qty = orderQty(item);
  const unit = xmlUnit(product);
  const subtotal = totalCost(item);
  const unitCostValue = qty ? subtotal / qty : 0;
  return `      <det nItem="${number}">
        <prod>
          <cProd>${xmlEscape(product.code)}</cProd>
          <cEAN>SEM GTIN</cEAN>
          <xProd>${xmlEscape(titleText(product.name))}</xProd>
          <NCM>00000000</NCM>
          <CFOP>5102</CFOP>
          <uCom>${xmlEscape(unit)}</uCom>
          <qCom>${formatXmlQty(qty)}</qCom>
          <vUnCom>${formatXmlUnitMoney(unitCostValue)}</vUnCom>
          <vProd>${formatXmlMoney(subtotal)}</vProd>
          <cEANTrib>SEM GTIN</cEANTrib>
          <uTrib>${xmlEscape(unit)}</uTrib>
          <qTrib>${formatXmlQty(qty)}</qTrib>
          <vUnTrib>${formatXmlUnitMoney(unitCostValue)}</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <ICMS><ICMS00><orig>0</orig><CST>00</CST><modBC>3</modBC><vBC>0.00</vBC><pICMS>0.00</pICMS><vICMS>0.00</vICMS></ICMS00></ICMS>
          <PIS><PISOutr><CST>99</CST><vBC>0.00</vBC><pPIS>0.00</pPIS><vPIS>0.00</vPIS></PISOutr></PIS>
          <COFINS><COFINSOutr><CST>99</CST><vBC>0.00</vBC><pCOFINS>0.00</pCOFINS><vCOFINS>0.00</vCOFINS></COFINSOutr></COFINS>
        </imposto>
      </det>`;
}

function buildWeberXmlKey(noteNumber, date) {
  const yearMonth = String(date.getFullYear()).slice(-2) + String(date.getMonth() + 1).padStart(2, "0");
  const model = "99";
  const series = "000";
  const number = String(noteNumber).padStart(9, "0").slice(-9);
  const emission = "1";
  const code = String(noteNumber).slice(-8).padStart(8, "0");
  const base = `43${yearMonth}${WEBER_XML_EMIT_CNPJ}${model}${series}${number}${emission}${code}`;
  return `${base}${nfeCheckDigit(base)}`;
}

function nfeCheckDigit(base) {
  let weight = 2;
  let sum = 0;
  for (let index = base.length - 1; index >= 0; index -= 1) {
    sum += Number(base[index]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  const digit = 11 - remainder;
  return digit >= 10 ? 0 : digit;
}

function formatXmlDate(date) {
  const pad = value => String(value).padStart(2, "0");
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = pad(Math.floor(Math.abs(offset) / 60));
  const minutes = pad(Math.abs(offset) % 60);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${hours}:${minutes}`;
}

function formatXmlMoney(value) {
  return Number(value || 0).toFixed(2);
}

function formatXmlUnitMoney(value) {
  return Number(value || 0).toFixed(10);
}

function formatXmlQty(value) {
  return Number(value || 0).toFixed(4);
}

function xmlUnit(product) {
  return normalizeName(product.packageLabel || "cx").toUpperCase().slice(0, 6) || "UN";
}

function xmlEscape(value) {
  return String(value ?? "").replace(/[<>&"']/g, char => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
  }[char]));
}

async function sendFileToDrive(name, content, type, title, text) {
  const file = new File([content], name, { type });
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        files: [file]
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  downloadFile(name, content, `${type};charset=utf-8`);
  alert("Nao Foi Possivel Abrir O Envio Direto. O Arquivo Foi Baixado; Envie Esse Arquivo Para O Google Drive.");
}

function saveOrder() {
  const rows = selectedLines();
  if (!rows.length) return alert("Selecione Pelo Menos Um Produto.");
  state.history.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), rows });
  state.order = {};
  renderAll();
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!state.history.length) {
    historyList.innerHTML = `<div class="empty">Nenhum Pedido Salvo.</div>`;
    return;
  }
  for (const entry of state.history) {
    const total = entry.rows.reduce((sum, row) => sum + totalCost(row.item), 0);
    const el = document.createElement("div");
    el.className = "history-item";
    el.innerHTML = `<div><strong>${new Date(entry.date).toLocaleString("pt-BR")}</strong><p>${entry.rows.length} Itens - ${money.format(total)}</p></div><button type="button">Reabrir</button>`;
    el.querySelector("button").addEventListener("click", () => {
      state.order = {};
      for (const row of entry.rows) state.order[row.product.id] = row.item;
      switchView("pedido");
      renderAll();
    });
    historyList.appendChild(el);
  }
}

function renderEdits() {
  vendorList.innerHTML = state.vendors.map(v => `
    <div class="edit-item">
      <div><strong>${escapeHtml(titleText(v.name))}</strong><p>${state.products.filter(p => p.vendorId === v.id).length} Produtos</p></div>
      <div><button data-edit-vendor="${v.id}" type="button">Editar</button><button data-del-vendor="${v.id}" class="danger" type="button">Excluir</button></div>
    </div>`).join("");

  editableProductList.innerHTML = state.products.map(p => {
    const vendor = state.vendors.find(v => v.id === p.vendorId);
    return `<div class="edit-item product-edit-item">
      <img class="edit-product-image" src="${escapeHtml(productImage(p))}" alt="${escapeHtml(p.name)}">
      <div class="edit-product-info">
        <strong>${escapeHtml(productLabel(p))}</strong>
        <div class="edit-product-meta">
          <span>${escapeHtml(titleText(vendor?.name || "Sem fornecedor"))}</span>
          <span>${escapeHtml(titleText(p.packageLabel))} ${formatQty(p.packageSize)}${titleText(p.baseUnit)}</span>
          <span>Markup ${formatInputNumber(p.markup || 0)}%</span>
        </div>
      </div>
      <div class="edit-actions"><button data-edit-product="${p.id}" type="button">Editar</button><button data-del-product="${p.id}" class="danger" type="button">Excluir</button></div>
      <div class="inline-product-form-slot" data-product-form-slot="${p.id}"></div>
    </div>`;
  }).join("");
  placeProductForm(productId.value);
}

function placeProductForm(productIdValue = "") {
  openProductFormBtn.classList.toggle("hidden", productFormOpen || Boolean(productIdValue));
  if (!productFormOpen && !productIdValue) {
    productForm.remove();
    return;
  }
  const target = productIdValue
    ? document.querySelector(`[data-product-form-slot="${CSS.escape(productIdValue)}"]`)
    : productFormSlot;
  (target || productFormSlot).appendChild(productForm);
  productForm.classList.toggle("inline-editing", Boolean(productIdValue));
}

function handleEditClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const editVendor = target.dataset.editVendor;
  const delVendor = target.dataset.delVendor;
  const editProduct = target.dataset.editProduct;
  const delProduct = target.dataset.delProduct;

  if (editVendor) {
    const vendor = state.vendors.find(v => v.id === editVendor);
    vendorId.value = vendor.id;
    vendorName.value = vendor.name;
  }
  if (delVendor && confirm("Excluir Fornecedor E Produtos Dele?")) {
    state.vendors = state.vendors.filter(v => v.id !== delVendor);
    state.products = state.products.filter(p => p.vendorId !== delVendor);
    renderAll();
  }
  if (editProduct) {
    if (productId.value === editProduct) {
      clearProductForm();
      return;
    }
    productFormOpen = true;
    const product = state.products.find(p => p.id === editProduct);
    productId.value = product.id;
    productVendor.value = product.vendorId;
    productCode.value = product.code || "";
    productName.value = product.name;
    packageLabel.value = product.packageLabel;
    packageSize.value = product.packageSize;
    baseUnit.value = product.baseUnit;
    productMarkup.value = product.markup ? formatInputNumber(product.markup) : "";
    productImageUrl.value = product.image || "";
    updateProductImagePreview();
    placeProductForm(editProduct);
    productForm.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  if (delProduct && confirm("Excluir Produto?")) {
    state.products = state.products.filter(p => p.id !== delProduct);
    delete state.order[delProduct];
    renderAll();
  }
}

function saveVendor(event) {
  event.preventDefault();
  const name = vendorName.value.trim();
  if (!name) return;
  if (vendorId.value) {
    state.vendors.find(v => v.id === vendorId.value).name = name;
  } else {
    state.vendors.push({ id: crypto.randomUUID(), name, order: state.vendors.length + 1 });
  }
  clearVendorForm();
  renderAll();
}

function saveProduct(event) {
  event.preventDefault();
  const data = {
    vendorId: productVendor.value,
    code: productCode.value.trim() || codeForProductName(productName.value),
    name: productName.value.trim(),
    packageLabel: packageLabel.value.trim() || "cx",
    packageSize: Number(packageSize.value) || 1,
    baseUnit: baseUnit.value,
    markup: readNumber(productMarkup.value),
    order: Number(state.products.find(p => p.id === productId.value)?.order) || state.products.length + 1,
    image: productImageUrl.value.trim()
  };
  if (productId.value) {
    Object.assign(state.products.find(p => p.id === productId.value), data);
  } else {
    state.products.push({ id: crypto.randomUUID(), ...data });
  }
  ensureOrderLists();
  clearProductForm();
  renderAll();
}

function clearVendorForm() {
  vendorId.value = "";
  vendorName.value = "";
}

function clearProductForm() {
  productFormOpen = false;
  productId.value = "";
  productCode.value = "";
  productName.value = "";
  packageLabel.value = "cx";
  packageSize.value = "1";
  baseUnit.value = "kg";
  productMarkup.value = "";
  productImageUrl.value = "";
  productImageFile.value = "";
  updateProductImagePreview();
  placeProductForm("");
}

function openNewProductForm() {
  productFormOpen = true;
  productId.value = "";
  productCode.value = "";
  productName.value = "";
  packageLabel.value = "cx";
  packageSize.value = "1";
  baseUnit.value = "kg";
  productMarkup.value = "";
  productImageUrl.value = "";
  productImageFile.value = "";
  updateProductImagePreview();
  placeProductForm("");
}

function updateProductImagePreview() {
  const value = productImageUrl.value.trim();
  productImagePreview.src = value || productImage({ name: productName.value || "produto" });
  productImagePreview.alt = productName.value || "Produto";
}

function readProductImageFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) return alert("Escolha Um Arquivo De Imagem.");
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    productImageUrl.value = String(reader.result || "");
    updateProductImagePreview();
  });
  reader.readAsDataURL(file);
}

function backup() {
  downloadFile(`backup-pedido-ceasa-${dateStamp()}.json`, JSON.stringify(state, null, 2), "application/json");
}

async function restoreBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!confirm("Restaurar backup vai substituir os dados atuais. Continuar?")) return;
  state = JSON.parse(await file.text());
  migrateProducts(state);
  renderAll();
  event.target.value = "";
}

function switchView(viewId) {
  document.querySelectorAll(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.view === viewId));
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === viewId));
}

function switchOrderMode(mode) {
  orderMode = mode;
  updateOrderModeUi();
  renderProducts();
  renderShareList();
  renderCostSummary();
  if (mode === "cost") requestAnimationFrame(focusNextCost);
}

function updateOrderModeUi() {
  selectModeBtn.classList.toggle("active", orderMode === "select");
  costModeBtn.classList.toggle("active", orderMode === "cost");
  const canEditOrder = productSortMode === "manual" || productSortMode === "favorites";
  manualOrderBtn.classList.toggle("hidden", !canEditOrder);
  orderSaveTargetWrap.classList.toggle("hidden", !manualOrderEditing);
  manualOrderBtn.textContent = manualOrderEditing ? "Salvar Ordem" : "Editar Ordem";
}

function isEnterKey(event) {
  return event.key === "Enter" || event.keyCode === 13 || event.which === 13;
}

function focusNextCost(currentCard = null) {
  if (currentCard) {
    const inputs = [...document.querySelectorAll(".cost-mode .product-card .box-price")];
    const current = currentCard.querySelector(".box-price");
    const next = inputs[inputs.indexOf(current) + 1];
    if (next) {
      next.focus();
      next.select?.();
      return;
    }
    current.blur();
    return;
  }

  const empty = [...document.querySelectorAll(".cost-mode .box-price")]
    .find(input => !readNumber(input.value));
  const target = empty || document.querySelector(".cost-mode .box-price");
  if (target) {
    target.focus();
    target.select?.();
  }
}

function updateStatus() {
  const rows = selectedLines();
  const total = rows.reduce((sum, row) => sum + totalCost(row.item), 0);
  orderStatus.textContent = rows.length ? `${rows.length} Itens - ${money.format(total)}` : "Pedido Em Aberto";
}

function formatQty(value) {
  return Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function toCsv(rows) {
  return rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
}

function formatTxtNumber(value) {
  return Number(value || 0).toFixed(2);
}

function formatTxtQty(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function formatWeberNumber(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function formatWeberQty(value) {
  return Number(value || 0).toFixed(3).replace(".", ",");
}

function formatInputNumber(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
document.addEventListener("click", event => {
  const target = event.target.closest?.("button");
  if (target?.id === "selectModeBtn") switchOrderMode("select");
  if (target?.id === "costModeBtn") switchOrderMode("cost");
});
document.addEventListener("keydown", event => {
  if (!["Enter", " "].includes(event.key)) return;
  if (event.target?.id === "selectModeBtn") switchOrderMode("select");
  if (event.target?.id === "costModeBtn") switchOrderMode("cost");
});
vendorFilter.addEventListener("change", renderProducts);
productSort.addEventListener("change", () => {
  if (manualOrderEditing) finishManualOrderEdit();
  productSortMode = productSort.value;
  manualOrderEditing = false;
  manualOrderSnapshot = null;
  localStorage.setItem(SORT_KEY, productSortMode);
  updateOrderModeUi();
  renderProducts();
});
manualOrderBtn.addEventListener("click", () => {
  if (manualOrderEditing) {
    finishManualOrderEdit();
  } else {
    startManualOrderEdit();
  }
});
selectModeBtn.addEventListener("click", () => switchOrderMode("select"));
costModeBtn.addEventListener("click", () => switchOrderMode("cost"));
pendingOnlyInput.addEventListener("change", () => {
  pendingOnly = pendingOnlyInput.checked;
  renderProducts();
  renderCostSummary();
  requestAnimationFrame(focusNextCost);
});
nextCostBtn.addEventListener("click", focusNextCost);
openCostTextBtn.addEventListener("click", () => {
  costTextPanel.classList.toggle("hidden");
  if (!costTextPanel.classList.contains("hidden")) costMessageInput.focus();
});
parseCostTextBtn.addEventListener("click", () => analyzeCostText(costMessageInput.value));
clearCostImportBtn.addEventListener("click", clearCostImport);
readCostPhotoBtn.addEventListener("click", () => {
  if (window.AndroidBridge?.readCostPhoto) {
    window.AndroidBridge.readCostPhoto();
    return;
  }
  alert("A Leitura De Foto Funciona No App Android Instalado.");
});
costImportReview.addEventListener("input", syncCostImportRows);
costImportReview.addEventListener("change", syncCostImportRows);
costImportReview.addEventListener("click", event => {
  if (event.target?.id === "applyCostImportBtn") applyCostImport();
});
exportTxtBtn.addEventListener("click", exportWeberTxt);
exportXmlBtn.addEventListener("click", exportWeberXml);
saveOrderBtn.addEventListener("click", saveOrder);
clearOrderBtn.addEventListener("click", () => {
  if (confirm("Zerar Pedido Atual?")) {
    state.order = {};
    renderAll();
  }
});
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Limpar Todo O Historico?")) {
    state.history = [];
    renderAll();
  }
});
vendorForm.addEventListener("submit", saveVendor);
productForm.addEventListener("submit", saveProduct);
newVendorBtn.addEventListener("click", clearVendorForm);
openProductFormBtn.addEventListener("click", openNewProductForm);
newProductBtn.addEventListener("click", clearProductForm);
productImageFile.addEventListener("change", readProductImageFile);
productImageUrl.addEventListener("input", updateProductImagePreview);
productMarkup.addEventListener("blur", event => {
  const value = readNumber(event.currentTarget.value);
  event.currentTarget.value = value ? formatInputNumber(value) : "";
});
productName.addEventListener("input", () => {
  if (!productImageUrl.value.trim()) updateProductImagePreview();
});
clearProductImageBtn.addEventListener("click", () => {
  productImageUrl.value = "";
  productImageFile.value = "";
  updateProductImagePreview();
});
vendorList.addEventListener("click", handleEditClick);
editableProductList.addEventListener("click", handleEditClick);
downloadBackupBtn.addEventListener("click", backup);
restoreBackupInput.addEventListener("change", restoreBackup);

window.receiveCostOcrText = text => {
  switchOrderMode("cost");
  costTextPanel.classList.remove("hidden");
  costMessageInput.value = String(text || "");
  analyzeCostText(costMessageInput.value);
};

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

updateProductImagePreview();
renderAll();
