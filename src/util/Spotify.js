/**
 * JS Object that handles communicating with the Spotify API.
 * 
 * @type {Object}
 */
export const Spotify = {
	// Store our Spotify access token.
	token: '',
	// Redirect URI for Spotify authentication flow.
	uri: 'http://localhost:3000/',
	// Client ID of our Spotify app.
	cId: 'd124bf82c53447b9b275c8db1d9834d3',

	set accessToken( token ) {
		this.token = token;
	},

	get accessToken() {
		return this.token;
	},

	get clientId() {
		return this.cId;
	},

	get redirectUri() {
		return this.uri;
	},

	/**
	 * Search Spotify for a specific term.
	 * 
	 * @since  1.0
	 * @param  {string} 	searchTerm String being searched for.
	 * @return {promise}	Promise that will be fullfilled.
	 */
	async search( searchTerm ) {
	    // Search Spotify for our term
	    const response = await fetch( 'https://api.spotify.com/v1/search?type=track&q=' + searchTerm, {
	      headers: {
	        Authorization: `Bearer ${this.token}`
	      }
	    } );
	    if ( response.ok ) {
			let jsonResponse = await response.json();
			return jsonResponse;
	    } else {
	    	return false;
	    }
	},

	/**
	 * Start the playlist creation process by first getting the user ID from the access token.
	 * 
	 * @since  1.0
	 * @param  {string} playlistName   	Name of the new playlist.
	 * @param  {array} 	playlistTracks 	An array of track items to add to the playlist.
	 * @return {promise}                Promise that will be fullfilled.
	 */
	async createPlaylist( playlistName, playlistTracks ) {
		// Get the current user profile
		const response = await fetch( 'https://api.spotify.com/v1/me', {
		  headers: {
		    'Authorization': `Bearer ${this.token}`
		  }
		} );
		if ( response.ok ) {
			response.json().then( jsonResponse => {
				// jsonResponse.id will be the user ID of the current user (based on the access token).
				this.addPlaylist( jsonResponse.id, playlistName, playlistTracks );
			} );
			
		} else {
			console.log( 'Error: ' );
			console.log( response );
		}
  	},

  	/**
  	 * Actually adds the new playlist to Spotify using the API.
  	 * Called when the user ID .json() promise has been fullfilled within the createPlaylist method.
  	 * 
  	 * @since 1.0
  	 * @param {string} 	userId         Spotify user ID
  	 * @param {string} 	playlistName   Desired playlist name
  	 * @param {array} 	playlistTracks Array of track info to be added to the playlist
  	 */
  	async addPlaylist( userId, playlistName, playlistTracks ) {
		const response = await fetch( `https://api.spotify.com/v1/users/${userId}/playlists`, {
		  method: 'POST',
		  body: JSON.stringify( {
		    name: playlistName
		  } ),
		  headers: {
		    'Content-Type':   'application/json',
		    'Authorization':  `Bearer ${this.token}`
		  }
		} );
		if ( response.ok ) {
		  response.json().then( jsonResponse => {
		  	// jsonResponse.id will be the ID of our newly added playlist.
		  	this.populatePlaylist( userId, jsonResponse.id, playlistTracks );
		  } );
		  
		} else {
		  console.log( 'Error: ' );
		  console.log( response );
		}
	},

	/**
	 * Updates the newly created playlist with the supplied track array.
	 * Called when the playlist id promise has been fullfilled within the addPlaylist method.
	 * 
	 * @since  version
	 * @param  {[type]} userId         [description]
	 * @param  {[type]} playlistId     [description]
	 * @param  {[type]} playlistTracks [description]
	 * @return {[type]}                [description]
	 */
	async populatePlaylist( userId, playlistId, playlistTracks ) {
		// If we are passed an empty list of tracks, bail early.
		if ( ! playlistTracks ) return false;

		// We have to build an object of tracks in a specific format.
		let tracks = {
		  uris: []
		};
		// Adds that track uri in the required Spotify format.
		playlistTracks.forEach( item => {
		  tracks.uris.push( `spotify:track:${item.id}` );
		} );

		const response = await fetch( `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
		  method: 'POST',
		  body: JSON.stringify( tracks ),
		  headers: {
		    'Content-Type':   'application/json',
		    'Authorization':  `Bearer ${this.token}`
		  }
		} );
		if ( response.ok ) {
		  let jsonResponse = await response.json();
		} else {
		  console.log( 'Error: ' );
		  console.log( response );
		}
	}

}