// import { useContext, useState } from "react";
// import "./comments.scss";
// import { AuthContext } from "../../context/authContext";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { makeRequest } from "../../axios";
// import moment from "moment";

// const Comments = ({ postId }) => {
//   const [desc, setDesc] = useState("");
//   const { currentUser } = useContext(AuthContext);
//   const { isLoading, error, data } = useQuery({
//     queryKey: ["comments"],
//     queryFn: () =>
//       makeRequest.get("/comments?postId=" + postId).then((res) => {
//         // console.log(res);
//         return res.data;
//       }),
//   });

//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: (newComment) => {
//       return makeRequest.post("/comments", newComment);
//     },
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ["comments"] });
//     },
//   });
//   const handleClick = async (e) => {
//     e.preventDefault();

//     mutation.mutate({ desc, postId });
//     setDesc("");
//   };
//   return (
//     <div className="comments">
//       <div className="write">
//         <img src={currentUser.profilepic} alt="" />
//         <input
//           type="text"
//           placeholder="write a comment"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//         />
//         <button onClick={handleClick}>Send</button>
//       </div>
//       {isLoading
//         ? "Loading.."
//         : data.map((comment) => (
//             <div className="comment">
//               <img src={comment.profilepic} alt="" />
//               <div className="info">
//                 <span>{comment.name}</span>
//                 <p>{comment.desc}</p>
//               </div>
//               <span className="date">
//                 {moment(comment.createdAt).fromNow()}
//               </span>
//             </div>
//           ))}
//     </div>
//   );
// };

// export default Comments;
import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data = [],
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest
        .get("/comments?postId=" + postId)
        .then((res) => {
          // console.log("Response Data:", res.data); // Debugging line
          return res.data;
        })
        .catch((error) => {
          // console.error("Error fetching comments:", error); // Debugging line
          throw error;
        }),
  });

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilepic} alt="User profile" />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <p>Failed to load comments. Please try again later.</p>
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilepic} alt="Commenter profile" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
