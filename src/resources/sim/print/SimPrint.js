import React, { useCallback, useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import moment from "moment";
import monthToRoman from "./monthToRoman";
import SimCanvas from "./SimCanvas";

const SimPrint = ({
  match: {
    params: { id }
  }
}) => {
  const dataProvider = useDataProvider();
  const [sim, setSim] = useState();
  const [satlak, setSatlak] = useState();
  const [pemohon, setPemohon] = useState();
  const [permohonan_sim_tni, setPermohonanSimTni] = useState();
  const [golongan_sim_tni, setGolonganSimTni] = useState();
  const [lingkup, setLingkup] = useState();
  const [markas, setMarkas] = useState();
  const [pangkat_komandan, setPangkatKomandan] = useState();
  const [korps_komandan, setKorpsKomandan] = useState();
  const [pangkat_pemohon, setPangkatPemohon] = useState();
  const [korps_pemohon, setKorpsPemohon] = useState();
  const [golongan_pns_pemohon, setGolonganPnsPemohon] = useState();
  const [golongan_darah_pemohon, setGolonganDarahPemohon] = useState();
  const [kode_sim, setKodeSim] = useState({});
  const [kode_sim_display, setKodeSimDisplay] = useState();
  const [nama_display, setNamaDisplay] = useState();
  const [
    tempat_tanggal_lahir_display,
    setTempatTanggalLahirDisplay
  ] = useState();
  const [pangkat_display, setPangkatDisplay] = useState();
  const [korps_display, setKorpsDisplay] = useState();
  const [golongan_pns_display, setGolonganPnsDisplay] = useState();
  const [no_identitas_display, setNoIdentitasDisplay] = useState();
  const [pangkat_nrp_nip_display, setPangkatNrpNipDisplay] = useState();
  const [kesatuan_display, setKesatuanDisplay] = useState();
  const [golongan_darah_display, setGolonganDarahDisplay] = useState();
  const [pas_foto_display, setPasFotoDisplay] = useState();
  const [tanda_tangan_display, setTandaTanganDisplay] = useState();
  const [diberikan_di_display, setDiberikanDiDisplay] = useState();
  const [pada_tanggal_display, setPadaTanggalDisplay] = useState();
  const [berlaku_hingga_display, setBerlakuHinggaDisplay] = useState();
  const [stempel_display, setStempelDisplay] = useState();
  const [sidik_jari_display, setSidikJariDisplay] = useState();
  const [label_komandan_display, setLabelKomandanDisplay] = useState();
  const [nama_komandan_display, setNamaKomandanDisplay] = useState();
  const [pangkat_komandan_display, setPangkatKomandanDisplay] = useState();
  const [korps_komandan_display, setKorpsKomandanDisplay] = useState();
  const [nrp_komandan_display, setNrpKomandanDisplay] = useState();
  const [
    pangkat_nrp_komandan_display,
    setPangkatNrpKomandanDisplay
  ] = useState();
  const [
    tanda_tangan_komandan_display,
    setTandaTanganKomandanDisplay
  ] = useState();

  const fetchSim = useCallback(async () => {
    const { data: sim } = await dataProvider.getOne("sim", { id: id });

    const sim_id = sim.id.toString().padStart(4, "0");
    const sim_bulan_pembuatan = monthToRoman(moment(sim.created).format("M"));
    const sim_tahun_pembuatan = moment(sim.created).format("YYYY");
    const pada_tanggal_display = moment(sim.created).format("DD-MM-YYYY");
    const berlaku_hingga_display = moment(sim.berlaku_hingga).format(
      "DD-MM-YYYY"
    );
    const pas_foto_display = sim.pas_foto;
    const tanda_tangan_display = sim.tanda_tangan;
    const sidik_jari_display = sim.sidik_jari.src;

    setKodeSim(kode_sim => ({
      ...kode_sim,
      sim_id,
      sim_bulan_pembuatan,
      sim_tahun_pembuatan
    }));
    setPadaTanggalDisplay(pada_tanggal_display);
    setBerlakuHinggaDisplay(berlaku_hingga_display);
    setPasFotoDisplay(pas_foto_display);
    setTandaTanganDisplay(tanda_tangan_display);
    setSidikJariDisplay(sidik_jari_display);
    setSim(sim);
  }, [id]);

  const fetchPemohon = useCallback(async id => {
    const { data: pemohon } = await dataProvider.getOne("pemohon", { id: id });

    const nama_display = pemohon.nama.toUpperCase();
    const no_identitas_display = pemohon.no_identitas;
    const tempat_lahir_display = pemohon.tempat_lahir.toUpperCase();
    const tanggal_lahir_display = moment(pemohon.tanggal_lahir).format(
      "DD-MM-YYYY"
    );
    const tempat_tanggal_lahir_display =
      tempat_lahir_display + "/" + tanggal_lahir_display;
    const kesatuan_display = pemohon.kesatuan;
    const pemohon_bulan_tahun_lahir = moment(pemohon.tanggal_lahir).format(
      "MMYY"
    );

    setNamaDisplay(nama_display);
    setNoIdentitasDisplay(no_identitas_display);
    setTempatTanggalLahirDisplay(tempat_tanggal_lahir_display);
    setKesatuanDisplay(kesatuan_display);
    setKodeSim(kode_sim => ({ ...kode_sim, pemohon_bulan_tahun_lahir }));
    setPemohon(pemohon);
  }, []);

  const fetchPangkatPemohon = useCallback(async id => {
    const { data: pangkatPemohon } = await dataProvider.getOne("pangkat", {
      id: id
    });

    const pangkat_display = pangkatPemohon.kode;

    setPangkatDisplay(pangkat_display);
    setPangkatPemohon(pangkatPemohon);
  }, []);

  const fetchKorpsPemohon = useCallback(async id => {
    const { data: korpsPemohon } = await dataProvider.getOne("korps", {
      id: id
    });
    const korps_display = korpsPemohon.kode;

    setKorpsDisplay(korps_display);
    setKorpsPemohon(korpsPemohon);
  }, []);

  const fetchGolonganPnsPemohon = useCallback(async id => {
    const { data: golonganPnsPemohon } = await dataProvider.getOne(
      "golongan_pns",
      {
        id: id
      }
    );
    const golongan_pns_display = golonganPnsPemohon.kode;

    setGolonganPnsDisplay(golongan_pns_display);
    setGolonganPnsPemohon(golonganPnsPemohon);
  }, []);

  const fetchGolonganDarahPemohon = useCallback(async id => {
    const { data: golonganDarahPemohon } = await dataProvider.getOne(
      "golongan_darah",
      {
        id: id
      }
    );

    const golongan_darah_nama = golonganDarahPemohon.nama;

    setGolonganDarahDisplay(golongan_darah_nama);
    setGolonganDarahPemohon(golonganDarahPemohon);
  }, []);

  const fetchPermohonanSimTni = useCallback(async id => {
    const {
      data: permohonanSimTni
    } = await dataProvider.getOne("permohonan_sim_tni", { id: id });

    const permohonan_sim_tni_kode = permohonanSimTni.kode;

    setKodeSim(kode_sim => ({ ...kode_sim, permohonan_sim_tni_kode }));
    setPermohonanSimTni(permohonanSimTni);
  }, []);

  const fetchGolonganSimTni = useCallback(async id => {
    const {
      data: golonganSimTni
    } = await dataProvider.getOne("golongan_sim_tni", { id: id });

    const golongan_sim_tni_nama = golonganSimTni.nama;

    setKodeSim(kode_sim => ({ ...kode_sim, golongan_sim_tni_nama }));
    setGolonganSimTni(golonganSimTni);
  }, []);

  const fetchSatlak = useCallback(async id => {
    const { data: satlak } = await dataProvider.getOne("satlak", { id: id });

    const satlak_kode = satlak.kode;
    const nama_komandan_display = satlak.nama_komandan.toUpperCase();
    const nrp_komandan_display = satlak.nrp_komandan;
    const stempel_display = satlak.stempel.src;
    const tanda_tangan_komandan_display = satlak.tanda_tangan;

    setKodeSim(kode_sim => ({ ...kode_sim, satlak_kode }));
    setNamaKomandanDisplay(nama_komandan_display);
    setNrpKomandanDisplay(nrp_komandan_display);
    setStempelDisplay(stempel_display);
    setTandaTanganKomandanDisplay(tanda_tangan_komandan_display);
    setSatlak(satlak);
  }, []);

  const fetchLingkupSatlak = useCallback(async id => {
    const { data: lingkupSatlak } = await dataProvider.getOne("lingkup", {
      id: id
    });

    setLingkup(lingkupSatlak);
  }, []);

  const fetchMarkasSatlak = useCallback(async id => {
    const { data: markasSatlak } = await dataProvider.getOne(
      "ibukota_provinsi",
      { id: id }
    );

    const markas_display = markasSatlak.nama.toUpperCase();

    setDiberikanDiDisplay(markas_display);
    setMarkas(markasSatlak);
  }, []);

  const fetchPangkatKomandan = useCallback(async id => {
    const { data: pangkatKomandan } = await dataProvider.getOne("pangkat", {
      id: id
    });

    const pangkat_komandan_display = pangkatKomandan.kode;

    setPangkatKomandanDisplay(pangkat_komandan_display);
    setPangkatKomandan(pangkatKomandan);
  }, []);

  const fetchKorpsKomandan = useCallback(async id => {
    const { data: korpsKomandan } = await dataProvider.getOne("korps", {
      id: id
    });

    const korps_komandan_display = korpsKomandan.kode;

    setKorpsKomandanDisplay(korps_komandan_display);
    setKorpsKomandan(korpsKomandan);
  }, []);

  useEffect(() => {
    if (id) {
      fetchSim();
    }
  }, [id]);

  useEffect(() => {
    if (sim) {
      const {
        satlak_id,
        created,
        updated,
        berlaku_hingga,
        permohonan_sim_tni_id,
        golongan_sim_tni_id,
        pemohon_id
      } = sim;

      fetchSatlak(satlak_id);
      fetchPemohon(pemohon_id);
      fetchPermohonanSimTni(permohonan_sim_tni_id);
      fetchGolonganSimTni(golongan_sim_tni_id);
    }
  }, [sim]);

  useEffect(() => {
    if (satlak) {
      const {
        korps_komandan_id,
        lingkup_id,
        nama,
        kode,
        markas_id,
        nama_komandan,
        nrp_komandan,
        pangkat_komandan_id
      } = satlak;

      fetchLingkupSatlak(lingkup_id);
      fetchMarkasSatlak(markas_id);
      fetchPangkatKomandan(pangkat_komandan_id);
      fetchKorpsKomandan(korps_komandan_id);
    }
  }, [satlak]);

  useEffect(() => {
    if (pemohon) {
      const {
        jenis_pemohon_id,
        no_identitas,
        nama,
        pangkat_id,
        korps_id,
        golongan_pns_id,
        jabatan,
        kesatuan,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        golongan_darah_id,
        no_ktp_prajurit
      } = pemohon;

      if (pangkat_id) {
        fetchPangkatPemohon(pangkat_id);
      }

      if (korps_id) {
        fetchKorpsPemohon(korps_id);
      }

      if (golongan_pns_id) {
        fetchGolonganPnsPemohon(golongan_pns_id);
      }

      if (golongan_darah_id) {
        fetchGolonganDarahPemohon(golongan_darah_id);
      }
    }
  }, [pemohon]);

  useEffect(() => {
    const pangkat_display_ = pangkat_display ? pangkat_display + " " : "";
    const korps_display_ = korps_display ? korps_display + "/" : "";
    const golongan_pns_display_ = golongan_pns_display
      ? golongan_pns_display + "/"
      : "";
    const no_identitas_display_ = no_identitas_display
      ? no_identitas_display
      : "";
    const pangkat_nrp_nip_display =
      pangkat_display_ +
      korps_display_ +
      golongan_pns_display_ +
      no_identitas_display_;

    setPangkatNrpNipDisplay(pangkat_nrp_nip_display);
  }, [
    pangkat_display,
    korps_display,
    golongan_pns_display,
    no_identitas_display
  ]);

  useEffect(() => {
    const pangkat_komandan_display_ = pangkat_komandan_display
      ? pangkat_komandan_display + " "
      : "";
    const korps_komandan_display_ = korps_komandan_display
      ? korps_komandan_display + "/"
      : "";
    const nrp_komandan_display_ = nrp_komandan_display
      ? nrp_komandan_display
      : "";
    const pangkat_nrp_nip_komandan_display =
      pangkat_komandan_display_ +
      korps_komandan_display_ +
      nrp_komandan_display_;

    setPangkatNrpKomandanDisplay(pangkat_nrp_nip_komandan_display);
  }, [pangkat_komandan_display, korps_komandan_display, nrp_komandan_display]);

  useEffect(() => {
    if (kode_sim) {
      const {
        sim_id,
        sim_bulan_pembuatan,
        sim_tahun_pembuatan,
        satlak_kode,
        pemohon_bulan_tahun_lahir,
        permohonan_sim_tni_kode,
        golongan_sim_tni_nama
      } = kode_sim;

      const satlak_kode_ = satlak_kode ? satlak_kode + "." : "";
      const sim_id_ = sim_id ? sim_id + "." : "";
      const pemohon_bulan_tahun_lahir_ = pemohon_bulan_tahun_lahir
        ? pemohon_bulan_tahun_lahir + "/"
        : "";
      const golongan_sim_tni_nama_ = golongan_sim_tni_nama
        ? golongan_sim_tni_nama + "."
        : "";
      const permohonan_sim_tni_kode_ = permohonan_sim_tni_kode
        ? permohonan_sim_tni_kode + "/"
        : "";
      const sim_bulan_pembuatan_ = sim_bulan_pembuatan
        ? sim_bulan_pembuatan + "/"
        : "";
      const sim_tahun_pembuatan_ = sim_tahun_pembuatan
        ? sim_tahun_pembuatan
        : "";

      const kode_sim_display =
        satlak_kode_ +
        sim_id_ +
        pemohon_bulan_tahun_lahir_ +
        golongan_sim_tni_nama_ +
        permohonan_sim_tni_kode_ +
        sim_bulan_pembuatan_ +
        sim_tahun_pembuatan_;

      setKodeSimDisplay(kode_sim_display);
    }
  }, [kode_sim]);

  useEffect(() => {
    if (lingkup) {
      const { id, label_komandan } = lingkup;
      const { kode, kode_romawi } = satlak;

      if (id === 1) {
        setLabelKomandanDisplay(label_komandan);
      } else {
        const label_satlak = kode_romawi ? kode_romawi + "/" + kode : kode;
        const label_komandan_display =
          label_komandan + " " + label_satlak.toUpperCase();

        setLabelKomandanDisplay(label_komandan_display);
      }
    }
  }, [lingkup, satlak]);

  console.log(label_komandan_display);

  return (
    <div>
      <SimCanvas />
    </div>
  );
};

export default SimPrint;
