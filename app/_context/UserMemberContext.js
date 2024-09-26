import { createContext } from 'react';

const UserMemberContext = createContext({
  isMember: false,
  setIsMember: () => {}
});

export default UserMemberContext;