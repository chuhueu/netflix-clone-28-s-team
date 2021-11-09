import "./listitem.scss";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
  FiberManualRecord,
  KeyboardArrowDown,
  CheckOutlined,
} from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player/lazy";
import axios from "../../axios";
import { Link } from "react-router-dom";
import { FavouriteContext } from "../../favouriteContext/FavouriteContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const Listitem = ({ index, item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const [delayHandler, setDelayHandler] = useState(null);
  const [check, setCheck] = useState(false);
  const { addMovieToWatchList, removeMovieFromWatchList } =
    useContext(FavouriteContext);
  const handleMouseEnter = () => {
    setDelayHandler(
      setTimeout(() => {
        setIsHovered(true);
      }, 500)
    );
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    clearTimeout(delayHandler);
  };
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(!user);

  useEffect(() => {
    setTimeout(() => {
      const getMovie = async () => {
        try {
          const res = await axios.get("movies/find/" + item);
          setMovie(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getMovie();
    }, 500);
  }, [item]);

  return (
    <div
      className="listItem"
      style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={movie?.imgSm} alt={movie?.title} className="poster" />
      {isHovered && (
        <>
          <ReactPlayer
            controls
            playing={true}
            loop={true}
            url={movie.trailer}
            className="trailer"
            width="100%"
            height="60%"
          />
          <div className="itemInfo">
            <div className="icons">
              {!user ? (
                <Popup
                  trigger={<PlayArrow className="icon play" />}
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <div className="header">Oops!</div>
                      <div className="content">
                        You are not logged in. Please login to use this feature
                      </div>
                      <div className="actions">
                        <Link to="/register" className="button">
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </Popup>
              ) : (
                <Link to={{ pathname: "/watch/" + movie?._id, movie: movie }}>
                  <PlayArrow className="icon play" />
                </Link>
              )}
              {check ? (
                <CheckOutlined
                  className="icon"
                  onClick={() =>
                    removeMovieFromWatchList(movie, setCheck(!check))
                  }
                />
              ) : (
                <Add
                  className="icon add"
                  onClick={() => addMovieToWatchList(movie, setCheck(!check))}
                />
              )}
              <ThumbUpAltOutlined className="icon like" />
              <ThumbDownOutlined className="icon dislike" />
              {!user ? (
                <Popup
                  trigger={
                    <KeyboardArrowDown className="icon moreInfo" />

                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <div className="header">Oops!</div>
                      <div className="content">
                        You are not logged in. Please login to use this feature
                      </div>
                      <div className="actions">
                        <Link to="/register" className="button">
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </Popup>
              ) : (
                <Link
                  to={{ pathname: "/info/" + movie._id, movie: movie }}
                  className="link"
                >
                  <KeyboardArrowDown className="icon moreInfo" />
                </Link>
              )}
            </div>
            <div className="itemInfoTop">
              <span className="rate">{movie.rate}</span>
              <span className="duration">{movie.duration}</span>
              <div className="limit">{movie.limit}</div>
              <span>{movie.year}</span>
            </div>
            <div className="itemInfoDown">
              <h4 className="title">{movie.title}</h4>
              <FiberManualRecord className="dot" />
              <span className="genre">{movie.genre}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Listitem;