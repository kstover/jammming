/**
 * Main Jammming React Component
 *
 * @version 1.0
 */

// Import our components, libraries, and CSS.
import React, { Component } from 'react';
import './App.css';
import { Playlist } from './components/Playlist';
import { SearchResults } from './components/SearchResults';
import { SearchBar } from './components/SearchBar';
import { ConnectPrompt } from './components/ConnectPrompt';
import { Spotify } from './util/Spotify';

/**
 * Main React component for our app.
 * Renders into the #root HTML element.
 */
class App extends Component {
  constructor( props ) {
    super( props );

    // Set our initial state.
    this.state = {
      accessToken: '',
      searchResults: [],
      playlist: [],
      playlistName: 'New Playlist',
      searchTerm: ''
    };

    // Bind our methods so that they always have the app component as their context.
    this.updatePlaylist = this.updatePlaylist.bind( this );
    this.updatePlaylistName = this.updatePlaylistName.bind( this );
    this.createPlaylist = this.createPlaylist.bind( this );
    this.updateSearchTerm = this.updateSearchTerm.bind( this );
    this.searchSpotify = this.searchSpotify.bind( this );
  }

  /**
   * Just before this component is rendered, we want to check out URL for an access token.
   * 
   * @since  1.0
   * @return void
   */
  componentWillMount() {
    this.setupToken();
  }

  /**
   * Adds an item to our playlist and updates the state with the new playlist.
   * 
   * @since  1.0
   * @param  {object} item   Track that we want to add to our playlist.
   * @param  {string} action 'add' or 'remove' depending upon what action we want to take.
   * @return void
   */
  updatePlaylist( item, action ) {
    if ( ! action ) {
      return false;
    }
    let playlist;
    if ( 'add' === action ) {
      playlist = this.state.playlist;
      playlist.push( item );
    } else if ( 'remove' === action ) {
      playlist = this.state.playlist.filter( playlistItem => playlistItem.id !== item.id );
    }
    this.setState( { playlist: playlist } );
  }

  /**
   * When the user types in our Playlist Name input, update our state.
   * 
   * @since  1.0
   * @param  {string} name Playlist Name input's current value.
   * @return void
   */
  updatePlaylistName( name ) {
    this.setState( { playlistName: name } );
  }

  /**
   * Turns a JSON object from Spotify into a usable form.
   * This method is in the app component and not the Spotify object in order to keep
   * the Spotify object purely for interacting with Spotify.
   * 
   * @since  1.0
   * @param  {object} JSONResponse Object to be converted into a Jammming compatible format.
   * @return {array}  An array of track objects.
   */
  convertJSONResponse( JSONResponse ) {
    return JSONResponse.tracks.items.map( item => {
      return {
        id: item.id,
        title: item.name,
        artist: item.artists[0].name,
        album: item.album.name
      }
    } );
  }

  /**
   * Use our Spotify object to add a playlist.
   * Calls our clear function upon completion.
   * Passed down to the Playlist component and called from there.
   * 
   * @since  1.0
   * @return void
   */
  createPlaylist() {
    Spotify.createPlaylist( this.state.playlistName, this.state.playlist ).then( response => {
      this.resetState();
    } );
  }

  /**
   * Use our Spotify object to search for a song, album, or artist.
   * Spotify.search() returns a promise object.
   * When that promise is fullfilled, update our state with the search results.
   * 
   * @since  1.0
   * @return void
   */
  searchSpotify() {
    Spotify.search( this.state.searchTerm ).then( response => {
      let results = this.convertJSONResponse( response );
      this.setState( { searchResults: results } );
    } );
    
  }

  /**
   * Return our state to the original with the exception of the accessToken.
   * 
   * @since  1.0
   * @return void
   */
  resetState() {
    this.setState( {
      searchResults: [],
      playlist: [],
      playlistName: 'New Playlist',
      searchTerm: ''
    } );
  }

  /**
   * Update our state when the user types in the search bar input.
   * 
   * @since  1.0
   * @param  {string} searchTerm Current text in the search bar input.
   * @return void
   */
  updateSearchTerm( searchTerm ) {
    this.setState( { searchTerm: searchTerm } );
  }

  /**
   * Parse our querystring to see if we have an access token.
   * If we do, then set our state.accessToken to that variable.
   * If we don't, set our state.accessToken to an empty string.
   * 
   * @since  1.0
   * @return void
   */
  setupToken() {
    // Grab our location and replace the /# with a /? so that our #access_token is ?access_token, which can be parsed as a querystring.
    let url = window.location.href;
    url = url.replace( '/#', '/?' );
    let parseUrl = new URL( url );
    let accessToken = parseUrl.searchParams.get( 'access_token' );
    let expiresIn = parseUrl.searchParams.get( 'expires_in' );

    // Wipe our access token after it has expired.
    window.setTimeout( () => this.setState( { accessToken: '' } ), expiresIn * 1000 );
    // Clear the access token and querystring from the URL
    window.history.pushState( 'Jammming', null, '/' );

    // Set our Spotify access token.
    Spotify.accessToken = accessToken;
    // Update our state with the access token.
    this.setState( { accessToken: accessToken } );
  }

  /**
   * Responsible for returning JSX that gets output in the #root HTML element.
   * @since  1.0
   * @return {JSX} JSX to be rendered into our #root HTML element.
   */
  render() {
    let mainNav;
    let body;
    // If we have an access token, show the search bar. Otherwise, show the connection prompt.
    if ( this.state.accessToken ) {
      mainNav = <SearchBar searchSpotify={this.searchSpotify} updateSearchTerm={this.updateSearchTerm} searchTerm={this.state.searchTerm} accessToken={this.state.accessToken} updateSearchResults={this.updateSearchResults} />
      body = (
        <div className="App-playlist">
            <SearchResults updatePlaylist={this.updatePlaylist} searchResults={this.state.searchResults} />
            <Playlist createPlaylist={this.createPlaylist} updatePlaylistName={this.updatePlaylistName} playlistName={this.state.playlistName} updatePlaylist={this.updatePlaylist} playlist={this.state.playlist} accessToken={this.state.accessToken} />
        </div> );
    } else {
      mainNav = <ConnectPrompt redirectUri={Spotify.redirectUri} clientId={Spotify.clientId} />
      body = '';
    }

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {mainNav}
          {body}
        </div>
      </div>
    );
  }
}

export default App;