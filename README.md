# 🏥 HealthPal - Digital Healthcare Platform
<img width="1024" height="402" alt="Gemini_Generated_Image_cp07smcp07smcp07-artguru" src="https://github.com/user-attachments/assets/37514699-40b3-43fe-9292-7790b2e1ace1" />


![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/ORM-6CCFF6?style=for-the-badge&logo=sequelize&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jwt&logoColor=yellow)
![OAuth](https://img.shields.io/badge/OAuth-4285F4?style=for-the-badge&logo=oauth&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-5A5A5A?style=for-the-badge&logo=helmet&logoColor=white)

> **Course:** Advanced Software Engineering

> **Instructor:** Dr. Amjad AbuHassan  

---

## 📖 Project Overview
**HealthPal** is a comprehensive digital healthcare platform designed to bridge the gap between patients, doctors, donors, and NGOs in Palestine. In response to the challenges facing the local healthcare system, HealthPal provides a RESTful API backend that facilitates remote medical consultations, medicine coordination, and transparent sponsorship for critical treatments.

The system is designed to be **scalable**, **secure**, and **user-centric**, ensuring that humanitarian efforts reach those in need with precision and dignity.

---

## 📑 Table of Contents
- [Core Features](#-core-features)
- [Tech Stack & Justification](#-technology-stack--justification)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing Strategy](#-testing-strategy)
- [Git Workflow](#-git-workflow)
- [Contact & Team](#-the-team)

---

## 🚀 Core Features

### 1. 🩺 Remote Medical Consultations
*   **Virtual Clinic Access:** REST endpoints to schedule and manage appointments between patients and local/international doctors.
*   **Low-Bandwidth Support:** Optimized data transfer for areas with poor internet connectivity.
*   **Medical Translation:** Integration features to support Arabic-English translation for international specialists.

### 2. 🤝 Medical Sponsorship & Crowdfunding
*   **Case Profiles:** Verified patient profiles (anonymized/secured) for surgeries, cancer treatments, and dialysis.
*   **Transparency Dashboard:** Track donations against specific medical bills and invoices to ensure trust.
*   **Secure Payments:** Integration with Payment Gateways (Stripe API) for donations.

### 3. 💊 Medication & Equipment Hub
*   **Medicine Matching:** Algorithms to match patient medication requests with available stock from NGOs and volunteer pharmacists.
*   **Equipment Registry:** Real-time tracking of shared medical devices (Oxygen tanks, Wheelchairs).

### 4. 🧠 Mental Health Support
*   **Trauma Counseling:** Dedicated endpoints for booking sessions with trauma specialists (PTSD support).
*   **Anonymous Chat:** Secure and private channels for mental health support.

### 5. 🚨 Emergency & Public Health
*   **Real-time Alerts:** Broadcast system for health warnings or urgent blood donation requests.
*   **NGO Coordination:** Management of medical missions and volunteer scheduling.

---

## 💡 Technology Stack & Justification

We chose the following technologies based on scalability, security, and maintainability requirements:

| Technology | Role | Justification |
| :--- | :--- | :--- |
| **Java 17** | Core Language | Strongly typed, robust, and widely used in enterprise-level healthcare systems. |
| **Spring Boot** | Backend Framework | **Efficiency:** Reduces boilerplate code.<br>**Security:** Built-in Spring Security for Role-Based Access Control (RBAC).<br>**Ecosystem:** Seamless integration with Data JPA and Web MVC. |
| **MySQL** | Database | **Reliability:** ACID compliance ensures data integrity for sensitive medical and financial transactions.<br>**Relational:** Perfect for handling complex relationships (Doctor-Patient-Appointment). |
| **Hibernate / JPA** | ORM | Simplifies database interactions and protects against SQL injection. |
| **Lombok** | Library | Improves code readability by auto-generating getters, setters, and builders. |
| **Stripe API** | External Integration | Secure and standard solution for handling international credit card donations. |

---

## 🏗 System Architecture & Roles

The system follows a **Layered Architecture** (Controller -> Service -> Repository) to ensure separation of concerns.

### User Roles (RBAC)
*   **👮‍♂️ Admin:** System oversight, NGO verification, User management.
*   **👨‍⚕️ Doctor:** Manage schedule, view patient history, conduct consultations.
*   **🤕 Patient:** Book appointments, request medicine, apply for sponsorship.
*   **🎗️ Sponsor/Donor:** Browse cases, donate, view transparency reports.
*   **🏢 NGO/Volunteer:** Manage inventory, fulfill requests, organize missions.

---

## 🛠 Getting Started

Follow these steps to set up the project locally:

### Prerequisites
*   Java Development Kit (JDK) 17+
*   Maven installed
*   MySQL Server running

### Installation
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YourUsername/HealthPal.git
    cd HealthPal
    ```

2.  **Configure Database:**
    *   Create a MySQL database named `healthpal_db`.
    *   Update `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/healthpal_db
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```

3.  **Build and Run:**
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

---

## 📘 API Documentation
We use **Postman** for API testing and documentation. The API collection includes examples for all endpoints (GET, POST, PUT, DELETE).

*   **Documentation Link:** [Insert Your Postman Collection Public Link Here]
*   **Format:** JSON is used for all request and response bodies.

---

## 🧪 Testing Strategy
We implemented a robust testing strategy to ensure reliability:
*   **Unit Testing:** Used **JUnit 5** and **Mockito** to test service logic in isolation.
*   **Integration Testing:** Tested the interaction between Controllers and the Database.
*   **Error Handling:** Implemented a global `@ControllerAdvice` to handle exceptions (e.g., `ResourceNotFound`, `InsufficientFunds`) gracefully.

---

## 🔄 Git Workflow
To ensure smooth collaboration, our team followed a strict Git workflow:
1.  **Main Branch:** Contains production-ready code.
2.  **Feature Branches:** Each member worked on separate branches (e.g., `feature/auth`, `feature/appointments`).
3.  **Pull Requests:** Code was merged to `main` only after review to resolve conflicts.
4.  **Commit Messages:** Descriptive messages tracking the development progress.

---

## 👥 The Team

| Name | Role | GitHub |
| :--- | :--- | :--- |
| **Haneen Habash** | Backend Developer | [@HaneenHabash](https://github.com/) |
| **Raghad Shaar** | Backend Developer | [@RaghadShaar](https://github.com/) |
| **Lujain Toma** | Backend Developer | [@LujainToma](https://github.com/) |

---
*© 2025 HealthPal Project. Built for the RESTful API Course.*
