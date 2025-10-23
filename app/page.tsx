import { AboutOmdah } from "@/components/AboutOmdah";
import { Services } from "@/components/Services";
import { Works } from "@/components/Works";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <AboutOmdah />
      <Services />
      <Clients />
      <Works />
      <Contact />
    </main>
  );
}
