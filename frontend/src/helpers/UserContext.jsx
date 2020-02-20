import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext({ currentUser: null, setCurrentUser: () => {} });

function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
