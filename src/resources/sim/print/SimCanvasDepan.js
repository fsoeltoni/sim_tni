// import React, { forwardRef, useEffect, useState } from "react";
// import { Stage, Layer, Image, Text, Group } from "react-konva";
// import useImage from "use-image";

// const SimCanvasDepan = forwardRef((props, ref) => {
//   const {
//     kode_sim,
//     nama,
//     tempat_tanggal_lahir,
//     pangkat_nrp_nip,
//     kesatuan,
//     golongan_darah,
//     dibuat_di,
//     pada_tanggal,
//     berlaku_hingga,
//     label_komandan,
//     nama_komandan,
//     pangkat_korps_nrp_komandan,
//     tanda_tangan_komandan,
//     stempel,
//     tanda_tangan,
//     pas_foto,
//     sidik_jari,
//   } = props.content;

//   // Debug original data
//   useEffect(() => {
//     console.log("SimCanvasDepan received data:", props.content);
//   }, [props.content]);

//   // Enhanced function to extract image URL with proper handling of different formats
//   const extractImageData = (data) => {
//     if (!data) {
//       console.log("No image data provided");
//       return null;
//     }

//     try {
//       // Handle direct URLs
//       if (typeof data === "string") {
//         // Check if it's a complete URL
//         if (data.startsWith("http")) {
//           console.log("Using direct URL:", data);
//           return data;
//         }
//         // It might be a path - build the full URL
//         const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data}`;
//         console.log("Built URL from path:", fullUrl);
//         return fullUrl;
//       }

//       // Handle object with URL property
//       if (data.url) {
//         console.log("Using URL from object:", data.url);
//         return data.url;
//       }

//       // Handle object with path property
//       if (data.path) {
//         const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data.path}`;
//         console.log("Built URL from object path:", fullUrl);
//         return fullUrl;
//       }

//       // Handle ImageInput format (object with src)
//       if (data.src) {
//         if (typeof data.src === "string") {
//           console.log("Using src from ImageInput:", data.src);
//           return data.src;
//         }
//         // If src is a file, this shouldn't happen in this component but handle just in case
//         if (data.src instanceof File) {
//           console.warn("Received File object instead of URL");
//           return null;
//         }
//       }

//       // Handle raw object case where data itself might be the URL
//       if (data.toString && typeof data.toString === "function") {
//         const stringValue = data.toString();
//         if (stringValue.startsWith("http")) {
//           console.log("Using object toString as URL:", stringValue);
//           return stringValue;
//         }
//       }

//       console.warn("Unknown image data format:", data);
//       return null;
//     } catch (error) {
//       console.error("Error processing image data:", error);
//       return null;
//     }
//   };

//   // Process image sources
//   const [processedImages, setProcessedImages] = useState({
//     stempelSrc: null,
//     tandaTanganKomandanSrc: null,
//     tandaTanganPemohonSrc: null,
//     sidikJariPemohonSrc: null,
//     pasFotoPemohonSrc: null,
//   });

//   useEffect(() => {
//     setProcessedImages({
//       stempelSrc: extractImageData(stempel),
//       tandaTanganKomandanSrc: extractImageData(tanda_tangan_komandan),
//       tandaTanganPemohonSrc: extractImageData(tanda_tangan),
//       sidikJariPemohonSrc: extractImageData(sidik_jari),
//       pasFotoPemohonSrc: extractImageData(pas_foto),
//     });
//   }, [stempel, tanda_tangan_komandan, tanda_tangan, sidik_jari, pas_foto]);

//   // Use the processed sources with useImage
//   const [stempel_satlak, stempelStatus] = useImage(processedImages.stempelSrc);
//   const [tanda_tangan_komandan_satlak, komandanStatus] = useImage(
//     processedImages.tandaTanganKomandanSrc
//   );
//   const [tanda_tangan_pemohon, pemohonStatus] = useImage(
//     processedImages.tandaTanganPemohonSrc
//   );
//   const [sidik_jari_pemohon, sidikStatus] = useImage(
//     processedImages.sidikJariPemohonSrc
//   );
//   const [pas_foto_pemohon, fotoStatus] = useImage(
//     processedImages.pasFotoPemohonSrc
//   );

