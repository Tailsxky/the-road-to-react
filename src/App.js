import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result){
    const {hits, page} = result;

    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: { ...results,
      [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0){

    // axios to request for the data 
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    //.then(response => response.json())
    .then(result => this.setSearchTopStories(result.data))
    .catch(e => this.setState({error:e}));

  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }




  onDismiss(id){
    /*function isNotId(item){
      return item.objectID !== id;
    }*/
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];


    const isNotId = item => {
      return item.objectID !== id;
    }
    const updatedHits = hits.filter(isNotId)
    this.setState({
      results: {...results, 
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }

  

  onSearchChange(e){
    this.setState({searchTerm: e.target.value})

  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault();
  }

 

  render() {
    let helloWorld = "Welcome to the Road to React";
    let userName = "Tails"

    const { searchTerm, results, searchKey, error } = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    
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
      { error
        ? <div className="interactions">
            <p>Something Wrong! </p>
          </div>
        : <Table        
        list={list}  
        onDismiss={this.onDismiss}
      />
      }

      <div className="interactions">
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1 )}
        >
        More
        </Button>
        </div>
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

export {
  Button,
  Search,
  Table
};