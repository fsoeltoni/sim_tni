import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  DeleteButton,
} from "react-admin";
import KodeSatlakField from "../satlak/helpers/KodeSatlakField";

const PenggunaList = ({ permissions, ...props }) => {
  if (permissions) {
    const filter =
      permissions && permissions.satlak_id !== 1
        ? { id: permissions.satlak_id }
        : null;

    return (
      <List
        {...props}
        title="Daftar Pengguna"
        sort={{ field: "id", order: "ASC" }}
        filter={filter}
      >
        <Datagrid>
          <TextField source="id" label="Id" />
          <ReferenceField
            source="lingkup_id"
            reference="lingkup"
            label="Lingkup"
          >
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
          <ReferenceField
            source="pangkat_id"
            reference="pangkat"
            label="Pangkat"
          >
            <TextField source="kode" />
          </ReferenceField>
          <ReferenceField source="korps_id" reference="korps" label="Korps">
            <TextField source="kode" />
          </ReferenceField>
          <TextField source="nrp_nip" label="NRP/NIP" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      </List>
    );
  } else {
    return null;
  }
};

export default PenggunaList;
