import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Testimonials } from "./demo";
import { Process } from "./process";
import "./index.css";
// The existing 3D scene is a prebuilt JavaScript module.
import { PlanetStageHero } from "../orbit-hero.js";

const testimonialsHost = document.getElementById("testimonials-root");
if (testimonialsHost) createRoot(testimonialsHost).render(createElement(Testimonials));

const processHost = document.getElementById("process-root");
if (processHost) createRoot(processHost).render(createElement(Process));

const orbitHost = document.getElementById("orbit-stage");
if (orbitHost) createRoot(orbitHost).render(createElement(PlanetStageHero, { theme: "auto", assetBaseUrl: "assets/" }));
