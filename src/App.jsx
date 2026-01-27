import "./assets/styles/main.css";
import Header from "./components/Header";
import Services from "./components/Services";
import Examples from "./components/Examples";
import Process from "./components/Process";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <>
      <Header />
      <main>
        <Services />
        <Examples />
        <Process />
        <ContactForm />
      </main>
    </>
  );
}

export default App;
