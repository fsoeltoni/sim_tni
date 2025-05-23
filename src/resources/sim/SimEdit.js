import React, { useEffect, useState } from "react";
import {
  Edit,
  TabbedForm,
  FormTab,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextInput,
  DateInput,
  FormDataConsumer,
  ImageInput,
} from "react-admin";

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import moment from "moment";
import NoIdentitasInput from "./helpers/input/NoIdentitasInput";
import isBiiSus from "./helpers/input/conditions/isBiiSus";
import hasJenisPemohon from "./helpers/input/conditions/hasJenisPemohon";
import isPrajuritTniAd from "./helpers/input/conditions/isPrajuritTniAd";
import isPnsTniAd from "./helpers/input/conditions/isPnsTniAd";
import InputJenisPemohon from "./helpers/input/InputJenisPemohon";
import SimEditToolbar from "./helpers/edit/SimEditToolbar";
import CustomImageField from "../../helpers/input/components/ImageField";
import CameraInput from "../../helpers/input/CameraInput";
import SignaturePadInput from "../../helpers/input/SignaturePadInput";
import dataProvider from "../../providers/data";

const SIM_PAS_FOTO_BUCKET = "gambar";
const SIM_PAS_FOTO_FOLDER = "pasfoto_sim";
const SIM_TANDA_TANGAN_FOLDER = "tanda_tangan_sim";
const SIM_SIDIK_JARI_FOLDER = "sidik_jari_sim";

// Fungsi untuk menormalisasi bidang file dalam record
const normalizeFileField = (record) => {
  if (!record) return record;

  const recordCopy = { ...record };

  // Daftar field yang perlu dinormalisasi
  const fileFields = ["pas_foto", "tanda_tangan", "sidik_jari"];

  fileFields.forEach((field) => {
    // Jika field ada dan berupa string (URL), konversi ke format yang diharapkan
    if (recordCopy[field] && typeof recordCopy[field] === "string") {
      recordCopy[field] = {
        src: recordCopy[field],
        title: field,
      };
    }
  });

  return recordCopy;
};

const normalizeFileFieldForDisplay = (record, fileFieldConfigurations) => {
  if (!record) return record;
  const recordCopy = { ...record };

  fileFieldConfigurations.forEach(({ source, fileNameField }) => {
    const fileValue = recordCopy[source];
    const filePath = recordCopy[fileNameField];

    if (fileValue && typeof fileValue === "string" && fileValue.startsWith('http')) {
      recordCopy[source] = {
        src: fileValue,
        title: source,
        path: filePath || fileValue,
      };
    } else if (typeof fileValue === 'object' && fileValue !== null && typeof fileValue.src === 'string' && fileValue.src.startsWith('http')) {
      if (!fileValue.path && filePath) {
        recordCopy[source].path = filePath;
      }
    }
  });

  return recordCopy;
};

