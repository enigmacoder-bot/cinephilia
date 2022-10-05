import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";

import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import "./styles.css";
import Carousal from "../Carousel/Carousel";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "90%",
    height: "80%",
    backgroundColor: "#39445a",
    border: "1px solid #282c34",
    borderRadius: 10,
    color: "white",
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(1, 1, 3),
  },
}));

export default function ContentModal({ children, media_type, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
  };
  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
  };
  useEffect(() => {
    fetchData();
    fetchVideo();
    //eslint-disable-next-line
  }, []);
  return (
    <ThemeProvider>
      <div
        className="media"
        onClick={handleOpen}
        color="inherit"
        style={{ cursor: "pointer" }}
      >
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && (
            <div className={classes.paper}>
              <div className="ContentModal">
                <img
                  alt={content.name || content.title}
                  className="ContentModal_portrait"
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                />
                <img
                  alt={content.name || content.title}
                  className="ContentModal_landscape"
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                />
                <div className="ContentModal_about">
                  <span className="ContentModal_title">
                    {content.name || content.title}(
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "------"
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}
                  <span className="ContentModal_description">
                    {content.overview}
                  </span>
                  <div>
                    <Carousal media_type={media_type} id={id} />
                  </div>
                  <Button
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    color="secondary"
                    target="_blank"
                    href={`https://www.youtube.com/watch?v=${video}`}
                  >
                    Watch the Trailer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}
