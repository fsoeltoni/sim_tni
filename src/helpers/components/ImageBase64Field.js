import React, { useEffect } from "react";
import { ImageField } from "react-admin";
import isBase64 from "is-base64";
import converFileToBase64 from "../converFileToBase64";

const ImageBase64Field = props => {
  const record = props.record;

  useEffect(() => {
    if (record && record.src && !isBase64(record.src, { allowMime: true })) {
      converFileToBase64(record).then(res => (record.src = res));
    }
  }, [record]);

  return <ImageField {...props} />;
};

export default ImageBase64Field;
