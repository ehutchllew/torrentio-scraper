require('dotenv').config();
const repository = require('../lib/repository');
const { parseTorrentFiles } = require('../lib/torrentFiles');
const { Type } = require('../lib/types');

async function addMissingEpisodes() {
  const torrent = { infoHash: '0ec780c2c7f8d5b38e61827f0b53c77c3d22f955' };
  const torrentFiles = await require('../lib/torrent').torrentFiles(torrent);
  const storedFiles = await repository.getFiles(torrent)
      .then((files) => files.reduce((map, next) => (map[next.fileIndex] = next, map), {}));
  const imdbId = Object.values(storedFiles)[0].imdbId;

  torrentFiles
      .filter((file) => !storedFiles[file.fileIndex])
      .map((file) => ({
        infoHash: torrent.infoHash,
        fileIndex: file.fileIndex,
        title: file.name,
        size: file.size,
        imdbId: imdbId,
        imdbSeason: parseInt(file.name.match(/(\d+)[ .]?-[ .]?\d+/)[1], 10),
        imdbEpisode: parseInt(file.name.match(/\d+[ .]?-[ .]?(\d+)/)[1], 10),
      }))
      .forEach((file) => repository.createFile(file));
}

async function findAllFiles() {
  /* Test cases */
  /* Anime Season and absolute episodes */
  const torrent = {
    infoHash: '6b95e5cfde9aaa71970a14f6bb6b9de19e2cbfa1',
    title: '[OMDA] Bleach + Filmes + Ovas (480p-720p x264 AAC-MP3) [rich_jc]',
    type: Type.SERIES,
    imdbId: 'tt0434665'
  };
  /* Season and concat episodes */
  // const torrent = {
  //   infoHash: '235e8ed73b6cc9679b0842c39e17223c47b51f68',
  //   title: 'Daria - The Complete Animated Series [2010] DVDRip',
  //   type: Type.SERIES,
  //   imdbId: 'tt0118298'
  // };
  /* Series Season and absolute episodes */
  // const torrent = {
  //   infoHash: '16b4560beb05397c0eeb35487a997caf789243ea',
  //   title: 'Seinfeld - Complete Collection',
  //   type: Type.SERIES,
  //   imdbId: 'tt0098904'
  // };
  /* Series Season and episodes */
  // const torrent = {
  //   infoHash: 'd0f120c1bbfb988eb35b648e1c78ca3e5d45ef39',
  //   title: 'Seinfeld Complete Series-720p WEBrip EN-SUB x264-[MULVAcoded]',
  //   type: Type.SERIES,
  //   imdbId: 'tt0098904'
  // };
  /* Anime single absolute episode */
  // const torrent = {
  //   infoHash: 'e81e12880980086c476aa8bfdd22bed9d41b1dfe',
  //   title: '[Vision] Naruto Shippuuden - 451 (1080p x264 AAC) [rich_jc].mp4',
  //   size: 467361138,
  //   type: Type.SERIES,
  //   imdbId: 'tt0988824'
  // };
  /* Date based episode */
  // const torrent = {
  //   infoHash: '5a8e9e64fa04e3541236f049cb6b0d35e4ca12cc',
  //   title: 'Jimmy.Fallon.2020.02.14.Steve.Buscemi.WEB.x264-XLF[TGx]',
  //   size: 618637331,
  //   type: Type.SERIES,
  //   imdbId: 'tt3444938'
  // };

  return parseTorrentFiles(torrent)
      .then((files) => console.log(files));
}

//addMissingEpisodes().then(() => console.log('Finished'));
findAllFiles().then(() => console.log('Finished'));