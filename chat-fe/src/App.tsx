import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthGuard from "./components/guard/AuthGuard";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "",
    Component: AuthGuard,
    children: [
      {
        Component: HomePage,
        index: true,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
