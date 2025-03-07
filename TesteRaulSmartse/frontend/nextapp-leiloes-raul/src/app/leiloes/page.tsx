"use client";
import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Navbar from "@/app/navbar/page";
import Produto from "@/app/produto/page";
import "./leiloes.css";

//conecto ao WebSocket do backend usando socket io
const socket = io("http://localhost:5000");

function Leiloes() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  interface Prod {
    pro_id: number;
    pro_nome: string;
    pro_quantidade: string;
    pro_lance_inicial: number;
    pro_status: string;
    pro_tempo: string;
    pro_foto: string;
    pro_data: string;
    pro_comprador: string;
    pro_lance_atual: number;
  }

  const fetchProdutos = async (): Promise<Prod[]> => {
    const response = await fetch("http://localhost:5000/api/produtos");
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    return response.json();
  };

  const { data: produtos = [], isLoading, error } = useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    socket.on("atualizar_tempo", ({ pro_id, pro_tempo }: { pro_id: number; pro_tempo: string }) => {
      queryClient.setQueryData(["produtos"], (oldData: Prod[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((p) => (p.pro_id === pro_id ? { ...p, pro_tempo } : p));
      });
    });

    socket.on("atualizar_produto", (produtoAtualizado: Prod) => {
      queryClient.setQueryData(["produtos"], (oldData: Prod[] | undefined) => {
        if (!oldData) return [];
        const updatedData = oldData.map((p) =>
          p.pro_id === produtoAtualizado.pro_id ? produtoAtualizado : p
        );

        if (
          produtoAtualizado.pro_comprador !== user.name &&
          oldData.some((p) => p.pro_id === produtoAtualizado.pro_id && p.pro_comprador === user.name)
        ) {
          Swal.fire({
            title: "Lance Superado!",
            text: `Seu lance no produto ${produtoAtualizado.pro_nome} foi superado.`,
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "var(--cor5)",
          }).then(() => {
            router.push("/leiloes");
          });
        }

        return updatedData;
      });
    });

    return () => {
      socket.off("atualizar_tempo");
      socket.off("atualizar_produto");
    };
  }, [queryClient]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) =>
      searchTerm
        ? produto.pro_id.toString().includes(searchTerm) ||
          produto.pro_nome.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );
  }, [produtos, searchTerm]);

  if (isLoading) return <div className="loading-overlay"><div className="loading-spinner"></div></div>;
  if (error instanceof Error) return <p>Erro: {error.message}</p>;

  const produtosAguardando = produtosFiltrados.filter((produto) => produto.pro_status === "aguardando");
  const produtosAberto = produtosFiltrados.filter((produto) => produto.pro_status === "aberto");
  const produtosEncerrado = produtosFiltrados.filter((produto) => produto.pro_status === "encerrado");

  return (
    <div className="body">
      <Navbar />
      <div className="container mx-auto py-4" style={{ backgroundColor: "var(--cor1)", color: "var(--cor3)" }}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Leilões</h2>
          <div className="flex w-full md:w-auto gap-2 mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Buscar por ID ou Nome..."
              className="input-buscar w-full md:w-64 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              style={{ color: "var(--cor2)" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 border rounded-md transition"
              style={{ backgroundColor: "var(--cor4)", color: "var(--cor1)" }}
              onClick={() => router.push("/novo-produto")}
            >
              <i className="fas fa-plus"></i> Novo
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold py-2 px-4 mb-4 rounded-sm" style={{ backgroundColor: "var(--cor5)", color: "var(--cor1)" }}>Aguardando</h3>
            <div className="space-y-4">{produtosAguardando.map((produto) => (<Produto key={produto.pro_id} {...produto} />))}</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold py-2 px-4 mb-4 rounded-sm" style={{ backgroundColor: "var(--cor5)", color: "var(--cor1)" }}>Aberto</h3>
            <div className="space-y-4">{produtosAberto.map((produto) => (<Produto key={produto.pro_id} {...produto} />))}</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold py-2 px-4 mb-4 rounded-sm" style={{ backgroundColor: "var(--cor5)", color: "var(--cor1)" }}>Encerrado</h3>
            <div className="space-y-4">{produtosEncerrado.map((produto) => (<Produto key={produto.pro_id} {...produto} />))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leiloes;
