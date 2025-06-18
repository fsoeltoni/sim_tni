import React, { Component } from "react";
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import dataProvider from "../../../providers/data"; // Pastikan path ini benar

class SignaturePadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      loading: false,
      preview: props.input.value && props.input.value.src ? props.input.value.src : null,
    };
  }

  componentDidMount = () => {
    this.setState({
      canvas: this.refs.canvas
    }, () => {
      // Setelah canvas diset, gambar preview jika sudah ada
      if (this.state.preview) {
        this.drawImageOnCanvas(this.state.preview);
      }
    });
  };

  componentWillUnmount = () => {
    window.top.document.removeEventListener(
      "SignResponse",
      this.signResponse,
      false
    );
  };

  // Fungsi pembantu untuk menggambar gambar di canvas
  drawImageOnCanvas = (imageUrl) => {
    const { canvas } = this.state;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = (e) => {
      console.error("Error loading image for canvas display:", e);
    };
    img.src = imageUrl;
  };

  startSign = () => {
    const { canvas } = this.state;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.setState({ preview: null }); // Hapus preview lama saat memulai tanda tangan baru

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

  base64ToBlob = (base64) => {
    const parts = base64.split(";base64,");
    if (parts.length < 2) {
      console.error("Invalid base64 string provided for Blob conversion.");
      return new Blob();
    }
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  uploadToSupabase = async (base64Image) => {
    try {
      this.setState({ loading: true });

      const blob = this.base64ToBlob(base64Image);
      const fileName = `signature_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const bucketName = "gambar"; // Sesuaikan dengan nama bucket Anda
      const folderPath = "tanda_tangan_sim"; // Sesuaikan dengan struktur folder Anda

      const { url, path } = await dataProvider.uploadFile(
        file,
        bucketName,
        folderPath
      );

      const fileData = {
        src: url,
        path: path,
        bucket: bucketName,
        title: fileName,
      };

      const {
        input: { onChange },
      } = this.props;
      onChange(fileData);

      this.setState({ preview: url });

      return url;
    } catch (error) {
      console.error("Error uploading signature:", error);
      alert("Gagal mengupload tanda tangan!");
      return null;
    } finally {
      this.setState({ loading: false });
    }
  };

  setValue = async (res, width, height) => {
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
      // Clear canvas dan preview jika error
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ preview: null });
      onChange(null);
    } else {
      if (obj.isSigned) {
        var img = new Image();
        img.onload = async () => {
          // Gambar signature ke canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Setelah digambar di canvas, ambil data canvas untuk upload
          const base64ImageToUpload = canvas.toDataURL("image/png");
          
          // Upload ke Supabase
          await this.uploadToSupabase(base64ImageToUpload);
        };
        img.onerror = (e) => {
          console.error("Error loading signature image:", e);
          alert("Gagal memuat gambar tanda tangan.");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          this.setState({ preview: null });
          onChange(null);
        };
        img.src = "data:image/png;base64," + obj.imageData;
      } else {
        // Jika tidak ditandatangani
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({ preview: null });
        onChange(null);
      }
    }
  };

  render() {
    const { loading, preview } = this.state;

    return (
      <Card>
        <CardContent>
          <canvas
            ref="canvas"
            id="cnv"
            name="cnv"
            width="500"
            height="100"
            style={{ 
              border: '1px solid #ccc', 
              width: '100%',
              marginBottom: preview ? '15px' : '0' 
            }}
          />

          {/* Tampilkan preview tanda tangan jika sudah ada */}
          {preview && (
            <div style={{ marginTop: 15 }}>
              <strong>Tanda Tangan Tersimpan:</strong>
              <img
                src={preview}
                alt="Tanda tangan tersimpan"
                style={{
                  width: "100%",
                  maxHeight: "120px",
                  objectFit: "contain",
                  border: '1px dashed #aaa',
                  padding: '5px'
                }}
              />
            </div>
          )}

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <CircularProgress size={24} />
            </div>
          )}
        </CardContent>
        <CardActions>
          <Button 
            style={{ margin: "auto" }} 
            onClick={this.startSign}
            disabled={loading}
          >
            {preview ? "Tanda Tangani Ulang" : "Tanda Tangani"}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default SignaturePadComponent;