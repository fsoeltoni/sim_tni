import React, { Component } from "react";
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import dataProvider from "../../../providers/data"; // Change this import path to match your project structure

class SignaturePadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      loading: false,
      preview: null,
    };
  }

  componentDidMount = () => {
    this.setState({
      canvas: this.refs.canvas,
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
      minSigPoints: 25,
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

  signResponse = (event) => {
    const { canvas } = this.state;
    const str = event.target.getAttribute("msgAttribute");
    const obj = JSON.parse(str);

    this.setValue(obj, canvas.width, canvas.height);
  };

  // Fungsi untuk mengkonversi base64 ke blob
  base64ToBlob = (base64) => {
    const parts = base64.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  // Fungsi untuk upload gambar ke Supabase Storage menggunakan dataProvider
  uploadToSupabase = async (base64Image) => {
    try {
      this.setState({ loading: true });

      // Konversi base64 menjadi blob
      const blob = this.base64ToBlob(base64Image);

      // Buat nama file unik berdasarkan timestamp
      const fileName = `signature_${Date.now()}.png`;

      // Buat File object dari blob
      const file = new File([blob], fileName, { type: "image/png" });

      // Gunakan bucket dan folder yang sesuai dengan kebutuhan Anda
      const bucketName = "gambar"; // Sesuaikan dengan nama bucket Anda
      const folderPath = "signatures"; // Sesuaikan dengan struktur folder Anda

      // Upload file menggunakan data provider
      const { url, path } = await dataProvider.uploadFile(
        file,
        bucketName,
        folderPath
      );

      // Buat objek yang akan disimpan di field database
      const fileData = {
        src: url,
        path: path,
        bucket: bucketName,
        title: fileName,
      };

      // Simpan ke dalam field via onChange dari props
      const {
        input: { onChange },
      } = this.props;
      onChange(fileData);

      // Simpan preview URL
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
        const img = new Image();
        img.onload = async () => {
          ctx.drawImage(img, 0, 0, width, height);

          // Konversi canvas ke base64 dan upload ke Supabase
          const base64Image = canvas.toDataURL("image/png");
          await this.uploadToSupabase(base64Image);
        };
        img.src = "data:image/png;base64," + obj.imageData;
      }
    }
  };

  render() {
    const { loading, preview } = this.state;

    return (
      <Card>
        <CardContent>
          {/* Tampilkan preview tanda tangan jika sudah ada */}
          {preview && (
            <div style={{ marginBottom: 15 }}>
              <img
                src={preview}
                alt="Tanda tangan"
                style={{
                  width: "100%",
                  maxHeight: "120px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          <canvas
            ref="canvas"
            id="cnv"
            name="cnv"
            width="500"
            height="100"
          ></canvas>

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
