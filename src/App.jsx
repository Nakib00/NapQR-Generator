import React from "react";

import GeneratorTab from "./components/GeneratorTab";

const App = () => {
  return (
    <div className="app-container">
      <h1>Nap QR</h1>
      <main className="main-content">
        <GeneratorTab />
      </main>
      <p>Developed by Napver.com</p>
    </div>
  );
};

export default App;
