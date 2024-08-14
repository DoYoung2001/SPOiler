import React from "react";
import "../styles/AlbumInfo.css";

const AlbumInfo = ({ isOpen, onClose, album }) => {
  if (!isOpen || !album) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="album-details">
          <h2>{album.name}</h2>
          <img src={album.images[0].url} alt={album.name} />
          <p>Artist: {album.artists.map((artist) => artist.name).join(", ")}</p>
          <p>Release Date: {album.release_date}</p>
          <p>Total Tracks: {album.total_tracks}</p>
          <p>Popularity: {album.popularity}</p>
          <p>Label: {album.label}</p>
          <p>Type: {album.album_type}</p>
          <a
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Listen on Spotify
          </a>
        </div>
      </div>
    </div>
  );
};

export default AlbumInfo;
