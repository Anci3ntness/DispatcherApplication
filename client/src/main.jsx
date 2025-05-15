import { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import UserStore from "./store/UserStore.js";

export const Context = createContext();

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

const context = { user: new UserStore() };

function renderApp() {
    root.render(
        <Context.Provider value={context}>
            <App />
        </Context.Provider>
    );
}
renderApp();
if (import.meta.hot) {
    import.meta.hot.accept("./App", () => {
        renderApp();
    });
}
