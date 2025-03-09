import React, { forwardRef } from "react";
import { Stage, Layer, Image, Text, Group } from "react-konva";
import useImage from "use-image";

const SimCanvasDepan = forwardRef((props, ref) => {
  const {
    kode_sim,
    nama,
    tempat_tanggal_lahir,
    pangkat_nrp_nip,
    kesatuan,
    golongan_darah,
    dibuat_di,
    pada_tanggal,
    berlaku_hingga,
    label_komandan,
    nama_komandan,
    pangkat_korps_nrp_komandan,
    tanda_tangan_komandan,
    stempel,
    tanda_tangan,
    pas_foto,
    sidik_jari,
  } = props.content;

  const [stempel_satlak] = useImage(stempel);
  const [tanda_tangan_komandan_satlak] = useImage(tanda_tangan_komandan);
  const [tanda_tangan_pemohon] = useImage(tanda_tangan);
  const [sidik_jari_pemohon] = useImage(sidik_jari);
  const [pas_foto_pemohon] = useImage(pas_foto);

  return (
    <Stage width={325} height={204} ref={ref}>
      <Layer>
        <Text
          x={86}
          y={36}
          width={153}
          text={kode_sim}
          fontSize={8}
          fontStyle="bold"
          align="center"
        />
        <Image
          image={sidik_jari_pemohon}
          x={10}
          y={75}
          scaleY={0.13}
          scaleX={0.13}
        />

        <Group x={15} y={55}>
          <Group>
            <Text text="Nama" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={nama} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={10}>
            <Text text="Tempat/Tgl. Lahir" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text
              text={tempat_tanggal_lahir}
              x={90}
              fontSize={9}
              fontStyle="bold"
            />
          </Group>
          <Group y={20}>
            <Text text="Pangkat/NRP/NIP" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={pangkat_nrp_nip} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={30}>
            <Text text="Kesatuan" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={kesatuan} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={40}>
            <Text text="Golongan Darah" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={golongan_darah} x={90} fontSize={9} fontStyle="bold" />
          </Group>
        </Group>
        <Group x={160} y={108}>
          <Group>
            <Text text="Diberikan di" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={dibuat_di} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={10}>
            <Text text="Pada Tanggal" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={pada_tanggal} x={90} fontSize={9} fontStyle="bold" />
          </Group>
          <Group y={20}>
            <Text text="Berlaku Hingga" fontSize={9} fontStyle="bold" />
            <Text text=":" x={80} fontSize={9} fontStyle="bold" />
            <Text text={berlaku_hingga} x={90} fontSize={9} fontStyle="bold" />
          </Group>
        </Group>
        <Group x={160} y={140}>
          <Group>
            <Text
              text={label_komandan}
              fontSize={9}
              fontStyle="bold"
              width={160}
              align="center"
            />
            <Image
              image={tanda_tangan_komandan_satlak}
              width={140}
              height={30}
              x={0}
              y={10}
            />
            <Text
              text={nama_komandan}
              fontSize={9}
              fontStyle="bold"
              width={165}
              align="center"
              y={35}
            />
            <Text
              text={pangkat_korps_nrp_komandan}
              fontSize={8}
              fontStyle="bold"
              width={160}
              align="center"
              y={45}
            />
          </Group>
        </Group>

        <Image image={pas_foto_pemohon} x={86} y={108} width={72} height={86} />
        <Image image={stempel_satlak} x={150} y={115} width={75} height={75} />
        <Image
          image={tanda_tangan_pemohon}
          x={-25}
          y={170}
          width={150}
          height={30}
        />
      </Layer>
    </Stage>
  );
});

export default SimCanvasDepan;