const SimEdit = ({ permissions, ...props }) => {
  const [initialValues, setInitialValues] = useState();
  const now = moment();

  useEffect(() => {
    if (permissions) {
      const updated = moment(now).format("YYYY-MM-DD");

      setInitialValues({
        updated,
      });
    }
  }, [permissions]);

  // Define file field configurations for update operations
  const fileFields = [
    {
      source: "pas_foto",
      bucket: SIM_PAS_FOTO_BUCKET,
      folder: SIM_PAS_FOTO_FOLDER,
      fileNameField: "pas_foto_path",
    },
    {
      source: "tanda_tangan",
      bucket: SIM_PAS_FOTO_BUCKET,
      folder: SIM_TANDA_TANGAN_FOLDER,
      fileNameField: "tanda_tangan_path",
    },
    {
      source: "sidik_jari",
      bucket: SIM_PAS_FOTO_BUCKET,
      folder: SIM_SIDIK_JARI_FOLDER,
      fileNameField: "sidik_jari_path",
    },
  ];

  // Custom save handler to process file uploads during updates
  const handleSave = async (values) => {
    try {
      // Log untuk debugging
      console.log("Original form values before save:", values);

      const processedValues = { ...values };

      // Periksa apakah file yang dikirim adalah URL yang sudah ada vs File baru
      fileFields.forEach((field) => {
        const { source } = field;
        if (
          processedValues[source] &&
          typeof processedValues[source] === "object"
        ) {
          // Jika src adalah string URL (bukan blob atau File object), simpan sebagai string
          if (
            typeof processedValues[source].src === "string" &&
            !processedValues[source].src.startsWith("blob:")
          ) {
            processedValues[source] = processedValues[source].src;
          } else if (processedValues[source].src instanceof File) {
            // Jika src adalah File object, simpan File untuk upload
            processedValues[source] = processedValues[source].src;
          }
        }
      });

      console.log("Processed form values for save:", processedValues);

      // Gunakan data provider untuk update dengan konfigurasi fileFields
      const result = await dataProvider.update(
        "sim",
        {
          id: processedValues.id,
          data: processedValues,
        },
        fileFields
      );
      return result;
    } catch (error) {
      console.error("Error updating SIM data:", error);
      throw error;
    }
  };

  // Transformasi data dari server sebelum ditampilkan di form
  const transform = (data) => {
    // Log untuk debugging
    console.log("Data before transform:", data);
    // Normalisasi bidang file
    const normalizedData = normalizeFileField(data);
    console.log("Data after transform:", normalizedData);
    return normalizedData;
  };

  const transformForDisplay = (data) => {
    if (!data) return data;
    return normalizeFileFieldForDisplay(data, fileFields);
  };

  return permissions ? (
    <Edit {...props} title="Edit SIM" transform={transform}>
      <TabbedForm
        toolbar={<SimEditToolbar />}
        initialValues={initialValues}
        variant="outlined"
        save={handleSave}
      >
        <FormTab label="Keterangan">
          <ReferenceInput
            source="permohonan_sim_tni_id"
            reference="permohonan_sim_tni"
            label="Permohonan SIM TNI"
            sort={{ field: "id", order: "ASC" }}
          >
            <SelectInput optionText="nama" />
          </ReferenceInput>
          <ReferenceInput
            source="golongan_sim_tni_id"
            reference="golongan_sim_tni"
            label="Golongan SIM TNI"
            sort={{ field: "id", order: "ASC" }}
          >
            <SelectInput optionText="nama" />
          </ReferenceInput>
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              isBiiSus(formData) && (
                <ReferenceInput
                  source="kualifikasi_pengemudi_id"
                  reference="kualifikasi_pengemudi"
                  label="Kualifikasi Pengemudi"
                  sort={{ field: "id", order: "ASC" }}
                  {...rest}
                >
                  <SelectInput optionText="kode" />
                </ReferenceInput>
              )
            }
          </FormDataConsumer>
        </FormTab>

        <FormTab label="Pemohon">
          <InputJenisPemohon />
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              hasJenisPemohon(formData) && (
                <NoIdentitasInput
                  jenis_pemohon_id={formData.pemohon.jenis_pemohon_id}
                  {...rest}
                />
              )
            }
          </FormDataConsumer>
          <TextInput source="pemohon.nama" label="Nama" />
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              (isPrajuritTniAd(formData) || isPnsTniAd(formData)) && (
                <ReferenceInput
                  source="pemohon.pangkat_id"
                  reference="pangkat"
                  label="Pangkat"
                  sort={{ field: "id", order: "ASC" }}
                  {...rest}
                  defaultValue={isPnsTniAd(formData) ? 23 : null}
                  disabled={isPnsTniAd(formData)}
                >
                  <SelectInput optionText="kode" />
                </ReferenceInput>
              )
            }
          </FormDataConsumer>
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              isPrajuritTniAd(formData) && (
                <ReferenceInput
                  source="pemohon.korps_id"
                  reference="korps"
                  label="Korps"
                  allowEmpty
                  sort={{ field: "id", order: "ASC" }}
                  {...rest}
                >
                  <SelectInput optionText="kode" />
                </ReferenceInput>
              )
            }
          </FormDataConsumer>
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              isPnsTniAd(formData) && (
                <ReferenceInput
                  source="pemohon.golongan_pns_id"
                  reference="golongan_pns"
                  label="Golongan PNS"
                  sort={{ field: "id", order: "ASC" }}
                  {...rest}
                >
                  <AutocompleteInput optionText="nama" />
                </ReferenceInput>
              )
            }
          </FormDataConsumer>
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              (isPrajuritTniAd(formData) || isPnsTniAd(formData)) && (
                <TextInput source="pemohon.jabatan" label="Jabatan" {...rest} />
              )
            }
          </FormDataConsumer>
          <TextInput source="pemohon.kesatuan" label="Kesatuan" />
          <TextInput source="pemohon.alamat" label="Alamat" />
          <TextInput source="pemohon.tempat_lahir" label="Tempat Lahir" />
          <DateInput source="pemohon.tanggal_lahir" label="Tanggal Lahir" />
          <ReferenceInput
            source="pemohon.golongan_darah_id"
            reference="golongan_darah"
            label="Golongan Darah"
            sort={{ field: "id", order: "ASC" }}
          >
            <SelectInput optionText="nama" />
          </ReferenceInput>
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              isPrajuritTniAd(formData) && (
                <TextInput
                  source="pemohon.no_ktp_prajurit"
                  label="No. KTP Prajurit"
                  {...rest}
                />
              )
            }
          </FormDataConsumer>
        </FormTab>

        <FormTab label="Pas Foto" path="pas_foto">
          <Typography variant="subtitle1" gutterBottom>
            Opsi 1: Ambil Foto Langsung dari Kamera
          </Typography>
          <CameraInput
            source="pas_foto"
            label="Ambil/Ganti Foto dari Kamera"
            bucketName={SIM_PAS_FOTO_BUCKET}
            folderPath={SIM_PAS_FOTO_FOLDER}
          />

          <Box mt={3} mb={1}>
            <Typography variant="subtitle1" gutterBottom>
              Opsi 2: Unggah File Gambar Baru
            </Typography>
          </Box>
          <ImageInput
            source="pas_foto"
            label="Pilih atau seret file pas foto baru"
            accept="image/*"
            placeholder={<p>Letakkan file baru di sini jika ingin mengganti</p>}
          >
            <CustomImageField source="src" title="title" />
          </ImageInput>
          <Box mt={2}>
            <Typography variant="caption">
              Catatan: Jika Anda mengambil foto baru atau mengunggah file baru, foto lama akan diganti saat disimpan.
            </Typography>
          </Box>
        </FormTab>

        <FormTab label="Tanda Tangan">
          <SignaturePadInput source="tanda_tangan" />
        </FormTab>

        <FormTab label="Sidik Jari">
          <ImageInput
            source="sidik_jari"
            label="Unggah Gambar Sidik Jari Baru"
            accept="image/*"
            placeholder={<p>Letakkan file baru di sini jika ingin mengganti</p>}
          >
            <CustomImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  ) : null;
};

export default SimEdit;
