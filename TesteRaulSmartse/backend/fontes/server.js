require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const hoje = new Date(); 
const amanha = new Date(hoje); 
amanha.setDate(hoje.getDate() + 1); 
const hojeFormatada = hoje.toLocaleDateString("pt-BR")
const amanhaFormatada = amanha.toLocaleDateString("pt-BR");
let produtos = [
  {
    pro_id: 1,
    pro_nome: "Rolex Submariner",
    pro_status: "aguardando",
    pro_lance_inicial: 20000,
    pro_lance_atual: 20000,
    pro_tempo: "60",
    pro_data: amanhaFormatada,
    pro_quantidade: "Quantidade: 1",
    pro_comprador:'',
    pro_foto:'https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_3840/v1727080626/rolexcom/collection/family-pages/professional-watches/submariner/family-page/2024/roller/professional-watches-submariner-underwater-roller_240904_rolex_submariner_d3_373724'
  },
  {
    pro_id: 2,
    pro_nome: "Mercedes 1980",
    pro_status: "aguardando",
    pro_lance_inicial: 50000,
    pro_lance_atual: 50000,
    pro_tempo: "60",
    pro_data: amanhaFormatada,
    pro_quantidade: "Quantidade: 1",
    pro_comprador:'',
    pro_foto:'https://thegarage.com.br/wp-content/uploads/2021/07/mercedes-benz-230.jpg'
  },
  {
    pro_id: 3,
    pro_nome: "Notebook Gamer Dell",
    pro_status: "aguardando",
    pro_lance_inicial: 7000,
    pro_lance_atual: 7000,
    pro_tempo: "60",
    pro_data: amanhaFormatada,
    pro_quantidade: "Quantidade: 2",
    pro_comprador:'',
    pro_foto:'https://s2-techtudo.glbimg.com/I53qh-Baq_lrm2B-BCByUcpJcYM=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2022/K/L/pDNjiASe2yW3oj9FUtFw/g15.jpg'
  },
  {
    pro_id: 4,
    pro_nome: "Colar de Ouro 18K",
    pro_status: "aguardando",
    pro_lance_inicial: 3000,
    pro_lance_atual: 3000,
    pro_tempo: "60",
    pro_data: amanhaFormatada,
    pro_quantidade: "Quantidade: 1",
    pro_comprador:'',
    pro_foto:'https://fluiartejoias.vteximg.com.br/arquivos/ids/180897-550-550/colar-fluiarte-em-ouro-10k-malha-cordao.jpg?v=638732340369700000'
  },
  {
    pro_id: 5,
    pro_nome: "Pulseira de Ouro 18K",
    pro_status: "aberto",
    pro_lance_inicial: 3000,
    pro_lance_atual: 3500,
    pro_tempo: "50",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 1",
    pro_comprador:'',
    pro_foto:'https://images.tcdn.com.br/img/img_prod/758202/pulseira_masculina_ouro_18k_750_grumet_fecho_gaveta_oca_trava_dupla_1675_2_86c29f37fd1a42c84ca4ade56aa867e8.jpg'
  },
  {
    pro_id: 6,
    pro_nome: "Brincos de Ouro 18K",
    pro_status: "aberto",
    pro_lance_inicial: 3000,
    pro_lance_atual: 3500,
    pro_tempo: "50",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 2 ",
    pro_comprador:'',
    pro_foto:'https://massatejoias.com.br/wp-content/uploads/2019/09/brincoo-ouro-branco18k-de-diamantes-folhas-cravejadas-scaled.jpg'
  },
  {
    pro_id: 7,
    pro_nome: "Corvette C7",
    pro_status: "aberto",
    pro_lance_inicial: 500000,
    pro_lance_atual: 500000,
    pro_tempo: "50",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 1 ",
    pro_comprador:'',
    pro_foto:'https://versatille.com/wp-content/uploads/jabaaymotors_83700146_182506879524000_6786215211585467221_n-1-1.jpg'
  },
  {
    pro_id: 8,
    pro_nome: "Corvette C6",
    pro_status: "aberto",
    pro_lance_inicial: 500000,
    pro_lance_atual: 500000,
    pro_tempo: "0",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 1 ",
    pro_comprador:'',
    pro_foto:'https://www.autolist.com/6tuem73u73an/3Q8qC6ImSDukwYCNmcJZWg/9d55e82609a9e64bde14311d08f754de/2005_Chevrolet_Corvette_Conv__CX05CH_CR059.jpg'
  },
  {
    pro_id: 9,
    pro_nome: "Iphone 16",
    pro_status: "encerrado",
    pro_lance_inicial: 7000,
    pro_lance_atual: 7500,
    pro_tempo: "0",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 2 ",
    pro_comprador:'Raul Souza',
    pro_foto:'https://images.kabum.com.br/produtos/fotos/634659/iphone-16-pro-128gb-titanio-preto_1726835740_gg.jpg'
  },
  {
    pro_id: 10,
    pro_nome: "Macbook Air",
    pro_status: "encerrado",
    pro_lance_inicial: 7000,
    pro_lance_atual: 7500,
    pro_tempo: "0",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 2 ",
    pro_comprador:'Raul Souza',
    pro_foto:'https://i.ytimg.com/vi/SFV-EF_539Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBYUluirp93R9HkNoxSS5wtv6rB9g'
  },
  {
    pro_id: 11,
    pro_nome: "Macbook Pro",
    pro_status: "encerrado",
    pro_lance_inicial: 8000,
    pro_lance_atual: 8500,
    pro_tempo: "0",
    pro_data: hojeFormatada,
    pro_quantidade: "Quantidade: 1",
    pro_comprador:'Yasmin',
    pro_foto:'https://i.ytimg.com/vi/SFV-EF_539Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBYUluirp93R9HkNoxSS5wtv6rB9g'
  },
];

