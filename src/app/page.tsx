'use client'

import { use, useContext, useState } from "react";
import { HomeContext } from "./context/HomeContext";
import { FaPause, FaPlay } from "react-icons/fa";
import videos, { Video } from './data/video';
import { convertTimeToString } from "./utils/Utils";

import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { FaBullseye } from "react-icons/fa6";

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const {
    videoURL,
    playing,
    totalTime,
    currentTime,
    videoRef,
    canvasRef,
    volume,
    playPause,
    configCurrentTime,
    configVideo,
    configFilter,
    configVolume,
    configMuteVolume,
    passarVideo,
    voltarVideo
  } = useContext(HomeContext);

  return (
    <main className="flex min-h-screen bg-black ">
      {/* Vídeo principal */}
      <div className="w-3/4">
        <video onClick={playPause} className="w-full" ref={videoRef} src={videoURL} hidden={showFilter}></video>
        <canvas className="w-full h-[380px]" ref={canvasRef} hidden={!showFilter}></canvas>

        <input className="appearance-none
                          [&::-webkit-slider-runnable-track]:appearance-none
                        [&::-webkit-slider-runnable-track]:bg-[white]
                          [&::-webkit-slider-runnable-track]:h-[10px]
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:h-[10px]
                          [&::-webkit-slider-thumb]:w-[10px]
                        [&::-webkit-slider-thumb]:bg-[red]
                          [&::-webkit-slider-thumb]:rounded-full
                          w-full h-2 rounded-lg"
          type="range"
          min={0}
          max={totalTime}
          value={currentTime}
          step="0.01"
          onChange={(e) => configCurrentTime(Number(e.target.value))}
        >
        </input>

        <div className="flex justify-center space-x-4">
          <button className="text-white" onClick={() => voltarVideo()}>
            <MdSkipPrevious className="text-[25px]" />
          </button>
          <button className="text-white" onClick={playPause}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <button className="text-white" onClick={() => passarVideo()}>
            <MdSkipNext className="text-[25px]" />
          </button>
          <p className="text-white text-[20px]">{convertTimeToString(currentTime)} / {convertTimeToString(totalTime)}</p>
          <input
            type="range"
            min={0}
            max={1}
            step="0.01"
            value={volume}
            onChange={(e) => configVolume(Number(e.target.value))}
          />
          <button onClick={() => configMuteVolume()} className="ml-[5px] text-white">
            {volume > 0 ? <HiMiniSpeakerWave /> : <HiMiniSpeakerXMark />}
          </button>
          <span className="text-white">
            <input type="checkbox" name="Filtro" onChange={() => setShowFilter(!showFilter)} />
            <select className="text-black"
              onChange={(e) => configFilter(Number(e.target.value))} hidden={!showFilter}>
              <option selected value={0}>Sem filtro</option>
              <option value={1}>Verde</option>
              <option value={2}>Azul</option>
              <option value={3}>Vermelho</option>
              <option value={4}>Preto e branco</option>
            </select>
          </span>

        </div>
      </div>

      {/* Lista de Vídeos */}
      <div className="w-1/4 h-[100vh] overflow-y-auto p-4">
        {
          videos.map((video: Video, index) => {
            return (
              <button className="w-full p-4" onClick={(e) => configVideo(index)}>
                <p className="text-white">{video.description}</p>
                <img key={index} className="w-full max-h-[200px] mb-1" src={video.imageURL}></img>
              </button>
            )
          })
        }
      </div>
    </main>
  );
}
