import Header from "./components/header";
import Landing from "./components/landing";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Landing />
      <Footer />
    </main>
  );
}
