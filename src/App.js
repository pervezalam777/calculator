import {useRef, useState} from 'react'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import * as aiCalculator from './calculator'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';

function App() {
  const areaRef = useRef();
  const [processed, setProcessed] = useState(false);
  const [value, setValue] = useState(-1);

  const handleClick = () => {
    const processed = aiCalculator.processRawData(areaRef.current.value)
    setProcessed(processed);
  }

  const handleTotalHouseExpense = () => {
    const result = aiCalculator.totalHouseExpense()
    setValue(`Total House expense ${result}`);
  }

  function renderOptions() {
    if(processed) {
      return (
        <>
          <div>
            <button onClick={handleTotalHouseExpense}> totalHouseExpense </button>
          </div>
          <div>Result: {value}</div>
          {renderPersonExpenseTable()}
          {renderTable()}
        </>
      )
    }
    return null;
  }

  function renderPersonExpenseTable() {
    return (
      <>
        <table>
          <thead>
            <th>Name</th>
            <th>Paid</th>
            <th>Received</th>
            <th>Paid from own pocket</th>
          </thead>
          <tbody>
          {
              aiCalculator.getPersonList().map(name => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{aiCalculator.paidBy(name)}</td>
                  <td>{aiCalculator.receivedBy(name)}</td>
                  <td>{aiCalculator.paidFromOwnPocket(name)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </>
     
    )
  }

  function renderTable() {
    const result = aiCalculator.getTabularFormat();
    console.log('tabular result', result);
    if(result.length > 0){
      return (
        <div className="ag-theme-alpine" style={{height: 400, width: '100%'}}>
           <AgGridReact
               rowData={result}>
               <AgGridColumn field="by" sortable={ true } filter={ true } ></AgGridColumn>
               <AgGridColumn field="paymentMode" sortable={ true } filter={ true }></AgGridColumn>
               <AgGridColumn field="amount"></AgGridColumn>
               <AgGridColumn field="description"></AgGridColumn>
               <AgGridColumn field="date"></AgGridColumn>
           </AgGridReact>
        </div>
      )
    }
    return null;
  }

  return (
    <div className="App">
      <div>
        <textarea ref={areaRef}
          placeholder="whatsApp messages"
          style={{
            width: '400px',
            height: '200px'

          }}
        ></textarea>
        <button onClick={handleClick}>process data</button>
      </div>
      {renderOptions()}
    </div>
  );
}

export default App;
