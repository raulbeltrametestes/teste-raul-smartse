"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../navbar/page";

// Função auxiliar para recuperar o nome do usuário logado
const getLoggedUserName = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.name || "";
};

export default function LancePage() {
  const searchParams = useSearchParams();
  const valor = Number(searchParams.get("valor")) || 0;
  const pro_id = Number(searchParams.get("pro_id")) || 0;

  // Definição do esquema do Zod com validação dinâmica
  const lanceSchema = z.object({
    pro_id: z.number().min(1, "ID do produto é obrigatório"),
    novo_lance: z
      .number()
      .min(1, "O valor do lance deve ser maior que zero")
      .refine((value) => value >= valor, {
        message: `O valor do lance deve ser no mínimo ${valor}.`,
      }),
    comprador: z
      .string()
      .min(1, "Nome do comprador é obrigatório")
      .refine((name) => name === getLoggedUserName(), {
        message: "O nome não confere com o usuário logado.",
      }),
  });

  type LanceFormValues = z.infer<typeof lanceSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<LanceFormValues>({
    resolver: zodResolver(lanceSchema),
    defaultValues: {
      pro_id,
      novo_lance: valor,
      comprador: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LanceFormValues) => {
      return axios.post("http://localhost:5000/api/lance", data);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Lance Registrado!",
        text: "Seu lance foi enviado com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = '/leiloes'
      });
    },
    onError: (error) => {
      console.error("Erro ao enviar lance:", error);
    },
  });

  const onSubmit = (data: LanceFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white mb-20 p-6 rounded-lg shadow-lg w-96"
        >
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--cor4)" }}>
            Confirmar Lance
            </h2>

            <div className="mb-4">
            <label htmlFor="comprador" className="block text-gray-700">
                Nome do Comprador
            </label>
            <input
                id="comprador"
                {...register("comprador")}
                className={`w-full p-2 border rounded mt-1 ${errors.comprador ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.comprador && (
                <p className="text-red-500 text-sm mt-1">{errors.comprador.message}</p>
            )}
            </div>

            <div className="mb-4">
            <label htmlFor="novo_lance" className="block text-gray-700">
                Valor do Lance
            </label>
            <input
                id="novo_lance"
                {...register("novo_lance", { valueAsNumber: true })}
                type="number"
                className={`w-full p-2 border rounded mt-1 ${errors.novo_lance ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.novo_lance && (
                <p className="text-red-500 text-sm mt-1">{errors.novo_lance.message}</p>
            )}
            </div>

            <button
            type="submit"
            className="w-full text-white p-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
            style={{ backgroundColor: "var(--cor4)" }}
            >
            <FontAwesomeIcon icon={faGavel} className="mr-2" /> Confirmar Lance
            </button>
        </form>
        </div>
    </div>

  );
}
