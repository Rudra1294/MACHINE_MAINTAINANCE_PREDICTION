# OptiMaintain: Predictive Equipment Maintenance & Workforce Management

OptiMaintain is a web-based predictive maintenance and technician dispatching platform designed to monitor equipment diagnostics, predict machinery failures, and streamline workforce scheduling to minimize industrial operational downtime[cite: 3].

---

## 📌 Features

* **Equipment Diagnostics & Health Monitoring:** Interactive dashboard visualizing telemetry data, operational status, and health metrics across registered machinery units[cite: 3].
* **Automated & Smart Scheduling:** Intelligent matching pipeline to allocate certified technicians to flagged equipment issues based on shift availability and domain specialization[cite: 3].
* **Workforce & Shift Management:** Dedicated technician module with shift calendars, domain tracking, status indicators, and direct contact integration (phone/email)[cite: 3].
* **Real-Time Data Pipelines:** Telemetry ingestion pipelines supported by mock APIs to simulate live machinery diagnostics and fault detection[cite: 3].
* **Security & Role-Based Access:** Secure administrator authentication featuring Two-Factor Verification (2FA) and fine-grained access control[cite: 3].

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Material UI, CSS3, Modern Dashboard Visualizations[cite: 3]
* **State Management & Routing:** React Router, Context API / Hooks
* **APIs & Data Ingestion:** RESTful API structure, Telemetry Mock Pipelines[cite: 3]
* **Security & Auth:** Admin 2FA, Role-Based Access Control (RBAC)[cite: 3]
* **Tooling & Version Control:** Git, GitHub, VS Code[cite: 3]

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16.x or higher recommended)
* npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Phalguni-ubhe/MACHINE_MAINTAINANCE_PREDICTION.git](https://github.com/Phalguni-ubhe/MACHINE_MAINTAINANCE_PREDICTION.git)
   cd MACHINE_MAINTAINANCE_PREDICTION

```

2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add any required API keys or endpoints:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api

```


4. **Start the development server:**
```bash
npm start

```


Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 📁 Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── assets/          # Icons, images, and static graphics
│   ├── components/      # Reusable UI components (Cards, Gauges, Modals)
│   ├── pages/           # Core page views (Dashboard, Machinery, Technicians, Schedule)
│   ├── services/        # API service layers and telemetry simulation pipelines
│   ├── context/         # Auth and Global application state
│   ├── styles/          # Global styles and themes
│   ├── App.js           # Route definitions and layout wrappers
│   └── index.js         # React DOM root entry
├── package.json
└── README.md

```

---

## 👥 Contributors & Team Roles

* **Phalguni Ubhe** – **Frontend, Testing & Documentation**: Developed interactive React.js dashboards (diagnostics, registries, technician schedules), executed testing workflows, and created project documentation.
* **Sarthak** – **Database, Backend & DevOps**: Designed database schemas, developed backend API services, and configured containerization using Docker.
* **Rudra** – **Formulation, Cloud Integration & Circuit Optimization**: Handled problem formulation, cloud architecture deployment, and optimization logic.
* **Tushar** – **Data Preprocessing, QSVM & Microservices**: Built data preprocessing pipelines, developed QSVM machine learning models, and created the FastAPI prediction microservice.
