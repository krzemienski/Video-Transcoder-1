import {
  loadedStore,
  fileUploaded,
  transcoded,
  terminalText,
} from "../stores.js";
const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    let value = (ratio * 100.0).toFixed(2);
    if (value > 0) {
      terminalText.update((existing) => `Complete: ${value}%`);
    }
  },
});
(async () => {
  try {
    await ffmpeg.load();
  } catch (err) {
    alert(`Your Browser is not supported ${err.message}`);
  }
  console.log("Loaded!");
  loadedStore.update((existing) => true);
})();

let transcode = async ({ target: { files } }) => {
  const { name } = files[0];
  await console.log(name);

  terminalText.update((existing) => "Start processing");
  await console.log("it works");
  await ffmpeg.write(name, files[0]);
  let threads = window.navigator.hardwareConcurrency;
  //let grayscale = document.getElementById("grayscale").checked;
  let grayscale = false;
  threads = threads < 8 ? threads : 8;

  await ffmpeg.run(
    `-i ${name} ${
      grayscale ? `-vf hue=s=0` : ""
    } output.mp4 -threads ${threads}`
  );
  terminalText.update((existing) => "Complete processing");
  const data = ffmpeg.read("output.mp4");
  let blobUrl = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  transcoded.update((existing) => blobUrl);
  //   t1.clear();
  terminalText.update(
    (existing) => "The processing is complete! Enjoy your video"
  );
};

fileUploaded.subscribe((files) => {
  transcode({ target: { files: files } });
});