//   // Log image loading status for debugging
//   useEffect(() => {
//     console.log("Image loading status:", {
//       stempel: { src: processedImages.stempelSrc, status: stempelStatus },
//       komandan: {
//         src: processedImages.tandaTanganKomandanSrc,
//         status: komandanStatus,
//       },
//       pemohon: {
//         src: processedImages.tandaTanganPemohonSrc,
//         status: pemohonStatus,
//       },
//       sidik: { src: processedImages.sidikJariPemohonSrc, status: sidikStatus },
//       foto: { src: processedImages.pasFotoPemohonSrc, status: fotoStatus },
//     });
//   }, [
//     processedImages,
//     stempelStatus,
//     komandanStatus,
//     pemohonStatus,
//     sidikStatus,
//     fotoStatus,
//   ]);

//   // Safe text rendering helper
//   const safeText = (text) => text || "";

//   return (
//     <Stage width={325} height={204} ref={ref}>
//       <Layer>
//         <Text
//           x={86}
//           y={36}
//           width={153}
//           text={safeText(kode_sim)}
//           fontSize={8}
//           fontStyle="bold"
//           align="center"
//         />

//         {sidik_jari_pemohon && sidikStatus === "loaded" && (
//           <Image
//             image={sidik_jari_pemohon}
//             x={10}
//             y={75}
//             scaleY={0.13}
//             scaleX={0.13}
//           />
//         )}

//         <Group x={15} y={55}>
//           <Group>
//             <Text text="Nama" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text text={safeText(nama)} x={90} fontSize={9} fontStyle="bold" />
//           </Group>
//           <Group y={10}>
//             <Text text="Tempat/Tgl. Lahir" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(tempat_tanggal_lahir)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={20}>
//             <Text text="Pangkat/NRP/NIP" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(pangkat_nrp_nip)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={30}>
//             <Text text="Kesatuan" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(kesatuan)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={40}>
//             <Text text="Golongan Darah" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(golongan_darah)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//         </Group>

//         <Group x={160} y={108}>
//           <Group>
//             <Text text="Diberikan di" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(dibuat_di)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={10}>
//             <Text text="Pada Tanggal" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(pada_tanggal)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={20}>
//             <Text text="Berlaku Hingga" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(berlaku_hingga)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//         </Group>

//         <Group x={160} y={140}>
//           <Group>
//             <Text
//               text={safeText(label_komandan)}
//               fontSize={9}
//               fontStyle="bold"
//               width={160}
//               align="center"
//             />
//             {tanda_tangan_komandan_satlak && komandanStatus === "loaded" && (
//               <Image
//                 image={tanda_tangan_komandan_satlak}
//                 width={140}
//                 height={30}
//                 x={0}
//                 y={10}
//               />
//             )}
//             <Text
//               text={safeText(nama_komandan)}
//               fontSize={9}
//               fontStyle="bold"
//               width={165}
//               align="center"
//               y={35}
//             />
//             <Text
//               text={safeText(pangkat_korps_nrp_komandan)}
//               fontSize={8}
//               fontStyle="bold"
//               width={160}
//               align="center"
//               y={45}
//             />
//           </Group>
//         </Group>

//         {pas_foto_pemohon && fotoStatus === "loaded" && (
//           <Image
//             image={pas_foto_pemohon}
//             x={86}
//             y={108}
//             width={72}
//             height={86}
//           />
//         )}

//         {stempel_satlak && stempelStatus === "loaded" && (
//           <Image
//             image={stempel_satlak}
//             x={150}
//             y={115}
//             width={75}
//             height={75}
//           />
//         )}

//         {tanda_tangan_pemohon && pemohonStatus === "loaded" && (
//           <Image
//             image={tanda_tangan_pemohon}
//             x={-25}
//             y={170}
//             width={150}
//             height={30}
//           />
//         )}
//       </Layer>
//     </Stage>
//   );
// });

// export default SimCanvasDepan;

