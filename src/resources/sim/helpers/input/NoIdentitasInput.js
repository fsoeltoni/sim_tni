import React, { useState, useEffect, useCallback } from "react";
import { useDataProvider, NumberInput } from "react-admin";
import { useForm } from "react-final-form";

const NoIdentitasInput = ({ jenis_pemohon_id, ...rest }) => {
  const dataProvider = useDataProvider();
  const form = useForm();
  const [label, setLabel] = useState();

  const switchLabel = useCallback(() => {
    switch (jenis_pemohon_id) {
      case 1:
        setLabel("NRP");
        break;
      case 2:
        setLabel("NIP");
        break;
      case 3:
        setLabel("NIK");
        break;
      default:
        break;
    }
  }, [jenis_pemohon_id]);

  useEffect(() => {
    switchLabel();
  }, [switchLabel]);

  const fetchPemohon = useCallback(
    async no_identitas => {
      const { data: pemohon } = await dataProvider.getList("pemohon", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "id", order: "ASC" },
        filter: {
          jenis_pemohon_id: jenis_pemohon_id,
          no_identitas: no_identitas
        }
      });

      return pemohon[0];
    },
    [dataProvider, jenis_pemohon_id]
  );

  const onChange = async e => {
    const val = e.target.value;
    const pemohon = await fetchPemohon(val);

    if (pemohon) {
      form.batch(() => {
        form.change("pemohon_id", pemohon.id);
        form.change("pemohon.nama", pemohon.nama);
        form.change("pemohon.no_identitas", pemohon.no_identitas);
        form.change("pemohon.pangkat_id", pemohon.pangkat_id);
        form.change("pemohon.korps_id", pemohon.korps_id);
        form.change("pemohon.golongan_pns_id", pemohon.golongan_pns_id);
        form.change("pemohon.jabatan", pemohon.jabatan);
        form.change("pemohon.kesatuan", pemohon.kesatuan);
        form.change("pemohon.alamat", pemohon.alamat);
        form.change("pemohon.tempat_lahir", pemohon.tempat_lahir);
        form.change("pemohon.tanggal_lahir", pemohon.tanggal_lahir);
        form.change("pemohon.golongan_darah_id", pemohon.golongan_darah_id);
        form.change("pemohon.no_ktp_prajurit", pemohon.no_ktp_prajurit);
      });
    } else {
      form.batch(() => {
        form.change("pemohon_id", undefined);
        form.change("pemohon.nama", undefined);
        form.change("pemohon.pangkat_id", undefined);
        form.change("pemohon.korps_id", undefined);
        form.change("pemohon.golongan_pns_id", undefined);
        form.change("pemohon.jabatan", undefined);
        form.change("pemohon.kesatuan", undefined);
        form.change("pemohon.alamat", undefined);
        form.change("pemohon.tempat_lahir", undefined);
        form.change("pemohon.tanggal_lahir", undefined);
        form.change("pemohon.golongan_darah_id", undefined);
        form.change("pemohon.no_ktp_prajurit", undefined);
      });
    }
  };

  return (
    <NumberInput
      source="pemohon.no_identitas"
      label={label}
      onChange={onChange}
      {...rest}
    />
  );
};

export default NoIdentitasInput;
