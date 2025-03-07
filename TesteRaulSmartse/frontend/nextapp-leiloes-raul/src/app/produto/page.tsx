import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faHourglassHalf, faGift, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


interface ProdutoProps {
  pro_id: number;
  pro_data: string;
  pro_tempo: string;
  pro_foto: string;
  pro_nome: string;
  pro_lance_inicial: number;
  pro_status: string;
  pro_quantidade: string;
  pro_lance_atual: number;
  pro_comprador: string | null;
}

const socket = io("http://localhost:5000");

const Produto: React.FC<ProdutoProps> = ({
  pro_id,
  pro_data,
  pro_tempo,
  pro_foto,
  pro_nome,
  pro_lance_inicial,
  pro_status,
  pro_quantidade,
  pro_lance_atual,
  pro_comprador,
}) => {
  const [lanceAtual, setLanceAtual] = useState(pro_lance_atual);
  const [lanceTemp, setLanceTemp] = useState(pro_lance_atual);
  const [compradorAtual, setCompradorAtual] = useState(pro_comprador);
  const [tempoRestante, setTempoRestante] = useState(parseInt(pro_tempo, 10) * 60); 
  const usuarioLogado = JSON.parse(localStorage.getItem("user") || "{}");
  const router = useRouter();


  //atualiza o lance em tempo real com o socket para notificar quem teve o seu superado
  useEffect(() => {
    socket.on("atualizar_produto", (produtoAtualizado) => {
      if (produtoAtualizado.pro_id === pro_id) {
        setLanceAtual(produtoAtualizado.pro_lance_atual);
        setLanceTemp(produtoAtualizado.pro_lance_atual);
        setCompradorAtual(produtoAtualizado.pro_comprador);
      }
    });

    return () => {
      socket.off("atualizar_produto");
    };
  }, [pro_id]);

  //contagem regressiva
  useEffect(() => {
    if (pro_status !== "aberto" || tempoRestante <= 0) return;

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [pro_status, tempoRestante]);

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
  };

  const iniciarLeilao = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/iniciar", {
        pro_id,
      });
      const produtoAtualizado = response.data.produto;
  
      //emissao da atualizacao pelo socket
      socket.emit("atualizar_produto", produtoAtualizado);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "erro ao iniciar o leilão.");
      } else {
        alert("erro inesperado ao tentar iniciar o leilão.");
      }
      console.error("error:", error);
    }
  };
  
  

  const darLance = async () => {
    if (usuarioLogado.perfil === "administrador") {
      Swal.fire("Atenção", "Faça login com um perfil comprador para dar um lance.", "error");
      return;
    }

    if (pro_status !== "aberto") {
      alert("Leilão indisponível!");
      return;
    }

    if (lanceTemp <= lanceAtual) {
      alert("O lance deve ser maior que o valor atual");
      return;
    }

    router.push(`/lance?pro_id=${pro_id}&valor=${lanceTemp}&nome=${usuarioLogado.name}`);

  };

  return (
    <div className="card-produto border rounded-md p-4 shadow-md w-100 mx-auto" style={{color:'var(--cor7)', borderColor:'var(--cor2)'}}>
      <div className="flex justify-between mb-2">
        <span className="font-bold">Item #{pro_id}</span>
        <span className="text-sm" style={{color:'var(--cor7)'}}>
          {pro_data} - {tempoRestante > 0 ? formatarTempo(tempoRestante) : "Encerrado"}
        </span>
      </div>
      <hr style={{color:'var(--cor2)'}}/>
      <div className="flex items-center my-4">
        <img src={pro_foto} alt={pro_nome} className="w-16 h-16 rounded-lg mr-4" />
        <div>
          <h2 className="font-bold text-lg">{pro_nome}</h2>
          <p className="text-sm">Lance Inicial: <strong>R$ {pro_lance_inicial}</strong></p>
          <p className="text-xs text-gray-600">Status: {pro_status}</p>
          <p className="text-xs text-gray-600">Último Lance: <strong>R$ {lanceAtual}</strong></p>
          {compradorAtual && <p className="text-xs text-gray-600">Comprador: {compradorAtual}</p>}
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4">{pro_quantidade}</p>
      <hr style={{color:'var(--cor2)'}}/>
      <div className="flex justify-between items-center mt-4">
        {pro_status === "aguardando" && usuarioLogado.perfil === "administrador" ? (
          <button
            onClick={iniciarLeilao}
            className="bg-green-500 w-full text-center text-white px-4 py-1 rounded"
          >
            <FontAwesomeIcon icon={faFlagCheckered} className="mr-2" /> Iniciar
          </button>
        ) : pro_status === "aguardando" ? (
          <div className="w-full py-1 text-center text-white font-bold rounded bg-gray-500">
            <FontAwesomeIcon icon={faHourglassHalf} className="mr-2" /> Indisponível
          </div>
        ) : null}

        {pro_status === "aberto" && (
          <>
            <button
              onClick={() => setLanceTemp((prev) => Math.max(prev - 100, pro_lance_inicial))}
              disabled={lanceTemp === pro_lance_inicial}
              style={{backgroundColor:'var(--cor5)', color:'var(--cor1)'}}
              className={`px-3 pb-1 border rounded ${lanceTemp === pro_lance_inicial ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              -
            </button>
            <span className="text-lg font-bold">R$ {lanceTemp}</span>
            <button onClick={() => setLanceTemp((prev) => prev + 100)} className="px-3 pb-1 border rounded" style={{backgroundColor:'var(--cor5)', color:'var(--cor1)'}}>
              +
            </button>
            <button onClick={darLance} className="text-white px-4 py-1 rounded flex items-center" style={{backgroundColor:'var(--cor5)', color:'var(--cor1)'}}>
              <FontAwesomeIcon icon={faGavel} className="mr-2" style={{color:'var(--cor1)'}}/> Dar Lance
            </button>
          </>
        )}

        {pro_status === "encerrado" && (
          <div className={`w-full py-1 text-center text-white font-bold rounded ${compradorAtual === usuarioLogado.name ? "bg-green-500" : "bg-gray-500"}`}>
            {compradorAtual === usuarioLogado.name ? <FontAwesomeIcon icon={faGift} className="mr-2" /> : null}
            {compradorAtual === usuarioLogado.name ? "Você arrematou!" : "Finalizado"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Produto;
