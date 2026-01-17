# TechyTax Frontend (techytax-ngx)

TechyTax is a comprehensive tax and administration management application designed for freelancers and small business owners. This repository contains the frontend application, built with Angular.

## Relation with Backend

This frontend application communicates with the **TechyTax Backend**, which provides the API and data persistence layer.
You can find the backend repository here: [https://github.com/beemsoft/techytax-backend](https://github.com/beemsoft/techytax-backend)

## Features

The application includes the following features:

- **Dashboard / Home**: Overview of the financial status.
- **User Management**: Authentication and user profile management.
- **Customer Management**: Maintain a database of customers.
- **Project Management**: Track projects and link them to customers.
- **Activity Tracking**: Log activities and hours spent on projects.
- **Invoicing**: Generate and send invoices to customers.
- **VAT (Value Added Tax) Management**: 
    - VAT overview and calculations.
    - VAT matching for transactions.
- **Expense Tracking (Costs)**: Manage and categorize business costs.
- **Asset Management (Activa)**: Track business assets and depreciation.
- **Bookkeeping**: General ledger and transaction management.
- **Fiscal Overview**: Comprehensive financial reports for fiscal periods.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [Angular CLI](https://angular.io/cli)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/beemsoft/techytax-ngx.git
   cd techytax-ngx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200/`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Technology Stack

- **Framework**: Angular 21
- **Styling**: Bootstrap 4, Angular Material
- **Utilities**: Moment.js, RxJS
