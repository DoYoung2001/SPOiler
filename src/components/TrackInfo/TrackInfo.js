import React from "react";
import styles from "./TrackInfo.module.css";

const TrackInfo = ({ isOpen, onClose, track }) => {
  console.log(track);
  if (!isOpen || !track) return null;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.trackDetails}>
          <h2>{track.name}</h2>
          {track.album && track.album.images && track.album.images[0] && (
            <img src={track.album.images[0].url} alt={track.name} />
          )}
          <p>Artist: {track.artists.map((artist) => artist.name).join(", ")}</p>
          <p>Album: {track.album.name}</p>
          <p>Release Date: {track.album.release_date}</p>
          <p>Duration: {formatDuration(track.duration_ms)}</p>
          <p>Popularity: {track.popularity}</p>
          <p>Track Number: {track.track_number}</p>
          <p>Explicit: {track.explicit ? "Yes" : "No"}</p>
          {track.preview_url && (
            <audio controls>
              <source src={track.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <div>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackInfo;
