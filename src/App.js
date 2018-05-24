import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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

  //const isSearched = searchTerm => item =>
  //      item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm){
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.JSON())
    .then(result => this.setSearchTopStories(result))
    .catch(e => e);
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id){
    /*function isNotId(item){
      return item.objectID !== id;
    }*/
    const isNotId = item => {
      return item.objectID !== id;
    }
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    })
  }

  

  onSearchChange(e){
    this.setState({searchTerm: e.target.value})

  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

 

  render() {
    let helloWorld = "Welcome to the Road to React";
    let userName = "Tails"

    const { searchTerm, result } = this.state
 
    return (
      <div className="page">
      <div className="interactions">
      <h1>{helloWorld}</h1>
      <h2>{userName}</h2>
      <Search value={searchTerm} 
      onChange={this.onSearchChange}
      onSubmit={this.onSearchSubmit}
      >
      Search </Search>
      </div>
      { result &&
       <Table 
        list={result.hits}  
        onDismiss={this.onDismiss}
      />
      
      }
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

const Search = ({ value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
      <input type="text"
      value={value} onChange={onChange}
    />
    <button type="submit">{ children }</button>
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

const Table = ({ list, onDismiss }) => 
  <div className="table">
    {list.map(item => {
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
