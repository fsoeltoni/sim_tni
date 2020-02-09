import React from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput
} from "react-admin";

const PenggunaCreate = props => {
  return (
    <Create {...props} title="Tambah Pengguna">
      <SimpleForm variant="outlined">
        <ReferenceInput
          source="lingkup_id"
          reference="lingkup"
          label="Lingkup"
          sort={{ field: "id", order: "ASC" }}
        >
          <SelectInput optionText="kode" />
        </ReferenceInput>
        <ReferenceInput
          source="satlak_id"
          reference="satlak"
          label="Satlak"
          sort={{ field: "id", order: "ASC" }}
        >
          <SelectInput optionText="kode" />
        </ReferenceInput>
        <ReferenceInput
          source="jenis_pengguna_id"
          reference="jenis_pengguna"
          label="Jenis Pengguna"
          sort={{ field: "id", order: "ASC" }}
        >
          <SelectInput optionText="nama" />
        </ReferenceInput>
        <TextInput source="nama" label="Nama" />
        <TextInput source="nrp_nip" label="NRP/NIP" />
        <TextInput source="kata_sandi" label="Kata Sandi" />
      </SimpleForm>
    </Create>
  );
};

export default PenggunaCreate;
