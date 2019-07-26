import React, { Component } from 'react';
import './App.css';
import io from "socket.io-client";

class App extends Component {

  state = {
    previousOperand: '',
    currentOperand: '',
    operation: '',
    endPoint: '/',
    calculation:"",
    history:[]
  }

  componentDidMount = () => {
    const socket = io(this.state.endpoint);
    socket.emit('new user')
    socket.on('calc', (array) => {
      this.setState({
        history: array,
      })
    })
  }

  send = () => {
    const socket = io(this.state.endpoint);
    socket.emit('add calculation', this.state);
    console.log('');
  }

  onChangeNumbers = (key) => {
    if (key === '.') {
      if (!this.state.currentOperand.includes('.')) {
        let newNumber = `${this.state.currentOperand}${key}`
        this.setState({
          currentOperand: newNumber,
        })
      }
    } else {
      let newNumber = `${this.state.currentOperand}${key}`
      this.setState({
        currentOperand: newNumber,
      })
    }
  }

  onChangeOperations = (key) => {
    if (this.state.previousOperand && this.state.currentOperand && this.state.operation) {
      this.calculate(key)
    } else if (this.state.currentOperand !== '') {
      this.setState({
        operation: key,
        previousOperand: this.state.currentOperand,
        currentOperand: '',
      })
    } else if (this.state.previousOperand !== '') {
      this.setState({
        operation: key
      })
    }
  }

  calculate = (operationKey) => {
    if (this.state.previousOperand && this.state.currentOperand && this.state.operation) {

      let answer = eval(`${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`)

      this.setState({
        previousOperand: eval(`${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand}`),
        currentOperand: '',
        operation: operationKey,
        calculation: `${this.state.previousOperand} ${this.state.operation} ${this.state.currentOperand} = ${answer}`
      }, () => {
        console.log('asdasjdkhasdhjasdkasld', this.state);
        this.send();
      }
      )

    }
  }

  onClickDelete = () => {
    this.setState({
      currentOperand: this.state.currentOperand.substring(0, this.state.currentOperand.length - 1)
    })
  }

  allClear = () => {
    this.setState({
      previousOperand: '',
      currentOperand: '',
      operation: '',
    })
  }

  render() {
    let listOfCalculations = null;
    listOfCalculations = this.state.history.map((element, i) => {
      console.log('this is the element', element);
      return (
        <div>
          <p key={i}>{element}</p>
        </div >
      )
    });

    console.log('this is the history======', this.state.history);
    

    return (
      <div className="main-div-wrapper">

        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">{this.state.previousOperand}{this.state.operation}</div>
            <div className="current-operand">{this.state.currentOperand}</div>
          </div>
          <button className="span-two" onClick={() => this.allClear()}>AC</button>
          <button onClick={() => this.onClickDelete()}>DEL</button>
          <button onClick={() => this.onChangeOperations('/')}>/</button>

          <button onClick={() => this.onChangeNumbers('1')}>1</button>
          <button onClick={() => this.onChangeNumbers('2')}>2</button>
          <button onClick={() => this.onChangeNumbers('3')}>3</button>
          <button onClick={() => this.onChangeOperations('*')}>*</button>

          <button onClick={() => this.onChangeNumbers('4')}>4</button>
          <button onClick={() => this.onChangeNumbers('5')}>5</button>
          <button onClick={() => this.onChangeNumbers('6')}>6</button>
          <button onClick={() => this.onChangeOperations('+')}>+</button>

          <button onClick={() => this.onChangeNumbers('7')}>7</button>
          <button onClick={() => this.onChangeNumbers('8')}>8</button>
          <button onClick={() => this.onChangeNumbers('9')}>9</button>
          <button onClick={() => this.onChangeOperations('-')}>-</button>

          <button onClick={() => this.onChangeNumbers('.')}>.</button>
          <button onClick={() => this.onChangeNumbers('0')}>0</button>
          <button onClick={() => this.calculate('')} className="span-two">=</button>

        </div>

        <div className="history-list">
          <ul>
            {listOfCalculations}
          </ul>
        </div>

      </div>
    );
  }
}

export default App;
