import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  DeleteButton
} from "react-admin";
import KodeSatlakField from "../satlak/helpers/KodeSatlakField";

const PenggunaList = props => {
  return (
    <List
      {...props}
      title="Daftar Pengguna"
      sort={{ field: "id", order: "ASC" }}
    >
      <Datagrid>
        <TextField source="id" label="Id" />
        <ReferenceField source="lingkup_id" reference="lingkup" label="Lingkup">
          <TextField source="kode" />
        </ReferenceField>
        <ReferenceField source="satlak_id" reference="satlak" label="Satlak">
          <KodeSatlakField />
        </ReferenceField>
        <ReferenceField
          source="jenis_pengguna_id"
          reference="jenis_pengguna"
          label="Jenis Pengguna"
        >
          <TextField source="nama" />
        </ReferenceField>
        <TextField source="nama" label="Nama" />
        <TextField source="nrp_nip" label="NRP/NIP" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default PenggunaList;
