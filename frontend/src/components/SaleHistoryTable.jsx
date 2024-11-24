import { useState, useEffect } from "react";

export default function SaleTable({ onSalesHistoryFetched }) {
  //set state for prediction result
  const [salesPredictions, setSalesPredictions] = useState([]);

  // Fetch sale data
  const fetchSalesPredictions = () => {
    fetch('http://127.0.0.1:8000/sale-prediction-history/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setSalesPredictions(data.predictions);
        onSalesHistoryFetched(data.predictions); // Call the function to update parent state
      })
      .catch((error) => {
        alert('Error fetching sales prediction history: ' + error.message);
        setSalesPredictions([]);
      });
  };

  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm('Delete this prediction?')) {
      fetch(`http://127.0.0.1:8000/delete-sale-prediction/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            alert('Deleted successfully!');
            fetchSalesPredictions(); // Refresh the sales predictions after deletion
          } else {
            return response.json().then((data) => {
              alert(data.detail || 'Failed to delete the prediction. Please try again.');
            });
          }
        })
        .catch((error) => {
          alert('Error deleting prediction: ' + error.message);
        });
    }
  };

  useEffect(() => {
    fetchSalesPredictions();
  }, []);

  return (
    <>
      <div className="row mt-5">
        <h1 className="text-center text-uppercase">Sales Predictions History</h1>
        <div className="col-12">
          {/* display table  */}
          <table className="table">
            <thead className='table-danger text-center'>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">House and Market Data</th>
                <th scope="col">Property Score Predict</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesPredictions.map((salesPrediction) => (
                <tr key={salesPrediction.id}>
                  <th className='text-center' scope="row">{salesPrediction.id}</th>
                  <td>
                    <ul>
                      <li>Predicted Result: {salesPrediction.predicted_result}</li>
                      <li>Predicted Status: {salesPrediction.predicted_status}</li>
                      <li>Price: {salesPrediction.price.toLocaleString()}</li>
                      <li>Median Price: {salesPrediction.median_price.toLocaleString()}</li>
                      <li>Median Rental: {salesPrediction.median_rental.toLocaleString()}</li>
                    </ul>
                  </td>
                  <td className='text-center'>{salesPrediction.predicted_result.toLocaleString()}</td>
                  <td className='text-center'>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(salesPrediction.id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
