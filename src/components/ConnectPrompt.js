/**
 * Functional React component that returns a JSX button, prompting the user to connect to Spotify.
 * This button has a link that redirects to Spotify, specifying a redirect uri.
 * 
 * @since 1.0
 */
import React from 'react';

export const ConnectPrompt = props => {
	return (
		<div className="SearchBar">
			<h2>You must be logged-in to Spotify to use this app</h2>
			<a href={`https://accounts.spotify.com/authorize?client_id=${props.clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${props.redirectUri}`}>LOGIN</a>
      </div>
	);
};