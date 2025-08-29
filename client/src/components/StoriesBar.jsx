import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
export default function StoriesBar() {
  const [stories, setStories] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);
  const { getToken } = useAuth();

  const fetchStories = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/story/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setStories(data.stories);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);
  return (
    <div className="w-full lg:max-w-2xl  sm:max-w-xl px-2 sm:px-4">
      <div
        className="flex gap-4 pb-5 
      overflow-x-auto sm:overflow-x-auto
      no-scrollbar 
      sm:flex-nowrap flex-wrap"
      >
        {/* add story */}
        <div
          onClick={() => setShowModel(true)}
          className="rounded-lg shadow-sm min-w-[7.5rem] aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4"
        >
          <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-medium text-slate-700 text-center">
            Create Story
          </p>
        </div>

        {/* stories */}
        {stories.map((story, index) => (
          <div
            onClick={() => setViewStory(story)}
            key={index}
            className="relative rounded-lg shadow min-w-[7.5rem] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95"
          >
            <img
              src={story.user.profile_picture}
              alt=""
              className="absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow"
            />
            <p className="absolute top-16 left-3 text-white/60 text-sm truncate max-w-24">
              {story.content}
            </p>
            <p className="text-white absolute bottom-1 right-2 z-10 text-xs">
              {moment(story.createdAt).fromNow()}
            </p>
            {story.media_type !== "text" && story.media_url && (
              <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt="story"
                    className="h-full w-full object-cover opacity-70"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    alt='video'
                    className="h-full w-full object-cover opacity-70"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />
      )}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
}
