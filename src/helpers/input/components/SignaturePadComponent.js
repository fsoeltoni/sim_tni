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
        // Setelah canvas diset, gambar preview jika sudah ada dan canvas sudah siap
        if (this.state.preview) {
          this.drawImageOnCanvas(this.state.preview);
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

  // Fungsi pembantu untuk menggambar gambar di canvas
  drawImageOnCanvas = (imageUrl) => {
    const { canvas } = this.state;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      // Pastikan lebar internal canvas sesuai dengan lebar visualnya sebelum menggambar
      canvas.width = this.canvasRef.current.offsetWidth;
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
    
    // Perbarui lebar internal canvas agar sesuai dengan lebar visual DOM-nya
    canvas.width = this.canvasRef.current.offsetWidth;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.setState({ preview: null }); // Hapus preview lama saat memulai tanda tangan baru

    // Objek pesan yang dioptimalkan untuk SigWeb
    // Beberapa properti diubah/ditambahkan agar sesuai dengan dokumentasi Topaz SigWeb
    let message = {
      // Default SigWeb. Mengatur properti ini bisa menghasilkan gambar yang lebih baik
      "QPF_SigWeb_Properties": "PadType=4;Interface=USB;AutoDetect=YES;Port=USB;", 
      "SigWeb_ImageFormat": "PNG", // Format gambar yang diinginkan (PNG atau JPG)
      "SigWeb_ImageX": canvas.width, // Lebar gambar yang diminta
      "SigWeb_ImageY": canvas.height, // Tinggi gambar yang diminta
      "SigWeb_ImageTransparency": true, // Latar belakang transparan
      "SigWeb_MinSigPoints": 25, // Jumlah minimum titik untuk tanda tangan valid
      "SigWeb_RawDataFormat": "ENC", // Format data mentah (ENC disarankan untuk keamanan)
      // Properti lain yang mungkin Anda ingin sertakan, sesuaikan dengan kebutuhan Anda
      "SigWeb_PenWidth": 2, // Ketebalan pena
      "SigWeb_InkColor": "#0000FF", // Warna tinta (biru)
      "SigWeb_BackgroundColor": "#FFFFFF", // Warna latar belakang (putih)
      // "SigWeb_EnableHandwritingMode": false, // Jika SigWeb mendukung mode tulisan tangan
      // "SigWeb_DisplayLCD": "Please sign below", // Pesan di LCD pad (jika ada LCD)
      
      // Properti custom Anda (jika ada yang masih relevan untuk data message)
      // firstName: "", 
      // lastName: "",
      // eMail: "",
      // location: "",
    };

    // Pastikan event listener hanya ditambahkan sekali
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
    
    // Hapus elemen setelah event dikirim untuk membersihkan DOM
    document.documentElement.removeChild(element);
  };

  signResponse = async (event) => {
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in signResponse.");
      return;
    }

    const str = event.target.getAttribute("msgAttribute");
    let obj = null;
    try {
      obj = JSON.parse(str);
    } catch (e) {
      console.error("Failed to parse SignResponse message:", e, str);
      alert("Gagal memproses data tanda tangan dari perangkat.");
      return;
    }

    await this.setValue(obj); // Hanya passing obj, lebar/tinggi akan diambil dari canvas di setValue
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
      const folderPath = "signatures"; // Sesuaikan dengan struktur folder Anda

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

  setValue = async (obj) => { // Hanya terima obj
    const { canvas } = this.state;
    if (!canvas) {
      console.error("Canvas element not found in setValue.");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (obj.errorMsg && obj.errorMsg !== "" && obj.errorMsg !== "undefined") {
      alert("Error dari SigWeb: " + obj.errorMsg);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({ preview: null });
      const { input: { onChange } } = this.props;
      onChange(null);
    } else {
      // Pastikan obj.isSigned ada dan bernilai true
      if (obj.isSigned && obj.imageData) {
        const base64ImageFromPad = "data:image/png;base64," + obj.imageData;
        
        // Gambar tanda tangan dari SigWeb ke canvas
        const img = new Image();
        img.onload = async () => {
          // Penting: Pastikan lebar internal canvas sudah diatur
          canvas.width = this.canvasRef.current.offsetWidth; 
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Setelah digambar di canvas, baru upload ke Supabase
          const base64ImageToUpload = canvas.toDataURL("image/png");
          await this.uploadToSupabase(base64ImageToUpload);
        };
        img.onerror = (e) => {
            console.error("Error loading signature image from SigWeb data:", e);
            alert("Gagal memuat gambar tanda tangan dari SigWeb.");
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan jika error
            this.setState({ preview: null });
            this.props.input.onChange(null);
        };
        img.src = base64ImageFromPad;
      } else {
        // Jika tidak ditandatangani atau data gambar tidak ada
        alert("Proses tanda tangan dibatalkan atau data tidak valid.");
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
            height="100" // Tinggi canvas tetap 100px
            style={{ 
              border: '1px solid #ccc', 
              width: '100%', // Lebar penuh
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
                  width: "100%", // Lebar penuh
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