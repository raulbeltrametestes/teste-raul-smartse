"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/app/navbar/page";
import "../novo-produto/novo-produto.css";
import Swal from "sweetalert2";


const leilaoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  quantidade: z.number().min(1, "A quantidade deve ser pelo menos 1"),
  valorInicial: z.number().min(0.01, "O valor inicial deve ser maior que 0"),
  dataInicio: z.string().refine((date) => !isNaN(Date.parse(date)), "Data de início inválida"),
  dataFim: z.string().refine((date) => !isNaN(Date.parse(date)), "Data de fim inválida"),
  urlFoto: z.string().url("URL da foto inválida"),
});

type LeilaoFormData = z.infer<typeof leilaoSchema>;

function NovoLeilao() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.perfil === "administrador");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeilaoFormData>({ resolver: zodResolver(leilaoSchema) });

  const formatDateToDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onSubmit = async (data: LeilaoFormData) => {
    if (!isAdmin) {
      alert("Apenas administradores podem criar leilões.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pro_nome: data.nome,
          pro_lance_inicial: data.valorInicial,
          pro_quantidade: `Quantidade: ${data.quantidade}`,
          pro_foto: data.urlFoto,
          pro_data: formatDateToDDMMYYYY(data.dataInicio),
          pro_status: "aguardando", 
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar leilão");
      }
      Swal.fire({
        icon: "success",
        title: "Leilão Criado!",
        text: "O leilão foi criado com sucesso.",
        confirmButtonColor: "var(--cor5)",
      }).then(() => {
        router.push("/leiloes");
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAdmin) return <p className="text-center text-red-500 font-semibold mt-10">Você não tem permissão para acessar esta página.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container-novo-produto flex justify-center items-center pb-3 mt-0">
        <div className="bg-white shadow-lg mb-9 rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Novo Leilão</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Nome do Item</label>
              <input {...register("nome")} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Quantidade</label>
              <input type="number" {...register("quantidade", { valueAsNumber: true })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.quantidade && <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Valor Inicial</label>
              <input type="number" step="0.01" {...register("valorInicial", { valueAsNumber: true })} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.valorInicial && <p className="text-red-500 text-sm mt-1">{errors.valorInicial.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Data de Início</label>
              <input type="datetime-local" {...register("dataInicio")} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.dataInicio && <p className="text-red-500 text-sm mt-1">{errors.dataInicio.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Data de Fim</label>
              <input type="datetime-local" {...register("dataFim")} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.dataFim && <p className="text-red-500 text-sm mt-1">{errors.dataFim.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">URL da Foto</label>
              <input type="url" {...register("urlFoto")} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300" />
              {errors.urlFoto && <p className="text-red-500 text-sm mt-1">{errors.urlFoto.message}</p>}
            </div>
            <div className="col-span-2">
              <button type="submit" className="w-full text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition" style={{backgroundColor:'var(--cor5)'}}              >
                Criar Leilão
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoLeilao;
