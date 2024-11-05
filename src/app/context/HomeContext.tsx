'use client'

import { ReactNode, RefObject, createContext, useEffect, useRef, useState } from "react";
import videos, { Video } from "../data/video";
import { Filter, filters } from "../data/Filter";

type HomeContextData = {
    videoURL: string;
    playing: boolean;
    totalTime: number;
    currentTime: number;
    videoRef: RefObject<HTMLVideoElement>;
    canvasRef: RefObject<HTMLCanvasElement>;
    volume: number;
    oldVolume: number;

    playPause: () => void;
    configCurrentTime: (time:number) => void;
    configVideo: (index: number) => void;
    configFilter: (index: number) => void;
    configVolume: (value:number) => void;
    configMuteVolume: () => void;
    passarVideo: () => void;
    voltarVideo: () => void;
}

export const HomeContext =
   createContext({} as HomeContextData);

type ProviderProps = {
    children: ReactNode;    
}

const HomeContextProvider = ({children}: ProviderProps) => {
    const [videoURL, setVideoURL] = useState("");
    const [videoIndex, setVideoIndex] = useState(0);
    const [filterIndex, setFilterIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [volume, setVolume] = useState(0.5);
    const [oldVolume, setOldVolume] = useState(0);

    useEffect(()=>{
        configVideo(videoIndex);
    }, []);

    const configVideo = (index: number) => {
        const currentIndex = index % videos.length;
        const currentVideo: Video = videos[currentIndex];
        const currentVideoURL = currentVideo.videoURL;
        setVideoURL(currentVideoURL);
        setVideoIndex(currentIndex);
    }
    
    const configFilter = (index: number) => {
        setFilterIndex(index);
    }

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.onloadedmetadata = () => {
                setTotalTime(video.duration);
                setCurrentTime(video.currentTime);

                if (playing) {
                    video.play();
                }
            }

            video.ontimeupdate = () => {
                const video = videoRef.current;
                if (!video) return;
                setCurrentTime(video.currentTime);
            }

            video.onended = () => {
                configVideo(videoIndex + 1);
            }
        }
        draw();
    }, [videoURL, filterIndex]);

    const configCurrentTime = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
        setCurrentTime(time);
    }

    const playPause = ()  => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
           video.pause();     
        }
        else {
            video.play();
            draw();
        }
        setPlaying(!playing);
    }

    const draw = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        var context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const filter:Filter = filters[filterIndex];
        for (var i = 0; i < data.length; i+=4) {
            const red = data[i + 0];
            const green = data[i + 1];
            const blue = data[i + 2];

            filter.calc(red, green, blue);
            data[i + 0] = filter.red;
            data[i + 1] = filter.green;
            data[i + 2] = filter.blue;
        }
     
        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(draw);
    }

    const configVolume = (value: number) => {
        if(videoRef.current){
            videoRef.current.volume = value
            setVolume(value)
        }
    }

    const configMuteVolume = () => {
        if(volume > 0){
            setOldVolume(volume)
            configVolume(0)
        } else if(oldVolume > 0){
            configVolume(oldVolume)
        }
    }

    const passarVideo = () => {
        configVideo(videoIndex + 1 >= videos.length? 0: videoIndex + 1); 
    }

    const voltarVideo = () => {
        configVideo(videoIndex - 1 < 0? videos.length - 1: videoIndex - 1)
    }

    return (
        <HomeContext.Provider value={
            {
                videoURL,
                playing,
                totalTime,
                currentTime,
                videoRef,
                canvasRef,
                volume,
                oldVolume,
                playPause,
                configCurrentTime,
                configVideo,
                configFilter,
                configVolume,
                configMuteVolume,
                passarVideo,
                voltarVideo
            }
        }>
         {children}
        </HomeContext.Provider>
    )
}

export default HomeContextProvider;