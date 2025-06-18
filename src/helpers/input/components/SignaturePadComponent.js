import React, { Component, createRef } from "react";
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import dataProvider from "../../../providers/data";

class SignaturePadComponent extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.state = {
      canvas: null,
      loading: false,
      preview: props.input.value && props.input.value.src ? props.input.value.src : null,
    };
    
    // Bind method untuk memastikan context yang benar
    this.signResponse = this.signResponse.bind(this);
  }

  componentDidMount = () => {
    if (this.canvasRef.current) {
      this.setState({
        canvas: this.canvasRef.current,
      }, () => {
        if (this.state.preview) {
          this.drawImageOnCanvas(this.state.preview);
        }
      });
    }
  };

  componentWillUnmount = () => {
    // Cleanup event listener
    if (window.top && window.top.document) {
      window.top.document.removeEventListener(
        "SignResponse",
        this.signResponse,
        false
      );
    }
  };

  drawImageOnCanvas = (imageUrl) => {
    const { canvas } = this.state;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = this.canvasRef.current.offsetWidth;
      canvas.height = 100; // Set tinggi yang konsisten
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
    if (!canvas) {
      console.error("Canvas element not found.");
      alert("Canvas untuk tanda tangan tidak ditemukan. Mohon refresh halaman.");
      return;
    }
    
    // Set dimensi canvas
    canvas.width = this.canvasRef.current.offsetWidth;
    canvas.height = 100;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.setState({ preview: null });

    // Konfigurasi message untuk SigWeb dengan parameter yang lebih kompatibel
    let message = {
      "FirstName": "",
      "LastName": "",
      "Email": "",
      "Location": "",
      "ImageFormat": 1, // 1 untuk PNG
      "ImageX": canvas.width,
      "ImageY": canvas.height,
      "ImageTransparency": 1, // 1 untuk true
      "ImageScaling": 0, // 0 untuk no scaling
      "MinSigPoints": 25,
      "MaxSigPoints": 50000,
      "PenWidth": 2,
      "PenColor": "#0000FF",
      "BackgroundColor": "#FFFFFF",
      "BorderWidth": 0,
      "PadType": "STU-300", // Sesuaikan dengan tipe pad Anda
      "DataFormat": 1, // 1 untuk ENC format
      "CompressionMode": 1,
      "HashAlgorithm": 1
    };

    // Cleanup existing listener
    if (window.top && window.top.document) {
      window.top.document.removeEventListener(
        "SignResponse",
        this.signResponse,
        false
      );
      
      // Add new listener
      window.top.document.addEventListener(
        "SignResponse",
        this.signResponse,
        false
      );
    }

    try {
      const messageData = JSON.stringify(message);
      console.log("Sending message to SigWeb:", messageData);
      
      // Buat element untuk komunikasi dengan SigWeb
      const element = document.createElement("MyPluginDataElement");
      element.setAttribute("messageAttribute", messageData);
      
      // Tambahkan ke DOM
      document.documentElement.appendChild(element);
      
      // Dispatch event
      const evt = document.createEvent("Events");
      evt.initEvent("SignStartEvent", true, false);
      element.dispatchEvent(evt);
      
      console.log("SignStartEvent dispatched successfully");
      
      // Cleanup element setelah delay singkat
      setTimeout(() => {
        try {
          if (element.parentNode) {
            document.documentElement.removeChild(element);
          }
        } catch (e) {
          console.warn("Element already removed:", e);
        }
      }, 100);
      
    } catch (error) {
      console.error("Error starting signature process:", error);
      alert("Gagal memulai proses tanda tangan. Pastikan SigWeb sudah terinstall dan berjalan.");
    }
  };

  signResponse = async (event) => {
    console.log("SignResponse event received:", event);
    
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in signResponse.");
      return;
    }

    const str = event.target.getAttribute("msgAttribute");
    console.log("Response data:", str);
    
    if (!str) {
      console.error("No response data received from SigWeb");
      alert("Tidak ada data yang diterima dari SigWeb.");
      return;
    }

    let obj = null;
    try {
      obj = JSON.parse(str);
      console.log("Parsed response object:", obj);
    } catch (e) {
      console.error("Failed to parse SignResponse message:", e, str);
      alert("Gagal memproses data tanda tangan dari perangkat.");
      return;
    }

    await this.setValue(obj);
  };

  base64ToBlob = (base64) => {
    try {
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
    } catch (error) {
      console.error("Error converting base64 to blob:", error);
      return new Blob();
    }
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
      console.log("Signature uploaded successfully:", url);

      return url;
    } catch (error) {
      console.error("Error uploading signature:", error);
      alert("Gagal mengupload tanda tangan!");
      return null;
    } finally {
      this.setState({ loading: false });
    }
  };

  setValue = async (obj) => {
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in setValue.");
      return;
    }

    const ctx = canvas.getContext("2d");

    // Cek berbagai kemungkinan error response
    if (obj.errorMsg && obj.errorMsg !== "" && obj.errorMsg !== "undefined") {
      console.error("SigWeb Error:", obj.errorMsg);
      alert("Error dari SigWeb: " + obj.errorMsg);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ preview: null });
      const { input: { onChange } } = this.props;
      onChange(null);
      return;
    }

    // Cek apakah response menunjukkan signature yang valid
    const isSigned = obj.isSigned === true || obj.isSigned === "true" || obj.isSigned === 1;
    const hasImageData = obj.imageData && obj.imageData.length > 0;

    console.log("Signature validation:", { isSigned, hasImageData, obj });

    if (isSigned && hasImageData) {
      try {
        const base64ImageFromPad = obj.imageData.startsWith('data:') 
          ? obj.imageData 
          : "data:image/png;base64," + obj.imageData;
        
        const img = new Image();
        img.onload = async () => {
          // Set canvas dimensions
          canvas.width = this.canvasRef.current.offsetWidth;
          canvas.height = 100;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Upload to Supabase
          const base64ImageToUpload = canvas.toDataURL("image/png");
          await this.uploadToSupabase(base64ImageToUpload);
        };
        
        img.onerror = (e) => {
          console.error("Error loading signature image from SigWeb data:", e);
          alert("Gagal memuat gambar tanda tangan dari SigWeb.");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          this.setState({ preview: null });
          this.props.input.onChange(null);
        };
        
        img.src = base64ImageFromPad;
      } catch (error) {
        console.error("Error processing signature image:", error);
        alert("Gagal memproses gambar tanda tangan.");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({ preview: null });
        this.props.input.onChange(null);
      }
    } else {
      console.log("Signature cancelled or invalid");
      alert("Proses tanda tangan dibatalkan atau data tidak valid.");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ preview: null });
      const { input: { onChange } } = this.props;
      onChange(null);
    }
  };

  render() {
    const { loading, preview } = this.state;

    return (
      <Card>
        <CardContent>
          <canvas
            ref={this.canvasRef}
            id="cnv"
            name="cnv"
            height="100"
            style={{ 
              border: '1px solid #ccc', 
              width: '100%',
              marginBottom: preview ? '15px' : '0' 
            }}
          />

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