import React, { Component } from 'react';
//import logo from './logo.svg';
import PropTypes from 'prop-types';
import 'font-awesome/css/font-awesome.min.css'; 
import { sortBy } from 'lodash';
import classNames from 'classnames';
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
      error: null,
      isLoading: false,
      //sortKey: 'NONE',
      //isSortReverse: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    //this.onSort = this.onSort.bind(this);
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
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page = 0){
    this.setState({ isLoading: true });
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

  // moved to table component
  /*onSort(sortKey){
    const isSortReverse = this.state.sortKey
    === sortKey && !this.state.isSortReverse;

    this.setState( {sortKey, isSortReverse} );
  }

*/

  render() {
    let helloWorld = "Welcome to the Road to React";
    let userName = "Tails"

    const { searchTerm, results, searchKey, error, isLoading//, sortKey, isSortReverse 
    } = this.state
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
        //isSortReverse={isSortReverse}
        //sortKey={sortKey}
        //onSort={this.onSort}
        onDismiss={this.onDismiss}
      />
      }

      <div className="interactions">
        <ButtonWithLoading 
          isLoading={isLoading}
          onClick={() => this.fetchSearchTopStories(searchKey, page + 1 )}
        >
          More
        </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

/*class Search extends Component {
  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }
  render(){
    const {value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text"
        value={value} onChange={onChange}
        ref={ (node) => { this.input = node; } }
      />
      <button type="submit">{ children }</button>
      </form>
      );
  }
}*/

const Search = ({ value, onChange, onSubmit, children}) => {
    let input;
    return(
    <form onSubmit={onSubmit}>
      <input type="text"
      value={value} onChange={onChange}
      ref={ (node) => input = node}
    />
    <button type="submit">{ children }</button>
    </form>
    );
}
  


class Table extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
    
  }

  onSort(sortKey){
    const isSortReverse = this.state.sortKey
    === sortKey && !this.state.isSortReverse;

    this.setState( {sortKey, isSortReverse} );
  }

  render(){
    const { list, onDismiss, //sortKey, 
      //onSort, isSortReverse 
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
    return(
         <div className="table">
         <div className='table-header'>
           <span style={ largeColumn } >
             <Sort sortKey={'TITLE'} onSort={this.onSort}
             activeSortKey={sortKey} isSortReverse={isSortReverse}>
             Title </Sort> </span>
           <span style={ midColumn } >
             <Sort sortKey={'AUTHOR'} onSort={this.onSort}
             activeSortKey={sortKey} isSortReverse={isSortReverse}>
             Author </Sort></span>
           <span style={ smallColumn } >
             <Sort sortKey={'COMMENTS'} onSort={this.onSort}
             activeSortKey={sortKey} isSortReverse={isSortReverse}>
             Comments </Sort></span>
           <span style={ smallColumn } >
             <Sort sortKey={'POINTS'} onSort={this.onSort}
             activeSortKey={sortKey} isSortReverse={isSortReverse}>
             Points </Sort></span>  
           <span style={ smallColumn } >
             Archive
             </span>
         </div>    
         {reverseSortedList.map(item => {
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
  )}
}



/*const Table = ({ list, onDismiss, sortKey, onSort, isSortReverse }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
  ? sortedList.reverse()
  : sortedList;

  return(
  <div className="table">
    <div className='table-header'>
      <span style={ largeColumn } >
        <Sort sortKey={'TITLE'} onSort={onSort}
        activeSortKey={sortKey} isSortReverse={isSortReverse}>
        Title </Sort> </span>
      <span style={ midColumn } >
        <Sort sortKey={'AUTHOR'} onSort={onSort}
        activeSortKey={sortKey} isSortReverse={isSortReverse}>
        Author </Sort></span>
      <span style={ smallColumn } >
        <Sort sortKey={'COMMENTS'} onSort={onSort}
        activeSortKey={sortKey} isSortReverse={isSortReverse}>
        Comments </Sort></span>
      <span style={ smallColumn } >
        <Sort sortKey={'POINTS'} onSort={onSort}
        activeSortKey={sortKey} isSortReverse={isSortReverse}>
        Points </Sort></span>  
      <span style={ smallColumn } >
        Archive
        </span>
    </div>    
    {reverseSortedList.map(item => {
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
  )}*/

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

 Button.propTypes = {
   onClick: PropTypes.func.isRequired,
   className: PropTypes.string,
   children: PropTypes.node.isRequired,
 }

 Table.propTypes = {
   list: PropTypes.array.isRequired,
   onDismiss: PropTypes.func.isRequired,
 }

 const Loading = () => 
  <div className='fa-3x'>
    <i className='fa fa-spinner fa-pulse'></i>
  </div>

const withLoading = (Component) => ( { isLoading, ...rest }) =>
 isLoading
  ? <Loading />
  : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),

}

const Sort = ({ sortKey, onSort, activeSortKey, isSortReverse, children }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );
  const sortClassIcon = classNames(
    'fa',
    {'fa-hand-o-up': sortKey === activeSortKey && isSortReverse === false },
    { 'fa-hand-o-down': sortKey === activeSortKey && isSortReverse === true }
  );
  return(
  <Button onClick={() => onSort(sortKey)}
   className={sortClass} >
   
    { children }  <i className={sortClassIcon} aria-hidden="true"></i>
    </Button>
  )}

export default App;

export {
  Button,
  Search,
  Table
};