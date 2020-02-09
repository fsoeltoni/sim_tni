import React from "react";
import { Field } from "react-final-form";
import CameraComponent from "../components/CameraComponent";

const CameraInput = () => <Field name="pas_foto" component={CameraComponent} />;

export default CameraInput;
