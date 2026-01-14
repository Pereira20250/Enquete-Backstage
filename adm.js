const SENHA = "backstage123";
const SEMANA_FIXA = 3;

// LOGIN
function login(){
  if(document.getElementById("senha").value !== SENHA){
    alert("Senha incorreta");
    return;
  }
  document.getElementById("login").style.display="none";
  document.getElementById("painel").classList.remove("hidden");
  carregar();
}

// CARREGAR DADOS
function carregar(){
  const d = new Date();
  const ano = d.getFullYear();
  const mesNum = String(d.getMonth()+1).padStart(2,"0");
  const mesTxt = d.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});

  document.getElementById("mesRef").innerText = mesTxt;

  const key = `backstage_${ano}-${mesNum}_semana${SEMANA_FIXA}`;
  const dados = JSON.parse(localStorage.getItem(key)) || {};

  gerarTextoWhats(dados, mesTxt);
  gerarRanking(dados);
  gerarContador(dados);
}

// TEXTO IGUAL PARA WHATSAPP
function gerarTextoWhats(dados, mesTxt){
  let txt = `📋 *BACKSTAGE*\n`;
  txt += `🗓 ${mesTxt} – 3ª Semana\n\n`;

  if(Object.keys(dados).length === 0){
    txt += "⚠️ Nenhum voto registrado.";
  }

  for(let culto in dados){
    txt += `🕒 *${culto}*\n`;
    dados[culto].forEach(nome=>{
      txt += `• ${nome}\n`;
    });
    txt += `\n`;
  }

  document.getElementById("saida").value = txt;
}

// RANKING VISUAL
function gerarRanking(dados){
  const rankingDiv = document.getElementById("ranking");
  rankingDiv.innerHTML = "";

  for(let culto in dados){
    const total = dados[culto].length;
    const barra = document.createElement("div");
    barra.className = "rank-item";
    barra.innerHTML = `
      <span>${culto}</span>
      <div class="barra">
        <div class="preenchimento" style="width:${total*50}%"></div>
      </div>
      <strong>${total}</strong>
    `;
    rankingDiv.appendChild(barra);
  }
}

// CONTADOR DE PESSOAS (LÍDERES)
function gerarContador(dados){
  let total = 0;
  for(let culto in dados){
    total += dados[culto].length;
  }
  document.getElementById("contadorPessoas").innerText =
    `👥 Total de pessoas que votaram: ${total}`;
}

// COPIAR
function copiar(){
  const campo = document.getElementById("saida");
  campo.select();
  document.execCommand("copy");
  alert("📋 Copiado para WhatsApp");
}

// RELÓGIO
setInterval(()=>{
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString("pt-BR");
},1000);
