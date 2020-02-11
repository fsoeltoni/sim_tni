import React from "react";
import {
  Edit,
  TabbedForm,
  FormTab,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextInput,
  NumberInput,
  ImageInput
} from "react-admin";
import ImageBase64Field from "../../helpers/components/ImageBase64Field";
import SignaturePadInput from "../../helpers/input/SignaturePadInput";

const SatlakEdit = props => {
  const initialValues = {
    korps_komandan_id: 9
  };

  return (
    <Edit {...props} title="Ubah SATLAK">
      <TabbedForm initialValues={initialValues} variant="outlined">
        <FormTab label="Keterangan">
          <ReferenceInput
            source="lingkup_id"
            reference="lingkup"
            label="Lingkup"
            sort={{ field: "id", order: "ASC" }}
          >
            <SelectInput optionText="kode" />
          </ReferenceInput>
          <TextInput source="nama" label="Nama" />
          <TextInput source="kode" label="Kode" />
          <TextInput source="kode_romawi" label="Kode Romawi" />
          <ReferenceInput
            source="markas_id"
            reference="ibukota_provinsi"
            label="Markas"
            sort={{ field: "id", order: "ASC" }}
          >
            <AutocompleteInput optionText="nama" />
          </ReferenceInput>
        </FormTab>
        <FormTab label="Komandan">
          <TextInput source="nama_komandan" label="Nama Komandan" />
          <NumberInput source="nrp_komandan" label="NRP Komandan" />
          <ReferenceInput
            source="pangkat_komandan_id"
            reference="pangkat"
            label="Pangkat Komandan"
            sort={{ field: "id", order: "ASC" }}
          >
            <AutocompleteInput optionText="kode" />
          </ReferenceInput>
        </FormTab>
        <FormTab label="Tanda Tangan Komandan">
          <SignaturePadInput />
        </FormTab>
        <FormTab label="Stempel">
          <ImageInput
            source="stempel"
            label="Stempel"
            accept="image/*"
            multiple={false}
          >
            <ImageBase64Field source="src" title="stempel" />
          </ImageInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default SatlakEdit;
