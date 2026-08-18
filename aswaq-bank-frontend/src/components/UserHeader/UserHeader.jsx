import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import api from '../../services/api';

export default function UserHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (error) {
        console.error('Erreur récupération utilisateur :', error);
      }
    };

    loadUser();
  }, []);

  const firstName = user?.prenom || user?.firstName || '';
  const lastName = user?.nom || user?.lastName || '';

  const fullName =
    `${firstName} ${lastName}`.trim() || 'Utilisateur';

  const initials =
    `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <div className="dash-user-chip">
      <div className="dash-user-avatar">
        {initials}
      </div>

      <span>{fullName}</span>

      <ChevronDown size={16} />
    </div>
  );
}