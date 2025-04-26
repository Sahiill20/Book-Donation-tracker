import { createContext, useContext, useState } from 'react';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    donatedBooks: 0,
    pendingDonations: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rewardsEarned: 0
  });

  return (
    <UserStatsContext.Provider value={{ userStats, setUserStats }}>
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStats = () => useContext(UserStatsContext);
