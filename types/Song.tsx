export  interface Song {
    id: string;
    title: string;
    artist: string;
    streams: string;
    image: any;
    audio: any;
  }

export interface Album {
    id: string;
    title: string;
    image: any;
  }
  
  interface PlaylistSong {
    id: number;
    title: string;
    artist: string;
    streams: string;
    image: string;
    audio: string;
}

export default interface Playlists {
    id: number;
    title: string;
    image: string;
    music: string;
    director: string;
    producer: string;
    songs: PlaylistSong[];
}
