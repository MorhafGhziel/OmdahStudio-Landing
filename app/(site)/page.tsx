import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";

/**
 * The walk through the gallery: an opening frame, the studio's own words,
 * what it does, what it has made, who it made it for, and the way in.
 * Light and dark alternate on hard cuts.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Works />
      <Clients />
      <Contact />
    </>
  );
}
