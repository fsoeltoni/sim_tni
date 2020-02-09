import React from "react";
import {
  List,
  Datagrid,
  DateField,
  ReferenceField,
  TextField,
  EditButton,
  DeleteButton
} from "react-admin";

const SimList = ({ permissions, ...rest }) => {
  return (
    <List
      {...rest}
      title="Daftar SIM"
      sort={{ field: "created", order: "DESC" }}
    >
      <Datagrid>
        <DateField source="created" label="Pada Tanggal" />
        <DateField source="berlaku_hingga" label="Berlaku Hingga" />
        <ReferenceField
          source="permohonan_sim_tni_id"
          reference="permohonan_sim_tni"
          label="Permohonan"
        >
          <TextField source="nama" />
        </ReferenceField>
        <ReferenceField
          source="golongan_sim_tni_id"
          reference="golongan_sim_tni"
          label="Golongan"
        >
          <TextField source="nama" />
        </ReferenceField>
        <ReferenceField
          source="kualifikasi_pengemudi_id"
          reference="kualifikasi_pengemudi"
          label="Kualifikasi"
        >
          <TextField source="kode" />
        </ReferenceField>
        <ReferenceField source="pemohon_id" reference="pemohon" label="Pemohon">
          <TextField source="nama" />
        </ReferenceField>
        <ReferenceField source="pemohon_id" reference="pemohon" label="NRP/NIP">
          <TextField source="no_identitas" />
        </ReferenceField>
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export default SimList;