// import React, { forwardRef, useEffect, useState } from "react";
// import { Stage, Layer, Image, Text, Group } from "react-konva";
// import useImage from "use-image";

// const SimCanvasDepan = forwardRef((props, ref) => {
//   const {
//     kode_sim,
//     nama,
//     tempat_tanggal_lahir,
//     pangkat_nrp_nip,
//     kesatuan,
//     golongan_darah,
//     dibuat_di,
//     pada_tanggal,
//     berlaku_hingga,
//     label_komandan,
//     nama_komandan,
//     pangkat_korps_nrp_komandan,
//     tanda_tangan_komandan,
//     stempel,
//     tanda_tangan,
//     pas_foto,
//     sidik_jari,
//   } = props.content;

//   const extractImageData = (data) => {
//     console.log("🔍 Memproses data gambar:", data);
//     if (!data) return "https://via.placeholder.com/150"; // Placeholder jika tidak ada gambar

//     try {
//       if (typeof data === "string" && data.startsWith("http")) {
//         console.log("🔹 Gambar diambil langsung dari string URL:", data);
//         return data;
//       }

//       if (typeof data === "object") {
//         if (data.src) {
//           console.log("🔹 Gambar diambil dari objek src:", data.src);
//           return data.src;
//         }

//         if (data.path) {
//           const fullPath = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data.path}`;
//           console.log("🔹 Gambar diambil dari path:", fullPath);
//           return fullPath;
//         }

//         if (data.sidik_jari) {
//           const sidikJariPath = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data.sidik_jari}`;
//           console.log("🔹 Gambar sidik jari:", sidikJariPath);
//           return sidikJariPath;
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error processing image data:", error);
//     }

//     console.log("⚠️ Menggunakan gambar default");
//     return "https://via.placeholder.com/150"; // Placeholder default
//   };

//   useEffect(() => {
//     console.log("Gambar yang diproses:", {
//       stempel: extractImageData(stempel),
//       tanda_tangan_komandan: extractImageData(tanda_tangan_komandan),
//       tanda_tangan: extractImageData(tanda_tangan),
//       sidik_jari: extractImageData(sidik_jari),
//       pas_foto: extractImageData(pas_foto),
//     });
//   }, [stempel, tanda_tangan_komandan, tanda_tangan, sidik_jari, pas_foto]);

//   const [stempel_satlak] = useImage(extractImageData(stempel));
//   const [tanda_tangan_komandan_satlak] = useImage(
//     extractImageData(tanda_tangan_komandan)
//   );
//   const [tanda_tangan_pemohon] = useImage(extractImageData(tanda_tangan));
//   const [sidik_jari_pemohon] = useImage(extractImageData(sidik_jari));
//   const [pas_foto_pemohon] = useImage(extractImageData(pas_foto), "anonymous");

