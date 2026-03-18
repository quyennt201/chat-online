import { toast } from "react-toastify";
import { useLogin } from "../lib/hooks/useAuth";

export default function LoginForm({
  onClickRegister,
}: {
  onClickRegister: () => void;
}) {
  const { mutateAsync: login, isPending: isLogging } = useLogin();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return;
    }

    try {
      await login({ password, username });
      toast("Login success");
    } catch {
      toast("Login failed");
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-lg text-center">
        You don't have an account?{" "}
        <strong
          className="text-purple-500 font-medium cursor-pointer"
          onClick={onClickRegister}
        >
          Sign up
        </strong>
      </p>
      <form
        onSubmit={handleLogin}
        className="rounded-2xl w-lg p-6 flex flex-col gap-5 border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="space-y-4">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            className="px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition border border-white/10"
          />
        </div>
        <div className="space-y-4">
          <label htmlFor="username" className="text-sm">
            Password
          </label>
          <input
            type="text"
            name="password"
            placeholder="Enter username"
            className="px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition border border-white/10"
          />
        </div>
        <button className="w-full text-center bg-linear-to-b from-purple-500 to-pink-500 p-3 text-lg font-medium rounded-lg">
          {isLogging ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
}
