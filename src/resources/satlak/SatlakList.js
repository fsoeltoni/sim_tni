import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  DeleteButton
} from "react-admin";
import KodeSatlakField from "./helpers/KodeSatlakField";

const NamaSatlakFull = ({ record: { nama, kode_romawi } }) =>
  kode_romawi ? kode_romawi + "/" + nama : nama;

const SatlakList = props => {
  return (
    <List {...props} title="Daftar SATLAK" sort={{ field: "id", order: "ASC" }}>
      <Datagrid>
        <TextField source="id" label="id" />
        <ReferenceField source="lingkup_id" reference="lingkup" label="Lingkup">
          <TextField source="kode" label="Kode" />
        </ReferenceField>
        <NamaSatlakFull label="Nama" />
        <KodeSatlakField label="Kode" />
        <TextField source="nama_komandan" label="Nama Komandan" />
        <TextField source="nrp_komandan" label="NRP Komandan" />
        <ReferenceField
          source="pangkat_komandan_id"
          reference="pangkat"
          label="Pangkat"
        >
          <TextField source="kode" label="Kode" />
        </ReferenceField>
        <ReferenceField
          source="korps_komandan_id"
          reference="korps"
          label="Korps"
        >
          <TextField source="kode" label="Kode" />
        </ReferenceField>
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default SatlakList;
