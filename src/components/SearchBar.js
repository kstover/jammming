/**
 * React component that outputs JSX for the song search section.
 * Also handles:
 * 1) Updating the app state for search term
 * 2) Calling the search method of the app on click or enter key
 *
 * @since 1.0
 */
import React from 'react';

export class SearchBar extends React.Component {
	constructor( props ) {
		super( props );

		// Bind our handles to the proper context.
		this.handleClick = this.handleClick.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleKeyPress = this.handleKeyPress.bind( this );
	}

	/**
	 * When a user changes the input, call the update method passed to the component.
	 * 
	 * @since  1.0
	 * @param  {object} e Event object
	 * @return void
	 */
	handleChange( e ) {
		this.props.updateSearchTerm( e.target.value );
	}

	/**
	 * When a user clicks the search button, call the search method passed to the component.
	 * 
	 * @since  1.0
	 * @param  {object} e Event object
	 * @return void
	 */
	handleClick( e ) {
		// Prevent the link from being followed.
		e.preventDefault();
		// Trigger search request
		this.props.searchSpotify();
	}

	/**
	 * When a user presses the ENTER key, call the search method passed to the component.
	 * 
	 * @since  1.0
	 * @param  {object} e Event object
	 * @return void
	 */
	handleKeyPress( e ) {
		if ( 'Enter' === e.key ) {
			this.props.searchSpotify();
		}
	}

	/**
	 * Render our component.
	 * 
	 * @since  1.0
	 * @return {JSX} Component JSX
	 */
	render() {
		return (
			<div className="SearchBar">
				<input ref="searchInput" placeholder="Enter A Song Title" value={this.props.searchTerm} onKeyPress={this.handleKeyPress}  onChange={this.handleChange} />
				<a onClick={this.handleClick}>SEARCH</a>
          </div>
		);
	}
}