// app/dashboard/admin/page.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconLinkButton from "@/app/components/IconLinkButton";
import AdminDashboardClassified from "@/app/dashboard/admin/components/AdminDashboardClassified";
import AdminDashboardUser from "@/app/dashboard/admin/components/AdminDashboardUser";
import { AuthContext } from "@/app/context/AuthContext";
import styles from "./page.module.css";

interface AnnonceType { /* ... */ }
interface UserType { /* ... */ }

const AdminDashboardPage: React.FC = () => {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [tab, setTab] = useState<'annonces'|'utilisateurs'>('annonces');
  const [annonces, setAnnonces] = useState<AnnonceType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Auth
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/connexion');
    } else if (user.role !== 'admin') {
      router.push('/dashboard/user');
    }
  }, [user, authLoading, router]);

  // Data fetch
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchData = async () => {
      setDataLoading(true);
      // annonces
      const resA = await fetch('http://localhost:3000/annonce', { credentials:'include' });
      const listA: AnnonceType[] = await resA.json();
      const enrichedA = await Promise.all(listA.map(async a => {
        const [catRes, userRes] = await Promise.all([
          fetch(`http://localhost:3000/categorie/${a.id_categorie}`),
          fetch(`http://localhost:3000/annonce/${a.id_annonce}/utilisateur`)
        ]);
        const cat = await catRes.json();
        const usr = await userRes.json();
        return { ...a, categorie: cat.nom, utilisateur: usr };
      }));
      setAnnonces(enrichedA);
      // utilisateurs
      const resU = await fetch('http://localhost:3000/utilisateur', { credentials:'include' });
      const listU: UserType[] = await resU.json();
      setUsers(listU);
      setDataLoading(false);
    };
    fetchData();
  }, [user]);

  const deleteAnnonce = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;
    await fetch(`http://localhost:3000/annonce/${id}`, { method:'DELETE', credentials:'include' });
    setAnnonces(prev => prev.filter(a => a.id_annonce !== id));
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;
    await fetch(`http://localhost:3000/utilisateur/${id}`, { method:'DELETE', credentials:'include' });
    setUsers(prev => prev.filter(u => u.id_utilisateur !== id));
  };

  const handleLogout = () => {
    if (!confirm('Se déconnecter ?')) return;
    fetch('http://localhost:3000/utilisateur/deconnexion', { method:'POST', credentials:'include' })
      .then(() => { logout(); router.push('/connexion'); });
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Administration</h1>
      </header>
  
      <div className={styles.dashboardContent}>
        <div className={styles.sidebar}>
          <IconLinkButton
            image="/images/annonce.png"
            imageAlt="Annonces"
            title="Annonces"
            onClick={() => setTab('annonces')}
          />
          <IconLinkButton
            image="/images/utilisateur.png"
            imageAlt="Utilisateurs"
            title="Utilisateurs"
            onClick={() => setTab('utilisateurs')}
          />
          <IconLinkButton
            image="/images/deconnexion.png"
            imageAlt="Déconnexion"
            title="Se déconnecter"
            onClick={handleLogout}
          />
        </div>
  
        <div className={styles.content}>
          {(authLoading || dataLoading) && <p>Chargement...</p>}
          
          {!authLoading && !dataLoading && tab === 'annonces' && (
            <div className={styles.list}>
              {annonces.map(a => (
                <AdminDashboardClassified
                  key={a.id_annonce}
                  id={a.id_annonce}
                  title={a.titre}
                  category={a.categorie}
                  location={a.localisation}
                  price={parseFloat(a.prix)}
                  image={`/images/${a.image_annonce}`}
                  firstName={a.utilisateur?.prenom}
                  lastName={a.utilisateur?.nom}
                  creationDate={new Date(a.date_creation)}
                  onButtonClick={() => deleteAnnonce(a.id_annonce)}
                />
              ))}
            </div>
          )}
  
          {!authLoading && !dataLoading && tab === 'utilisateurs' && (
            <div className={styles.list}>
              {users.map(u => (
                <AdminDashboardUser
                  key={u.id_utilisateur}
                  firstName={u.prenom}
                  lastName={u.nom}
                  email={u.email}
                  role={u.role}
                  onButtonClick={() => deleteUser(u.id_utilisateur)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );  
};

export default AdminDashboardPage;
