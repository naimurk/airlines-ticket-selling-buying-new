import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Ensure react-router-dom is used

import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "sonner";
// Import the new login page
import LoginPage from "./components/auth/login.tsx";
import ProtectedRoute from "./routes/ProtectRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  
  },
]);

createRoot(document.getElementById("root")!).render(

  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster expand={true} richColors />
    </Provider>
  </StrictMode>
);
