/**
 * React Component that:
 * 1) Returns JSX for the playlist section of the app by
 * 	  looping over the playlist and calling the Track component.
 * 2) Handles text change of the Playlist name.
 * 3) Handles clicks of the Save Playlist button.
 *
 * @since 1.0
 */
import React from 'react';
import { Track } from './Track.js';

export class Playlist extends React.Component {
	constructor( props ) {
		super( props );
		
		// Bind our Change and Click handlers to the proper context.
		this.handleClick = this.handleClick.bind( this );
		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * When our user clicks on the Save To Spotify button:
	 * 1) Check to see if the playlist name has been changed.
	 * 2) If it hasn't been changed, make sure that the user wanted to use the default name.
	 * 3) Call the createPlaylist method passed to the component.
	 * 
	 * @since  1.0
	 * @param  {object} e Event object
	 * @return void
	 */
	handleClick( e ) {
		if ( 'New Playlist' === this.props.playlistName ) {
			let really = window.confirm( 'Really name this playlist "New Playlist"?' );
			if ( really ) {
				this.props.createPlaylist();
			}
		} else {
			this.props.createPlaylist();
		}
	}

	/**
	 * When the user types in our playlist name input, call the updatePlaylistName method passed to the component.
	 * 
	 * @since  1.0
	 * @param  {object} e Event object
	 * @return void
	 */
	handleChange( e ) {
		this.props.updatePlaylistName( e.target.value );
	}

	/**
	 * Render our component
	 * 
	 * @since  1.0
	 * @return {JSX} Component JSX
	 */
	render() {
		if ( ! this.props.accessToken ) return <div className="Playlist"></div>;
		return (
	        <div className="Playlist">
	          <input value={this.props.playlistName} onChange={this.handleChange} />
	          <div className="TrackList">
	            {
	              this.props.playlist.map( ( song, index ) => {
	                return <Track section='playlist' updatePlaylist={this.props.updatePlaylist} id={song.id} title={song.title} artist={song.artist} album={song.album} key={index} />
	              } )
	            }
	          </div>
	          <a className="Playlist-save" onClick={this.handleClick}>SAVE TO SPOTIFY</a>
	        </div>
		);	
	}
}