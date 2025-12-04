import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";
import { isPWAInstalled } from "../utils/pwa";

export const InstallPWA = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const isInstalled = isPWAInstalled();
    console.log("PWA installed check:", isInstalled);

    if (isInstalled) {
      console.log("PWA already installed, not showing prompt");
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired!");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      setShowFallback(false);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setShowFallback(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show fallback after 3 seconds if beforeinstallprompt hasn't fired
    const fallbackTimer = setTimeout(() => {
      console.log("beforeinstallprompt event not fired, showing fallback");
      setShowFallback(true);
    }, 3000);

    console.log("InstallPWA component mounted, listening for install event");

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowFallback(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleFallbackInstall = () => {
    // For fallback: show instructions for manual installation
    alert(
      "To install this app:\n\n1. Click the menu (⋮) or settings icon in your browser\n2. Select 'Install app' or 'Add to Home Screen'\n3. Follow the prompts to complete installation"
    );
  };

  if (!showInstallPrompt && !showFallback) {
    return null;
  }

  const isFallback = showFallback && !deferredPrompt;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-in slide-in-from-bottom-2 md:bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Install Bhajanbaug Sabha App
            </h3>
            <p className="text-sm text-gray-600">
              {isFallback
                ? "Use your browser menu to install"
                : "Add to home screen for quick access"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={isFallback ? handleFallbackInstall : handleInstallClick}
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            {isFallback ? "Help" : "Install"}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
