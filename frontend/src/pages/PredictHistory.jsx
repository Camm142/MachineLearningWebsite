// PredictHistory.js
import React, { useState, useEffect } from 'react';
import '../styles/pages/history.css';
import PredictTable from '../components/PredictHistoryTable';
import SaleTable from '../components/SaleHistoryTable';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function PredictHistory() {
  //define state for initial export type, table, predictions
  const [exportType, setExportType] = useState('json');
  const [showPredictTable, setShowPredictTable] = useState(true);
  const [predictions, setPredictions] = useState([]); //state for predicted price
  const [salesPredictions, setSalesPredictions] = useState([]); // State for sales predictions
  const [animationClass, setAnimationClass] = useState(''); // State for animation class


  const fetchPredictions = () => {
    fetch('http://127.0.0.1:8000/prediction-history/') // fetch data from predicted price
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setPredictions(data.predictions);
      })
      .catch((error) => {
        alert('Error fetching history: ' + error.message);
      });
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  //handle export action
  const handleExport = () => {
    if (exportType === 'json') {
      exportAsJSON();
    } else if (exportType === 'csv') {
      exportAsCSV();
    }
  };

  //export data as JSON file
  const exportAsJSON = () => {
    const dataToExport = showPredictTable ? predictions : salesPredictions;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = showPredictTable ? 'predictions.json' : 'sales_predictions.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //export data as CSV file
  const exportAsCSV = () => {
    const csvRows = [];
    if (showPredictTable) { //for predicted price
      csvRows.push(['ID', 'Distance to CBD', 'Built Year', 'Building Area (sqm)', 'Landsize (sqm)', 'Location', 'Total Rooms', 'Property Type', 'Predicted Price (AUD)']);
      predictions.forEach((prediction) => {
        const totalRooms = prediction.house_data.bedroom + prediction.house_data.bathroom + prediction.house_data.car_garage;
        const propType = prediction.house_data.prop_type === 'h' ? 'House' : prediction.house_data.prop_type === 'u' ? 'Unit' : 'Townhouse';
        const row = [
          prediction.id,
          prediction.house_data.cbd_distance,
          prediction.house_data.built_year,
          prediction.house_data.building_area,
          prediction.house_data.landsize,
          prediction.house_data.suburb_name,
          totalRooms,
          propType,
          prediction.predicted_price
        ];
        csvRows.push(row);
      });
    } else { //for sale predictions
      csvRows.push(['ID', 'Predicted Result', 'Predicted Status', 'Price', 'Median Price', 'Median Rental']);
      salesPredictions.forEach((sale) => {
        const row = [
          sale.id,
          sale.predicted_result,
          sale.predicted_status,
          sale.price,
          sale.median_price,
          sale.median_rental
        ];
        csvRows.push(row);
      });
    }

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = showPredictTable ? 'predictions-history.csv' : 'sales-history.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //handle toggle action for button
  const toggleTable = () => {
    setAnimationClass('fade-out');

    setTimeout(() => {
      setShowPredictTable(!showPredictTable);
      setAnimationClass('slide-in');
    }, 300);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex flex-column justify-content-center align-items-center mt-3">
          {/* set animation to change table */}
          <div className={`${animationClass}`} key={showPredictTable ? 'predict' : 'sale'}>
              {showPredictTable ? (
                <PredictTable predictions={predictions} fetchPredictions={fetchPredictions} />
              ) : (
                <SaleTable onSalesHistoryFetched={setSalesPredictions} />
              )}
          </div>
          <div className="arrow-icon" onClick={toggleTable} style={{ position: 'fixed', right: '10px', top: '50%', cursor: 'pointer' }}>
            <button className="btn btn-danger rounded-circle">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className='ms-3 mb-3'>Export As
            <select className='ms-2' value={exportType} onChange={(e) => setExportType(e.target.value)}>
              <option value='json'>JSON</option>
              <option value='csv'>CSV</option>
            </select>
            <button className='btn btn-danger btn-sm ms-2' onClick={handleExport}>Export</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
