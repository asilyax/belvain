import Header from "../../components/layout/Header";
import Hero from "../../sections/home/hero/Hero";
import LongevityRedefined from "../../sections/home/LongevityRedefined/LongevityRedefined";
import MedicalAestheticsPreview from "../../sections/home/MedicalAestheticsPreview/MedicalAestheticsPreview";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LongevityRedefined />
      <MedicalAestheticsPreview />
    </>
  );
}
