import React, { Component } from "react";
import {
  Card,
  CardActions,
  Button,
  CardContent,
  makeStyles
} from "@material-ui/core";

class SignaturePadComponent extends Component {
  componentDidMount = () => {
    this.setState({
      canvas: this.refs.canvas
    });
  };

  startSign = () => {
    const { canvas } = this.state;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    let message = {
      firstName: "",
      lastName: "",
      eMail: "",
      location: "",
      imageFormat: 2,
      imageX: canvas.width,
      imageY: canvas.height,
      imageTransparency: true,
      imageScaling: false,
      maxUpScalePercent: 0.0,
      rawDataFormat: "ENC",
      minSigPoints: 25
    };

    window.top.document.addEventListener(
      "SignResponse",
      this.signResponse,
      false
    );
    const messageData = JSON.stringify(message);
    const element = document.createElement("MyExtensionDataElement");
    element.setAttribute("messageAttribute", messageData);

    document.documentElement.appendChild(element);
    const evt = window.document.createEvent("Events");
    evt.initEvent("SignStartEvent", true, false);
    element.dispatchEvent(evt);
  };

  signResponse = event => {
    const { canvas } = this.state;
    const str = event.target.getAttribute("msgAttribute");
    const obj = JSON.parse(str);

    this.setValue(obj, canvas.width, canvas.height);
  };

  setValue = (res, width, height) => {
    const {
      input: { onChange }
    } = this.props;
    const { canvas } = this.state;
    let obj = null;

    if (typeof res === "string") {
      obj = JSON.parse(res);
    } else {
      obj = JSON.parse(JSON.stringify(res));
    }

    const ctx = canvas.getContext("2d");

    if (
      obj.errorMsg !== null &&
      obj.errorMsg !== "" &&
      obj.errorMsg !== "undefined"
    ) {
      alert(obj.errorMsg);
    } else {
      if (obj.isSigned) {
        var img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = "data:image/png;base64," + obj.imageData;
        onChange(img.src);
      }
    }
  };

  render() {
    return (
      <Card>
        <CardContent>
          <canvas
            ref="canvas"
            id="cnv"
            name="cnv"
            width="500"
            height="100"
          ></canvas>
        </CardContent>
        <CardActions>
          <Button style={{ margin: "auto" }} onClick={this.startSign}>
            Tanda Tangani
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default SignaturePadComponent;
