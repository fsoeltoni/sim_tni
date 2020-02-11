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
  NumberInput,
  FormDataConsumer,
  ImageInput
} from "react-admin";
import moment from "moment";
import NoIdentitasInput from "./helpers/input/NoIdentitasInput";
import isBiiSus from "./helpers/input/conditions/isBiiSus";
import hasJenisPemohon from "./helpers/input/conditions/hasJenisPemohon";
import isPrajuritTniAd from "./helpers/input/conditions/isPrajuritTniAd";
import isPnsTniAd from "./helpers/input/conditions/isPnsTniAd";
import InputJenisPemohon from "./helpers/input/InputJenisPemohon";
import SimCreateToolbar from "./helpers/create/SimCreateToolbar";
import ImageBase64Field from "../../helpers/components/ImageBase64Field";
import CameraInput from "../../helpers/input/CameraInput";
import SignaturePadInput from "../../helpers/input/SignaturePadInput";

const SimCreate = ({ permissions, ...props }) => {
  const [initialValues, setInitialValues] = useState();

  useEffect(() => {
    if (permissions) {
      const created = moment();
      const updated = created;
      const berlaku_hingga = moment(created).add(5, "Y");

      setInitialValues({
        satlak_id: permissions.satlak_id,
        created,
        updated,
        berlaku_hingga
      });
    }
  }, [permissions]);

  return permissions ? (
    <Create {...props} title="Tambah SIM">
      <TabbedForm
        toolbar={<SimCreateToolbar />}
        initialValues={initialValues}
        variant="outlined"
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
                  sort={{ field: "id", order: "ASC" }}
                  {...rest}
                >
                  <AutocompleteInput optionText="kode" />
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
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData, ...rest }) =>
              isPrajuritTniAd(formData) && (
                <TextInput
                  source="pemohon.kesatuan"
                  label="Kesatuan"
                  {...rest}
                />
              )
            }
          </FormDataConsumer>
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
                <NumberInput
                  source="pemohon.no_ktp_prajurit"
                  label="No. KTP Prajurit"
                  {...rest}
                />
              )
            }
          </FormDataConsumer>
        </FormTab>
        <FormTab label="Pas Foto">
          <CameraInput />
        </FormTab>
        <FormTab label="Tanda Tangan">
          <SignaturePadInput />
        </FormTab>
        <FormTab label="Sidik Jari">
          <ImageInput
            source="sidik_jari"
            label="Sidik Jari"
            accept="image/*"
            multiple={true}
          >
            <ImageBase64Field source="src" title="sidik_jari" />
          </ImageInput>
        </FormTab>
      </TabbedForm>
    </Create>
  ) : null;
};

export default SimCreate;
