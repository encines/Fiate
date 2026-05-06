import Header from "./components/header";
import Landing from "./components/landing";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <Landing />
      <Footer />
    </div>
  );
}
