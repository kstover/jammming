/**
 * Component that renders the Search Results section of our app.
 * Takes the searchResults prop passed to the component and loops over it, rendering a Track component for each.
 * 
 * @since 1.0
 */
import React from 'react';
import { Track } from './Track'

export const SearchResults = props => {
	return(
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          {
            props.searchResults.map( ( song, index ) => {
              return <Track section='searchResults' updatePlaylist={props.updatePlaylist} id={song.id} title={song.title} artist={song.artist} album={song.album} key={index} />
            } )
          }
        </div>
      </div>
	); 
}