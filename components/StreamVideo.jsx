import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const StreamVideo = ({ srcObject, ...rest }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = srcObject;
  }, [srcObject]);

  return (
    <video ref={ref} {...rest}>
      <track kind="captions" />
    </video>
  );
};

StreamVideo.propTypes = {
  srcObject: PropTypes.object
};

export default StreamVideo;
