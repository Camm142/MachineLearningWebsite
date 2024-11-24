import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles/pages/charts.css';
import ScatterPlotPage from '../components/ScatterPlotComponent';
import BarChart from '../components/BarChartComponent';
import GaugeChartComponent from '../components/GaugeChartComponent';

export default function MarketCharts() {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Change between charts with animation
  const handleArrowClick = () => {
    setAnimate(true); // Trigger animation
    setTimeout(() => {
      setCurrentChartIndex((prevIndex) => (prevIndex + 1) % 3);
      setAnimate(false); // End animation after transition
    }, 300); // Duration should match the CSS transition time
  };

  const renderChart = () => {
    if (currentChartIndex === 0) {
      return <ScatterPlotPage />;
    } else if (currentChartIndex === 1) {
      return <BarChart />;
    } else if (currentChartIndex === 2) {
      return <GaugeChartComponent />;
    }
  };

  // Reload only on window resize and ScatterPlot chart (currentChartIndex === 0)
  useEffect(() => {
    const handleResize = () => {
      if (currentChartIndex === 0) {
        window.location.reload();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentChartIndex]);

  return (
    <>
      <NavBar />
      <div className="container mt-5 mb-5">
        <div className="d-flex flex-column justify-content-center align-items-center text-center">
          <div className={`chart-container ${animate ? 'fade-in' : ''}`}>
            {renderChart()}
          </div>
          <div
            className="arrow-icon"
            onClick={handleArrowClick}
            style={{ position: 'fixed', right: '10px', top: '50%', cursor: 'pointer' }}
          >
            <button className="btn btn-danger rounded-circle">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
