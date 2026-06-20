import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import { ErrorBoundary } from "@/components";
import { Footer, SiteHeader } from "@/layout";

import AppRouter from "./routing/Router";

import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="App">
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
          <SiteHeader />
          <AppRouter />
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
