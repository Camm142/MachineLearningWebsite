import React from 'react';

export default function PredictTable({ predictions, fetchPredictions }) {
  //get property type function, if it is h, change to house, u to unit, t to townhouse
  const getPropertyType = (propType) => {
    return propType === 'h' ? 'House' : propType === 'u' ? 'Unit' : 'Townhouse';
  };

  //handle delete action
  const handleDelete = (id) => {
    if (window.confirm('Delete this prediction?')) {
      fetch(`http://127.0.0.1:8000/delete-prediction/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            alert('Deleted successfully!');
            fetchPredictions();
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

  //function to get total number of rooms
  const getTotalRooms = (houseData) => {
    return houseData.bedroom + houseData.bathroom + houseData.car_garage;
  };

  return (
    <div className="row mt-3">
      <h1 className="text-center text-uppercase">Predictions History</h1>
      <div className="col-12">
        {/* display table  */}
        <table className="table">
          <thead className='table-danger text-center'>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">House Data</th>
              <th scope="col">Predicted Price (AUD)</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.id}>
                <th className='text-center' scope="row">{prediction.id}</th>
                <td>
                  <ul>
                    {prediction.house_data.cbd_distance !== 0 && (
                      <li>Distance to CBD(km): {prediction.house_data.cbd_distance}</li>
                    )}
                    <li>Built year: {prediction.house_data.built_year}</li>
                    {prediction.house_data.building_area !== 0 && (
                      <li>Building area(sqm): {prediction.house_data.building_area}</li>
                    )}
                    {prediction.house_data.landsize !== 0 && (
                      <li>Landsize(sqm): {prediction.house_data.landsize}</li>
                    )}
                    <li>Location: {prediction.house_data.suburb_name}</li>
                    <li>
                      Total Rooms: {getTotalRooms(prediction.house_data)} ({prediction.house_data.bedroom} bedroom, {prediction.house_data.bathroom} bathroom, {prediction.house_data.car_garage} car-garage)
                    </li>
                    <li>Property Type: {getPropertyType(prediction.house_data.prop_type)}</li>
                  </ul>
                </td>
                <td className='text-center'>{prediction.predicted_price.toLocaleString()}</td>
                <td className='text-center'>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(prediction.id)}
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
  );
}
