import { AutoTokenizer } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1";

const TOKENIZERS = [
  { key: "byte_bpe", name: "Byte-level BPE", model: "gpt2", used: "GPT-2, GPT-4, Llama", unk: null },
  { key: "bpe", name: "BPE", model: "EleutherAI/pythia-70m", used: "Pythia, GPT-NeoX", unk: null },
  { key: "wordpiece", name: "WordPiece", model: "bert-base-uncased", used: "BERT, DistilBERT", unk: "[UNK]" },
  { key: "unigram", name: "Unigram", model: "t5-small", used: "T5, XLNet, ALBERT", unk: "<unk>" },
];

const PRESETS = {
  "English": "The quick brown fox jumps over the lazy dog.",
  "Español": "El murciélago veloz comía kiwi y cigüeña, ¿qué más quieres?",
  "日本語": "吾輩は猫である。名前はまだ無い。",
  "العربية": "مرحبا بالعالم، كيف حالك اليوم؟",
  "Code": "def fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)",
  "Emoji": "Launch day 🚀🔥 let's gooo 😅👍🏽",
  "Made-up": "Supercalifragilisticexpialidocious flibbertigibbet zorblax",
  "URL": "https://example.com/path/to/page?query=hello&lang=es#section",
};

const $ = (id) => document.getElementById(id);
const textEl = $("text");
const loaded = {};

const clean = (t) => t.replace(/[Ġ▁]/g, "·").replace(/Ċ/g, "↵");

function render(tok, text, unk) {
  const tokens = text ? tok.tokenize(text) : [];
  const unkCount = tokens.filter((t) => unk && t === unk).length;
  const chars = [...text].length;
  const ratio = tokens.length ? (chars / tokens.length).toFixed(2) : "0.00";
  const chips = tokens
    .map((t, i) => {
      const cls = unk && t === unk ? "unk" : `c${i % 4}`;
      return `<span class="chip ${cls}">${clean(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`;
    })
    .join("");
  return { count: tokens.length, unkCount, ratio, chips };
}

function update() {
  const text = textEl.value;
  for (const info of TOKENIZERS) {
    const tok = loaded[info.key];
    if (!tok) continue;
    const r = render(tok, text, info.unk);
    const card = $(`card-${info.key}`);
    card.querySelector(".n").textContent = r.count;
    card.querySelector(".r").textContent = r.ratio;
    card.querySelector(".u").textContent = r.unkCount;
    card.querySelector(".tokens").innerHTML = r.chips;
  }
}

function buildUI() {
  $("grid").innerHTML = TOKENIZERS.map(
    (t) => `<article class="card" id="card-${t.key}">
      <h2>${t.name}</h2>
      <p class="sub">${t.used} · <code>${t.model}</code></p>
      <div class="stats">
        <div><b class="n">–</b><span>tokens</span></div>
        <div><b class="r">–</b><span>chars / token</span></div>
        <div><b class="u">–</b><span>unknown</span></div>
      </div>
      <div class="tokens"></div>
    </article>`
  ).join("");

  $("presets").innerHTML = Object.keys(PRESETS)
    .map((k) => `<button type="button" data-k="${k}">${k}</button>`)
    .join("");
  $("presets").addEventListener("click", (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    textEl.value = PRESETS[k];
    update();
  });
  textEl.addEventListener("input", update);
}

async function load() {
  buildUI();
  let done = 0;
  await Promise.all(
    TOKENIZERS.map(async (info) => {
      loaded[info.key] = await AutoTokenizer.from_pretrained(info.model);
      done += 1;
      $("status").textContent = `Loaded ${done} of ${TOKENIZERS.length} tokenizers…`;
      update();
    })
  );
  $("status").textContent = "";
}

load().catch((err) => {
  $("status").textContent = `Could not load tokenizers: ${err.message}`;
});
