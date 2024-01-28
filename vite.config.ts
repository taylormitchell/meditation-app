import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default ({ mode }) => {
  const plugins: PluginOption[] = [react(), VitePWA()];
  if (mode === "development") {
    // over https locally cause wakeLock doesn't work on http
    plugins.push(basicSsl());
  }
  return defineConfig({
    plugins,
    base: process.env.BASE_URL || "/",
  });
};