let timers = {};

//Funcao para iniciar a contagem regressiva 
function finalizarLeiloes() {
  const produtosEncerrados = produtos.filter(produto => produto.pro_status === "encerrado");

  if (produtosEncerrados.length > 0) {
    io.emit("leiloes_encerrados", produtosEncerrados);
  }
}
function iniciarContagemProduto(produto) {
  if (produto.pro_status !== "aberto") return;

  timers[produto.pro_id] = setInterval(() => {
    if (produto.pro_tempo > 0) {
      produto.pro_tempo -= 1;
      io.emit("atualizar_tempo", { pro_id: produto.pro_id, pro_tempo: produto.pro_tempo });
    }

    if (produto.pro_tempo === 0) {
      produto.pro_status = "encerrado";
      clearInterval(timers[produto.pro_id]);

      //Chama a função que notifica o front-end
      finalizarLeiloes();
    }
  }, 1000);
}


//Funcao para iniciar a contagem de encerramento por falta de lances
function iniciarEncerramentoAutomático(produto) {
  if (produto.pro_status !== "aberto") return;

  if (timers[produto.pro_id]) {
    clearTimeout(timers[produto.pro_id]);
  }

  timers[produto.pro_id] = setTimeout(() => {
    produto.pro_status = "encerrado";
    produto.pro_tempo = 0;
    io.emit("atualizar_produto", produto);
  }, 12000); //2 min
}

//Inicia contagem regressiva para todos os pro com status 'aberto'
produtos.forEach((produto) => {
  if (produto.pro_status === "aberto") {
    iniciarContagemProduto(produto);
    iniciarEncerramentoAutomático(produto);
  }
});

//endpoint para iniciar o leilao apos ordem do admin
app.post("/api/iniciar", (req, res) => {
  const { pro_id } = req.body;

  const produto = produtos.find((p) => p.pro_id === pro_id);
  if (!produto) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  if (produto.pro_status !== "aguardando") {
    return res.status(400).json({ message: "O produto já foi iniciado ou está encerrado." });
  }

  produto.pro_status = "aberto";
  io.emit("atualizar_produto", produto);
  iniciarContagemProduto(produto);

  res.json({ message: "Leilão iniciado com sucesso", produto });
});


//endpoint para obter os produtos
app.get("/api/produtos", (req, res) => {
  res.json(produtos);
});

//endpoint para registrar um lance
app.post("/api/lance", (req, res) => {
  const { pro_id, novo_lance, comprador } = req.body;

  const produto = produtos.find((p) => p.pro_id === pro_id);
  if (!produto) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  if (novo_lance > produto.pro_lance_atual) {
    produto.pro_lance_atual = novo_lance;
    produto.pro_comprador = comprador;

    io.emit("atualizar_produto", produto);

    iniciarEncerramentoAutomático(produto);

    return res.json({ message: "Lance registrado com sucesso", produto });
  } else {
    return res.status(400).json({ message: "O lance deve ser maior que o atual" });
  }
});

//endpoint para adicionar um novo produto
app.post("/api/produtos", (req, res) => {
  const { pro_nome, pro_lance_inicial, pro_quantidade, pro_foto, pro_data } = req.body;

  if (!pro_nome || !pro_lance_inicial || !pro_quantidade || !pro_foto) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  const novoProduto = {
    pro_id: produtos.length > 0 ? Math.max(...produtos.map(p => p.pro_id)) + 1 : 1,
    pro_nome,
    pro_status: "aguardando",
    pro_lance_inicial,
    pro_lance_atual: pro_lance_inicial,
    pro_tempo: "60",
    pro_data,
    pro_quantidade,
    pro_comprador: "",
    pro_foto
  };

  produtos.push(novoProduto);

  io.emit("novo_produto", novoProduto);

  res.status(201).json(novoProduto);
});


server.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});

//Configuracoes do webhook
io.on("connection", (socket) => {
  console.log("novo usuario conectado: ", socket.id);

  socket.on("disconnect", () => {
    console.log("usuario desconectado: ", socket.id);
  });
});

