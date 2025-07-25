# Travelers App - Interactive Service Simulator

This project is an interactive service booking simulator for travelers, built using HTML, CSS, and JavaScript. It demonstrates dynamic content loading, shopping cart functionality, and user-friendly notifications.

## Features

- **Dynamic Service Loading**: Services are loaded from a `services.json` file, simulating a remote data source.
- **Interactive Service Cards**: Each service features a carousel for images and a detailed description.
- **Shopping Cart**: Users can add services to a shopping cart, adjust quantities, and remove items.
- **Checkout Process**: A simulated checkout flow with confirmation using SweetAlert2.
- **User-Friendly Notifications**: All user interactions (e.g., adding to cart, checkout) are handled with modern, non-intrusive notifications.

## Project Structure

```
travelers_app/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── services.json
└── recursos/
    ├── ... (image assets)
    └── carruseles/
        ├── ... (carousel image assets)
```

## How to Run

To run this project, you need a local web server. Follow the steps below:

1.  **Navigate to the project directory:**

    ```bash
    cd c:\Users\JV\Desktop\travelers_app
    ```

2.  **Start a local web server:**

    You can use Python's built-in HTTP server or Node.js's `http-server`.

    *   **Using Python (if you have Python installed):**

        ```bash
        python -m http.server 8000
        ```

    *   **Using Node.js (if you have Node.js installed, you might need to install `http-server` globally first: `npm install -g http-server`):**

        ```bash
        http-server -p 8000
        ```

3.  **Open your web browser** and go to `http://localhost:8000`.

## Technologies Used

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   Bootstrap 5 (for responsive design and UI components)
-   SweetAlert2 (for custom alerts and notifications)


# final-javascrip
