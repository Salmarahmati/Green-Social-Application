// import Post from "../post/Post";
// import "./posts.scss";
// import { useQuery } from "@tanstack/react-query";
// import { makeRequest } from "../../axios";

// const Posts = ({ userid }) => {
//   const { isLoading, error, data } = useQuery({
//     queryKey: ["posts"],
//     queryFn: () =>
//       makeRequest.get("/posts?userid=" + userid).then((res) => {
//         // console.log("Data from server:", res.data);
//         return res.data;
//       }),
//   });

//   return (
//     <div className="posts">
//       {error
//         ? "Something went wrong!"
//         : isLoading
//         ? "loading"
//         : Array.isArray(data) && data.length > 0
//         ? data.map((post) => <Post post={post} key={post.id} />)
//         : "No posts available"}
//     </div>
//   );
// };
// export default Posts;
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userid }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userid],
    queryFn: () =>
      makeRequest.get(`/posts?userid=${userid || ""}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "Loading..."
        : Array.isArray(data) && data.length > 0
        ? data.map((post) => <Post post={post} key={post.id} />)
        : "No posts available"}
    </div>
  );
};

export default Posts;
