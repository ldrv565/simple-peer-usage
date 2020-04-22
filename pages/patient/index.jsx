import React from 'react';

import { withAuth } from 'core/utils';
import { Patient } from 'components';

const DoctorPage = () => {
  return <Patient />;
};

export default withAuth(DoctorPage);