//   return (
//     <Stage width={325} height={204} ref={ref}>
//       <Layer>
//         <Text
//           x={86}
//           y={36}
//           width={153}
//           text={kode_sim || "N/A"}
//           fontSize={8}
//           fontStyle="bold"
//           align="center"
//         />
//         <Image
//           image={sidik_jari_pemohon}
//           x={10}
//           y={75}
//           scaleY={0.13}
//           scaleX={0.13}
//         />
//         <Group x={15} y={55}>
//           {[
//             ["Nama", nama],
//             ["Tempat/Tgl. Lahir", tempat_tanggal_lahir],
//             ["Pangkat/NRP/NIP", pangkat_nrp_nip],
//             ["Kesatuan", kesatuan],
//             ["Golongan Darah", golongan_darah],
//           ].map(([label, value], index) => (
//             <Group key={index} y={index * 10}>
//               <Text text={label} fontSize={9} fontStyle="bold" />
//               <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//               <Text
//                 text={value || "N/A"}
//                 x={90}
//                 fontSize={9}
//                 fontStyle="bold"
//               />
//             </Group>
//           ))}
//         </Group>
//         <Group x={160} y={108}>
//           {[
//             ["Diberikan di", dibuat_di],
//             ["Pada Tanggal", pada_tanggal],
//             ["Berlaku Hingga", berlaku_hingga],
//           ].map(([label, value], index) => (
//             <Group key={index} y={index * 10}>
//               <Text text={label} fontSize={9} fontStyle="bold" />
//               <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//               <Text
//                 text={value || "N/A"}
//                 x={90}
//                 fontSize={9}
//                 fontStyle="bold"
//               />
//             </Group>
//           ))}
//         </Group>
//         <Group x={160} y={140}>
//           <Text
//             text={label_komandan || "N/A"}
//             fontSize={9}
//             fontStyle="bold"
//             width={160}
//             align="center"
//           />
//           <Image
//             image={tanda_tangan_komandan_satlak}
//             width={140}
//             height={30}
//             x={0}
//             y={10}
//           />
//           <Text
//             text={nama_komandan || "N/A"}
//             fontSize={9}
//             fontStyle="bold"
//             width={165}
//             align="center"
//             y={35}
//           />
//           <Text
//             text={pangkat_korps_nrp_komandan || "N/A"}
//             fontSize={8}
//             fontStyle="bold"
//             width={160}
//             align="center"
//             y={45}
//           />
//         </Group>
//         <Image image={pas_foto_pemohon} x={86} y={108} width={72} height={86} />
//         <Image image={stempel_satlak} x={150} y={115} width={75} height={75} />
//         <Image
//           image={tanda_tangan_pemohon}
//           x={-25}
//           y={170}
//           width={150}
//           height={30}
//         />
//       </Layer>
//     </Stage>
//   );
// });

// export default SimCanvasDepan;

// import React, { forwardRef, useEffect, useState } from "react";
// import { Stage, Layer, Image, Text, Group } from "react-konva";
// import useImage from "use-image";

// const SimCanvasDepan = forwardRef((props, ref) => {
//   const {
//     kode_sim,
//     nama,
//     tempat_tanggal_lahir,
//     pangkat_nrp_nip,
//     kesatuan,
//     golongan_darah,
//     dibuat_di,
//     pada_tanggal,
//     berlaku_hingga,
//     label_komandan,
//     nama_komandan,
//     pangkat_korps_nrp_komandan,
//     tanda_tangan_komandan,
//     stempel,
//     tanda_tangan,
//     pas_foto,
//     sidik_jari,
//   } = props.content;

//   // Debug received data
//   useEffect(() => {
//     console.log("SimCanvasDepan received data:", props.content);
//   }, [props.content]);

//   // Enhanced image URL extraction to handle all observed formats
//   const extractImageData = (data) => {
//     if (!data) {
//       console.log("No image data provided");
//       return null;
//     }

//     try {
//       // Format 1: Direct URL string
//       if (typeof data === "string") {
//         if (data.startsWith("http")) {
//           console.log("Direct URL found:", data);
//           return data;
//         }
//         // Path-only string
//         const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data}`;
//         console.log("Built URL from string path:", fullUrl);
//         return fullUrl;
//       }

//       // Format 2: Object with src property (from console logs)
//       if (data.src && typeof data.src === "string") {
//         console.log("Found src property:", data.src);
//         return data.src;
//       }

//       // Format 3: Object with path in nested structure (from console screenshot)
//       if (data.path) {
//         const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data.path}`;
//         console.log("Built URL from path property:", fullUrl);
//         return fullUrl;
//       }

//       // Format 4: Object with the specific structure seen in console
//       if (typeof data === "object" && data !== null) {
//         // Check for the structure with src, path, bucket, and title (from your console)
//         if (
//           data.src &&
//           data.src.startsWith("http") &&
//           data.path &&
//           data.bucket
//         ) {
//           console.log("Using source URL from complex object:", data.src);
//           return data.src;
//         }

//         // Try to access any URL-like string property in the object
//         for (const key in data) {
//           if (typeof data[key] === "string" && data[key].startsWith("http")) {
//             console.log(`Found URL in property ${key}:`, data[key]);
//             return data[key];
//           }
//         }
//       }

//       console.warn("Unknown image data format:", data);
//       return null;
//     } catch (error) {
//       console.error("Error processing image data:", error);
//       return null;
//     }
//   };

