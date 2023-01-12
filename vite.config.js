export default {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        console.log("assetInfo", assetInfo);
        if (assetInfo.name == "style.css") return "customname.css";
        return assetInfo.name;
      },
    },
  },
};
