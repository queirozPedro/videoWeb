export type Video = {
    videoURL: string;
    imageURL: string;
    description: string;
}

const videos: Video[] = [
    {
        videoURL: "video/video01.mp4",
        imageURL: "image/image01.jpg",
        description: "Elephants Dreams"
    },
    {
        videoURL: "video/video02.mp4",
        imageURL: "image/image02.jpg",
        description: "Doguinho"
    },
    {
        videoURL: "video/video03.mp4",
        imageURL: "image/image03.jpg",
        description: "Mobile Game"
    },
    {
        videoURL: "video/video04.mp4",
        imageURL: "image/image04.jpg",
        description: "Virtual Reality"
    },
    {
        videoURL: "video/video05.mp4",
        imageURL: "image/image05.jpg",
        description: "Ocean"
    }

]
export default videos;