//   // Process image sources
//   const [imageUrls, setImageUrls] = useState({
//     stempelSrc: null,
//     tandaTanganKomandanSrc: null,
//     tandaTanganPemohonSrc: null,
//     sidikJariPemohonSrc: null,
//     pasFotoPemohonSrc: null,
//   });

//   // Update URLs whenever props change
//   useEffect(() => {
//     setImageUrls({
//       stempelSrc: extractImageData(stempel),
//       tandaTanganKomandanSrc: extractImageData(tanda_tangan_komandan),
//       tandaTanganPemohonSrc: extractImageData(tanda_tangan),
//       sidikJariPemohonSrc: extractImageData(sidik_jari),
//       pasFotoPemohonSrc: extractImageData(pas_foto),
//     });

//     console.log("Extracted image URLs:", {
//       stempel: extractImageData(stempel),
//       tanda_tangan_komandan: extractImageData(tanda_tangan_komandan),
//       tanda_tangan: extractImageData(tanda_tangan),
//       sidik_jari: extractImageData(sidik_jari),
//       pas_foto: extractImageData(pas_foto),
//     });
//   }, [stempel, tanda_tangan_komandan, tanda_tangan, sidik_jari, pas_foto]);

//   // Load images with appropriate crossOrigin setting
//   const [stempel_satlak, stempelStatus] = useImage(
//     imageUrls.stempelSrc,
//     "anonymous"
//   );
//   const [tanda_tangan_komandan_satlak, komandanStatus] = useImage(
//     imageUrls.tandaTanganKomandanSrc,
//     "anonymous"
//   );
//   const [tanda_tangan_pemohon, pemohonStatus] = useImage(
//     imageUrls.tandaTanganPemohonSrc,
//     "anonymous"
//   );
//   const [sidik_jari_pemohon, sidikStatus] = useImage(
//     imageUrls.sidikJariPemohonSrc,
//     "anonymous"
//   );
//   const [pas_foto_pemohon, fotoStatus] = useImage(
//     imageUrls.pasFotoPemohonSrc,
//     "anonymous"
//   );

//   // Log loading status for debugging
//   useEffect(() => {
//     console.log("Image loading status:", {
//       stempel: { src: imageUrls.stempelSrc, status: stempelStatus },
//       komandan: {
//         src: imageUrls.tandaTanganKomandanSrc,
//         status: komandanStatus,
//       },
//       pemohon: { src: imageUrls.tandaTanganPemohonSrc, status: pemohonStatus },
//       sidik: { src: imageUrls.sidikJariPemohonSrc, status: sidikStatus },
//       foto: { src: imageUrls.pasFotoPemohonSrc, status: fotoStatus },
//     });
//   }, [
//     imageUrls,
//     stempelStatus,
//     komandanStatus,
//     pemohonStatus,
//     sidikStatus,
//     fotoStatus,
//   ]);

//   // Helper for safe text rendering
//   const safeText = (text) => text || "N/A";

//   return (
//     <Stage width={325} height={204} ref={ref}>
//       <Layer>
//         {/* SIM Code */}
//         <Text
//           x={86}
//           y={36}
//           width={153}
//           text={safeText(kode_sim)}
//           fontSize={8}
//           fontStyle="bold"
//           align="center"
//         />

//         {/* Fingerprint - Render with fallback message */}
//         {sidikStatus === "loaded" ? (
//           <Image
//             image={sidik_jari_pemohon}
//             x={10}
//             y={75}
//             scaleY={0.13}
//             scaleX={0.13}
//           />
//         ) : (
//           imageUrls.sidikJariPemohonSrc && (
//             <Text
//               x={10}
//               y={75}
//               text="Loading sidik jari..."
//               fontSize={6}
//               width={50}
//             />
//           )
//         )}

