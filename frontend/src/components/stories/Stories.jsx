import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.pexels.com/photos/12419737/pexels-photo-12419737.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.pexels.com/photos/28537826/pexels-photo-28537826/free-photo-of-delicious-asparagus-and-poached-egg-toast.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.pexels.com/photos/28821836/pexels-photo-28821836/free-photo-of-scenic-aerial-view-of-saint-moritz-switzerland.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.pexels.com/photos/8755965/pexels-photo-8755965.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilepic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
