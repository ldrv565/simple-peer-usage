import React from 'react';

import withAuth from 'core/utils/withAuth';
import { Patient } from 'components';

const DoctorPage = () => {
  return <Patient />;
};

export default withAuth(DoctorPage);