//         {/* Personal Info */}
//         <Group x={15} y={55}>
//           <Group>
//             <Text text="Nama" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text text={safeText(nama)} x={90} fontSize={9} fontStyle="bold" />
//           </Group>
//           <Group y={10}>
//             <Text text="Tempat/Tgl. Lahir" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(tempat_tanggal_lahir)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={20}>
//             <Text text="Pangkat/NRP/NIP" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(pangkat_nrp_nip)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={30}>
//             <Text text="Kesatuan" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(kesatuan)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={40}>
//             <Text text="Golongan Darah" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(golongan_darah)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//         </Group>

//         {/* Issuance Info */}
//         <Group x={160} y={108}>
//           <Group>
//             <Text text="Diberikan di" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(dibuat_di)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={10}>
//             <Text text="Pada Tanggal" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(pada_tanggal)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//           <Group y={20}>
//             <Text text="Berlaku Hingga" fontSize={9} fontStyle="bold" />
//             <Text text=":" x={80} fontSize={9} fontStyle="bold" />
//             <Text
//               text={safeText(berlaku_hingga)}
//               x={90}
//               fontSize={9}
//               fontStyle="bold"
//             />
//           </Group>
//         </Group>

//         {/* Commander Info */}
//         <Group x={160} y={140}>
//           <Group>
//             <Text
//               text={safeText(label_komandan)}
//               fontSize={9}
//               fontStyle="bold"
//               width={160}
//               align="center"
//             />

//             {/* Commander Signature */}
//             {komandanStatus === "loaded" ? (
//               <Image
//                 image={tanda_tangan_komandan_satlak}
//                 width={140}
//                 height={30}
//                 x={0}
//                 y={10}
//               />
//             ) : (
//               imageUrls.tandaTanganKomandanSrc && (
//                 <Text
//                   x={0}
//                   y={10}
//                   text="Loading signature..."
//                   fontSize={6}
//                   width={140}
//                   align="center"
//                 />
//               )
//             )}

//             <Text
//               text={safeText(nama_komandan)}
//               fontSize={9}
//               fontStyle="bold"
//               width={165}
//               align="center"
//               y={35}
//             />
//             <Text
//               text={safeText(pangkat_korps_nrp_komandan)}
//               fontSize={8}
//               fontStyle="bold"
//               width={160}
//               align="center"
//               y={45}
//             />
//           </Group>
//         </Group>

//         {/* Photo */}
//         {fotoStatus === "loaded" ? (
//           <Image
//             image={pas_foto_pemohon}
//             x={86}
//             y={108}
//             width={72}
//             height={86}
//           />
//         ) : (
//           imageUrls.pasFotoPemohonSrc && (
//             <Group x={86} y={108} width={72} height={86}>
//               <Text
//                 text="Loading photo..."
//                 fontSize={8}
//                 width={72}
//                 align="center"
//                 y={40}
//               />
//             </Group>
//           )
//         )}

//         {/* Stamp */}
//         {stempelStatus === "loaded" ? (
//           <Image
//             image={stempel_satlak}
//             x={150}
//             y={115}
//             width={75}
//             height={75}
//             opacity={0.7}
//           />
//         ) : (
//           imageUrls.stempelSrc && (
//             <Text
//               x={150}
//               y={140}
//               text="Loading stamp..."
//               fontSize={8}
//               width={75}
//               align="center"
//             />
//           )
//         )}

//         {/* Applicant Signature */}
//         {pemohonStatus === "loaded" ? (
//           <Image
//             image={tanda_tangan_pemohon}
//             x={-25}
//             y={170}
//             width={150}
//             height={30}
//           />
//         ) : (
//           imageUrls.tandaTanganPemohonSrc && (
//             <Text
//               x={0}
//               y={170}
//               text="Loading signature..."
//               fontSize={6}
//               width={100}
//             />
//           )
//         )}
//       </Layer>
//     </Stage>
//   );
// });

// export default SimCanvasDepan;

import React, { forwardRef, useEffect, useState } from "react";
import { Stage, Layer, Image, Text, Group } from "react-konva";
import useImage from "use-image";

