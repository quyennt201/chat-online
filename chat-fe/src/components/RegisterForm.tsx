import { toast } from "react-toastify";
import { useRegister } from "../lib/hooks/useAuth";

export default function RegisterForm({
  onClickLogin,
}: {
  onClickLogin: () => void;
}) {
  const { mutateAsync: register, isPending: isRegistering } = useRegister();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const passwordAgain = formData.get("password-2") as string;

    if (!username || !password) {
      toast("username & password is required!");
      return;
    }
    console.log(password, passwordAgain);
    if (password !== passwordAgain) {
      toast("Password is not match");
      return;
    }

    try {
      await register({ password, username });
      toast("Register success");
    } catch {
      toast("Register failed");
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-lg text-center">
        Do you already have an account?
        <strong
          className="text-purple-500 font-medium cursor-pointer"
          onClick={onClickLogin}
        >
          Login
        </strong>
      </p>
      <form
        onSubmit={handleRegister}
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
        <div className="space-y-4">
          <label htmlFor="username" className="text-sm">
            Password again
          </label>
          <input
            type="text"
            name="password-2"
            placeholder="Enter username again"
            className="px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition border border-white/10"
          />
        </div>
        <button className="w-full text-center bg-linear-to-b from-purple-500 to-pink-500 p-3 text-lg font-medium rounded-lg">
          {isRegistering ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
