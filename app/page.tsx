import Header from "./components/header";
import Landing from "./components/landing";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />
      <Landing />
      <Footer />
    </div>
  );
}
