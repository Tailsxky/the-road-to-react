import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  ];

  const largeColumn = {
    width: '40%',
  };

  const midColumn = {
    width: '30%',
  };

  const smallColumn = {
    width: '10%'
  };



  /*function isSearched(searchTerm) {
    return function(item){
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
  }*/

  const isSearched = searchTerm => item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list,
      searchTerm: '',
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id){
    /*function isNotId(item){
      return item.objectID !== id;
    }*/
    const isNotId = item => {
      return item.objectID !== id;
    }
    const updatedList = this.state.list.filter(isNotId)
    this.setState({list: updatedList})
  }

  

  onSearchChange(e){
    this.setState({searchTerm: e.target.value})

  }

 

  render() {
    let helloWorld = "Welcome to the Road to React";
    let userName = "Tails"
    const { searchTerm, list } = this.state
    return (
      <div className="page">
      <div className="interactions">
      <h1>{helloWorld}</h1>
      <h2>{userName}</h2>
      <Search value={searchTerm} onChange={this.onSearchChange}>
      Search: </Search>
      </div>
      <Table 
        list={list} pattern={searchTerm} onDismiss={this.onDismiss}
      />
      </div>
    );
  }
}

/*class Search extends Component {
  render(){
    const {value, onChange, children } = this.props;
    return (
      <form>
        { children }
        <input type="text"
        value={value} onChange={onChange}
      />
      </form>
      );
  }
}*/

const Search = ({ value, onChange, children}) =>
    <form>
      { children }
      <input type="text"
      value={value} onChange={onChange}
    />
    </form>
  


/*class Table extends Component {
  render(){
    const { list, pattern, onDismiss } = this.props;
    return(
      <div>
        {list.filter(isSearched(pattern)).map(item => {
          return <div key={item.objectID}>
          <span>
            <a href={item.url}>{item.title}</a>
            </span>
            <span> {item.author}</span>
            <span> {item.num_comments}</span>
            <span> {item.points}</span>
            <span><Button onClick = {() => onDismiss(item.objectID)}
            type = "button" >
            Dismiss </Button></span>
        </div>
        })}
      </div>
    );
  }
}*/

const Table = ({ list, pattern, onDismiss }) => 
  <div className="table">
    {list.filter(isSearched(pattern)).map(item => {
      return <div key={item.objectID} className="table-row">
      <span style={ largeColumn }>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={ midColumn }> {item.author}</span>
      <span style={ smallColumn }> {item.num_comments}</span>
      <span style={ smallColumn }> {item.points}</span>
      <span style={ smallColumn }><Button onClick = {() => onDismiss(item.objectID)}
      type = "button" className="button-inline">
      Dismiss </Button></span>
  </div>
  })}
  </div>

/*class Button extends Component {
  render(){
    const { onClick, className = '', children } = this.props;
    return (
      <button onClick = {onClick}
      className = {className}
      type="button" >
       { children }
       </button>
    )
  }
}*/

const Button = ({ onClick, className= '', children}) =>
  <button onClick = {onClick}
    className = {className}
    type="button" >
    { children }
 </button>

export default App;
