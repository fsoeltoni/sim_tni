import React, { Component, createRef } from "react";
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
    this.canvasRef = createRef();
    this.state = {
      canvas: null,
      loading: false,
      preview: props.input.value && props.input.value.src ? props.input.value.src : null,
    };
  }

  componentDidMount = () => {
    if (this.canvasRef.current) {
      this.setState({
        canvas: this.canvasRef.current,
      }, () => {
        // Setelah canvas diset, gambar preview jika sudah ada
        if (this.state.preview) {
          const img = new Image();
          img.onload = () => {
            const ctx = this.state.canvas.getContext("2d");
            // Pastikan canvas di-resize sebelum menggambar gambar yang ada
            this.state.canvas.width = this.canvasRef.current.offsetWidth; // Mengambil lebar aktual dari DOM
            ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
            ctx.drawImage(img, 0, 0, this.state.canvas.width, this.state.canvas.height);
          };
          img.src = this.state.preview;
        }
      });
    }
  };

  componentWillUnmount = () => {
    window.top.document.removeEventListener(
      "SignResponse",
      this.signResponse,
      false
    );
  };

  startSign = () => {
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found.");
      alert("Canvas untuk tanda tangan tidak ditemukan. Mohon refresh halaman.");
      return;
    }
    
    // Perbarui lebar canvas sebelum membersihkan dan memulai tanda tangan baru
    canvas.width = this.canvasRef.current.offsetWidth; // Set lebar kanvas sesuai lebar elemen DOM
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.setState({ preview: null }); 

    let message = {
      firstName: "",
      lastName: "",
      eMail: "",
      location: "",
      imageFormat: 2,
      imageX: canvas.width, // Gunakan lebar canvas yang sudah diperbarui
      imageY: canvas.height,
      imageTransparency: true,
      imageScaling: false,
      maxUpScalePercent: 0.0,
      rawDataFormat: "ENC",
      minSigPoints: 25,
    };

    window.top.document.removeEventListener(
      "SignResponse",
      this.signResponse,
      false
    );
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
    
    document.documentElement.removeChild(element);
  };

  signResponse = async (event) => {
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in signResponse.");
      return;
    }

    const str = event.target.getAttribute("msgAttribute");
    const obj = JSON.parse(str);

    // Kirim lebar aktual canvas ke setValue
    await this.setValue(obj, canvas.width, canvas.height);
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

      const bucketName = "gambar";
      const folderPath = "signatures";

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
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in setValue.");
      return;
    }

    let obj = null;
    try {
      obj = typeof res === "string" ? JSON.parse(res) : res;
    } catch (e) {
      console.error("Failed to parse signature response:", e, res);
      alert("Gagal memproses data tanda tangan.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (obj.errorMsg && obj.errorMsg !== "" && obj.errorMsg !== "undefined") {
      alert(obj.errorMsg);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ preview: null });
      const { input: { onChange } } = this.props;
      onChange(null);
    } else {
      if (obj.isSigned) {
        const img = new Image();
        img.onload = async () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Gunakan lebar aktual canvas
          
          const base64Image = canvas.toDataURL("image/png");
          await this.uploadToSupabase(base64Image);
        };
        img.onerror = (e) => {
            console.error("Error loading signature image:", e);
            alert("Gagal memuat gambar tanda tangan.");
        };
        img.src = "data:image/png;base64," + obj.imageData;
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({ preview: null });
        const { input: { onChange } } = this.props;
        onChange(null);
      }
    }
  };

  render() {
    const { loading, preview } = this.state;

    return (
      <Card>
        <CardContent>
          {/* Canvas untuk menangkap dan menampilkan tanda tangan */}
          <canvas
            ref={this.canvasRef}
            id="cnv"
            name="cnv"
            // Hapus atribut width hardcoded di sini
            height="100" // Tinggi tetap 100px
            style={{ 
              border: '1px solid #ccc', 
              width: '100%', // Atur lebar menjadi 100%
              marginBottom: preview ? '15px' : '0' 
            }}
          ></canvas>

          {/* Tampilkan preview tanda tangan jika sudah ada */}
          {preview && (
            <div style={{ marginTop: 15 }}>
              <strong>Tanda Tangan Tersimpan:</strong>
              <img
                src={preview}
                alt="Tanda tangan tersimpan"
                style={{
                  width: "100%", // Atur lebar menjadi 100%
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