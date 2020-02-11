import React, { forwardRef, useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  makeStyles
} from "@material-ui/core";
import toBase64 from "image-to-base64";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { camera_server, live_camera_server } from "../../providers/attrs";

const useStyles = makeStyles(theme => ({
  button: {
    display: "flex",
    flexDirection: "column",
    marginTop: 50,
    marginBottom: 50,
    margin: "auto",
    width: "fit-content"
  }
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CameraComponent = ({ input: { onChange }, ...rest }) => {
  const classes = useStyles();
  const capturedServer = camera_server;
  const liveViewServer = live_camera_server;
  const cropRef = useRef();
  const [imgSrc, setImgSrc] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleCapture = () =>
    toBase64(capturedServer + "?" + Date.now())
      .then(response => {
        const result = "data:image/jpg;base64," + response;
        setImgSrc(result);
        handleClose();
      })
      .catch(error => {
        console.error(error);
        return;
      });

  const crop = () => onChange(cropRef.current.getCroppedCanvas().toDataURL());

  return (
    <div>
      {imgSrc && (
        <Cropper
          ref={cropRef}
          src={imgSrc}
          style={{ height: "100%", width: "100%" }}
          aspectRatio={3 / 4}
          guides={false}
          crop={crop}
        />
      )}

      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        className={classes.button}
      >
        Aktifkan Kamera
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        {/* <DialogContent> */}
        <img src={liveViewServer} alt="Live View" />
        {/* </DialogContent> */}
        <DialogActions>
          <Button onClick={handleCapture} color="primary">
            Ambil Foto
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CameraComponent;
