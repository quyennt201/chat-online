import { useNavigate } from "react-router-dom";
import { useMe } from "../../lib/hooks/useMe";
import { useUserStore } from "../../store/useUser";

export default function Header() {
  const { data } = useMe();
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logOut);
  const accessToken = useUserStore((state) => state.accessToken);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!data || !accessToken) {
    return null;
  }

  return (
    <div className="sticky top-0 border-b pb-3 border-white/30  px-4 w-full flex items-center justify-between">
      <p className="font-bold">{data?.username}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
