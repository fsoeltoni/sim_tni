import React, { useCallback } from "react";
import { useForm } from "react-final-form";
import { SaveButton, useDataProvider, useRedirect } from "react-admin";

const SimCreateButton = ({ handleSubmitWithRedirect, ...props }) => {
  const form = useForm();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const updatePemohon = useCallback(
    async (id, data) => {
      const { data: pemohon } = await dataProvider.update("pemohon", {
        id: id,
        data: { ...data }
      });

      return pemohon;
    },
    [dataProvider]
  );

  const createPemohon = useCallback(
    async data => {
      const { data: pemohon } = await dataProvider.create("pemohon", {
        data: { ...data }
      });

      return pemohon;
    },
    [dataProvider]
  );

  const createSim = useCallback(
    async data => {
      const { data: sim } = await dataProvider.create("sim", {
        data: { ...data }
      });

      return sim;
    },
    [dataProvider]
  );

  const handleClick = useCallback(async () => {
    const { pemohon, pemohon_id, ...rest } = form.getState().values;

    if (pemohon_id) {
      const updatedPemohon = await updatePemohon(pemohon_id, pemohon);

      if (updatedPemohon) {
        const createdSim = await createSim({
          ...rest,
          pemohon_id: updatedPemohon.id
        });

        if (createdSim) {
          redirect("/sim");
        }
      }
    } else {
      const createdPemohon = await createPemohon(pemohon);

      if (createdPemohon) {
        const createdSim = createSim({
          ...rest,
          pemohon_id: createdPemohon.id
        });

        if (createdSim) {
          redirect("/sim");
        }
      }
    }
  }, [createPemohon, createSim, form, redirect, updatePemohon]);

  return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

export default SimCreateButton;
