const iconPool = {
    code: "💻",
    rocket: "🚀",
    cloud: "☁️",
    database: "🗄️",
    chip: "🧠",
    fire: "🔥",
    wrench: "🔧",
    gear: "⚙️",
    bug: "🐞",
    shield: "🛡️",
    satellite: "🛰️",
    signal: "📶",
    mobile: "📱",
    plug: "🔌",
    keyboard: "⌨️",
    disk: "💽",
    robot: "🤖",
    dna: "🧬",
    lightning: "⚡",
    package: "📦",
    hammer: "🔨",
    star: "⭐",
    idea: "💡",
    clipboard: "📋",
    terminal: "🖥️",
    recycle: "♻️",
    folder: "📁",
    wifi: "📡",
  };
  
  // Function to get a random tech-related icon
  export const getRandomIcon = () => {
    const icons = Object.values(iconPool);
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };
  
  export default iconPool;
  