const SimCanvasDepan = forwardRef((props, ref) => {
  const {
    kode_sim,
    nama,
    tempat_tanggal_lahir,
    pangkat_nrp_nip,
    kesatuan,
    golongan_darah,
    dibuat_di,
    pada_tanggal,
    berlaku_hingga,
    label_komandan,
    nama_komandan,
    pangkat_korps_nrp_komandan,
    tanda_tangan_komandan,
    stempel,
    tanda_tangan,
    pas_foto,
    sidik_jari,
  } = props.content;

  // // Debug received data
  useEffect(() => {
    console.log("SimCanvasDepan received data:", props.content);
  }, [props.content]);

  // Fixed image URL extraction with proper JSON handling
  const extractImageData = (data) => {
    if (!data) {
      // console.log("No image data provided");
      return null;
    }

    try {
      // Handle case where data is a stringified JSON object
      if (
        typeof data === "string" &&
        (data.startsWith("{") || data.includes("src"))
      ) {
        try {
          // Attempt to parse if it's a JSON string
          const parsedData = JSON.parse(data);
          console.log("Parsed JSON data:", parsedData);

          // Extract src from parsed JSON
          if (parsedData.src) {
            console.log("Using src from parsed JSON:", parsedData.src);
            return parsedData.src;
          }
        } catch (parseError) {
          // If it's not valid JSON but contains a URL, try to extract it
          const urlMatch = data.match(/(https?:\/\/[^"]+)/);
          if (urlMatch && urlMatch[0]) {
            console.log("Extracted URL from string:", urlMatch[0]);
            return urlMatch[0];
          }
        }
      }

      // Handle direct URL strings
      if (typeof data === "string" && data.startsWith("http")) {
        console.log("Using direct URL:", data);
        return data;
      }

      // Handle simple string paths
      if (typeof data === "string") {
        const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data}`;
        console.log("Built URL from string path:", fullUrl);
        return fullUrl;
      }

      // Handle object with src property
      if (data && typeof data === "object" && data.src) {
        if (typeof data.src === "string" && data.src.startsWith("http")) {
          console.log("Using src from object:", data.src);
          return data.src;
        }
      }

      // Handle object with path property
      if (data && typeof data === "object" && data.path) {
        // Don't use path if src is available
        if (data.src) {
          console.log("Using src instead of path:", data.src);
          return data.src;
        }

        const fullUrl = `https://ocqghycfqgrvlgqjoort.supabase.co/storage/v1/object/public/gambar/${data.path}`;
        console.log("Built URL from object path:", fullUrl);
        return fullUrl;
      }

      console.warn("Unknown image data format:", data);
      return null;
    } catch (error) {
      console.error("Error processing image data:", error);
      return null;
    }
  };

  // Process image sources
  const [imageUrls, setImageUrls] = useState({
    stempelSrc: null,
    tandaTanganKomandanSrc: null,
    tandaTanganPemohonSrc: null,
    sidikJariPemohonSrc: null,
    pasFotoPemohonSrc: null,
  });

  // Update URLs whenever props change
  useEffect(() => {
    setImageUrls({
      stempelSrc: extractImageData(stempel),
      tandaTanganKomandanSrc: extractImageData(tanda_tangan_komandan),
      tandaTanganPemohonSrc: extractImageData(tanda_tangan),
      sidikJariPemohonSrc: extractImageData(sidik_jari),
      pasFotoPemohonSrc: extractImageData(pas_foto),
    });

    console.log("Extracted image URLs:", {
      stempel: extractImageData(stempel),
      tanda_tangan_komandan: extractImageData(tanda_tangan_komandan),
      tanda_tangan: extractImageData(tanda_tangan),
      sidik_jari: extractImageData(sidik_jari),
      pas_foto: extractImageData(pas_foto),
    });
  }, [stempel, tanda_tangan_komandan, tanda_tangan, sidik_jari, pas_foto]);

  // Load images with appropriate crossOrigin setting
  const [stempel_satlak, stempelStatus] = useImage(
    imageUrls.stempelSrc,
    "anonymous"
  );
  const [tanda_tangan_komandan_satlak, komandanStatus] = useImage(
    imageUrls.tandaTanganKomandanSrc,
    "anonymous"
  );
  const [tanda_tangan_pemohon, pemohonStatus] = useImage(
    imageUrls.tandaTanganPemohonSrc,
    "anonymous"
  );
  const [sidik_jari_pemohon, sidikStatus] = useImage(
    imageUrls.sidikJariPemohonSrc,
    "anonymous"
  );
  const [pas_foto_pemohon, fotoStatus] = useImage(
    imageUrls.pasFotoPemohonSrc,
    "anonymous"
  );

  // Log loading status for debugging
  useEffect(() => {
    console.log("Image loading status:", {
      stempel: { src: imageUrls.stempelSrc, status: stempelStatus },
      komandan: {
        src: imageUrls.tandaTanganKomandanSrc,
        status: komandanStatus,
      },
      pemohon: { src: imageUrls.tandaTanganPemohonSrc, status: pemohonStatus },
      sidik: { src: imageUrls.sidikJariPemohonSrc, status: sidikStatus },
      foto: { src: imageUrls.pasFotoPemohonSrc, status: fotoStatus },
    });
  }, [
    imageUrls,
    stempelStatus,
    komandanStatus,
    pemohonStatus,
    sidikStatus,
    fotoStatus,
  ]);

  // Helper for safe text rendering
  const safeText = (text) => text || "N/A";

  return (
    <Stage width={325} height={204} ref={ref}>
      <Layer>
        {/* SIM Code */}
        <Text
          x={86}
          y={36}
          width={153}
          text={safeText(kode_sim)}
          fontSize={8}
          fontStyle="bold"
          align="center"
        />

        {/* Fingerprint */}
        {sidikStatus === "loaded" && (
          <Image
            image={sidik_jari_pemohon}
            x={10}
            y={75}
            scaleY={0.13}
            scaleX={0.13}
          />
        )}

        {/* Personal Info */}
        <Group x={15} y={55}>
          <Group>
            <Text text="Nama" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={safeText(nama)} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={10}>
            <Text text="Tempat/Tgl. Lahir" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(tempat_tanggal_lahir)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={20}>
            <Text text="Pangkat/NRP/NIP" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(pangkat_nrp_nip)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={30}>
            <Text text="Kesatuan" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(kesatuan)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={40}>
            <Text text="Golongan Darah" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(golongan_darah)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
        </Group>

        {/* Issuance Info */}
        <Group x={160} y={108}>
          <Group>
            <Text text="Diberikan di" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(dibuat_di)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={10}>
            <Text text="Pada Tanggal" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(pada_tanggal)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={20}>
            <Text text="Berlaku Hingga" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={safeText(berlaku_hingga)}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
        </Group>

        {/* Commander Info */}
        <Group x={160} y={140}>
          <Group>
            <Text
              text={safeText(label_komandan)}
              fontSize={9}
              fontStyle="bold"
              width={160}
              align="center"
            />

            {/* Commander Signature */}
            {komandanStatus === "loaded" && (
              <Image
                image={tanda_tangan_komandan_satlak}
                width={140}
                height={30}
                x={0}
                y={10}
              />
            )}

            <Text
              text={safeText(nama_komandan)}
              fontSize={9}
              fontStyle="bold"
              width={165}
              align="center"
              y={35}
            />
            <Text
              text={safeText(pangkat_korps_nrp_komandan)}
              fontSize={8}
              fontStyle="bold"
              width={160}
              align="center"
              y={45}
            />
          </Group>
        </Group>

        {/* Photo */}
        {fotoStatus === "loaded" && (
          <Image
            image={pas_foto_pemohon}
            x={86}
            y={108}
            width={72}
            height={86}
          />
        )}

        {/* Stamp */}
        {stempelStatus === "loaded" && (
          <Image
            image={stempel_satlak}
            x={150}
            y={115}
            width={75}
            height={75}
            opacity={0.7}
          />
        )}

        {/* Applicant Signature */}
        {pemohonStatus === "loaded" && (
          <Image
            image={tanda_tangan_pemohon}
            x={-25}
            y={170}
            width={150}
            height={30}
          />
        )}
      </Layer>
    </Stage>
  );
});

export default SimCanvasDepan;
