import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  perfil: z.enum(["administrador", "comprador"], {
    required_error: "Selecione um perfil",
  }),
  cpf: z.string().min(11, "O CPF deve conter pelo menos 11 dígitos")
});

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const onSubmit = (data: LoginFormData) => {
    localStorage.setItem("user", JSON.stringify(data));
    router.push("/leiloes");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4" style={{color:'var(--cor4)'}}>Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Nome</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">CPF</label>
          <input
            type="cpf"
            {...register("cpf")}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Perfil</label>
          <select
            {...register("perfil")}
            className="w-full p-2 border rounded mt-1 bg-white cursor-pointer"
          >
            <option value="">Selecione...</option>
            <option value="administrador">Administrador</option>
            <option value="comprador">Comprador</option>
          </select>
          {errors.perfil && (
            <p className="text-red-500 text-sm mt-1">{errors.perfil.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-white p-2 rounded hover:bg-blue-600 transition"
          style={{backgroundColor:'var(--cor4)'}}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
