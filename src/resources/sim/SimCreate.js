import React, { useEffect, useState } from "react";
import {
  Create,
  TabbedForm,
  FormTab,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextInput,
  DateInput,
  FormDataConsumer,
  ImageInput,
  ImageField,
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
import SimCreateToolbar from "./helpers/create/SimCreateToolbar";
import FingerprintInput from "../../helpers/input/FingerprintInput";
import CameraInput from "../../helpers/input/CameraInput";
import SignaturePadInput from "../../helpers/input/SignaturePadInput";
import dataProvider from "../../providers/data";

const SIM_PAS_FOTO_BUCKET = "gambar";
const SIM_PAS_FOTO_FOLDER = "pasfoto_sim";
const SIM_TANDA_TANGAN_FOLDER = "tanda_tangan_sim";
const SIM_SIDIK_JARI_FOLDER = "sidik_jari_sim";

const SimCreate = ({ permissions, ...props }) => {
  const [initialValues, setInitialValues] = useState();
  const now = moment();

  useEffect(() => {
    if (permissions) {
      const updated = moment(now).format("YYYY-MM-DD");

      setInitialValues({
        satlak_id: permissions.satlak_id,
        updated,
      });
    }
  }, [permissions]);

  // Updated file field configurations with consistent naming
  const fileFields = [
    {
      source: "pas_foto",
      bucket: SIM_PAS_FOTO_BUCKET,
      folder: SIM_PAS_FOTO_FOLDER,
      fileNameField: "pas_foto_path",
    },
    {
      source: "tanda_tangan",
      bucket: SIM_PAS_FOTO_BUCKET, // Using same bucket for consistency
      folder: SIM_TANDA_TANGAN_FOLDER,
      fileNameField: "tanda_tangan_path",
    },
    {
      source: "sidik_jari",
      bucket: SIM_PAS_FOTO_BUCKET, // Using same bucket for consistency
      folder: SIM_SIDIK_JARI_FOLDER,
      fileNameField: "sidik_jari_path",
    },
  ];

  // Custom save handler to process file uploads
  const handleSave = async (values) => {
    try {
      console.log("Pre-upload values for sidik_jari:", values.sidik_jari);
      // Use the data provider's create method with file field configurations

      const result = await dataProvider.create(
        "sim",
        {
          data: values,
          berlaku_hingga: moment(values.created)
            .add(5, "y")
            .format("YYYY-MM-DD"),
        },
        fileFields
      );

      console.log(result);
      return result;
    } catch (error) {
      console.error("Error saving SIM data:", error);
      throw error;
    }
  };

  return permissions ? (
    <Create {...props} title="Tambah SIM">
      <TabbedForm
        toolbar={<SimCreateToolbar />}
        initialValues={initialValues}
        variant="outlined"
        save={handleSave}
      >
        <FormTab label="Keterangan">
          <DateInput source="created" label="Tanggal Permohonan" />
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
        <FormTab label="Pas Foto">
          <Typography variant="subtitle1" gutterBottom>
            Opsi 1: Ambil Foto Langsung dari Kamera
          </Typography>
          <CameraInput
            source="pas_foto"
            label="Ambil Foto dari Kamera"
            bucketName={SIM_PAS_FOTO_BUCKET}
            folderPath={SIM_PAS_FOTO_FOLDER}
          />

          <Box mt={3} mb={1}>
            <Typography variant="subtitle1" gutterBottom>
              Opsi 2: Unggah File Gambar
            </Typography>
          </Box>
          <ImageInput
            source="pas_foto"
            label="Pilih atau seret file pas foto"
            accept="image/*"
            placeholder={<p>Letakkan file di sini atau klik untuk memilih</p>}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="Tanda Tangan">
          <SignaturePadInput />
        </FormTab>
        <FormTab label="Sidik Jari">
          <FingerprintInput source="sidik_jari" label="Sidik Jari" />
        </FormTab>
      </TabbedForm>
    </Create>
  ) : null;
};

export default SimCreate;
