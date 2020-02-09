import React from "react";
import {
  Create,
  TabbedForm,
  FormTab,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextInput,
  NumberInput
} from "react-admin";

const SatlakCreate = props => {
  const initialValues = {
    korps_komandan_id: 9
  };

  return (
    <Create {...props} title="Tambah SATLAK">
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
        <FormTab label="Tanda Tangan Komandan"></FormTab>
        <FormTab label="Stempel"></FormTab>
      </TabbedForm>
    </Create>
  );
};

export default SatlakCreate;
