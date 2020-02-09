import React from "react";
import { Admin, Resource } from "react-admin";
import attrs from "./providers/attrs";
import data from "./providers/data";
import SimCreate from "./resources/sim/SimCreate";
import SimList from "./resources/sim/SimList";
import SatlakCreate from "./resources/satlak/SatlakCreate";
import SatlakList from "./resources/satlak/SatlakList";
import PenggunaCreate from "./resources/pengguna/PenggunaCreate";
import PenggunaList from "./resources/pengguna/PenggunaList";
import auth from "./providers/auth";
import PemohonList from "./resources/pemohon/PemohonList";

const title = attrs.title;
const dataProvider = data;
const authProvider = auth;

const App = () => (
  <Admin title={title} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource
      name="sim"
      options={{ label: "SIM" }}
      create={SimCreate}
      list={SimList}
    />
    <Resource
      name="pemohon"
      options={{ label: "Pemohon" }}
      list={PemohonList}
    />
    <Resource
      name="pengguna"
      options={{ label: "Pengguna" }}
      create={PenggunaCreate}
      list={PenggunaList}
    />
    <Resource name="jenis_pengguna" />
    <Resource
      name="satlak"
      options={{ label: "SATLAK" }}
      create={SatlakCreate}
      list={SatlakList}
    />
    <Resource name="ibukota_provinsi" />
    <Resource name="lingkup" />
    <Resource name="permohonan_sim_tni" />
    <Resource name="golongan_sim_tni" />
    <Resource name="kualifikasi_pengemudi" />
    <Resource name="jenis_pemohon" />
    <Resource name="golongan_pns" />
    <Resource name="korps" />
    <Resource name="pangkat" />
    <Resource name="jenjang_kepangkatan" />
    <Resource name="golongan_darah" />
  </Admin>
);

export default App;
