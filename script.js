const cultos = [
  "Sáb 17h (TADEL)",
  "Dom 09h30 (TADEL)",
  "Dom 11h30",
  "Dom 16h30 (TADEL)",
  "Dom 18h30",
  "Dom 20h30",
  "Seg 20h",
  "Não conseguirei servir 😢"
];

const SEMANA_FIXA = 3;
const LIMITE_POR_CULTO = 2;

// ===== DATA =====
const agora = new Date();
const ano = agora.getFullYear();
const mesNum = String(agora.getMonth() + 1).padStart(2, "0");
const mesTxt = agora.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
const storageKey = `backstage_${ano}-${mesNum}_semana${SEMANA_FIXA}`;

document.getElementById("titulo").innerText =
  "Em qual culto você consegue servir?";
document.getElementById("subtitulo").innerText =
  `3ª semana • ${mesTxt}`;

// ===== HORÁRIO DA VOTAÇÃO =====
function votacaoAberta() {
  const d = new Date();
  const dia = d.getDay();
  const hora = d.getHours();
  if (dia < 2) return false;
  if (dia > 5) return false;
  if (dia === 5 && hora >= 12) return false;
  return true;
}

// ===== CARREGAR DADOS =====
function getDados() {
  return JSON.parse(localStorage.getItem(storageKey)) || {};
}

// ===== OPÇÕES =====
const opcoesDiv = document.getElementById("opcoes");

function renderOpcoes() {
  const dados = getDados();
  opcoesDiv.innerHTML = "";

  cultos.forEach(culto => {
    const total = dados[culto]?.length || 0;
    const lotado = total >= LIMITE_POR_CULTO;

    opcoesDiv.innerHTML += `
      <label class="opcao ${lotado ? "lotado" : ""}">
        <input type="checkbox" value="${culto}" ${lotado ? "disabled" : ""}>
        <div class="texto-opcao">
          ${culto}
          ${lotado ? `<span class="status-lotado"> • LOTADO (2/2)</span>` : ""}
        </div>
      </label>
    `;
  });
}

renderOpcoes();

// ===== VOTAR =====
function votar() {
  if (!votacaoAberta())
    return msg("⛔ Votação aberta de terça até sexta às 12h");

  const nome = document.getElementById("nome").value.trim();
  if (nome.length < 3)
    return msg("⚠️ Digite seu nome completo");

  const selecionados = [...document.querySelectorAll("input:checked")];
  if (selecionados.length === 0)
    return msg("⚠️ Selecione pelo menos um culto");

  let dados = getDados();

  // 🔴 BLOQUEIO REAL
  for (let item of selecionados) {
    const culto = item.value;
    const total = dados[culto]?.length || 0;

    if (total >= LIMITE_POR_CULTO) {
      msg(`❌ NEGADO: "${culto}" já está LOTADO`);
      renderOpcoes();
      return;
    }
  }

  // ✅ SALVAR
  selecionados.forEach(item => {
    const culto = item.value;
    if (!dados[culto]) dados[culto] = [];
    if (!dados[culto].includes(nome)) {
      dados[culto].push(nome);
    }
  });

  localStorage.setItem(storageKey, JSON.stringify(dados));

  msg("✅ Voto registrado com sucesso");
  document.getElementById("nome").value = "";
  renderOpcoes();
}

// ===== UI =====
function msg(texto) {
  document.getElementById("msg").innerText = texto;
}

// ===== TEMA =====
function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// ===== RELÓGIO =====
function atualizarRelogio() {
  const d = new Date();
  document.getElementById("clock").innerText =
    d.toLocaleTimeString("pt-BR");
  document.getElementById("data").innerText =
    d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// ===== CONTADOR =====
function contador() {
  const agora = new Date();
  let fim = new Date();
  fim.setDate(agora.getDate() + ((5 - agora.getDay() + 7) % 7));
  fim.setHours(12, 0, 0, 0);

  const diff = fim - agora;
  if (diff <= 0) {
    document.getElementById("contador").innerText = "Votação encerrada";
    return;
  }

  const h = Math.floor(diff / 36e5);
  const m = Math.floor(diff / 6e4) % 60;
  document.getElementById("contador").innerText =
    `⏳ Fecha em ${h}h ${m}min`;
}
setInterval(contador, 60000);
contador();
