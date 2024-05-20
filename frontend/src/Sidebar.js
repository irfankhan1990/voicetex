// Sidebar.js
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [sidebarItems, setSidebarItems] = useState([]);

  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        {sidebarItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
