import {useRef, useState} from 'react'

import * as aiCalculator from './calculator'
import './App.css';

function App() {
  const areaRef = useRef();
  const [processed, setProcessed] = useState(false);
  //const [person, setPerson] = useState('');
  const [value, setValue] = useState(-1);

  const handleClick = () => {
    const processed = aiCalculator.processRawData(areaRef.current.value)
    setProcessed(processed);
  }

  // const onChangeValue = (event) => {
  //   const method = event.target.value;
  //   const result = aiCalculator[method](person);
  //   setValue(`${method}: ${result}`)
  // }

  const handleTotalHouseExpense = () => {
    const result = aiCalculator.totalHouseExpense()
    setValue(`Total House expense ${result}`);
  }

  // const onPersonSelectionChange = (event) => {
  //   const name = event.target.value;
  //   setPerson(name);
  // }

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
        {/* <div>
          <h4>Select name </h4>
          <ul onChange={onPersonSelectionChange}>
            {
              aiCalculator.getPersonList().map(name => (
                <li key={name}>
                  <input type="radio" value={name} name="person" /> {name}
                </li>
              ))
            }
          </ul>
        </div>
        <div onChange={onChangeValue}>
          <h4> Select option </h4>
          <div>
            <input type="radio" value="paidFromOwnPocket" name="option" /> Paid From Own Pocket
          </div>
          <div>
            <input type="radio" value="paidBy" name="option" /> Paid By
          </div>
          <div>
            <input type="radio" value="receivedBy" name="option" /> Received By
          </div>
        </div> */}
      </>
     
    )
  }

  function renderTable() {
    const result = aiCalculator.getTabularFormat();
    console.log('tabular result', result);
    if(result.length > 0){
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Payment Mode</th>
              <th>Amount</th>
              <th>Description</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {
              result.map((tuple, index) => (
                <tr key={index}>
                  <td>{tuple.by}</td>
                  <td>{tuple.paymentMode}</td>
                  <td>{tuple.amount}</td>
                  <td>{tuple.description}</td>
                  <td>{tuple.date}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
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
