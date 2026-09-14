export const resume =
  "https://drive.google.com/file/d/1ppa3UJorZxCKYQvozD0Ut-o6K8sLVGt8/view?usp=drivesdk";
export const projects = [
  {
    id: "01",
    name: "Onelap.in",
    kind: "COMMERCE / PRODUCTION",
    intro: "From storefront to shipment.",
    description:
      "A connected e-commerce and order management platform spanning product discovery, pricing, payments, and shipment tracking.",
    decision:
      "Reusable Angular modules keep complex pricing and shipment workflows consistent. Spring Boot API mapping and SQL query optimization reduce backend wait time.",
    stack: ["Angular", "Spring Boot", "RxJS", "MySQL"],
    outcome: "+21% conversions · 32% faster page loads",
    flow: ["Angular storefront", "REST APIs", "Spring Boot", "SQL"],
    link: "https://onelap.in",
    linkLabel: "Visit website",
    detail:
      "Primary Angular developer, independently handling frontend development and collaborating on backend API integration. Built product listings, dynamic forms, order dashboards, and shipment workflows. Debugged production issues and optimized API response time from nearly 5 seconds to around 1 second, according to the existing project description.",
  },
  {
    id: "02",
    name: "GMC Charity Wings",
    kind: "SOCIAL IMPACT / APPLICATION",
    intro: "One platform. Many ways to give.",
    description:
      "PUNARJJANI brings blood donation, hair donation, medicine support, and birthday giving into one responsive application.",
    decision:
      "Shared form components and RxJS BehaviorSubjects synchronize donor and admin views. Local storage supports the current prototype; a secured backend is needed before handling real donor data.",
    stack: ["Angular", "TypeScript", "RxJS", "Local Storage"],
    outcome: "Four welfare modules · one connected interface",
    flow: [
      "Donation forms",
      "Angular services",
      "BehaviorSubject",
      "Local storage",
    ],
    link: "https://github.com/seriouslynonserious",
    linkLabel: "Explore GitHub",
    detail:
      "Blood Wing, Hair to Care, Drug Wing, and Gift of Giving provide dedicated donation workflows. The admin panel manages donor records and support requests. This is a browser-persisted prototype, not a claim of a deployed secure medical data system.",
  },
];
export const technologies = [
  {
    name: "Angular",
    zone: "Frontend",
    x: -3.1,
    y: 1,
    z: 0,
    detail:
      "Reusable components, RxJS state, routing, reactive forms, and performance-focused interfaces.",
  },
  {
    name: "Spring Boot",
    zone: "Backend",
    x: 2.8,
    y: 1,
    z: 0,
    detail:
      "REST APIs, Java services, DTO mapping, validation, and production debugging.",
  },
  {
    name: "Redis",
    zone: "Data",
    x: 1.7,
    y: -1.3,
    z: 1,
    detail:
      "Explore cache hits, misses, failure, and recovery in this frontend simulation.",
  },
  {
    name: "MySQL",
    zone: "Data",
    x: 3.3,
    y: -1.7,
    z: -0.5,
    detail:
      "SQL queries, data modeling, indexing, and performance optimization.",
  },
  {
    name: "REST API",
    zone: "Backend",
    x: -1.4,
    y: 2,
    z: -0.6,
    detail:
      "Contracts connect the frontend to backend services with clear request and error handling.",
  },
  {
    name: "Cloud",
    zone: "Infrastructure",
    x: -2.9,
    y: -1.7,
    z: -0.6,
    detail: "Stateless deployment, environment configuration, and monitoring.",
  },
  {
    name: "Docker",
    zone: "Infrastructure",
    x: -1.3,
    y: -2,
    z: 1,
    detail: "Reproducible container builds with a dedicated backend runtime.",
  },
  {
    name: "CI/CD",
    zone: "Infrastructure",
    x: 0.8,
    y: 2.1,
    z: -1,
    detail:
      "Build and validation pipelines make changes repeatable and reviewable.",
  },
  {
    name: "AI",
    zone: "AI",
    x: 3.1,
    y: 2.4,
    z: 1,
    detail:
      "Portfolio-grounded assistance through a server-side Gemini integration.",
  },
  {
    name: "Microservices",
    zone: "Backend",
    x: -3.5,
    y: 2.6,
    z: 1,
    detail:
      "Service boundaries, asynchronous processing, and integration contracts.",
  },
];
