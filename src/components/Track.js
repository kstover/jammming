/**
 * React Component that renders and handles the individual track sections of our app
 * Handles clicks on the + or - symbol next to each track.
 *
 * This component is used in both the SearchResults and the Playlist components.
 * 
 * @since 1.0
 */
import React from 'react';

export class Track extends React.Component {
	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	/**
	 * When a user clicks on the symbol + or -, add or remove the track based upon the section.
	 * If we're in the searchResults component, we are always adding.
	 * If we're not, we're removing.
	 *
	 * TODO: This could be refactored to check the symbol rather than the section if you wanted.
	 * 
	 * @since  version
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	handleClick(e) {
		e.preventDefault();
		let action;
		if ( 'searchResults' === this.props.section ) {
			action = 'add';
		} else {
			action = 'remove';
		}
		
		// Call the updatePlaylist method passed into this component.
		this.props.updatePlaylist( {
			id: this.props.id,
			title: this.props.title,
			artist: this.props.artist,
			album: this.props.album
		}, action );
	}

	/**
	 * Render the component.
	 * 
	 * @since  1.0
	 * @return {JSX} Component JSX
	 */
	render() {
		let symbol = 'searchResults' === this.props.section ? '+' : '-';
		return (
			<div className="Track">
				<div className="Track-information">
					<h3>{this.props.title}</h3>
					<p>{this.props.artist} | {this.props.album}</p>
				</div>
				<a className="Track-action" onClick={this.handleClick}>{symbol}</a>
			</div>
	    );
	}
}