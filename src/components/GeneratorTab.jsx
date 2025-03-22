import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/GeneratorTab.css";

const GeneratorTab = () => {
  const [qrData, setQrData] = useState("");
  const [qrType, setQrType] = useState("text");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size] = useState(200);
  const [logo, setLogo] = useState(null);
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
  });

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleWifiDataChange = (field, value) => {
    setWifiData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateQRData = () => {
    switch (qrType) {
      case "wifi":
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case "url":
      case "text":
      default:
        return qrData;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrData(e.target.result);
        setQrType("text");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = (format) => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    switch (format) {
      case "png": {
        const pngUrl = canvas.toDataURL("image/png");
        downloadImage(pngUrl, "qr-code.png");
        break;
      }
      case "jpeg": {
        const jpegUrl = canvas.toDataURL("image/jpeg");
        downloadImage(jpegUrl, "qr-code.jpg");
        break;
      }
      case "svg": {
        const svgString = canvas.outerHTML;
        const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);
        downloadImage(svgUrl, "qr-code.svg");
        URL.revokeObjectURL(svgUrl);
        break;
      }
    }
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="generator-container">
      <div className="generator-grid">
        <div className="input-section">
          <div className="card">
            <h2 className="heading">Generate QR Code</h2>
            <div className="input-group">
              <label className="label">QR Code Type</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={qrType}
                  onChange={(e) => setQrType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="url">URL</option>
                  <option value="wifi">WiFi</option>
                  <option value="image">Image Upload</option>
                </select>
                <div className="select-icon">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {qrType === "wifi" ? (
              <div className="input-group">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Network Name (SSID)"
                    className="input"
                    value={wifiData.ssid}
                    onChange={(e) =>
                      handleWifiDataChange("ssid", e.target.value)
                    }
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    value={wifiData.password}
                    onChange={(e) =>
                      handleWifiDataChange("password", e.target.value)
                    }
                  />
                </div>
                <select
                  className="select"
                  value={wifiData.encryption}
                  onChange={(e) =>
                    handleWifiDataChange("encryption", e.target.value)
                  }
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Encryption</option>
                </select>
              </div>
            ) : qrType === "image" ? (
              <div className="input-group">
                <label className="label">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="input"
                />
              </div>
            ) : (
              <div className="input-group">
                <label className="label">
                  {qrType === "url" ? "Enter URL" : "Enter Text"}
                </label>
                <textarea
                  className="input"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  rows="4"
                  placeholder={
                    qrType === "url"
                      ? "https://example.com"
                      : "Enter your text here"
                  }
                />
              </div>
            )}
          </div>

          <div className="card customize-card">
            <h2 className="heading">Customize Design</h2>
            <div className="color-picker-group">
              <label className="label">QR Code Color</label>
              <div className="color-picker-wrapper">
                <div className="relative">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="color-picker"
                  />
                  <div className="color-value">{qrColor}</div>
                </div>
                <div
                  className="color-preview"
                  style={{ background: qrColor }}
                ></div>
              </div>
            </div>

            <div className="color-picker-group">
              <label className="label">Background Color</label>
              <div className="color-picker-wrapper">
                <div className="relative">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="color-picker"
                  />
                  <div className="color-value">{bgColor}</div>
                </div>
                <div
                  className="color-preview"
                  style={{ background: bgColor }}
                ></div>
              </div>
            </div>

            <div className="input-group">
              <label className="label">Logo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                ref={logoInputRef}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="card qr-preview-container">
            <div ref={qrRef} className="qr-preview">
              <div className={`qr-frame`}>
                <QRCodeCanvas
                  value={generateQRData()}
                  size={size}
                  fgColor={qrColor}
                  bgColor={bgColor}
                  level="H"
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          x: undefined,
                          y: undefined,
                          height: size * 0.2,
                          width: size * 0.2,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>
            </div>

            <div className="download-section">
              <p className="label">Download QR Code</p>
              <div className="download-grid">
                <button
                  onClick={() => downloadQR("png")}
                  className="btn btn-png"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  PNG
                </button>
                <button
                  onClick={() => downloadQR("jpeg")}
                  className="btn btn-jpeg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  JPEG
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="btn btn-svg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorTab;
