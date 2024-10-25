import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";

const App = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const leftPanelRef = useRef(null);

  const tableData = [
    ["Test", "Result", "Reference Range"],
    ["Complete Blood Count", "Normal", "4.5-11.0 x 10^9/L"],
    ["Liver Function", "Elevated", "7-56 U/L"],
    ["Cholesterol", "High", "<200 mg/dL"],
    ["Blood Sugar", "Normal", "70-100 mg/dL"],
  ];

  const captureZoomedImage = async (x, y) => {
    const leftPanel = leftPanelRef.current;
    if (!leftPanel) return;

    const leftPanelCanvas = await html2canvas(leftPanel);
    const context = canvasRef.current.getContext("2d");

    const zoomBoxWidth = 400;
    const zoomBoxHeight = 120;

    canvasRef.current.width = zoomBoxWidth;
    canvasRef.current.height = zoomBoxHeight;

    const rect = leftPanel.getBoundingClientRect();
    const offsetX = x - rect.left - zoomBoxWidth / 4;
    const offsetY = y - rect.top - zoomBoxHeight / 4;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    context.drawImage(
      leftPanelCanvas,
      offsetX,
      offsetY,
      zoomBoxWidth / 2,
      zoomBoxHeight / 2,
      0,
      0,
      canvasRef.current.width, 
      canvasRef.current.height 
    );

    const imgURL = canvasRef.current.toDataURL("image/png");
    setImgSrc(imgURL);
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
      captureZoomedImage(clientX, clientY); 
    };

    const leftPanel = leftPanelRef.current;
    if (leftPanel) {
      leftPanel.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (leftPanel) {
        leftPanel.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="page-container">
      <header className="header">
        <h1>Patient Blood Report</h1>
      </header>

      <div className="content-container">
        <div className="left-panel" ref={leftPanelRef}>
          <section className="patient-details">
            <h2>Patient Details</h2>
            <p>Name: John Doe</p>
            <p>Age: 45</p>
            <p>Blood Type: O+</p>
            <p>Report Date: 24th October 2024</p>
          </section>

          {["RBC", "WBC", "Platelets"].map((type) => (
            <section className="test-results" key={type}>
              <h2>Blood Test Results - {type}</h2>
              <table>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="table-cell">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        <div className="right-panel">
          <h2>Zoomed-Out View</h2>
          <div className="zoom-box" style={{ border: '1px solid black', padding: '10px', position: 'relative', width: '400px', height: '120px', overflow: 'hidden' }}>
            {imgSrc && (
              <img
                src={imgSrc}
                alt="Zoomed-in view"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', 
                }}
              />
            )}
          </div>

          <section className="test-summary">
            <h2>Test Summary</h2>
            <p>Overall, the patient's blood test results are stable, except for slightly elevated cholesterol levels. Follow-up testing may be required.</p>
          </section>

          <section className="recommendations">
            <h2>Doctor's Recommendations</h2>
            <ul>
              <li>Continue a balanced diet, avoiding high cholesterol foods.</li>
              <li>Consider regular exercise to manage cholesterol.</li>
              <li>Re-test cholesterol levels in 6 months.</li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="footer">
        <p>Medical Testing Center © 2024</p>
      </footer>

      {}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;
