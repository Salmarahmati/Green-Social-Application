import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userid = parseInt(useLocation().pathname.split("/")[2]);

  const {
    isLoading,
    error,
    data = {},
  } = useQuery({
    queryKey: ["user", userid],
    queryFn: () =>
      makeRequest.get(`/users/find/${userid}`).then((res) => res.data),
    onError: (err) => {
      console.error("Failed to fetch user:", err);
    },
  });

  const { isLoading: rIsLoading, data: relationshipData = [] } = useQuery({
    queryKey: ["relationship", userid],
    queryFn: () =>
      makeRequest
        .get(`/relationships?followedUserId=${userid}`)
        .then((res) => res.data),
    onError: (err) => {
      console.error("Failed to fetch relationships:", err);
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      return following
        ? makeRequest.delete(`/relationships?userid=${userid}`)
        : makeRequest.post("/relationships", { userid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship", userid]);
    },
    onError: (err) => {
      console.error("Failed to update relationship:", err);
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser?.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <p>Error loading profile. Please try again later.</p>
      ) : (
        <>
          <div className="images">
            <img
              src={"/upload/" + data.coverpic}
              alt="Cover"
              className="cover"
            />
            <img
              src={"/upload/" + data.profilepic}
              alt="Profile"
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://instagram.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://linkedin.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://pinterest.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "Loading..."
                ) : userid === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userid={userid} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
