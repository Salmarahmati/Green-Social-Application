import { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: user?.name || "",
    city: user?.city || "",
    website: user?.website || "",
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("File upload error:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTexts((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (updatedUser) => makeRequest.put("/users", updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setOpenUpdate(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();

    let coverUrl;
    let profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverpic;
    profileUrl = profile ? await upload(profile) : user.profilepic;

    mutation.mutate({ ...texts, coverpic: coverUrl, profilepic: profileUrl });
  };

  return (
    <div className="update">
      <h2>Update Profile</h2>
      <form>
        <div className="div">
          {" "}
          <label htmlFor=""> Cover:</label>
          <input
            className="file"
            type="file"
            onChange={(e) => setCover(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="div">
          {" "}
          <label htmlFor="">Profile:</label>
          <input
            className="file"
            type="file"
            onChange={(e) => setProfile(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="div">
          <input
            type="text"
            name="name"
            value={texts.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="div">
          {" "}
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
            placeholder="Website"
          />
          <button onClick={handleClick} className="update-button">
            Update
          </button>
        </div>
      </form>
      <button onClick={() => setOpenUpdate(false)} className="close-button">
        X
      </button>
    </div>
  );
};

export default Update;
